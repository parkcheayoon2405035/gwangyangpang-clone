# 사이트 전체를 따라가며 원본 그대로 저장. 쿼리가 다른 페이지는 별도 파일로, 매핑은 urlmap.json에 기록
import re,os,sys,urllib.request,urllib.parse,json
START=sys.argv[1]; OUT=sys.argv[2]; MAX=int(sys.argv[3])
host=urllib.parse.urlparse(START).netloc
MAGIC={b'\xff\xd8':'.jpg',b'\x89P':'.png',b'GI':'.gif',b'%P':'.pdf',b'RI':'.webp'}
def get(u):
    r=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=60); return r.read()
def local_name(pu,data):
    rel=pu.path.lstrip('/') or 'index.html'
    if not pu.query: return rel
    base,ext=os.path.splitext(rel); q=re.sub(r'[^A-Za-z0-9]+','_',pu.query).strip('_')
    if ext=='.php': ext=MAGIC.get(data[:2],'.html')
    return f'{base}__{q}{ext}'
def refs(text,base):
    text=re.sub(r'<!--.*?-->','',text,flags=re.S); out=set()
    raw=re.findall(r'''(?:href|src|action)=["']([^"'#][^"']*)''',text)+re.findall(r'url\(["\']?([^)"\']+)',text)+re.findall(r'''location(?:\.href)?\s*=\s*["']([^"']+)''',text)+re.findall(r'''window\.open\(["']([^"']+)''',text)
    for l in raw:
        if l.startswith(('data:','javascript','mailto','tel','+')): continue
        u=urllib.parse.urljoin(base,'http:'+l if l.startswith('//') else l)
        if urllib.parse.urlparse(u).netloc==host: out.add(u.split('#')[0])
    return out
todo=[START]; seen=set(); urlmap={}; fails=[]; pages=0
while todo and pages<MAX:
    u=todo.pop(0)
    if u in seen: continue
    seen.add(u); pu=urllib.parse.urlparse(u)
    try: d=get(u)
    except Exception as e: fails.append(f'{u} {e}'); continue
    name=local_name(pu,d); urlmap[u]=name
    p=os.path.join(OUT,'orig',name); os.makedirs(os.path.dirname(p) or '.',exist_ok=True); open(p,'wb').write(d)
    if name.endswith('.html') and not name.startswith('js/'): pages+=1
    if name.endswith(('.html','.css')):
        todo+= [r for r in sorted(refs(d.decode('utf-8','replace'),u)) if r not in seen]
json.dump(urlmap,open(os.path.join(OUT,'urlmap.json'),'w',encoding='utf-8'),ensure_ascii=False,indent=1)
print(f'pages={pages} files={len(urlmap)} fails={len(fails)} left_in_queue={len([t for t in todo if t not in seen])}')
for f in fails: print('FAIL',f)
