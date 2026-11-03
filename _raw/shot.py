import sys,asyncio
from playwright.async_api import async_playwright
PS=[0,.17,.3,.7,.9]
async def run():
  async with async_playwright() as p:
    b=await p.chromium.launch(channel='msedge',args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    for name,vp,mob in [('d',(1440,810),False),('m',(390,844),True)]:
      c=await b.new_context(viewport={'width':vp[0],'height':vp[1]},has_touch=mob,is_mobile=mob,device_scale_factor=1)
      pg=await c.new_page();errs=[]
      pg.on('console',lambda m:errs.append(m.text) if m.type in('error',) else None);pg.on('pageerror',lambda e:errs.append('PE '+str(e)))
      await pg.goto('http://localhost:8091/',wait_until='load');await pg.wait_for_function("document.documentElement.classList.contains('ready')||document.documentElement.classList.contains('no3d')",timeout=90000)
      print(name,'no3d',await pg.evaluate("document.documentElement.classList.contains('no3d')"))
      for s in PS:
        await pg.evaluate(f"const r=document.getElementById('stage');scrollTo(0,{s}*(r.offsetHeight-innerHeight))")
        await pg.wait_for_timeout(4000)
        await pg.screenshot(path=f'_raw/shots/{name}_{int(s*100):02d}.jpg',quality=70,type='jpeg')
      for sec in ['reels','filiallar','aloqa']:
        await pg.evaluate(f"document.getElementById('{sec}').scrollIntoView()");await pg.wait_for_timeout(3500)
        await pg.screenshot(path=f'_raw/shots/{name}_{sec}.jpg',quality=70,type='jpeg')
      print(name,'overflow',await pg.evaluate("document.documentElement.scrollWidth-innerWidth"),'errs',errs[:8])
      await c.close()
    await b.close()
asyncio.run(run())
