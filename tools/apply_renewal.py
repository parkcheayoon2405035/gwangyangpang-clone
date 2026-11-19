"""site/ 의 모든 페이지에 디자인 리뉴얼 · DB 내용 번역 파일을 연결한다.

- js/i18n.js 를 불러오는 줄 바로 앞에 (뒤에는 js/chatbot-launcher.js)
    js/renewal.js       (i18n.js 보다 먼저 실행되어야 함)
    js/i18n-content.js  (i18n.js 가 번역을 찾을 때 함께 보는 DB 내용 번역)
- </head> 바로 앞에 css/renewal.css
- 파일마다 따로 확인해서 없는 것만 넣는다 (여러 번 실행해도 안전)

사용법: python tools/apply_renewal.py site
"""
import pathlib
import re
import sys

CSS = '<link rel="stylesheet" type="text/css" href="css/renewal.css">'
BEFORE_I18N = [
    ('js/renewal.js', '<script type="text/javascript" src="js/renewal.js"></script>'),
    ('js/i18n-content.js', '<script type="text/javascript" src="js/i18n-content.js"></script>'),
]
AFTER_I18N = [
    # 챗봇 버튼: i18n.js 가 정한 언어(window.I18N)를 써야 해서 i18n.js 뒤
    ('js/chatbot-launcher.js', '<script type="text/javascript" src="js/chatbot-launcher.js"></script>'),
]
I18N = re.compile(r'<script[^>]+src="js/i18n\.js"[^>]*></script>', re.I)
SKIP = {'_i18n_gallery.html', 'chatbot.html'}


def apply(path: pathlib.Path) -> str:
    html = path.read_text(encoding='utf-8')
    before = html
    for src, tag in BEFORE_I18N:
        if src in html:
            continue
        m = I18N.search(html)
        if not m:
            return 'no-i18n'
        html = html[:m.start()] + tag + '\n' + html[m.start():]
    for src, tag in AFTER_I18N:
        if src in html:
            continue
        m = I18N.search(html)
        if not m:
            return 'no-i18n'
        html = html[:m.end()] + '\n' + tag + html[m.end():]
    if 'css/renewal.css' not in html:
        head_end = html.lower().find('</head>')
        if head_end < 0:
            return 'no-head'
        html = html[:head_end] + CSS + '\n' + html[head_end:]
    if html == before:
        return 'skip'
    path.write_text(html, encoding='utf-8')
    return 'ok'


def main(site_dir: str) -> None:
    counts = {}
    for p in sorted(pathlib.Path(site_dir).glob('*.html')):
        if p.name in SKIP:
            continue
        r = apply(p)
        counts[r] = counts.get(r, 0) + 1
        if r not in ('ok', 'skip'):
            print(f'{r}: {p.name}')
    print(counts)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'site')
