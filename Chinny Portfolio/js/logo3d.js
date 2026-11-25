/* The chrome "chinny" logo, live in 3D (three.js, kept in vendor/three).
   The model is media/logo/chinny-logo.glb, exported from portoflio/blender/chinny-logo.blend.
   The logo tilts toward the mouse, so the chrome reflections slide across the letters; on phones it sways by itself.
   The letters light up as neon when it first shows, and again after ENTER (site.js calls .replay() and the enter screen's .powerOff()).
   If 3D can't run (very old browser, "reduce motion" switched on), the still picture media/logo/chinny-chrome-still.webp shows instead. */
import * as THREE from 'three';
import { GLTFLoader } from '../vendor/three/addons/loaders/GLTFLoader.js';

/* the light-up (after kxdgraphics' retro logo reel): each slanted letter strikes on as a neon bar, left to right,
   the dot of the i snaps on, the neon cools into chrome, then PORTFOLIO blinks on. powerOff() switches it off like an old TV. */
const NEON = ['#3b4bff', '#8a3dff', '#ff3fb4', '#ff3b3b', '#ff8a1f', '#ffd21f']; // blue to yellow, left to right, like the reel
const GLOW = 'rgba(255,150,210,.7)';
const STEP = 110, SNAP = 150 + 6 * STEP + 150, COOL = 450; // ms: gap between letters, when the dot snaps on, how long the neon takes to cool
const FLICK = [1, 0, 1, .25, 1]; // a tube catching: brightness for each 30 ms after it strikes
const OFF = [.7, .35, .55, .2, .08, 0]; // switching off: brightness for each 70 ms
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

// the world the chrome reflects: blue sky, a bright horizon, a dark band under it, a light floor (the same idea as the Blender render)
function sky() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  const x = c.getContext('2d'), at = e => (90 - e) / 180; // elevation in degrees -> share of the way down the picture
  const g = x.createLinearGradient(0, 0, 0, 512);
  // the letters' faces see about -9..+9 degrees of it, so the horizon line runs through them
  [[90, '#14206a'], [30, '#2f4fc4'], [12, '#7f9cf0'], [5, '#dfe8ff'], [.8, '#ffffff'], [0, '#ffffff'], [-.6, '#22253a'], [-3, '#080a14'], [-7, '#5d5f72'], [-12, '#c9c7d2'], [-30, '#f4f1ec'], [-90, '#bdb9c0']]
    .forEach(([e, col]) => g.addColorStop(at(e), col));
  x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
  // bright vertical glints in the sky straight behind the viewer (u = .75 is what the letters face):
  // moving the mouse sideways slides them across the letters
  [[700, 12, .55], [742, 5, .9], [812, 9, .7], [868, 4, .9]].forEach(([px, w, a]) => {
    const s = x.createLinearGradient(px - w, 0, px + w, 0);
    s.addColorStop(0, 'rgba(255,255,255,0)'); s.addColorStop(.5, `rgba(255,255,255,${a})`); s.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = s; x.fillRect(px - w, at(40) * 512, w * 2, (at(.5) - at(40)) * 512);
  });
  // soft warm bands of light (gold, peach, a hint of pink), top to bottom, like the lights on brushed steel
  [[628, 34, '255,214,140', .55], [770, 22, '255,246,232', .6], [905, 30, '255,170,120', .5], [980, 24, '255,200,215', .35]].forEach(([px, w, col, a]) => {
    const s = x.createLinearGradient(px - w, 0, px + w, 0);
    s.addColorStop(0, `rgba(${col},0)`); s.addColorStop(.5, `rgba(${col},${a})`); s.addColorStop(1, `rgba(${col},0)`);
    x.fillStyle = s; x.fillRect(px - w, at(40) * 512, w * 2, (at(-35) - at(40)) * 512);
  });
  // soft studio lights to the sides, for sparkles on the bevelled edges
  [[180, 150], [500, 130], [960, 160]].forEach(([px, py]) => {
    const r = x.createRadialGradient(px, py, 0, px, py, 64);
    r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = r; x.fillRect(px - 64, py - 64, 128, 128);
  });
  const t = new THREE.CanvasTexture(c);
  t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* brushed metal: fine streak lines running along the letters, each a little lighter or darker and a little more or
   less shiny than the next, like a brushed steel sheet. Drawn once on a canvas and laid over the whole logo at rest,
   so they stay put on the letters as they fly in. BRUSH = how strongly the streaks show (0 = smooth chrome). */
