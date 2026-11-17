# site/images 의 글자 이미지들 → site/images/i18n/<이름>_bg.png (글자 지운 배경) 일괄 생성
# 좌표는 원본 이미지 픽셀 기준. 형식은 erase_banner_text.py 참고
#   "x1,y1,x2,y2"            사각형 통째로 배경색 칠하기
#   "x1,y1,x2,y2:000000"     사각형 안에서 해당 글자색 픽셀만 지우기(그림과 가까울 때)
# 사용: python make_banner_bgs.py <site 폴더>
import os, sys, subprocess

SPECS = {
    'banner_center.png':  ['30,70,470,228'],
    # 휴대폰 그림과 '추' 글자가 겹치는 왼쪽 끝은 검은 글자 픽셀만 지움
    'banner_event_.png':  ['300,40,712,120', '290,125,716,262', '262,125,290,180:000000'],
    'banner_info.png':    ['30,40,445,128'],
    'main_event.jpg':     ['300,58,716,238'],
    'banner_food.png':    ['445,28,706,121'],
    'banner_hotel.png':   ['535,30,708,120'],
    'banner_tour.png':    ['445,28,706,121'],
    'banner_market.png':  ['393,26,708,116'],
    # 카테고리 배너: 알약 버튼 안 글자 / 제목 / 안내 2줄
    'banner_food_.png':   ['606,28,716,49', '350,44,496,96', '349,102,736,161'],
    'banner_fv_.png':     ['606,28,716,49', '314,48,504,100', '312,106,699,165'],
    'banner_hotel_.png':  ['606,28,716,49', '350,44,454,96', '349,102,736,161'],
    'banner_tour_.png':   ['606,28,716,49', '284,49,427,100', '285,106,671,165'],
    'banner_market_.png': ['606,28,716,49', '330,44,589,97', '329,102,716,161'],
    # 이용가이드: 팻말 속 큰 글자 / 오른쪽 문구 (Lucky PANG PANG 영문은 유지)
    'banner_guide.png':   ['90,160,467,208', '556,44,706,201'],
    'banner_guide_1.png': ['90,160,467,208', '556,44,706,166'],
    # 버튼: 원 모양은 두고 흰 글자만
    'search_btn.png':     ['8,4,92,68:ffffff'],
    'mypoint_btn.png':    ['8,4,92,68:ffffff'],
    'naver_map.png':      ['250,28,490,74:000000'],
    'more_btn.png':       ['60,9,165,39:000000'],
    # 글자뿐인 이미지 → 같은 크기의 투명 이미지
    'logo_img.png':       ['0,0,577,79'],
    'logo_w.png':         ['0,0,576,79'],
    'food_title.png':     ['0,0,699,39'],
    'hotel_title.png':    ['0,0,699,39'],
    'sp_title.png':       ['0,0,699,39'],
    'tour_title.png':     ['0,0,699,39'],
    'tour_title2.png':    ['0,0,699,39'],
}

site = sys.argv[1]
tool = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'erase_banner_text.py')
out_dir = os.path.join(site, 'images', 'i18n')
os.makedirs(out_dir, exist_ok=True)
for name, rects in SPECS.items():
    src = os.path.join(site, 'images', name)
    dst = os.path.join(out_dir, os.path.splitext(name)[0] + '_bg.png')
    print('##', name)
    subprocess.run([sys.executable, '-I', tool, src, dst, *rects], check=True)
