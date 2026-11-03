"""Gemini orqali kiyim va atmosfera kadrlarini yaratadi. Bor faylni qayta yaratmaydi."""
import base64, json, os, re, sys, urllib.request as u
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ENV = Path.home() / "Desktop/loyihalarim/hamroh/.env"
KEY = re.search(r"GEMINI_API_KEY=(\S+)", ENV.read_text(encoding="utf8")).group(1)
MODEL = "gemini-3-pro-image-preview"
OUT = Path(__file__).parent / "gen"
OUT.mkdir(exist_ok=True)

G = ("Ultra realistic e-commerce ghost product photograph. A single {x} hanging on a slim brass hanger, "
     "shown perfectly front-on and centered with the hanger hook visible at the top, empty garment with natural "
     "volume and real fabric folds. Isolated on a pure solid white #FFFFFF background, no shadow, no floor, no text, "
     "no logos, no labels, no mannequin, no person. Sharp fabric texture, soft even studio light, 85mm lens.")
A = ("Luxury menswear editorial photograph, black and warm brass-gold palette, cinematic low-key light, "
     "shallow depth of field, real film grain. No text, no logos, no watermarks. ")

JOBS = {
 # kiyimlar — do'kon Instagramida ko'ringan turlar asosida
 "g_vetrofka": ("3:4", G.format(x="matte black men's hooded zip-up windbreaker jacket with ribbed tonal panels")),
 "g_svitshot": ("3:4", G.format(x="chocolate brown men's heavyweight cotton hoodie sweatshirt with drawstrings")),
 "g_palto":    ("3:4", G.format(x="camel wool men's tailored long overcoat, notch lapels")),
 "g_kurtka":   ("3:4", G.format(x="mustard yellow men's quilted down puffer jacket with a stand collar")),
 "g_parka":    ("3:4", G.format(x="charcoal grey men's winter parka with hood, technical matte fabric, zip and snap placket")),
 "g_shim":     ("3:4", G.format(x="pair of light stone grey men's tailored pleated wide trousers, clipped at the waistband to the hanger")),
 "g_jins":     ("3:4", G.format(x="pair of dark indigo men's straight jeans, clipped at the waistband to the hanger")),
 # atmosfera
 "a_hero":   ("16:9", A + "Interior of a dark premium men's clothing boutique at night: long polished black floor, brass clothing rails with neatly spaced dark jackets, warm linear lights, mirrored brass-trimmed walls, tall green palm in a corner, wide symmetrical view, no people."),
 "a_qol":    ("4:5", A + "Close-up of a man's hand resting in the pocket of light stone-grey tailored trousers, dark knit sweater, beige open overcoat, black leather strap wristwatch. Body cropped at chest, face not visible."),
 "a_palto":  ("4:5", A + "Man in a camel wool overcoat walking at night past a lit boutique window on a wet city street, seen from the chest down to the knee, face not visible, motion, bokeh gold lights."),
 "a_tekstura": ("16:9", A + "Macro of stacked folded men's knitwear and dark wool fabric on a polished brass shelf, thick stitching visible, warm side light."),
 "a_kurtka": ("4:5", A + "Man wearing a mustard yellow quilted puffer jacket and black trousers standing beside a brass clothing rail in a dark boutique, framed from the neck to the thigh, face not visible."),
 "a_tuzatish": ("4:5", A + "Man's hands zipping a matte black hooded windbreaker jacket in front of a boutique mirror, close crop on chest and hands, face not visible."),
 "a_oyoq":   ("4:5", A + "Black leather men's chelsea boots and dark tapered trousers standing on a polished black marble floor with reflection and brass line inlay, low angle."),
}

def run(item):
    name, (ar, prompt) = item
    f = OUT / f"{name}.png"
    if f.exists():
        return name, "bor"
    body = {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": ar, "imageSize": "1K"}}}
    req = u.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
                    data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": KEY})
    try:
        d = json.load(u.urlopen(req, timeout=240))
        for p in d["candidates"][0]["content"]["parts"]:
            if "inlineData" in p:
                f.write_bytes(base64.b64decode(p["inlineData"]["data"]))
                return name, "ok"
        return name, "rasm yo'q"
    except Exception as e:
        return name, f"xato: {e} {getattr(e, 'read', lambda: b'')()[:200]}"

only = sys.argv[1:]
items = [i for i in JOBS.items() if not only or i[0] in only]
with ThreadPoolExecutor(4) as ex:
    for r in ex.map(run, items):
        print(*r, flush=True)