const BRUSH = .8;
function streakMap() {
  const W = 1024, H = 512, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'), img = x.createImageData(W, H), d = img.data;
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; // the same streaks every time
  for (let y = 0; y < H; y++) {
    const row = (rnd() - .5) * .5;                       // each line a little lighter or darker overall
    for (let px = 0; px < W;) {
      const len = 30 + rnd() * rnd() * 700, v = Math.round(255 * Math.min(1, Math.max(0, .5 + row + (rnd() - .5) * Math.pow(rnd(), 1.5) * 1.1)));
      for (const end = Math.min(W, px + len); px < end; px++) { const k = (y * W + px) * 4; d[k] = d[k + 1] = d[k + 2] = v; d[k + 3] = 255; }
    }
  }
  x.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.anisotropy = 8; t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
function metalwork(mats, lo, size) {
  const marks = streakMap();
  mats.forEach(mat => mat.onBeforeCompile = sh => {
    Object.assign(sh.uniforms, { uLo: { value: lo }, uSize: { value: size }, uMarks: { value: marks } });
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec3 aRest;\nvarying vec3 vRest;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRest = aRest;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>
uniform vec3 uLo, uSize;
uniform sampler2D uMarks;
varying vec3 vRest;
vec3 logoBump(vec3 pos, vec3 n, float h, float fd) {
  vec3 sx = dFdx(pos), sy = dFdy(pos), r1 = cross(sy, n), r2 = cross(n, sx);
  float det = dot(sx, r1) * fd;
  return normalize(abs(det) * n - sign(det) * (dFdx(h) * r1 + dFdy(h) * r2));
}`)
      .replace('#include <map_fragment>', `#include <map_fragment>
float mark = (texture2D(uMarks, (vRest.xy - uLo.xy) / uSize.xy).r - .5) * ${BRUSH.toFixed(2)};
diffuseColor.rgb *= 1. + mark * .45;`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = clamp(roughnessFactor + .07 - mark * .12, 0., 1.);')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
normal = logoBump(-vViewPosition, normal, mark * uSize.y * .00004, faceDirection);`);
  });
}

// the mouse, shared by every logo on the page
const mouse = { x: 0, y: 0, at: -1e9 };
addEventListener('pointermove', e => { if (e.pointerType === 'mouse') Object.assign(mouse, { x: e.clientX, y: e.clientY, at: performance.now() }); }, { passive: true });

