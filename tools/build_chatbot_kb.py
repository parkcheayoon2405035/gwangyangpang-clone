"""챗봇 장소 자료 만들기: 복제 사이트 → site/chatbot/kb/places-gwangyang.js

- 분류(음식점·숙박·관광지·특산물·행사)는 각 목록 페이지(food_intro 등)에 실제로 걸린 링크로 정한다.
  (파일 이름의 food_/hotel_ 은 내용과 다를 때가 있음. 예: hotel_s1__com_idx_3 은 동백축제)
- 상세 페이지에서 이름 · 한 줄 소개 · 기간 · 전화 · 주소 · 홈페이지 · 대표 메뉴 · 설명을 뽑는다.
- 번역은 이미 만들어 둔 site/js/i18n-content.js 를 그대로 쓴다. 이름은 한국어 그대로.
- 챗봇(chatbot/rag.js)이 이 자료에서 질문과 관련 있는 장소를 찾아 답한다.

사용법: python tools/build_chatbot_kb.py
"""
import html.parser
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / 'site'
OUT = SITE / 'chatbot' / 'kb' / 'places-gwangyang.js'
LANGS = ('en', 'ja', 'zh')

# 목록 페이지 → 분류
LISTS = {
    'food': ['food_intro.html', 'food_intro__page_1.html', 'food_intro__page_2.html', 'food_intro__page_3.html'],
    'hotel': ['hotel_intro.html'],
    'tour': ['tour_intro.html'],
    'sp': ['sp_intro.html'],
    'festival': ['festival_intro.html'],
}
# 상세 페이지 아이콘 → 항목 이름
ICON_FIELD = {
    'icon_simg1.png': 'period',
    's_call_icon.png': 'phone',
    's_map_icon.png': 'address',
    'icon_simg4.png': 'homepage',
    'icon_simg6.png': 'menu',
}


def norm(t: str) -> str:
    return re.sub(r'\s+', ' ', t).strip()


