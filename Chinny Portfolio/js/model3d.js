/* Real 3D models in the "All the stuffs" item shop (three.js, kept in vendor/three).
   A card gets a model when site.js gives it data-model="media/3d/....glb" (see MODELS in site.js).
   The model floats and slowly turns; point at it and it turns its front to you; drag it to look round it.
   The card's normal picture stays underneath until the model has loaded, and stays for good if 3D can't run.
   Soda Crackers: media/3d/soda-crackers.glb, exported from MIA/SEM 5/3D/final blend.blend (only the sealed pack). */
import * as THREE from 'three';
import { GLTFLoader } from '../vendor/three/addons/loaders/GLTFLoader.js';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const loader = new GLTFLoader();

// a soft photo studio for reflections: big bright softbox above, a warm light left, dark walls, a grey floor
function studio() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256;
  const x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 256);
  [[0, '#fbfbff'], [.18, '#c9cbd6'], [.42, '#2a2833'], [.5, '#17151d'], [.6, '#3a3742'], [1, '#77737f']].forEach(([o, col]) => g.addColorStop(o, col));
  x.fillStyle = g; x.fillRect(0, 0, 512, 256);
  [[120, 95, 70, 'rgba(255,236,214,.95)'], [330, 80, 46, 'rgba(255,255,255,.9)'], [430, 120, 40, 'rgba(255,120,170,.6)']].forEach(([px, py, rad, col]) => {
    const r = x.createRadialGradient(px, py, 0, px, py, rad); r.addColorStop(0, col); r.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = r; x.fillRect(px - rad, py - rad, rad * 2, rad * 2);
  });
  const t = new THREE.CanvasTexture(c); t.mapping = THREE.EquirectangularReflectionMapping; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function mount(card) {
  const box = card.querySelector('.gcard-media');
  if (!box) return;
  loader.loadAsync(card.dataset.model).then(gltf => {
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch (e) { return; } // no 3D: the picture stays
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
    const cv = renderer.domElement;
    cv.className = 'model3d'; cv.setAttribute('aria-hidden', 'true');

    // lighting like a small product shoot: a studio for the shiny bits to reflect, a strong key light from the top left,
    // a pink rim light behind and a cool fill from the right, so it has a bright side and a shadow side
    const scene = new THREE.Scene(), pm = new THREE.PMREMGenerator(renderer), env = studio();
    scene.environment = pm.fromEquirectangular(env).texture; scene.environmentIntensity = .9; env.dispose(); pm.dispose();
    scene.add(new THREE.HemisphereLight(0xf4f0ff, 0x1c1826, .55));
    const key = new THREE.DirectionalLight(0xfff4e8, 3.4); key.position.set(-3, 4, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0xff5a86, 2.2); rim.position.set(3, 2, -4); scene.add(rim);
    const fill = new THREE.DirectionalLight(0x8fb6ff, .8); fill.position.set(4, -1, 2); scene.add(fill);

    // the model, centred. Export it from Blender standing as in Blender's front view (its front facing the camera).
    const model = gltf.scene;
    model.traverse(n => { if (n.isMesh && n.material.transparent) { n.material.depthWrite = false; n.renderOrder = 2; } }); // the clear wrapper
    const fit = new THREE.Group(); fit.add(model);
    const bb = new THREE.Box3().setFromObject(fit), c = bb.getCenter(new THREE.Vector3()), size = bb.getSize(new THREE.Vector3());
    model.position.sub(c);
    const spin = new THREE.Group(); spin.add(fit); scene.add(spin);
    const cam = new THREE.PerspectiveCamera(30, 4 / 3, .1, 100);
    const r = size.length() / 2;
    cam.position.set(0, 0, r / Math.sin(THREE.MathUtils.degToRad(15)) * 1.45); // the canvas is 1.6 x the slot (see revamp.css), so this leaves room round it

    box.append(cv); box.classList.add('has-model');
    const fitCanvas = () => { const w = box.clientWidth * 1.6, h = box.clientHeight * 1.6; if (w && h) { renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); } };
    new ResizeObserver(fitCanvas).observe(box); fitCanvas();

    // turning: on its own, toward you on hover, by hand when dragged
    const s = { a: Math.random() * Math.PI * 2, x: 0, hover: false, drag: null, on: false, t0: Math.random() * 9 };
    card.addEventListener('pointerenter', () => { s.hover = true; });
    card.addEventListener('pointerleave', () => { s.hover = false; });
    // the canvas lets the mouse through (it hangs over the next cards), so the slot catches the drag
    box.addEventListener('pointerdown', e => { s.drag = { x: e.clientX, y: e.clientY, a: s.a, moved: false }; box.setPointerCapture(e.pointerId); });
    box.addEventListener('pointermove', e => {
      const d = s.drag; if (!d) return;
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) d.moved = true;
      s.a = d.a + dx * .014; s.x = clamp(dy * .006, -.5, .5);
    });
    const up = () => { if (s.drag && s.drag.moved) card.dragged = true; s.drag = null; }; // a drag doesn't open the work
    box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
    new IntersectionObserver(es => { s.on = es[es.length - 1].isIntersecting; }).observe(card);

    let last = 0;
    renderer.setAnimationLoop(t => {
      if (!s.on || !cv.isConnected) { last = 0; return; }
      const f = last ? Math.min(50, t - last) / 16.7 : 1; last = t;
      if (!s.drag) {
        if (s.hover) s.a += (Math.round(s.a / (Math.PI * 2)) * Math.PI * 2 - s.a) * (1 - Math.pow(.92, f)); // turn to the nearest front
        else s.a += .005 * f;                                                                              // about 20 seconds a turn
        s.x *= Math.pow(.9, f);
      }
      spin.rotation.set(s.x + .2, s.a - .42, -.04); // its "front" is a three-quarter view, so you see the top and the side and the light falls across it
      spin.position.y = Math.sin(t / 900 + s.t0) * r * .04 + (s.hover ? r * .05 : 0);
      renderer.render(scene, cam);
    });
  }).catch(() => {}); // the picture stays
}

if (!matchMedia('(prefers-reduced-motion: reduce)').matches && !/edit/i.test(location.hash)) {
  const all = () => document.querySelectorAll('.gcard[data-model]:not([data-model-on])').forEach(c => { c.dataset.modelOn = '1'; mount(c); });
  all();
  new MutationObserver(all).observe(document.body, { childList: true, subtree: true });
}