function mount(img, model) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch (e) { return; } // no 3D: the picture stays
  const cv = renderer.domElement, pm = new THREE.PMREMGenerator(renderer), env = sky();
  cv.className = 'chrome-logo'; cv.setAttribute('aria-hidden', 'true');
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.environment = pm.fromEquirectangular(env).texture; env.dispose();
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: .11 }); // a touch softer than a mirror
  const rig = new THREE.Group(), parts = [];
  const lo = new THREE.Vector3(Infinity, Infinity, Infinity), hi = lo.clone().negate();
  model.traverse(n => {
    if (!n.isMesh) return;
    const m = new THREE.Mesh(n.geometry, mat.clone()); m.position.copy(n.position); m.quaternion.copy(n.quaternion); m.scale.copy(n.scale); // each letter glows on its own
    rig.add(m); parts.push({ m, dot: n.name === 'L_dot', x: n.position.x });
    // where each point sits when the logo is at rest, so the metalwork stays put on the letters as they fly in
    if (!n.geometry.attributes.aRest) {
      const rest = n.geometry.attributes.position.clone(); rest.applyMatrix4(new THREE.Matrix4().compose(n.position, n.quaternion, n.scale));
      n.geometry.setAttribute('aRest', rest);
    }
    const b = new THREE.Box3().setFromBufferAttribute(n.geometry.attributes.aRest); lo.min(b.min); hi.max(b.max);
  });
  metalwork(parts.map(p => p.m.material), lo, hi.clone().sub(lo));
  // the bars light left to right, one colour each
  parts.filter(p => !p.dot).sort((a, b) => a.x - b.x).forEach((p, i) => { p.at = 150 + i * STEP; p.neon = new THREE.Color(NEON[i % NEON.length]).multiplyScalar(1.2); });
  parts.filter(p => p.dot).forEach(p => { p.at = SNAP; p.neon = new THREE.Color(0); });
  scene.add(rig);
  const cam = new THREE.PerspectiveCamera(30, 1100 / 547, .1, 20); cam.position.set(0, .02, 2.45);

  img.replaceWith(cv);
  const size = () => { const w = cv.clientWidth, h = cv.clientHeight; if (w && h) renderer.setSize(w, h, false); };
  new ResizeObserver(size).observe(cv); size();
  const word = cv.parentNode && cv.parentNode.querySelector('.chrome-neon'); // the PORTFOLIO sign
  let on = true, t0 = performance.now(), off = 0, rx = 0, ry = 0;
  new IntersectionObserver(es => { on = es[es.length - 1].isIntersecting; }).observe(cv);
  cv.replay = () => { t0 = performance.now(); off = 0; };
  cv.powerOff = () => { off = performance.now(); };

  const loop = now => {
    if (!cv.isConnected) { renderer.dispose(); pm.dispose(); parts.forEach(p => p.m.material.dispose()); return; } // the enter screen's logo is gone after ENTER
    requestAnimationFrame(loop);
    if (!on) return;
    const t = now - t0, c = clamp((t - SNAP) / COOL, 0, 1), neon = 1 - c * c * (3 - 2 * c); // 1 while lit as neon, easing to 0 as it cools
    parts.forEach(p => {
      const s = t - p.at, f = s < 0 ? 0 : FLICK[Math.floor(s / 30)] ?? 1;
      p.m.visible = f > 0;
      p.m.material.color.setScalar(1 - .88 * neon); // dark metal, so the neon colour is what shows
      p.m.material.emissive.copy(p.neon).multiplyScalar(neon * f);
    });
    const w = t - SNAP - COOL;
    if (word) word.style.visibility = w < 0 || !(FLICK[Math.floor(w / 30)] ?? 1) ? 'hidden' : '';
    const fx = [];
    if (t > 150 && neon > .01) fx.push(`drop-shadow(0 0 ${(.03 * neon).toFixed(3)}em ${GLOW}) drop-shadow(0 0 ${(.12 * neon).toFixed(3)}em ${GLOW})`);
    const b = off ? OFF[Math.min(OFF.length - 1, Math.floor((now - off) / 70))] : 1;
    if (off) fx.push(`brightness(${b}) saturate(.6)`);
    cv.style.filter = fx.join(' ');
    cv.parentNode.style.opacity = off ? b : ''; // PORTFOLIO switches off with it
    // turn toward the mouse; with no mouse for a while (or on a phone), sway gently by itself
    let tx, ty;
    if (now - mouse.at < 4000) {
      const r = cv.getBoundingClientRect();
      tx = clamp((mouse.x - (r.left + r.width / 2)) / (innerWidth / 2), -1, 1); ty = clamp((mouse.y - (r.top + r.height / 2)) / (innerHeight / 2), -1, 1);
    } else { tx = Math.sin(now / 2100) * .6; ty = Math.sin(now / 2900) * .5; }
    rx += (ty * .14 - rx) * .07; ry += (tx * .45 - ry) * .07; // up/down moves the horizon line, sideways slides the glints
    rig.rotation.set(rx, ry, 0);
    renderer.render(scene, cam);
  };
  requestAnimationFrame(loop);
}

if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !/edit/i.test(location.hash)) {
  new GLTFLoader().loadAsync('media/logo/chinny-logo.glb').then(gltf => {
    const all = () => document.querySelectorAll('img.chrome-logo').forEach(img => mount(img, gltf.scene));
    all();
    // the enter screen and the page can add their logo after this runs
    new MutationObserver(all).observe(document.body, { childList: true, subtree: true });
  }).catch(() => {}); // the picture stays
}
