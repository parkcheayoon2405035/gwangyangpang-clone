"""site/ 의 모든 페이지에 디자인 리뉴얼 파일을 연결한다.

- </head> 바로 앞에 css/renewal.css 연결
- js/i18n.js 를 불러오는 줄 바로 앞에 js/renewal.js 연결 (i18n.js 보다 먼저 실행되어야 함)
- 이미 연결된 페이지는 건너뛴다 (여러 번 실행해도 안전)

사용법: python tools/apply_renewal.py site
"""
import pathlib
import re
import sys

CSS = '<link rel="stylesheet" type="text/css" href="css/renewal.css">'
JS = '<script type="text/javascript" src="js/renewal.js"></script>'
I18N = re.compile(r'<script[^>]+src="js/i18n\.js"[^>]*></script>', re.I)
SKIP = {'_i18n_gallery.html', 'chatbot.html'}


def apply(path: pathlib.Path) -> str:
    html = path.read_text(encoding='utf-8')
    if 'js/renewal.js' in html:
        return 'skip'
    m = I18N.search(html)
    if not m:
        return 'no-i18n'
    html = html[:m.start()] + JS + '\n' + html[m.start():]
    head_end = html.lower().find('</head>')
    if head_end < 0:
        return 'no-head'
    html = html[:head_end] + CSS + '\n' + html[head_end:]
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
