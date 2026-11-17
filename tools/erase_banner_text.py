# 배너/버튼 이미지에서 글자를 지워 "글자 없는 배경"을 만든다
#
# 사용: python erase_banner_text.py <원본> <결과> <영역> [<영역> ...]
#   영역 = x1,y1,x2,y2            → 사각형 전체를 배경색으로 칠함 (단색 배경 위 글자)
#   영역 = x1,y1,x2,y2:000000,ffffff
#                                 → 사각형 안에서 "배경색과 글자색 사이의 색"인 픽셀만 지움
#                                   (글자 가까이에 그림이 있어서 사각형째 지우면 그림이 같이 지워질 때)
#   배경색은 영역 테두리 바깥쪽 픽셀에서 가장 많이 나온 색을 자동으로 사용.
#   배경이 투명(알파 0)이면 글자색에 가까운 픽셀을 투명하게 만든다.
import sys, collections
from PIL import Image


def hex2rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def is_blend(p, bg, colors, tol=40):
    # p 가 bg 와 글자색 c 를 섞은 색(안티앨리어싱 포함)인지
    for c in colors:
        d = [c[i] - bg[i] for i in range(3)]
        dd = sum(v * v for v in d) or 1
        t = max(0.0, min(1.0, sum((p[i] - bg[i]) * d[i] for i in range(3)) / dd))
        if sum((p[i] - (bg[i] + t * d[i])) ** 2 for i in range(3)) ** 0.5 < tol and t > 0.08:
            return True
    return False


src, dst, *rects = sys.argv[1:]
im = Image.open(src)
mode = 'RGBA' if im.mode in ('RGBA', 'LA', 'P') else 'RGB'
im = im.convert(mode)
W, H = im.size
for spec in rects:
    box, _, cols = spec.partition(':')
    x1, y1, x2, y2 = map(int, box.split(','))
    x1, y1, x2, y2 = max(x1, 0), max(y1, 0), min(x2, W - 1), min(y2, H - 1)
    edge = [im.getpixel((x, y)) for x in range(x1, x2 + 1) for y in (max(y1 - 2, 0), min(y2 + 2, H - 1))]
    edge += [im.getpixel((x, y)) for y in range(y1, y2 + 1) for x in (max(x1 - 2, 0), min(x2 + 2, W - 1))]
    bg = collections.Counter(edge).most_common(1)[0][0]
    colors = [hex2rgb(c) for c in cols.split(',')] if cols else None
    transparent = mode == 'RGBA' and bg[3] == 0
    n = 0
    for y in range(y1, y2 + 1):
        for x in range(x1, x2 + 1):
            p = im.getpixel((x, y))
            if colors is None:
                hit = p != bg
            elif transparent:
                hit = p[3] > 0 and any(sum(abs(p[i] - c[i]) for i in range(3)) < 120 for c in colors)
            else:
                hit = is_blend(p, bg, colors)
            if hit:
                im.putpixel((x, y), bg)
                n += 1
    print(f'{spec} -> 배경 {bg}, {n}픽셀 지움')
im.save(dst)
