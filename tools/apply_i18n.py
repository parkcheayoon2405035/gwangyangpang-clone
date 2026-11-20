# site/ 에 다국어 적용: 모든 페이지에 js/i18n.js 추가 + 언어 선택 버튼 연결 (여러 번 실행해도 같은 결과)
import re,os,sys,glob
S=sys.argv[1]
TAG='<script type="text/javascript" src="js/i18n.js"></script>'
n=0
for p in glob.glob(os.path.join(S,'*.html')):
    if os.path.basename(p) in ('chatbot.html',) or os.path.basename(p).startswith('_'): continue  # 챗봇·확인용 페이지 제외
    h=open(p,encoding='utf-8').read(); o=h
    if 'js/i18n.js' not in h: h=re.sub(r'(</head>)',TAG+r'\n\1',h,count=1,flags=re.I)
    # 원래 사이트 고장 보완(안내창 함수 등) — i18n.js 바로 앞, 본문 스크립트보다 먼저 불러온다
    FIX='<script type="text/javascript" src="js/site-fixes.js"></script>'
    if 'js/site-fixes.js' not in h: h=h.replace(TAG, FIX+'\n'+TAG, 1)
    if os.path.basename(p).startswith('intro'):
        ko=re.search(r"<a href='([^']+)'><button type=\"button\">한국어로 시작",h)
        if ko:
            href=ko.group(1)
            h=h.replace(f"<a href='{href}'><button type=\"button\">한국어로 시작",f"<a href='{href}' data-set-lang='ko'><button type=\"button\">한국어로 시작")
            for code,label in(('en','English'),('ja','日本語'),('zh','中文')):
                h=re.sub(r'<!--<a href=\'[^\']*\'>--><button type="button">'+label+r'</button>',
                         f"<a href='{href}' data-set-lang='{code}'><button type=\"button\">{label}</button></a>",h)
    # 이용가이드 페이지에만 챗봇 버튼 (한국어일 때만 보임 — js/chatbot-launcher.js 참고)
    if os.path.basename(p)=='coupon.html' and 'chatbot-launcher.js' not in h:
        h=h.replace(TAG, TAG+'\n<script type="text/javascript" src="js/chatbot-launcher.js"></script>',1)
    if h!=o: open(p,'w',encoding='utf-8',newline='').write(h); n+=1
print('updated',n)
