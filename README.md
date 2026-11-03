# VIP BRAND — 3D sayt (demo)

Ishga tushirish (papka ichida): `python -m http.server 8091`, keyin http://localhost:8091
Faylni to'g'ridan-to'g'ri ikki marta bosib ochib bo'lmaydi: 3D modul server talab qiladi.

Tuzilma: `index.html`, `site.css`, `site.js`, `vendor/` (three.js), `assets/`. `_raw/` serverga chiqmaydi.

## Ma'lumot manbalari
- 373K obunachi, 338 post, telefonlar, ikkala narx: Instagram skrinshoti (2026-11-02)
- 13 filial, xarita havolalari: t.me/vipbrandlocation
- Yo'llar: OpenStreetMap

## Hali haqiqiy emas
- **Kiyim rasmlari** (`assets/g/`): AI yaratgan namunalar, saytda "Namunaviy tasvir" deb yozilgan. Haqiqiy suratlar kelsa, shu nomlar bilan almashtiring va yozuvni olib tashlang.
- **Reels** (`assets/r/`): skrinshotdan qirqilgan past sifatli kadrlar. Video qo'shish uchun `assets/reels.js` ga `{video:'assets/v/nom.mp4', poster:'...', href:'reel havolasi'}` yozing.
- **Gemini kadrlari**: `_raw/gen.py` tayyor, kredit to'ldirilsa ishga tushiring.

## Do'kondan aniqlashtirish kerak
1. Ish vaqti: katalogda 10:00–22:00 ham, 10:00–00:00 ham bor, shuning uchun saytga yozilmagan.
2. Yetkazib berish: kanalning bir postida "vaqtincha yo'q", boshqasida "bor, Telegramdan yozing".
3. Narxlar: 129 000 va 79 000 reels'dan olingan, hozir ham shundaymi. Kurtka narxi noma'lum.
4. Beruniy filiali xaritada taxminiy nuqtada (metro yonida); havolasi kanalniki.
5. Kanalda Tinchlik havolasining belgisi Stroy Gorod nuqtasiga qaragan. Saytda to'g'rilangan, kanalda ham tuzatish kerak.
6. Uchinchi telefon (+998 77 3...) skrinshotda kesilgan.
7. Uzum'dagi "VIP-BRAND" do'koni shu tarmoqqa tegishlimi: unda ayollar kiyimi ham bor, shuning uchun saytga qo'shilmadi.

## Yakuniy test (2026-11-02, Edge headless, swiftshader, 1440 va 390)
- O'tdi: konsol va sahifa xatosi yo'q, 404 yo'q, overflow 0, buzilgan rasm yo'q, UZ matn va atributlarda kirill yo'q, "demo" so'zi yo'q, CSS qavslari teng, matn >= 12px.
- O'tdi: RU tili, desktop nav havolalari, xarita hover/bosish (1440), xarita bosish (390), ro'yxatda 13 ta Yandex havolasi, telefonda qo'ng'iroq tugmasi, og meta.
- Sinalmagan: haqiqiy telefon va GPU'dagi tezlik, Yandex havolalarining o'zi (testda tashqi so'rov to'silgan, faqat oyna ochilishi va havola shakli tekshirilgan).
- Video yo'q: haqiqiy reels videolari va haqiqiy kiyim suratlari hali yo'q. Reels bo'limi qoldirildi, chunki kadrlar xira bo'lsa ham do'konning yagona haqiqiy materiali.
- Joylashda: `og:image` ni to'liq domen manzili bilan yozish kerak.
