import * as THREE from './vendor/three.module.min.js';

/* ---------- Logo: rasmiy belgi chiziqlari (avatar bo'yicha chizilgan) ---------- */
const CX = 162.5, TOP = 190;
function bandsV(k) {
  const d = k * 10, xl = 95 + d, xr = 230 - d, tip = 300 - k * 15, top = [100, 88, 96][k];
  const knee = tip - (CX - xl) * 1.32;
  return { l: [[xl, top], [xl, knee], [CX, tip]], r: [[xr, top + (k === 1 ? 0 : 0)], [xr, knee], [CX, tip]] };
}
const LOGO = [];
[0, 1, 2].forEach(k => { const b = bandsV(k); LOGO.push({ pts: b.l, side: -1 - k * .15 }, { pts: b.r, side: 1 + k * .15 }); });
LOGO.push({ pts: [[125, 97], [125, 206], [CX, 253], [178, 238]], side: -.75 });
LOGO.push({ pts: [[125, 97], [190, 97], [192, 135], [176, 146], [192, 160], [192, 205], [150, 247]], side: .8, up: 1 });
LOGO.push({ pts: [[139, 106], [181, 106], [183, 130], [163, 146], [183, 165], [183, 200], [150, 232], [138, 220]], side: .55, up: .7 });

const svgInner = LOGO.map(o => `<path pathLength="1" d="M${o.pts.map(p => p.join(' ')).join('L')}"/>`).join('');
document.querySelectorAll('svg.mono').forEach(s => s.innerHTML = svgInner);

/* ---------- Til, reveal, ro'yxat ---------- */
const root = document.documentElement;
const saved = (() => { try { return localStorage.getItem('vb-l'); } catch { return null; } })();
if (saved) root.dataset.l = saved;
function syncLang() {
  const ru = root.dataset.l === 'ru';
  root.lang = root.dataset.l;
  document.title = ru ? 'VIP BRAND — мужская одежда, 13 филиалов в Ташкенте' : "VIP BRAND — erkaklar kiyimi, Toshkent bo'ylab 13 filial";
  document.getElementById('lang').setAttribute('aria-label', ru ? 'Сменить язык' : 'Tilni almashtirish');
}
syncLang();
document.getElementById('lang').onclick = () => {
  root.dataset.l = root.dataset.l === 'uz' ? 'ru' : 'uz'; syncLang();
  try { localStorage.setItem('vb-l', root.dataset.l); } catch {}
};
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } }), { threshold: .15 });
document.querySelectorAll('.rv').forEach(e => io.observe(e));

const IG = 'https://www.instagram.com/vipbrand.uzb/';
const fan = document.getElementById('fan');
const reels = window.REELS || [];
reels.forEach((r, i) => {
  const a = document.createElement('a');
  a.className = 'card'; a.href = r.href || IG; a.target = '_blank'; a.rel = 'noopener';
  const m = (i - (reels.length - 1) / 2);
  a.style.setProperty('--ry', `${-m * 10}deg`);
  a.style.setProperty('--tz', `${-Math.abs(m) * 50}px`);
  a.style.setProperty('--ty', `${Math.abs(m) * 12}px`);
  a.setAttribute('aria-label', r.alt || 'Instagram reels');
  if (r.video) {
    const v = document.createElement('video');
    Object.assign(v, { src: r.video, poster: r.poster || '', muted: true, loop: true, playsInline: true, preload: 'none' });
    new IntersectionObserver(([e]) => e.isIntersecting ? v.play().catch(() => {}) : v.pause(), { threshold: .3 }).observe(a);
    a.append(v);
  } else {
    const im = new Image(); im.src = r.poster; im.alt = r.alt || ''; im.loading = 'lazy'; a.append(im);
  }
  fan.append(a);
});

