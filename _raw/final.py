import asyncio, json, re
from playwright.async_api import async_playwright

U = 'http://localhost:8091/'


def log(*a):
    print(*a, flush=True)


AUDIT = """()=>{const vis=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!='none'&&s.visibility!='hidden'&&r.width>0&&r.height>0};
const small=[];document.querySelectorAll('body *').forEach(e=>{if(![...e.childNodes].some(n=>n.nodeType==3&&n.textContent.trim()))return;if(getComputedStyle(e).display=='none')return;const f=parseFloat(getComputedStyle(e).fontSize);if(f<12)small.push(e.tagName+':'+e.textContent.trim().slice(0,20)+':'+f)});
const tgt=[];document.querySelectorAll('a,button').forEach(e=>{if(!vis(e))return;const r=e.getBoundingClientRect();if(r.height<40)tgt.push((e.textContent.trim()||e.getAttribute('aria-label')||'').slice(0,20)+':'+Math.round(r.height))});
return {overflow:document.documentElement.scrollWidth-innerWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),imgs:document.images.length,videoErr:[...document.querySelectorAll('video')].filter(v=>v.error).length,small:[...new Set(small)],tgt:[...new Set(tgt)],
nav:[...document.querySelectorAll('#top nav a')].filter(vis).map(a=>[a.textContent.trim(),a.getAttribute('href'),!!document.querySelector(a.getAttribute('href'))]),
call:(e=>e&&vis(e)?[e.href,e.textContent.trim(),Math.round(e.getBoundingClientRect().height)]:null)(document.querySelector('.call')),
og:document.querySelectorAll('meta[property^=og]').length,title:document.title,lang:document.documentElement.lang}}"""

TEXTS = """()=>{const out=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(w.nextNode()){const n=w.currentNode,p=n.parentElement;if(!p||['SCRIPT','STYLE'].includes(p.tagName))continue;const l=p.closest('.ru,.uz');if(l&&getComputedStyle(l).display=='none')continue;const t=n.textContent.trim();if(t)out.push(t)}return out}"""


async def one(b, name, vp, mob):
    c = await b.new_context(viewport={'width': vp[0], 'height': vp[1]}, has_touch=mob, is_mobile=mob)
    await c.route(re.compile(r'https://yandex\.'), lambda r: r.abort())
    pg = await c.new_page()
    errs, bad = [], []
    pg.on('console', lambda m: errs.append(m.type + ': ' + m.text[:160]) if m.type in ('error', 'warning') else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)[:200]))
    pg.on('response', lambda r: bad.append(f'{r.status} {r.url[:90]}') if r.status >= 400 else None)
    pg.on('requestfailed', lambda r: bad.append('FAILED ' + r.url[:90]) if 'yandex' not in r.url else None)
    await pg.goto(U, wait_until='load')
    await pg.wait_for_function("document.documentElement.classList.contains('ready')||document.documentElement.classList.contains('no3d')", timeout=120000)
    log(name, 'no3d', await pg.evaluate("document.documentElement.classList.contains('no3d')"))
    for s, f in [(0, 'top'), (.3, 'item1'), (.5, 'item2'), (.7, 'item3'), (.9, 'end')]:
        await pg.evaluate(f"const r=document.getElementById('stage');scrollTo(0,{s}*(r.offsetHeight-innerHeight))")
        await pg.wait_for_timeout(2500)
        vis = await pg.evaluate("[...document.querySelectorAll('.ch')].filter(c=>+c.style.opacity>.5).map(c=>c.textContent.trim().replace(/\\s+/g,' ').slice(0,40))")
        log(name, f, vis)
        await pg.screenshot(path=f'_raw/shots/f{name}_{f}.jpg', type='jpeg', quality=70)
    t = await pg.evaluate(TEXTS)
    log(name, 'UZ kirill', [x for x in t if re.search('[А-Яа-яЁё]', x)])
    attrs = await pg.evaluate("[...document.querySelectorAll('[alt],[aria-label],[title]')].map(e=>e.getAttribute('alt')||e.getAttribute('aria-label')||e.title||'')")
    log(name, 'attr kirill', [a for a in attrs if re.search('[А-Яа-я]', a)])
    log(name, 'demo', [x for x in t if re.search('demo', x, re.I)])

    await pg.evaluate("document.querySelector('.mapbox').scrollIntoView({block:'center'})")
    await pg.wait_for_timeout(3500)
    box = await pg.locator('#map').bounding_box()
    if not mob:
        hit = None
        for yy in range(40, int(box['height']) - 20, 28):
            for xx in range(30, int(box['width']) - 20, 34):
                await pg.mouse.move(box['x'] + xx, box['y'] + yy)
                if await pg.evaluate("document.querySelector('#list a.on')!==null"):
                    hit = (xx, yy)
                    break
            if hit:
                break
        log(name, 'map hover', hit, await pg.evaluate("document.getElementById('tip').textContent"))
        if hit:
            try:
                async with c.expect_page(timeout=12000) as pi:
                    await pg.mouse.click(box['x'] + hit[0], box['y'] + hit[1])
                np = await pi.value
                log(name, 'map click opened', np.url[:80])
                await np.close()
            except Exception as e:
                log(name, 'map click XATO', str(e)[:120])
        await pg.mouse.move(5, 5)
        l = pg.locator('#list a').nth(7)
        await l.scroll_into_view_if_needed()
        await l.hover()
        await pg.wait_for_timeout(1500)
        log(name, 'list hover', await pg.evaluate("[document.getElementById('tip').textContent,document.querySelectorAll('#list a.on').length]"))
    log(name, 'list links ok', await pg.evaluate("[...document.querySelectorAll('#list a')].filter(a=>/^https:\\/\\/yandex/.test(a.href)&&a.target=='_blank').length"))

    await pg.locator('#lang').click()
    await pg.wait_for_timeout(600)
    t = await pg.evaluate(TEXTS)
    log(name, 'RU title', await pg.title(), '| lang', await pg.evaluate("document.documentElement.lang"))
    log(name, 'RU da UZ qoldiq', [x for x in t if re.search(r"(so'm|filial|Telegramda|Aloqa|kiyim|Savol|Qo'ng)", x)])
    for sec in ['reels', 'filiallar', 'aloqa']:
        await pg.evaluate(f"document.getElementById('{sec}').scrollIntoView()")
        await pg.wait_for_timeout(1800)
        await pg.screenshot(path=f'_raw/shots/f{name}_ru_{sec}.jpg', type='jpeg', quality=70)
    await pg.locator('#lang').click()
    await pg.evaluate("scrollTo(0,0)")
    await pg.wait_for_timeout(1500)
    await pg.screenshot(path=f'_raw/shots/f{name}_uz_top.jpg', type='jpeg', quality=70)
    log(name, 'audit', json.dumps(await pg.evaluate(AUDIT), ensure_ascii=False))
    log(name, 'console', errs[:12])
    log(name, 'bad', bad[:12])
    await c.close()


async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel='msedge', args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        try:
            await one(b, '1440', (1440, 810), False)
            await one(b, '390', (390, 844), True)
        finally:
            await b.close()
            log('browser closed')


asyncio.run(run())
