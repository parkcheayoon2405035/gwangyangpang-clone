# orig/ → site/ : 링크를 로컬 파일로 바꾸고 추적 코드·에러 나는 url_list.php 제거
import re,os,sys,json,shutil,urllib.parse
R=sys.argv[1]; O=os.path.join(R,'orig'); S=os.path.join(R,'site')
urlmap=json.load(open(os.path.join(R,'urlmap.json'),encoding='utf-8'))
page_url={v:k for k,v in urlmap.items()}
host=urllib.parse.urlparse(next(iter(urlmap))).netloc
shutil.rmtree(S,ignore_errors=True); shutil.copytree(O,S)
def relink(text,base_url,from_name):
    depth=from_name.count('/')
    def fix(m):
        pre,l,post=m.group(1),m.group(2),m.group(3)
        if l.startswith(('data:','javascript','mailto','tel','#')): return m.group(0)
        u=urllib.parse.urljoin(base_url,'http:'+l if l.startswith('//') else l)
        frag=''
        if '#' in u: u,frag=u.split('#',1); frag='#'+frag
        if u in urlmap: return pre+'../'*depth+urlmap[u]+frag+post
        if urllib.parse.urlparse(u).netloc==host:   # 못 받은 같은 사이트 주소 → 로컬 경로로만
            pu=urllib.parse.urlparse(u); return pre+'../'*depth+pu.path.lstrip('/')+(('?'+pu.query) if pu.query else '')+frag+post
        return m.group(0)
    text=re.sub(r'''((?:href|src|action)\s*=\s*["'])([^"']+)(["'])''',fix,text)
    text=re.sub(r'''(location(?:\.href)?\s*=\s*["'])([^"']+)(["'])''',fix,text)
    text=re.sub(r'''(window\.open\(\s*["'])([^"']+)(["'])''',fix,text)
    text=re.sub(r'''(url\(\s*["']?)([^)"']+)(["']?\s*\))''',fix,text)
    return text
n=0
for name,url in page_url.items():
    if not name.endswith(('.html','.css')): continue
    p=os.path.join(S,name); t=open(p,encoding='utf-8',errors='replace').read()
    if name.endswith('.html'):
        t=re.sub(r'<script[^>]*wcs\.(?:naver\.net|pstatic\.net)[^>]*>\s*</script>\s*(<script[^>]*>[^<]*wcs_[^<]*</script>)?','',t)   # 네이버 방문 추적 (두 주소 모두)
        t=re.sub(r'<script[^>]*url_list\.php[^>]*></script>\s*','',t)
    t=relink(t,url,name); open(p,'w',encoding='utf-8',newline='').write(t); n+=1
print('rewritten',n)