const BR = [
  ['Stroy Gorod', 'Yunusobod', 69.286707, 41.366787, 'https://yandex.ru/maps?whatshere%5Bpoint%5D=69.286707%2C41.366787&whatshere%5Bzoom%5D=17&ll=69.2865%2C41.3668&z=17'],
  ['Qoratosh Mediapark', 'Shayxontohur', 69.236045, 41.314523, 'https://yandex.ru/navi?whatshere%5Bpoint%5D=69.23604553739692%2C41.314523283793804&whatshere%5Bzoom%5D=19&ll=69.23604553739692%2C41.3145232&z=19'],
  ['Sergeli Mediapark', 'Sergeli', 69.221292, 41.22584, 'https://yandex.ru/maps/-/CLChbUiM'],
  ['Farxad Jiz Biz', 'Uchtepa', 69.185373, 41.285449, 'https://yandex.ru/maps?whatshere%5Bpoint%5D=69.18537347669773%2C41.28544894981701&whatshere%5Bzoom%5D=16&ll=69.18537347669773%2C41.2854489&z=16'],
  ['Parkent', 'Yashnobod', 69.330213, 41.313025, 'https://yandex.ru/maps/org/230934934318'],
  ['Sergeli Yangi hayot', 'Yangi hayot', 69.203568, 41.220937, 'https://yandex.ru/navi?whatshere%5Bzoom%5D=18&whatshere%5Bpoint%5D=69.203568,41.220937'],
  ['New Farxad', 'Chilonzor', 69.190461, 41.28324, 'https://yandex.ru/maps?whatshere%5Bpoint%5D=69.1904614321009%2C41.283239536674024&whatshere%5Bzoom%5D=16&ll=69.1904614%2C41.2832395&z=16'],
  ['Globus mall', 'Chilonzor', 69.176044, 41.27199, 'https://yandex.ru/maps?whatshere%5Bpoint%5D=69.1760440613272%2C41.27198973951763&whatshere%5Bzoom%5D=17&ll=69.176044%2C41.27199&z=17'],
  ['Nukus kinoteatr', 'Olmazor', 69.217525, 41.350574, 'https://yandex.ru/maps/org/57381900310'],
  ["Qo'yliq Farg'ona yo'li", 'Mirobod', 69.326048, 41.245505, 'https://yandex.ru/navi?whatshere%5Bzoom%5D=21&whatshere%5Bpoint%5D=69.326048,41.245505'],
  ['Tinchlik', 'Shayxontohur', 69.215055, 41.335021, 'https://yandex.uz/maps?ll=69.2150546%2C41.3350209&z=17'],
  ['Beruniy', 'Olmazor', 69.2056, 41.3449, 'https://yandex.ru/maps/-/CLCdAF3q'],
  ['Eco Chimgan', "Mirzo Ulug'bek", 69.355132, 41.352975, 'https://yandex.ru/maps/-/CLCdiXLn'],
];
const list = document.getElementById('list');
BR.forEach((b, i) => {
  const li = document.createElement('li');
  li.innerHTML = `<a href="${b[4]}" target="_blank" rel="noopener" data-i="${i}"><em>${String(i + 1).padStart(2, '0')}</em><b>${b[0]}</b><small>${b[1]}</small></a>`;
  list.append(li);
});

/* ---------- WebGL tekshiruvi ---------- */
const mob = matchMedia('(max-width:820px)').matches;
const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
function gl3d(cv, opts) { try { return new THREE.WebGLRenderer({ canvas: cv, ...opts }); } catch { return null; } }
const R = gl3d(document.getElementById('gl'), { antialias: !mob, powerPreference: 'high-performance' });
if (!R) { root.classList.add('no3d'); root.classList.add('ready'); }
else initStage();

/* ---------- 3D sahna ---------- */
function strip(pts, t, S) {
  const P = pts.map(p => new THREE.Vector2((p[0] - CX) * S, -(p[1] - TOP) * S));
  const a = [], b = [];
  P.forEach((p, i) => {
    const d0 = i ? p.clone().sub(P[i - 1]).normalize() : null;
    const d1 = i < P.length - 1 ? P[i + 1].clone().sub(p).normalize() : null;
    let tang = (d0 && d1) ? d0.clone().add(d1).normalize() : (d0 || d1);
    const n = new THREE.Vector2(-tang.y, tang.x);
    const ref = d1 ? new THREE.Vector2(-d1.y, d1.x) : new THREE.Vector2(-d0.y, d0.x);
    const m = Math.min(2.4, 1 / Math.max(.3, n.dot(ref)));
    a.push(p.clone().addScaledVector(n, t * m)); b.push(p.clone().addScaledVector(n, -t * m));
  });
  const sh = new THREE.Shape([...a, ...b.reverse()]);
  const g = new THREE.ExtrudeGeometry(sh, { depth: .17, bevelEnabled: true, bevelThickness: .018, bevelSize: .012, bevelSegments: 2, steps: 1 });
  g.translate(0, 0, -.085);
  return g;
}

