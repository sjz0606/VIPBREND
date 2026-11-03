from PIL import Image


def rep(s, a, b):
    assert a in s, a
    return s.replace(a, b)


im = Image.open('_raw/shots/d_00.jpg').convert('RGB')
w, h = im.size
H = int(w * 630 / 1200)
t = (h - H) // 2
im.crop((0, t, w, t + H)).resize((1200, 630), Image.LANCZOS).save('assets/og.jpg', quality=82)

h = open('index.html', encoding='utf8').read()
h = rep(h, '<meta name="theme-color" content="#0a0908">', '''<meta name="theme-color" content="#0a0908">
<meta property="og:type" content="website">
<meta property="og:title" content="VIP BRAND — erkaklar kiyimi, Toshkent bo'ylab 13 filial">
<meta property="og:description" content="Erkaklar kiyim do'konlari tarmog'i. Toshkent bo'ylab 13 filial.">
<meta property="og:image" content="assets/og.jpg">
<meta property="og:locale" content="uz_UZ">
<meta name="twitter:card" content="summary_large_image">''')
h = rep(h, '<button id="lang" type="button" aria-label="Til / Язык">', '''<a class="call" href="tel:+998930080000"><span class="uz">Qo'ng'iroq</span><span class="ru">Позвонить</span></a>
  <button id="lang" type="button" aria-label="Tilni almashtirish">''')
open('index.html', 'w', encoding='utf8').write(h)

c = open('site.css', encoding='utf8').read()
c = rep(c, '.note{font-size:11.5px;', '.note{font-size:12px;')
c = rep(c, '#lang:hover{border-color:var(--gold)}', '#lang:hover{border-color:var(--gold)}\n.call{display:none;align-items:center;min-height:44px;padding:0 14px;background:var(--gold);color:#17120a;font-size:13px;font-weight:600}')
c = rep(c, '  #top nav{display:none}', '  #top nav{display:none}\n  .call{display:inline-flex}\n  #top{gap:8px}\n  #lang{min-height:44px}\n  .brand span{font-size:12px;letter-spacing:.16em}')
open('site.css', 'w', encoding='utf8').write(c)

j = open('site.js', encoding='utf8').read()
j = rep(j, "function syncLang() { root.lang = root.dataset.l; }", """function syncLang() {
  const ru = root.dataset.l === 'ru';
  root.lang = root.dataset.l;
  document.title = ru ? 'VIP BRAND — мужская одежда, 13 филиалов в Ташкенте' : "VIP BRAND — erkaklar kiyimi, Toshkent bo'ylab 13 filial";
  document.getElementById('lang').setAttribute('aria-label', ru ? 'Сменить язык' : 'Tilni almashtirish');
}""")
open('site.js', 'w', encoding='utf8').write(j)
print('ok')
