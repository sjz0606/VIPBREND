# OpenStreetMap (_raw/osm.json) -> assets/map.js: Toshkent yo'llari va suvlari (soddalashtirilgan, km)
import json,math,urllib.request as u,urllib.parse as p
d=json.load(open('_raw/osm.json',encoding='utf8'))['elements']
water=set()
try:
    q='[out:json][timeout:25];way["waterway"~"^(river|canal)$"](41.19,69.11,41.40,69.40);out ids;'
    r=u.Request('https://maps.mail.ru/osm/tools/overpass/api/interpreter',data=p.urlencode({'data':q}).encode(),headers={'User-Agent':'vipbrand-local-site-build/1.0 (static map for a website)'})
    water={e['id'] for e in json.loads(u.urlopen(r,timeout=40).read())['elements']}
except Exception as e: print('water ids yoq',e)
C=(69.26,41.295);kx=math.cos(math.radians(C[1]))*111.32;ky=110.57
def simp(P,t):
    if len(P)<3:return P
    a,b=P[0],P[-1];dx,dy=b[0]-a[0],b[1]-a[1];L=math.hypot(dx,dy) or 1e-9;m=i=0
    for j,q in enumerate(P[1:-1],1):
        h=abs(dy*(q[0]-a[0])-dx*(q[1]-a[1]))/L
        if h>m:m,i=h,j
    return simp(P[:i+1],t)[:-1]+simp(P[i:],t) if m>t else [a,b]
R={'a':[],'b':[],'w':[]}
for e in d:
    if 'geometry' not in e:continue
    k='w' if e['id'] in water else 'a'
    P=simp([((g['lon']-C[0])*kx,(g['lat']-C[1])*ky) for g in e['geometry'] if g],.035)
    if len(P)>1:R[k].append([round(v,2) for q in P for v in q])
s='window.TASHKENT_MAP='+json.dumps(R,separators=(',',':'))+';'
open('assets/map.js','w').write(s);print({k:len(v) for k,v in R.items()},len(s))
xs=[v for k in R for l in R[k] for v in l[0::2]];ys=[v for k in R for l in R[k] for v in l[1::2]];print(min(xs),max(xs),min(ys),max(ys))