function glow(hex) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d'), g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, hex); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function initStage() {
  const dpr = Math.min(devicePixelRatio || 1, mob ? 1.4 : 1.75);
  R.setPixelRatio(dpr);
  R.toneMapping = THREE.ACESFilmicToneMapping;
  R.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0908);
  scene.fog = new THREE.Fog(0x0a0908, 8.2, 12.5);
  const cam = new THREE.PerspectiveCamera(mob ? 50 : 38, 1, .1, 80);

  // Metal uchun yorug'lik muhiti
  const envS = new THREE.Scene();
  envS.background = new THREE.Color(0x050403);
  const panel = (w, h, x, y, z, col, k) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.lookAt(0, 0, 0); envS.add(m);
  };
  panel(14, 2, 0, 9, 3, '#fff1d6', 9); panel(2, 12, -9, 1, 3, '#ffc98a', 7); panel(2, 12, 9, 2, 2, '#ffe6c2', 6);
  panel(10, 1, 0, -6, 6, '#c98b47', 2.5); panel(6, 6, 0, 2, 12, '#3a2c1e', 1.4); panel(1, 9, 4, 3, -9, '#fff', 4);
  const pm = new THREE.PMREMGenerator(R);
  scene.environment = pm.fromScene(envS, .035).texture;
  pm.dispose();

  const gold = new THREE.MeshStandardMaterial({ color: 0xe0b26b, metalness: 1, roughness: .24 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xb98f50, metalness: 1, roughness: .38 });
  const FLOOR = -2.25;

  // Logo: bo'laklar ochiladi
  const logo = new THREE.Group(); logo.position.y = mob ? .05 : .22; scene.add(logo);
  const S = .0152;
  const parts = LOGO.map(o => {
    const m = new THREE.Mesh(strip(o.pts, 2.1 * S, S), gold);
    m.userData = o; logo.add(m); return m;
  });
  const logoMirror = new THREE.Group(); logoMirror.scale.y = -1; logoMirror.position.y = FLOOR * 2 - logo.position.y; scene.add(logoMirror);
  const mirrorParts = LOGO.map((o, i) => { const m = new THREE.Mesh(parts[i].geometry, gold); logoMirror.add(m); return m; });

  // Yaltiroq pol: aksi ostidagi nusxalar orqali
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 90), new THREE.MeshStandardMaterial({ color: 0x0c0a08, metalness: .55, roughness: .3, transparent: true, opacity: .86, envMapIntensity: .16 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, FLOOR, -18); scene.add(floor);

  // Zal
  const W = mob ? 2.7 : 4.3, ZEND = -34, LEN = 30;
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x14100c, roughness: .46, metalness: .25, envMapIntensity: .55 });
  const hall = new THREE.Group(); scene.add(hall);
  const ceilY = 4.1;
  [-1, 1].forEach(s => {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(LEN + 6, 8), wallMat);
    w.rotation.y = -s * Math.PI / 2; w.position.set(s * W, 1.5, ZEND + LEN / 2); hall.add(w);
    // chiroq chiziqlari
    const l = new THREE.Mesh(new THREE.BoxGeometry(.035, .02, LEN), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd9a0').multiplyScalar(2.6), fog: true }));
    l.position.set(s * W * .42, ceilY - .02, ZEND + LEN / 2); hall.add(l);
    const lm = l.clone(); lm.position.y = FLOOR * 2 - l.position.y; hall.add(lm);
    // ilgak temir
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, LEN - 2, 8), brass);
    rail.rotation.x = Math.PI / 2; rail.position.set(s * (W - .55), 1.72, ZEND + LEN / 2); hall.add(rail);
  });
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, LEN + 6), new THREE.MeshStandardMaterial({ color: 0x0b0907, roughness: .8 }));
  ceil.rotation.x = Math.PI / 2; ceil.position.set(0, ceilY, ZEND + LEN / 2); hall.add(ceil);
  // Darvoza ramkalari
  const fr = (x, y, z, w, h) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, .1), brass); m.position.set(x, y, z); return m; };
  for (let z = -5; z > ZEND; z -= 6) {
    const midY = (ceilY + FLOOR) / 2, H = ceilY - FLOOR;
    const f = new THREE.Group();
    f.add(fr(-W + .06, midY, z, .1, H), fr(W - .06, midY, z, .1, H), fr(0, ceilY - .05, z, W * 2, .1));
    hall.add(f);
    const mir = f.clone(); mir.scale.y = -1; mir.position.y = FLOOR * 2; hall.add(mir);
  }
  // Oxirgi eshik: oltin belgi va orqa nur
  const endWall = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, 8), wallMat); endWall.position.set(0, 1.5, ZEND); hall.add(endWall);
  const endGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow('#ffcf8a'), blending: THREE.AdditiveBlending, transparent: true, opacity: .55, depthWrite: false, fog: false }));
  endGlow.scale.set(9, 9, 1); endGlow.position.set(0, .9, ZEND + .1); hall.add(endGlow);
  const endLogo = new THREE.Group(); parts.forEach(p => endLogo.add(new THREE.Mesh(p.geometry, gold))); endLogo.position.set(0, .7, ZEND + .35); hall.add(endLogo);

  const spot = (x, y, z, tx, ty, tz, i, a = .42) => {
    const s = new THREE.SpotLight(0xffe2b8, i, 16, a, .55, 1.1);
    s.position.set(x, y, z); s.target.position.set(tx, ty, tz); scene.add(s, s.target); return s;
  };
  spot(0, 5, 5, 0, .2, 0, 60, .5);
  const sweep = new THREE.PointLight(0xffd59a, 26, 11); scene.add(sweep);

  // Kiyimlar
  const G = [
    { f: 'assets/g/vetrofka.webp', z: -10, side: 1 },
    { f: 'assets/g/svitshot.webp', z: -18, side: -1 },
    { f: 'assets/g/kurtka.webp', z: -26, side: 1 },
  ];
  function bodyGeo(w, h) {
    const g = new THREE.PlaneGeometry(w, h, 28, 36), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i) / (w / 2), y = p.getY(i) / (h / 2);
      p.setZ(i, (1 - x * x) * .26 * (1 - .3 * y * y) + Math.sin(y * 9 + x * 2) * .006);
    }
    g.computeVertexNormals(); return g;
  }
  const big = bodyGeo(2.5, 3.33), small = bodyGeo(1.3, 1.73);
  const loader = new THREE.TextureLoader(new THREE.LoadingManager());
  const halo = glow('#c9975a');
  const wires = [], heroes = [], maxAn = R.capabilities.getMaxAnisotropy();
  let pending = G.length, done = 0;
  const num = document.getElementById('loadnum');
  const finish = () => { done++; num.textContent = Math.round(done / G.length * 100); if (--pending === 0) ready(); };
  G.forEach(g => {
    const x = mob ? 0 : g.side * 1.25;
    const y = mob ? .62 : .02;
    const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, alphaTest: .35, toneMapped: false, color: 0xf4f0ea });
    const dim = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, transparent: true, alphaTest: .35, roughness: .9, color: 0x8a8072, envMapIntensity: .35 });
    loader.load(g.f, t => {
      t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAn;
      mat.map = t; dim.map = t; mat.needsUpdate = dim.needsUpdate = true; finish();
    }, undefined, finish);
    g.dim = dim;
    const m = new THREE.Mesh(big, mat); m.position.set(x, y, g.z);
    const mm = new THREE.Mesh(big, mat); mm.scale.y = -1; mm.position.set(x, FLOOR * 2 - y, g.z);
    const h = new THREE.Sprite(new THREE.SpriteMaterial({ map: halo, blending: THREE.AdditiveBlending, transparent: true, opacity: .42, depthWrite: false }));
    h.scale.set(5.2, 5.2, 1); h.position.set(x, y, g.z - .7);
    // Tepadan osilgan sim
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(.006, .006, ceilY - y - 1.6, 5), brass);
    wire.position.set(x, (ceilY + y + 1.6) / 2, g.z);
    // Orqa ark
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.95, .018, 8, 80), gold); ring.position.set(x, y + .05, g.z - .75);
    scene.add(m, mm, h, wire, ring); wires.push(wire);
    spot(x + (mob ? 0 : -g.side * 1.5), 3.7, g.z + 3, x, y, g.z, 44, .46);
    heroes.push({ m, mm, g, x, y, parts: [m, mm, h, ring] });
  });
  // Yon temirdagi kiyimlar
  [-1, 1].forEach(s => {
    if (mob) return;
    for (let z = -6.5, i = 0; z > ZEND + 1.5; z -= .78, i++) {
      const src = G[(i + (s > 0 ? 1 : 0)) % 3];
      const m = new THREE.Mesh(small, src.dim);
      m.position.set(s * (W - .55), .88, z + Math.sin(i * 7.3) * .05);
      m.rotation.y = -s * (Math.PI / 2 - .5);
      scene.add(m);
    }
  });

  // Oltin chang
  const n = mob ? 260 : 620, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * W * 2; pos[i * 3 + 1] = FLOOR + Math.random() * 6; pos[i * 3 + 2] = 7 - Math.random() * 42; }
  const dustG = new THREE.BufferGeometry(); dustG.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(dustG, new THREE.PointsMaterial({ map: glow('#ffe0ad'), color: 0xffffff, size: .05, transparent: true, opacity: .75, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(dust);

  // Kamera yo'li
  const camD = mob ? 6.3 : 5.5, lookY = mob ? -.42 : .02;
  const KF = [
    { p: 0, c: [0, .15, mob ? 8.9 : 7.6], l: [0, mob ? .05 : .15, 0] },
    { p: .09, c: [0, .15, 6.6], l: [0, .15, 0] },
    { p: .2, c: [0, .15, -1.5], l: [0, .15, -8] },
  ];
  G.forEach((g, i) => {
    const p = [.3, .5, .7][i], cx = mob ? 0 : g.side * .1;
    KF.push({ p: p - .05, c: [cx + (mob ? 0 : -g.side * .22), .12, g.z + camD + .55], l: [mob ? 0 : g.side * .05, lookY, g.z] });
    KF.push({ p: p + .05, c: [cx + (mob ? 0 : g.side * .16), .12, g.z + camD - .25], l: [mob ? 0 : g.side * .05, lookY, g.z] });
  });
  KF.push({ p: .86, c: [0, .3, ZEND + 8], l: [0, .7, ZEND] }, { p: 1, c: [0, .55, ZEND + 3.2], l: [0, .7, ZEND] });
  const smooth = t => t * t * (3 - 2 * t);
  const vA = new THREE.Vector3(), vB = new THREE.Vector3(), look = new THREE.Vector3();
  function camAt(p) {
    let i = 0; while (i < KF.length - 2 && p > KF[i + 1].p) i++;
    const a = KF[i], b = KF[i + 1], t = smooth(THREE.MathUtils.clamp((p - a.p) / (b.p - a.p), 0, 1));
    cam.position.copy(vA.set(...a.c)).lerp(vB.set(...b.c), t);
    look.copy(vA.set(...a.l)).lerp(vB.set(...b.l), t);
  }

  // Scroll va sichqoncha
  const stage = document.getElementById('stage');
  const chs = [...document.querySelectorAll('.ch')];
  const fade = document.getElementById('fade'), barI = document.querySelector('#bar i');
  let target = 0, prog = 0, mx = 0, my = 0, sx = 0, sy = 0, visible = true;
  const readScroll = () => {
    const r = stage.getBoundingClientRect();
    target = THREE.MathUtils.clamp(-r.top / (r.height - innerHeight), 0, 1);
  };
  addEventListener('scroll', readScroll, { passive: true });
  if (!mob) addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);

  function size() {
    const w = innerWidth, h = document.querySelector('.pin').clientHeight;
    R.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    readScroll();
  }
  addEventListener('resize', size); size();

  function updateDom(p) {
    chs.forEach(c => {
      const a = +c.dataset.in, b = +c.dataset.out, e = .025;
      let o = THREE.MathUtils.smoothstep(p, a - e, a + e) * (1 - THREE.MathUtils.smoothstep(p, b - e, b + e));
      if (c.id === 'hero') o = 1 - THREE.MathUtils.smoothstep(p, .035, .085);
      c.style.opacity = o.toFixed(3);
      c.style.visibility = o < .01 ? 'hidden' : 'visible';
      c.style.pointerEvents = o > .6 && c.classList.contains('item') ? 'auto' : '';
    });
    fade.style.opacity = THREE.MathUtils.smoothstep(p, .965, 1).toFixed(3);
    barI.style.transform = `scaleY(${p.toFixed(3)})`;
  }

  const clock = new THREE.Clock();
  function frame() {
    const dt = Math.min(clock.getDelta(), .1), t = clock.elapsedTime;
    prog += (target - prog) * (calm ? 1 : 1 - Math.exp(-dt * 5.5));
    const k = 1 - Math.exp(-dt * 3); sx += (mx - sx) * k; sy += (my - sy) * k;
    const p = prog;
    camAt(p);
    cam.position.x += sx * .3; cam.position.y -= sy * .16;
    cam.lookAt(look);

    // Belgi ochilishi
    const open = THREE.MathUtils.smoothstep(p, .075, .19), eOpen = open * open;
    const rotY = (1 - open) * (sx * .55 + Math.sin(t * .35) * .13);
    logo.rotation.y = rotY; logo.rotation.x = (1 - open) * sy * .2;
    parts.forEach((m, i) => {
      const o = m.userData;
      m.position.x = o.side * eOpen * (mob ? 3.5 : 5.2);
      m.position.y = (o.up || 0) * eOpen * 4.4;
      m.position.z = eOpen * (o.side < 0 ? 1 : -1) * .3;
      m.rotation.y = o.side * eOpen * .8;
      const mm = mirrorParts[i]; mm.position.copy(m.position); mm.rotation.copy(m.rotation);
    });
    logoMirror.rotation.y = rotY;
    logo.visible = logoMirror.visible = open < .995;
    scene.fog.near = THREE.MathUtils.lerp(8.2, 4, open); scene.fog.far = THREE.MathUtils.lerp(12.5, 23, open);
    wires.forEach(w => { w.visible = open > .6; });
    heroes.forEach(h => h.parts.forEach(o => { o.visible = open > .3; }));
    const endOn = p > .68; endLogo.visible = endOn; endGlow.visible = endOn;

    heroes.forEach(h => {
      const r = Math.sin(t * .45 + h.g.z) * .1 + (mob ? 0 : -h.g.side * .16) + (cam.position.z - h.g.z - 4) * .12 * h.g.side;
      h.m.rotation.y = h.mm.rotation.y = r;
      h.m.rotation.z = Math.sin(t * .7 + h.g.z) * .006;
      h.mm.rotation.z = -h.m.rotation.z;
    });
    sweep.position.set(Math.sin(t * .55) * 3, 1.3 + Math.cos(t * .4), cam.position.z - 3);
    dust.rotation.y = Math.sin(t * .03) * .02;
    dust.position.y = Math.sin(t * .1) * .15;

    updateDom(p);
    R.render(scene, cam);
  }
  function loop() { requestAnimationFrame(loop); if (visible) frame(); }

  function ready() {
    frame();
    setTimeout(() => root.classList.add('ready'), 500);
    loop();
    window.__vb = { renderer: R };
  }
}

/* ---------- 3D xarita ---------- */
function initMap() {
  const cv = document.getElementById('map');
  const box = cv.parentElement, tip = document.getElementById('tip');
  const R2 = gl3d(cv, { antialias: true, alpha: true });
  if (!R2) return;
  R2.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(36, 1, .1, 100);
  const C = [69.26, 41.295], kx = Math.cos(C[1] * Math.PI / 180) * 111.32, ky = 110.57, U = .13;
  const lines = (arr, col, op) => {
    const v = [];
    arr.forEach(l => { for (let i = 0; i < l.length - 2; i += 2) v.push(l[i] * U, 0, -l[i + 1] * U, l[i + 2] * U, 0, -l[i + 3] * U); });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
    scene.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: op })));
  };
  const D = window.TASHKENT_MAP || { a: [], b: [], w: [] };
  scene.fog = new THREE.Fog(0x0d0b09, 3.4, 7.2);
  lines(D.w, 0x3f6a78, .75); lines(D.b, 0x6b5636, .6); lines(D.a, 0xc99d5a, .62);

  const beam = new THREE.CylinderGeometry(.018, .018, 1, 10, 1, true); beam.translate(0, .5, 0);
  const pos = beam.attributes.position, cols = new Float32Array(pos.count * 3);
  for (let i = 0; i < pos.count; i++) { const k = 1 - pos.getY(i); cols.set([k * k, k * k * .74, k * k * .42], i * 3); }
  beam.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  const pins = BR.map(b => {
    const g = new THREE.Group(); g.position.set((b[2] - C[0]) * kx * U, 0, -(b[3] - C[1]) * ky * U);
    const m = new THREE.Mesh(beam, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }));
    const ball = new THREE.Mesh(new THREE.SphereGeometry(.035, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffdca6, fog: false }));
    const ring = new THREE.Mesh(new THREE.RingGeometry(.05, .065, 32), new THREE.MeshBasicMaterial({ color: 0xffd28f, transparent: true, side: THREE.DoubleSide, fog: false }));
    ring.rotation.x = -Math.PI / 2;
    g.add(m, ball, ring); scene.add(g);
    return { g, m, ball, ring, h: .55 };
  });
  let active = -1, ang = 0, drag = false, lx = 0, spin = 0;
  const focus = new THREE.Vector3(), want = new THREE.Vector3();
  let W = 1, H = 1;
  function size() { W = box.clientWidth; H = box.clientHeight; R2.setSize(W, H, false); cam.aspect = W / H; cam.updateProjectionMatrix(); }
  new ResizeObserver(size).observe(box); size();
  const proj = new THREE.Vector3();
  const screenOf = p => { proj.setFromMatrixPosition(p.ball.matrixWorld).project(cam); return [(proj.x + 1) / 2 * W, (1 - proj.y) / 2 * H]; };
  function pick(e) {
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    let best = -1, bd = e.pointerType === 'touch' ? 34 : 24;
    pins.forEach((p, i) => { const [a, b] = screenOf(p), d = Math.hypot(a - x, b - y); if (d < bd) { bd = d; best = i; } });
    return best;
  }
  function setActive(i) {
    active = i;
    list.querySelectorAll('a').forEach((a, k) => a.classList.toggle('on', k === i));
    tip.style.opacity = i < 0 ? 0 : 1;
    if (i >= 0) tip.textContent = `${BR[i][0]} · ${BR[i][1]}`;
    cv.style.cursor = i < 0 ? 'grab' : 'pointer';
  }
  let downX = 0;
  cv.addEventListener('pointerdown', e => { drag = true; lx = downX = e.clientX; });
  addEventListener('pointerup', () => { drag = false; });
  cv.addEventListener('pointermove', e => {
    if (drag && e.pointerType === 'mouse') { ang += (e.clientX - lx) * .006; lx = e.clientX; }
    else if (!drag) setActive(pick(e));
  });
  cv.addEventListener('pointerleave', () => { if (!drag) setActive(-1); });
  cv.addEventListener('click', e => {
    if (Math.abs(e.clientX - downX) > 6) return;
    const i = pick(e);
    if (i >= 0) { setActive(i); window.open(BR[i][4], '_blank', 'noopener'); }
  });
  list.addEventListener('pointerover', e => { const a = e.target.closest('a'); if (a) setActive(+a.dataset.i); });
  list.addEventListener('pointerleave', () => setActive(-1));
  list.addEventListener('focusin', e => { const a = e.target.closest('a'); if (a) setActive(+a.dataset.i); });

  let vis = false; new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(box);
  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    if (!vis) return;
    const t = clock.getElapsedTime();
    if (!drag && active < 0 && !calm) spin += .0011;
    want.set(0, 0, 0);
    let dist = mob ? 4.7 : 3.55;
    if (active >= 0) { want.copy(pins[active].g.position); dist = 2.5; }
    focus.lerp(want, .05);
    cam.userData.d = (cam.userData.d || dist) + (dist - (cam.userData.d || dist)) * .05;
    const a = ang + Math.sin(spin) * .55, d = cam.userData.d;
    cam.position.set(focus.x + Math.sin(a) * d * .62, d * .86, focus.z + Math.cos(a) * d * .62);
    cam.lookAt(focus);
    pins.forEach((p, i) => {
      const on = i === active, tgt = on ? 1 : .55;
      p.h += (tgt - p.h) * .1;
      p.m.scale.set(on ? 2.2 : 1, p.h, on ? 2.2 : 1);
      p.ball.position.y = p.h;
      const pulse = (t * .6 + i * .37) % 1;
      p.ring.scale.setScalar(1 + pulse * 2.4); p.ring.material.opacity = (1 - pulse) * .8;
    });
    R2.render(scene, cam);
    if (active >= 0) { pins[active].ball.updateWorldMatrix(true, false); const [x, y] = screenOf(pins[active]); tip.style.transform = `translate(${x}px,${y}px)`; }
  })();
}
initMap();