class Detail(html.parser.HTMLParser):
    """상세 페이지에서 필요한 칸만 뽑는다."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []          # (tag, class)
        self.name = ''
        self.lines = []          # sub_cont02 글줄
        self.fields = {}
        self.menu = []
        self.pending = None      # 직전 sp1 아이콘이 가리키는 항목
        self.cur = None          # 지금 글자를 모으는 칸
        self.buf = ''
        self.tel = None

    def _cls(self):
        return [c for _, c in self.stack]

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get('class') or ''
        if tag == 'img':
            src = (a.get('src') or '').split('/')[-1]
            if 'sp1' in self._cls() and src in ICON_FIELD:
                self.pending = ICON_FIELD[src]
            return
        if tag == 'br':
            if self.cur == 'desc':
                self._flush()
            return
        if tag == 'a' and (a.get('href') or '').startswith('tel:'):
            self.tel = a['href'][4:]
        if tag in ('meta', 'link', 'input', 'hr'):
            return
        self.stack.append((tag, cls))
        if cls == 'title03':
            self.cur, self.buf = 'name', ''
        elif cls == 'sub_cont02' and self.cur is None:
            self.cur, self.buf = 'desc', ''
        elif cls == 'sp2' and self.pending:
            self.cur, self.buf = 'f:' + self.pending, ''
        elif cls == 'sp2_':
            self.cur, self.buf = 'menu', ''

    def _flush(self):
        t = norm(self.buf)
        self.buf = ''
        if not t:
            return
        if self.cur == 'name':
            self.name = t
        elif self.cur == 'desc':
            self.lines.append(t)
        elif self.cur == 'menu':
            self.menu.append(t)
        elif self.cur and self.cur.startswith('f:'):
            self.fields[self.cur[2:]] = t

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                closing = self.stack[i][1]
                del self.stack[i:]
                if closing in ('title03', 'sp2', 'sp2_') or (closing == 'sub_cont02' and 'sub_cont02' not in self._cls()):
                    self._flush()
                    if closing == 'sp2':
                        self.pending = None
                    self.cur = None
                break

    def handle_data(self, data):
        if self.cur:
            self.buf += data


def load_translations() -> dict:
    js = (SITE / 'js' / 'i18n-content.js').read_text(encoding='utf-8')
    body = js[js.index('{'):js.rindex('}') + 1]
    return json.loads(body)


MISSING = []
JOIN = {'en': ', ', 'ja': '、', 'zh': '，'}
# i18n.js 의 DICT(화면 고정 문구)에 있어서 i18n-content.js 에는 없는 말
EXTRA = {
    '모범음식점': {'en': 'Certified Restaurant', 'ja': '模範飲食店', 'zh': '模范餐厅'},
}


def split_lookup(text: str, table: dict):
    """'A B' 처럼 사이트에선 두 줄이던 글이 띄어쓰기로 붙은 경우: 앞뒤가 각각 번역돼 있으면 이어 붙인다."""
    words = text.split(' ')
    for i in range(1, len(words)):
        a, b = table.get(' '.join(words[:i])), table.get(' '.join(words[i:]))
        if a and b:
            return {l: a[l] + ' ' + b[l] for l in LANGS}
    return None


def tr(text: str, table: dict) -> dict:
    """{ko, en, ja, zh} — 번역이 없으면 한국어 그대로 (주소는 로마자+원문 HTML 이 들어 있으므로 글자만 남김)
    사이트에서 두 줄로 나뉘어 따로 번역된 글이 상세 페이지에선 쉼표로 붙어 있는 경우가 있어 나눠서도 찾는다."""
    out = {'ko': text}
    e = table.get(text) or EXTRA.get(text) or split_lookup(text, table)
    if not e and ', ' in text:
        parts = [table.get(p.strip()) for p in text.split(', ')]
        if all(parts):
            e = {l: JOIN[l].join(p[l] for p in parts) for l in LANGS}
    if not e and re.search(r'[가-힣]', text):
        MISSING.append(text)
    for l in LANGS:
        v = e[l] if e else text
        out[l] = re.sub(r'<[^>]+>', ' · ', v).strip(' ·') if '<' in v else v
    return out


def main() -> int:
    table = load_translations()
    cat_of = {}
    for cat, files in LISTS.items():
        for f in files:
            p = SITE / f
            if not p.exists():
                continue
            for idx in re.findall(r'_s1__com_idx_(\d+)\.html', p.read_text(encoding='utf-8', errors='replace')):
                cat_of.setdefault(idx, cat)

    places = []
    for idx, cat in sorted(cat_of.items(), key=lambda x: (x[1], int(x[0]))):
        prefix = {'food': 'food', 'hotel': 'hotel', 'tour': 'tour', 'sp': 'sp', 'festival': 'festival'}[cat]
        cands = [SITE / f'{prefix}_s1__com_idx_{idx}.html'] + sorted(SITE.glob(f'*_s1__com_idx_{idx}.html'))
        page = next((c for c in cands if c.exists()), None)
        if not page:
            continue
        d = Detail()
        d.feed(page.read_text(encoding='utf-8', errors='replace'))
        if not d.name:
            continue
        tagline = d.lines[0] if d.lines else ''
        desc = [l for l in d.lines[1:] if not l.startswith('http')]
        places.append({
            'id': f'{cat}-{idx}',
            'cat': cat,
            'name': d.name,                                   # 이름은 한국어 그대로
            'url': page.name,
            'tagline': tr(tagline, table) if tagline else None,
            'desc': [tr(l, table) for l in desc[:3]],         # 설명은 앞 3줄까지만
            'period': tr(d.fields['period'], table) if 'period' in d.fields else None,
            # 전화는 가게 정보 칸(sp2)의 번호만. 페이지 아래쪽 회사 전화(tel: 링크)는 쓰지 않는다
            'phone': d.fields.get('phone'),
            'address': tr(d.fields['address'], table) if 'address' in d.fields else None,
            'menu': [tr(m, table) for m in d.menu] or None,
        })

    OUT.parent.mkdir(parents=True, exist_ok=True)
    body = json.dumps(places, ensure_ascii=False, indent=1)
    OUT.write_text(
        '/* 자동 생성 — 직접 고치지 말고 python tools/build_chatbot_kb.py 를 다시 실행하세요.\n'
        ' * 광양 행사 사이트의 장소 자료 (음식점·숙박·관광지·특산물·행사). 챗봇이 질문과 관련 있는 장소를 찾을 때 쓴다. */\n'
        'window.CHAT_KB = window.CHAT_KB || {};\n'
        f'window.CHAT_KB.places = window.CHAT_KB.places || {{}};\n'
        f'window.CHAT_KB.places.gwangyang = {body};\n',
        encoding='utf-8')
    counts = {}
    for p in places:
        counts[p['cat']] = counts.get(p['cat'], 0) + 1
    print(f'{OUT.relative_to(ROOT)}: {len(places)} places {counts}')
    if MISSING:
        (ROOT / 'tools' / 'chatbot_kb_missing.txt').write_text('\n'.join(sorted(set(MISSING))), encoding='utf-8')
        print(f'untranslated: {len(set(MISSING))} -> tools/chatbot_kb_missing.txt')
    return 0


if __name__ == '__main__':
    sys.exit(main())
