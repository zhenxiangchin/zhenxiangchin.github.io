/* Chinny's edit mode.
   Open EDIT-MY-SITE.html (or add #edit to the address) in Chrome or Edge.
   Click words to type. Click a picture to swap it. Point at anything for Smaller, Bigger and Colour.
   "Save to my folder" writes js/my-edits.js and new pictures into uploads/, so the normal page shows them too.
   (The main site's own edits in ../website/js/edits.js are never touched.) */
(function () {
  'use strict';
  const E = window.CHINNY_EDITS = window.CHINNY_EDITS || {};
  E.text = E.text || {}; E.img = E.img || {}; E.style = E.style || {};
  const ON = /edit/.test(location.hash);
  const $ = (s, n = document) => n.querySelector(s), $$ = (s, n = document) => [...n.querySelectorAll(s)];
  const norm = s => String(s || '').replace(/\s+/g, ' ').trim();
  const plain = h => norm(String(h).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&'));
  const clean = h => h.replace(/<(?!\/?(br|b|em|i|strong)\b|span class="zh">|\/span>)[^>]*>/gi, '').replace(/&nbsp;/g, ' ').trim();
  // the headline is split into letters, so its real words live in aria-label
  const textOf = n => n.hasAttribute('data-count') ? n.dataset.count : norm(n.id === 'heroTitle' ? n.getAttribute('aria-label') || n.textContent : n.textContent);

  /* ---------- what can be edited ---------- */
  const SKIP = '#project, #lightbox, #intro, .marquee, .cursor, .say, #cordHint, .ed-ui';
  const TEXT = 'h1, h2, h3, p, .eyebrow, .btn, .follow, .nav-links a, .brand, blockquote, figcaption b, figcaption small, .contact-card small, .footer span, .footer small, .line-end, .stats b, .stats span, .facts dt, .facts dd, #awards li b, #awards li span, #tools li, .film-play b, .film-play small';
  const BOX = { 'peg': 'Artwork', 'hero-art a': 'Art tile', 'hero-reel': 'Reel', 'puppet': 'Ah Kit', 'film-player': 'Film player', 'scene': 'Scene', 'gcard': 'Card', 'about-photo': 'Photo', 'contact-card': 'Contact link', 'stk-deco': 'Sticker' };
  const where = n => { const s = n.closest('section[id], header'); return s ? (s.id || 'nav') : 'page'; };
  function keyed(list, kind) {
    const out = [], count = {};
    list.forEach(n => { const k = where(n) + ':' + kind(n); count[k] = (count[k] || 0) + 1; out.push([k + ':' + count[k], n]); });
    return out;
  }
  const textTargets = () => keyed($$(TEXT).filter(n => !n.closest(SKIP) && !(n.parentElement && n.parentElement.closest(TEXT) && !n.parentElement.closest(SKIP))), n => n.tagName.toLowerCase());
  const imgTargets = () => keyed($$('main img, header img').filter(n => !n.closest(SKIP)), () => 'img');
  function blocks() {
    const out = textTargets().map(([k, n]) => [k, n, n.matches('h1, h2, h3') ? 'Heading' : 'Words']);
    Object.entries(BOX).forEach(([sel, label]) => keyed($$('.' + sel).filter(n => !n.closest(SKIP)), () => 'box-' + sel.replace(/\W+/g, '-')).forEach(([k, n]) => out.push([k, n, label])));
    keyed($$('main > section[id]'), () => 'section').forEach(([k, n]) => out.push([k, n, 'Section']));
    return out;
  }

  /* ---------- show saved changes (always, also for visitors) ---------- */
  function paint(n, st) {
    st = st || {};
    n.style.color = st.color || ''; n.style.backgroundColor = st.bg || '';
    // artworks on the thread get taller/shorter; everything else scales as a whole
    if (n.matches('.peg')) {
      if (n.dataset.h0 == null) n.dataset.h0 = n.style.getPropertyValue('--h0');
      n.style.setProperty('--h0', st.size ? `calc(${n.dataset.h0} * ${st.size})` : n.dataset.h0);
    } else n.style.zoom = st.size || '';
  }
  function setImg(img, src) {
    img.src = src; img.removeAttribute('srcset');
    const peg = img.closest('.peg:not(.is-book)');
    img.addEventListener('load', () => { if (peg && img.naturalWidth) peg.style.setProperty('--r', img.naturalWidth / img.naturalHeight); dispatchEvent(new Event('resize')); }, { once: true });
  }
  function apply() {
    const T = textTargets();
    Object.entries(E.text).forEach(([k, e]) => {
      let hit = T.find(t => t[0] === k);
      // the page changed since this was saved? find the original words instead
      if (!hit || textOf(hit[1]) !== norm(e.from)) hit = T.find(t => textOf(t[1]) === norm(e.from)) || hit;
      if (!hit) return;
      const n = hit[1];
      if (textOf(n) === plain(e.html)) return; // already showing it (the headline gets its words before it is split)
      n.innerHTML = e.html;
      if (n.hasAttribute('data-count')) { const v = parseInt(n.textContent, 10); if (isNaN(v)) n.removeAttribute('data-count'); else n.dataset.count = v; }
    });
    const I = imgTargets();
    Object.entries(E.img).forEach(([k, src]) => { const hit = I.find(t => t[0] === k); if (hit) setImg(hit[1], src); });
    blocks().forEach(([k, n]) => { if (E.style[k]) paint(n, E.style[k]); });
    dispatchEvent(new Event('resize'));
  }
  apply();
  if (!ON) return;

  /* =========================================================
     EDIT MODE
     ========================================================= */
  document.documentElement.classList.add('editing');
  const css = document.createElement('style');
  css.textContent = `html.editing .cursor{display:none!important}
html.editing,html.editing *{cursor:auto!important}
html.editing .ed-text{cursor:text!important;user-select:text!important;-webkit-user-select:text!important;outline:1px dashed rgba(232,38,43,.45);outline-offset:3px}
html.editing .ed-text:focus{outline:2px solid #e8262b}
html.editing img[data-ed-img]{cursor:copy!important}
.ed-bar{position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:10px 14px;background:#141414;color:#f3eee4;font:14px/1.4 var(--font,system-ui)}
.ed-bar button,.ed-tool button,.ed-pop button{font:inherit;font-size:13px;padding:6px 10px;border:1px solid rgba(243,238,228,.3);background:transparent;color:inherit;cursor:pointer!important}
.ed-bar button:hover,.ed-tool button:hover{background:rgba(243,238,228,.12)}
.ed-bar .ed-primary{background:#e8262b;border-color:#e8262b}
.ed-bar .bad{color:#ffb4a8}.ed-bar .good{color:#b9f5a0}
.ed-actions{display:flex;gap:6px}
.ed-outline{position:fixed;z-index:9997;pointer-events:none;border:2px solid #e8262b}
.ed-tool{position:fixed;z-index:9998;display:flex;flex-wrap:wrap;gap:4px;align-items:center;max-width:calc(100vw - 16px);padding:4px;background:#141414;color:#f3eee4;font:13px/1 var(--font,system-ui)}
.ed-tool .ed-label{padding:0 6px;opacity:.7}
.ed-pop{position:fixed;z-index:9998;display:grid;gap:8px;padding:10px;background:#141414;color:#f3eee4;font:13px var(--font,system-ui)}
.ed-row{display:flex;gap:5px;align-items:center}.ed-row span{width:46px}
.ed-pop .ed-sw{width:22px;height:22px;padding:0;border:1px solid rgba(243,238,228,.45)}
.ed-any{position:relative;overflow:hidden;background:conic-gradient(red,yellow,lime,cyan,blue,magenta,red)}
.ed-any input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}`;
  document.head.appendChild(css);

  const pendText = {}, pendImg = {};
  const L = JSON.parse(JSON.stringify(E.style));
  let styleDirty = 0;
  const HELP = 'Click words to type. Click a picture to swap it. Point at anything for Smaller, Bigger and Colour.';
  const bar = document.createElement('div');
  bar.className = 'ed-bar ed-ui';
  bar.innerHTML = `<div><b>Edit mode</b> <span id="edStatus">${HELP}</span></div>
    <div class="ed-actions"><button class="ed-primary" id="edSave">Save to my folder</button><button id="edUndo">Undo unsaved</button><button id="edExit">Exit</button></div>`;
  document.body.appendChild(bar);
  const status = (t, cls) => { const s = $('#edStatus'); s.textContent = t; s.className = cls || ''; };
  const unsaved = () => Object.keys(pendText).length + Object.keys(pendImg).length + styleDirty;
  const dirty = () => { const n = unsaved(); status(n ? `${n} unsaved change${n > 1 ? 's' : ''}. Press "Save to my folder" when you're happy.` : HELP); };
  addEventListener('beforeunload', e => { if (unsaved()) { e.preventDefault(); e.returnValue = ''; } });

  // words
  textTargets().forEach(([k, n]) => {
    const from = (E.text[k] && E.text[k].from) || textOf(n);
    n.contentEditable = 'true'; n.spellcheck = true; n.classList.add('ed-text');
    if (n.id === 'heroTitle') n.addEventListener('focus', () => { n.textContent = n.getAttribute('aria-label'); }, { once: true });
    n.addEventListener('input', () => { pendText[k] = { from, html: clean(n.innerHTML) }; if (n.id === 'heroTitle') n.setAttribute('aria-label', n.textContent); dirty(); });
    n.addEventListener('paste', e => { e.preventDefault(); document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text')); });
    n.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); n.blur(); } });
  });

  // pictures
  const imgKey = new Map(imgTargets().map(([k, n]) => [n, k]));
  imgKey.forEach((k, n) => { n.dataset.edImg = k; });
  const picker = document.createElement('input');
  picker.type = 'file'; picker.accept = 'image/*'; picker.hidden = true; picker.className = 'ed-ui';
  document.body.appendChild(picker);
  let pickFor = null;
  const pick = img => { pickFor = img; picker.click(); };
  picker.onchange = async () => {
    const f = picker.files[0]; picker.value = '';
    if (!f || !pickFor) return;
    status('Preparing your picture…');
    try { const blob = await shrink(f); pendImg[imgKey.get(pickFor)] = blob; setImg(pickFor, URL.createObjectURL(blob)); dirty(); }
    catch (err) { status('That file could not be read as a picture. Try a JPG, PNG or WebP.', 'bad'); }
  };
  // big pictures are scaled down so the site stays fast
  function shrink(file) {
    return new Promise((ok, bad) => {
      const im = new Image();
      im.onload = () => {
        const k = Math.min(1, 2400 / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas');
        c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        c.toBlob(b => b ? ok(b) : bad(new Error('encode')), 'image/webp', 0.88);
      };
      im.onerror = bad; im.src = URL.createObjectURL(file);
    });
  }

  // while editing, clicks edit things instead of opening projects, swinging prints or following links
  ['pointerdown', 'pointerup', 'click'].forEach(type => document.addEventListener(type, e => {
    if (e.target.closest('.ed-ui')) return;
    if (type === 'click') {
      if (!e.target.closest('.ed-text')) e.preventDefault();
      const img = e.target.closest('img[data-ed-img]');
      if (img) pick(img);
    }
    e.stopPropagation();
  }, true));

  /* ---------- Smaller, Bigger, Colour ---------- */
  const B = blocks();
  B.forEach(([k, n, label]) => { n.dataset.edBlock = k; n.dataset.edLabel = label; });
  const outline = document.createElement('div'); outline.className = 'ed-outline ed-ui'; outline.hidden = true;
  const tool = document.createElement('div'); tool.className = 'ed-tool ed-ui'; tool.hidden = true;
  tool.innerHTML = `<span class="ed-label"></span>
    <button data-act="up" title="Pick the bigger box around this">⬆ Box around</button>
    <button data-act="small" title="Make it smaller">− Smaller</button>
    <button data-act="big" title="Make it bigger">+ Bigger</button>
    <button data-act="color" title="Change its colours">● Colour</button>
    <button data-act="pic" title="Put in a different picture">Swap picture</button>
    <button data-act="reset" title="Put its size and colour back">↺ Reset</button>`;
  const SW = ['#141414', '#6d675e', '#ffffff', '#f3eee4', '#e8262b', '#ff8a1f', '#ffd23f', '#7ee35b', '#3ad6ff', '#2d3cff', '#ff2e93'];
  const row = (prop, name) => `<div class="ed-row"><span>${name}</span>${SW.map(c => `<button class="ed-sw" data-prop="${prop}" data-c="${c}" style="background:${c}" title="${c}"></button>`).join('')}<label class="ed-sw ed-any" title="Any colour"><input type="color" data-prop="${prop}"></label><button data-prop="${prop}" data-c="">None</button></div>`;
  const pop = document.createElement('div'); pop.className = 'ed-pop ed-ui'; pop.hidden = true;
  pop.innerHTML = row('color', 'Words') + row('bg', 'Fill');
  document.body.append(outline, tool, pop);

  let cur = null, lock = false, hoverT = 0;
  const parentBlock = n => n.parentElement && n.parentElement.closest('[data-ed-block]');
  const picOf = n => n.matches('img[data-ed-img]') ? n : $('img[data-ed-img]', n);
  function select(n) {
    cur = n || null; pop.hidden = true;
    if (!cur) { tool.hidden = outline.hidden = true; return; }
    const k = cur.dataset.edBlock;
    $('.ed-label', tool).textContent = cur.dataset.edLabel;
    $('[data-act="up"]', tool).hidden = !parentBlock(cur);
    $('[data-act="pic"]', tool).hidden = !picOf(cur) || $$('img[data-ed-img]', cur).length > 1;
    $('[data-act="reset"]', tool).hidden = !L[k];
    tool.hidden = outline.hidden = false;
    place();
  }
  // the line slides and things sway, so keep the outline glued on every frame
  function place() {
    if (cur && !tool.hidden) {
      const r = cur.getBoundingClientRect();
      Object.assign(outline.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
      const tw = tool.offsetWidth, th = tool.offsetHeight;
      let top = r.top - th - 6; if (top < 8) top = Math.min(innerHeight - th - 90, Math.max(8, r.top + 6));
      tool.style.left = Math.max(8, Math.min(innerWidth - tw - 8, r.right - tw)) + 'px'; tool.style.top = top + 'px';
      if (!pop.hidden) { pop.style.left = Math.max(8, Math.min(innerWidth - pop.offsetWidth - 8, parseFloat(tool.style.left))) + 'px'; pop.style.top = (top + th + 6) + 'px'; }
    }
    requestAnimationFrame(place);
  }
  requestAnimationFrame(place);
  document.addEventListener('mouseover', e => {
    if (!pop.hidden) return;
    if (e.target.closest('.ed-ui')) { clearTimeout(hoverT); return; }
    if (lock) return;
    const b = e.target.closest('[data-ed-block]');
    clearTimeout(hoverT);
    if (b !== cur) hoverT = setTimeout(() => select(b), cur ? 170 : 0);
  });
  // after "Box around", stay on the big box until the mouse leaves it
  document.addEventListener('mousemove', e => {
    if (!lock || !cur || e.target.closest('.ed-ui')) return;
    const r = cur.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) lock = false;
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') { pop.hidden = true; lock = false; } });
  document.addEventListener('pointerdown', e => { if (!pop.hidden && !e.target.closest('.ed-pop, .ed-tool')) pop.hidden = true; }, true);

  const touched = k => { styleDirty++; paint(cur, L[k]); dispatchEvent(new Event('resize')); dirty(); $('[data-act="reset"]', tool).hidden = !L[k]; };
  function setStyle(k, prop, v) {
    const st = Object.assign({}, L[k]);
    if (v) st[prop] = v; else delete st[prop];
    if (Object.keys(st).length) L[k] = st; else delete L[k];
    touched(k);
  }
  tool.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || !cur) return;
    const k = cur.dataset.edBlock, act = b.dataset.act;
    if (act === 'up') { lock = true; select(parentBlock(cur)); }
    else if (act === 'small' || act === 'big') {
      const s = Math.round(Math.min(3, Math.max(.3, ((L[k] && L[k].size) || 1) * (act === 'big' ? 1.1 : 1 / 1.1))) * 100) / 100;
      setStyle(k, 'size', s === 1 ? '' : s);
      status(`Size: ${Math.round(s * 100)}%`);
    }
    else if (act === 'color') pop.hidden = !pop.hidden;
    else if (act === 'pic') pick(picOf(cur));
    else if (act === 'reset') { delete L[k]; touched(k); }
  });
  pop.addEventListener('click', e => { const b = e.target.closest('button[data-prop]'); if (b && cur) setStyle(cur.dataset.edBlock, b.dataset.prop, b.dataset.c); });
  pop.addEventListener('input', e => { if (e.target.matches('input[type=color]') && cur) setStyle(cur.dataset.edBlock, e.target.dataset.prop, e.target.value); });

  /* ---------- saving ---------- */
  const idb = (mode, fn) => new Promise((ok, bad) => {
    const r = indexedDB.open('chinny-editor', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('h');
    r.onerror = () => bad(r.error);
    r.onsuccess = () => { try { const tx = r.result.transaction('h', mode); const req = fn(tx.objectStore('h')); tx.oncomplete = () => ok(req && req.result); tx.onerror = () => bad(tx.error); } catch (e) { bad(e); } };
  });
  const has = async (dir, path) => { try { const [a, b] = path.split('/'); await (b ? (await dir.getDirectoryHandle(a)).getFileHandle(b) : dir.getFileHandle(a)); return true; } catch (e) { return false; } };
  async function folder() {
    let dir = null;
    try { dir = await idb('readonly', s => s.get('dir')); } catch (e) {}
    if (dir) {
      const p = await dir.queryPermission({ mode: 'readwrite' });
      if (p === 'granted' || (await dir.requestPermission({ mode: 'readwrite' })) === 'granted') return dir;
    }
    status('Pick your "Chinny Portfolio" folder so I can save into it.');
    dir = await window.showDirectoryPicker({ id: 'chinny-folder', mode: 'readwrite' });
    // picked the folder above it? step inside
    if (!(await has(dir, 'js/site.js'))) { try { const inner = await dir.getDirectoryHandle("Chinny Portfolio"); if (await has(inner, 'js/site.js')) dir = inner; } catch (e) {} }
    if (!(await has(dir, 'js/site.js'))) throw new Error('That isn\'t the right folder. Pick "Chinny Portfolio" (the one with index.html and a js folder).');
    try { await idb('readwrite', s => s.put(dir, 'dir')); } catch (e) {}
    return dir;
  }
  async function writeFile(dir, path, data) {
    const parts = path.split('/'); let d = dir;
    for (const p of parts.slice(0, -1)) d = await d.getDirectoryHandle(p, { create: true });
    const w = await (await d.getFileHandle(parts[parts.length - 1], { create: true })).createWritable();
    await w.write(data); await w.close();
  }
  const fileText = (obj = E) => '/* Changes Chinny made in edit mode (EDIT-MY-SITE.html).\n   To undo them all, replace everything in this file with:  window.CHINNY_EDITS = {};  */\nwindow.CHINNY_EDITS = ' + JSON.stringify(obj, null, 2) + ';\n';
  const slug = k => k.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
  const asData = b => new Promise(ok => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(b); });
  const commit = paths => { Object.assign(E.text, pendText); Object.assign(E.img, paths); E.style = JSON.parse(JSON.stringify(L)); };
  const done = () => { Object.keys(pendText).forEach(k => delete pendText[k]); Object.keys(pendImg).forEach(k => delete pendImg[k]); styleDirty = 0; };

  $('#edSave').onclick = async () => {
    if (!unsaved()) { status('Nothing new to save yet.'); return; }
    const stamp = Date.now().toString(36), paths = {};
    Object.keys(pendImg).forEach(k => { paths[k] = 'uploads/' + slug(k) + '-' + stamp + '.webp'; });
    // opened with OPEN-MY-SITE.bat / EDIT-MY-SITE.bat: the little local server saves straight into the folder, no picking
    if (/^https?:$/.test(location.protocol)) {
      status('Saving…');
      try {
        const files = {};
        for (const [k, blob] of Object.entries(pendImg)) files[paths[k]] = (await asData(blob)).split(',')[1];
        const next = { ...E, text: { ...E.text, ...pendText }, img: { ...E.img, ...paths }, style: JSON.parse(JSON.stringify(L)) };
        const r = await fetch('/__save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ edits: fileText(next), files }) });
        const res = await r.json().catch(() => ({}));
        if (r.ok && res.ok) { commit(paths); done(); status('Saved into your folder. Exit (or open the page without #edit) to see it as visitors will.', 'good'); return; }
        if (r.status !== 501 && r.status !== 404) { status('Couldn\'t save: ' + (res.error || 'the server said no (' + r.status + ')'), 'bad'); return; }
      } catch (err) { /* no save door on this server: fall back to picking the folder */ }
    }
    if (window.showDirectoryPicker) {
      try {
        const dir = await folder();
        status('Saving…');
        for (const [k, blob] of Object.entries(pendImg)) await writeFile(dir, paths[k], blob);
        commit(paths);
        await writeFile(dir, 'js/my-edits.js', fileText());
        done(); status('Saved! Open index.html (without #edit) to see it as visitors will.', 'good');
      } catch (err) { if (err && err.name !== 'AbortError') status('Couldn\'t save: ' + (err.message || err), 'bad'); else dirty(); }
      return;
    }
    // other browsers: download the file instead, with the pictures tucked inside it
    for (const [k, blob] of Object.entries(pendImg)) paths[k] = await asData(blob);
    commit(paths);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([fileText()], { type: 'text/javascript' })); a.download = 'my-edits.js'; a.click();
    done(); status('Downloaded my-edits.js. Put it in the "js" folder inside Chinny Portfolio (replace the old one).', 'good');
  };
  $('#edUndo').onclick = () => { if (!unsaved() || confirm('Throw away your unsaved changes?')) { done(); location.reload(); } };
  $('#edExit').onclick = () => { if (!unsaved() || confirm('You have unsaved changes. Leave anyway?')) { done(); location.href = location.pathname; } };
})();
