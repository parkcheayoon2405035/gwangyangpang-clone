"""DB 내용(가게·장소 설명, 주소, 기간, 메뉴) 번역 파일 만들기

tools/i18n_content/*.json  →  site/js/i18n-content.js  (window.I18N_CONTENT)

- "text": { 한국어 원문: {en, ja, zh} }
- "addr": { 한국어 주소: 로마자 주소 }  →  영·일·중 모두 '로마자 주소 + 한국어 원문(작게)'
  (택시 기사에게 보여 주거나 지도에서 검색할 때 한국어 원문이 필요해서 함께 보여 준다)
- 원문(키)이 실제 페이지 글자와 정확히 같아야 i18n.js 가 바꿔 준다.
  그래서 site/*.html 에서 글자 조각을 모아 키가 하나라도 없으면 알려 주고 실패한다.

사용법: python tools/build_i18n_content.py
"""
import html
import html.parser
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'tools' / 'i18n_content'
SITE = ROOT / 'site'
OUT = SITE / 'js' / 'i18n-content.js'
LANGS = ('en', 'ja', 'zh')


class TextCollector(html.parser.HTMLParser):
    """페이지의 글자 조각을 i18n.js 와 같은 방식(공백 정리)으로 모은다."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip = 0
        self.found = set()

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'):
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in ('script', 'style') and self.skip:
            self.skip -= 1

    def handle_data(self, data):
        if self.skip:
            return
        t = re.sub(r'\s+', ' ', data).strip()
        if t:
            self.found.add(t)


def page_texts() -> set:
    texts = set()
    for f in SITE.glob('*.html'):
        c = TextCollector()
        c.feed(f.read_text(encoding='utf-8', errors='replace'))
        texts |= c.found
    return texts


def main() -> int:
    out = {}
    for src in sorted(SRC.glob('*.json')):
        data = json.loads(src.read_text(encoding='utf-8'))
        for ko, tr in data.get('text', {}).items():
            missing = [l for l in LANGS if not tr.get(l)]
            if missing:
                print(f'[{src.name}] 번역 빠짐 {missing}: {ko}')
                return 1
            if any('<' in tr[l] for l in LANGS):
                print(f"[{src.name}] 번역문에 '<' 가 있어 적용되지 않음: {ko}")
                return 1
            out[ko] = {l: tr[l] for l in LANGS}
        for ko, roman in data.get('addr', {}).items():
            v = f'{html.escape(roman)}<span class="rn-ko-orig" lang="ko">{html.escape(ko)}</span>'
            out[ko] = {l: v for l in LANGS}

    texts = page_texts()
    not_found = [k for k in out if k not in texts]
    if not_found:
        print(f'페이지에서 찾을 수 없는 원문 {len(not_found)}개 (오타 확인):')
        for k in not_found:
            print('  -', k)
        return 1

    body = json.dumps(out, ensure_ascii=False, indent=1, sort_keys=True)
    OUT.write_text(
        '/* 자동 생성 파일 — 직접 고치지 말고 tools/i18n_content/*.json 을 고친 뒤\n'
        ' * python tools/build_i18n_content.py 를 실행하세요.\n'
        ' * DB 내용(가게·장소 설명, 주소, 기간, 메뉴) 번역. i18n.js 가 DICT 다음으로 찾아본다. */\n'
        f'window.I18N_CONTENT = {body};\n',
        encoding='utf-8')
    print(f'{OUT.relative_to(ROOT)}: {len(out)}개 원문 × {len(LANGS)}개 언어')
    return 0


if __name__ == '__main__':
    sys.exit(main())
