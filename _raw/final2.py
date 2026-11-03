import asyncio, re
from playwright.async_api import async_playwright

U = 'http://localhost:8091/'


def log(*a):
    print(*a, flush=True)


async def run():
    async with async_playwright() as p:
        b = await p.chromium.launch(channel='msedge', args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        try:
            c = await b.new_context(viewport={'width': 1440, 'height': 810})
            pg = await c.new_page()
            errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
            await pg.goto(U, wait_until='load')
            await pg.wait_for_function("document.documentElement.classList.contains('ready')", timeout=120000)
            for s, f in [(.3, 'item1'), (.5, 'item2'), (.7, 'item3')]:
                await pg.evaluate(f"const r=document.getElementById('stage');scrollTo(0,{s}*(r.offsetHeight-innerHeight))")
                seen = None
                for i in range(12):
                    await pg.wait_for_timeout(2000)
                    seen = await pg.evaluate("[...document.querySelectorAll('.ch.item')].filter(c=>+c.style.opacity>.5).map(c=>[c.querySelector('h2 .uz').textContent,getComputedStyle(c).pointerEvents])")
                    if seen:
                        log('1440', f, seen, f'{(i + 1) * 2}s')
                        break
                else:
                    log('1440', f, 'KORINMADI')
                await pg.screenshot(path=f'_raw/shots/g1440_{f}.jpg', type='jpeg', quality=70)
                if seen:
                    href = await pg.evaluate("[...document.querySelectorAll('.ch.item')].find(c=>+c.style.opacity>.5).querySelector('.tg').href")
                    log('1440', f, 'tugma', href)
            log('1440 pageerrors', errs)
            await c.close()

            c = await b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True)
            await c.route(re.compile(r'https://yandex\.'), lambda r: r.abort())
            pg = await c.new_page()
            await pg.goto(U, wait_until='load')
            await pg.wait_for_function("document.documentElement.classList.contains('ready')", timeout=120000)
            await pg.evaluate("document.querySelector('.mapbox').scrollIntoView({block:'center'})")
            await pg.wait_for_timeout(3500)
            box = await pg.locator('#map').bounding_box()
            opened = None
            for yy in range(60, int(box['height']) - 30, 45):
                for xx in range(30, int(box['width']) - 20, 45):
                    await pg.touchscreen.tap(box['x'] + xx, box['y'] + yy)
                    await pg.wait_for_timeout(120)
                    if len(c.pages) > 1:
                        opened = (xx, yy, await pg.evaluate("document.getElementById('tip').textContent"))
                        break
                if opened:
                    break
            log('390 map tap ochdi', opened)
            log('390 tels', await pg.evaluate("[...document.querySelectorAll('.tels a')].map(a=>Math.round(a.getBoundingClientRect().height))"))
            await c.close()
        finally:
            await b.close()
            log('browser closed')


asyncio.run(run())
