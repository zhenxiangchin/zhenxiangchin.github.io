/* Chinny's edit mode.
   Open EDIT-MY-SITE.html (or add #edit to the address) to change words and pictures,
   delete things, recolour them and move them around, right on the page. Saving writes
   your changes into js/edits.js and new pictures into media/uploads/, so the normal
   site shows them too. */
(function () {
  'use strict';
  const EDITS = window.PORTFOLIO_EDITS = window.PORTFOLIO_EDITS || {};
  EDITS.text = EDITS.text || {};
  EDITS.img = EDITS.img || {};
  EDITS.hide = EDITS.hide || {};   // things you deleted
  EDITS.style = EDITS.style || {}; // colours you picked
  EDITS.move = EDITS.move || {};   // things you dragged somewhere else
  const EDIT_MODE = /edit/.test(location.hash);
  if (EDIT_MODE) document.documentElement.classList.add('editing');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const norm = s => String(s || '').replace(/\s+/g, ' ').trim();
  // counters show 0 until they animate, so compare them by their real number
  const textOf = n => n.hasAttribute('data-count') ? n.dataset.count : norm(n.textContent);

  /* ---------- which things can be edited ---------- */
  const TEXT_SEL = 'h1, h2, h3, p, .kicker, .tag, .btn, .facts-strip b, .facts-strip span, .stats b, .stats span, figcaption, blockquote, .reel-scroll, .footer span, .footer small, .nav-links a, .logo b';
  const SKIP = '#cards, #rows, #filters, #reelStage, .reel-now, .reel-dots, #reelWipe, #project, #lightbox, #ach, #tools, .preview, .cursor';
  function textTargets() {
    const out = [], count = {};
    $$(TEXT_SEL).forEach(n => {
      if (n.closest(SKIP)) return;
      if (n.parentElement && n.parentElement.closest(TEXT_SEL) && !n.parentElement.closest(SKIP)) return; // only the outer one
      const sec = (n.closest('section[id], header') || document.body);
      const where = sec.id || sec.tagName.toLowerCase();
      const k = where + ':' + n.tagName.toLowerCase();
      count[k] = (count[k] || 0) + 1;
      out.push([k + ':' + count[k], n]);
    });
    $$('#cards .card').forEach(c => out.push(['card:' + c.dataset.id + ':title', $('h3', c)]));
    $$('#ach li').forEach((li, i) => { out.push(['ach:' + i + ':a', $('b', li)]); out.push(['ach:' + i + ':b', $('span', li)]); });
    return out.filter(([, n]) => n);
  }
  function imageTargets() {
    const out = [];
    const photo = $('.about-photo img'); if (photo) out.push(['about:photo', photo]);
    const pal = $('.hello-pal .sticker img'); if (pal) out.push(['hello:mascot', pal]);
    $$('#cards .card').forEach(c => out.push(['card:' + c.dataset.id + ':cover', $('.card-media img', c)]));
    return out.filter(([, n]) => n);
  }
  const clean = html => html.replace(/<(?!\/?(br|b|em|i|strong)\b)[^>]*>/gi, '').replace(/&nbsp;/g, ' ');

  /* ---------- apply saved changes (always, also for visitors) ---------- */
  function applyEdits() {
    const targets = textTargets();
    Object.entries(EDITS.text).forEach(([key, e]) => {
      let hit = targets.find(([k]) => k === key);
      // if the page layout changed since the edit was made, find the original words instead
      if (!hit || textOf(hit[1]) !== norm(e.from)) hit = targets.find(([, n]) => textOf(n) === norm(e.from)) || hit || null;
      if (!hit) return;
      const n = hit[1];
      n.innerHTML = e.html;
      if (n.hasAttribute('data-count')) { const v = parseInt(n.textContent, 10); if (isNaN(v)) n.removeAttribute('data-count'); else n.dataset.count = v; }
    });
    const imgs = imageTargets();
    Object.entries(EDITS.img).forEach(([key, src]) => { const hit = imgs.find(([k]) => k === key); if (hit) hit[1].src = src; });
    if (Object.keys(EDITS.img).length) setTimeout(() => dispatchEvent(new Event('resize')), 400);
  }
  /* ---------- boxes you can delete, recolour and move ---------- */
  function blockTargets() {
    const out = [];
    const add = (k, n, label) => { if (n) out.push([k, n, label]); };
    $$('main > section[id]').forEach(n => add('section:' + n.id, n, 'Section: ' + (n.id === 'top' ? 'landing' : n.id)));
    textTargets().forEach(([k, n]) => add(k, n, n.matches('.btn') ? 'Button' : n.matches('h1, h2, h3') ? 'Heading' : n.matches('.nav-links a, .logo b') ? 'Menu' : 'Words'));
    add('top:buttons', $('.landing .hero-actions'), 'Buttons');
    add('top:reel', $('.reel'), 'Showreel');
    add('top:reelbar', $('.reel-bar'), 'Showreel bar');
    add('hello:mascot', $('.hello-pal'), 'Backpack guy');
    add('hello:facts', $('.facts-strip'), 'Facts row');
    $$('.facts-strip > div').forEach((n, i) => add('fact:' + i, n, 'Fact'));
    add('work:bar', $('.work-bar'), 'Filters');
    $$('#cards .card').forEach(n => add('card:' + n.dataset.id, n, 'Work card'));
    add('film:player', $('#filmPlayer'), 'Film player');
    add('film:facts', $('.film .facts'), 'Film facts');
    add('about:photo', $('.about-photo'), 'Photo');
    add('about:stats', $('.stats'), 'Numbers');
    $$('.stats > div').forEach((n, i) => add('stat:' + i, n, 'Number'));
    add('about:tools', $('#tools'), 'Tools');
    $$('#tools li').forEach((n, i) => add('tool:' + i, n, 'Tool'));
    add('about:awards', $('#ach'), 'Awards list');
    $$('#ach li').forEach((n, i) => add('ach:' + i, n, 'Award'));
    add('contact:links', $('.contact-links'), 'Contact links');
    $$('.contact-links .big-link').forEach((n, i) => add('contact:link:' + i, n, 'Contact link'));
    add('contact:footer', $('.footer'), 'Footer');
    return out;
  }
  // moves are made on a computer screen; phones keep the tidy stacked layout
  const MOVE_MIN = 760;
  function placeMove(n, m) {
    if (!m || innerWidth < MOVE_MIN) { n.style.translate = ''; return; }
    const k = innerWidth / (m.w || innerWidth);
    if (getComputedStyle(n).display === 'inline') n.style.display = 'inline-block';
    n.style.translate = Math.round(m.x * k) + 'px ' + Math.round(m.y * k) + 'px';
  }
  function paintStyle(n, st) { n.style.color = (st && st.color) || ''; n.style.backgroundColor = (st && st.bg) || ''; }
  function applyLayout(state, blocks) {
    if (state.sections && state.sections.length) {
      const main = $('main');
      state.sections.forEach(id => { const n = document.getElementById(id); if (n && n.parentElement === main) main.appendChild(n); });
    }
    blocks.forEach(([k, n]) => {
      n.classList.toggle('ed-gone', !!state.hide[k]);
      if (state.style[k]) paintStyle(n, state.style[k]);
      if (state.move[k]) placeMove(n, state.move[k]);
    });
  }

  applyEdits();
  let BLOCKS = blockTargets();
  applyLayout(EDITS, BLOCKS);
  addEventListener('resize', () => BLOCKS.forEach(([k, n]) => { if ((LIVE || EDITS).move[k]) placeMove(n, (LIVE || EDITS).move[k]); }));
  let LIVE = null;

  if (!EDIT_MODE) return;

  /* =========================================================
     EDIT MODE
     ========================================================= */
  document.documentElement.classList.remove('has-cursor');
  $$('.reveal').forEach(n => n.classList.add('in'));
  $$('[data-count]').forEach(n => { n.textContent = n.dataset.count; });
  const pendingText = {}, pendingImg = {};
  const original = {};

  const bar = document.createElement('div');
  bar.className = 'edit-bar';
  const HELP = 'Click words to type. Click a picture to swap it. Point at anything for Move, Colour and Delete.';
  bar.innerHTML = `<div class="edit-msg"><b>Edit mode</b> <span id="editStatus">${HELP}</span></div>
    <div class="edit-actions">
      <button id="editSave" class="edit-primary">Save to my folder</button>
      <button id="editDiscard">Undo unsaved</button>
      <button id="editExit">Exit</button>
    </div>`;
  document.body.appendChild(bar);
  const status = (t, cls) => { const s = $('#editStatus'); s.textContent = t; s.className = cls || ''; };
  let layoutDirty = 0;
  const unsaved = () => Object.keys(pendingText).length + Object.keys(pendingImg).length + layoutDirty;
  const markDirty = () => { const n = unsaved(); status(n ? `${n} unsaved change${n > 1 ? 's' : ''}. Press "Save to my folder" when you're happy.` : HELP); };

  // words
  textTargets().forEach(([key, n]) => {
    original[key] = (EDITS.text[key] && EDITS.text[key].from) || textOf(n);
    n.removeAttribute('data-count');
    n.setAttribute('contenteditable', 'true');
    n.setAttribute('spellcheck', 'true');
    n.dataset.editKey = key;
    n.classList.add('ed-text');
    n.addEventListener('input', () => {
      const html = clean(n.innerHTML).trim();
      pendingText[key] = { from: original[key], html };
      markDirty();
    });
    n.addEventListener('paste', e => { e.preventDefault(); document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text')); });
    n.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); n.blur(); } });
  });

  // pictures
  const picker = document.createElement('input');
  picker.type = 'file'; picker.accept = 'image/*'; picker.hidden = true;
  document.body.appendChild(picker);
  let pickFor = null;
  imageTargets().forEach(([key, img]) => {
    img.dataset.editImg = key;
    const box = img.closest('.card-media, .about-photo, .sticker') || img.parentElement;
    box.classList.add('ed-img');
    box.dataset.editImgKey = key;
  });
  picker.onchange = async () => {
    const f = picker.files[0]; picker.value = '';
    if (!f || !pickFor) return;
    const [key, img] = pickFor;
    status('Preparing your picture…');
    try {
      const blob = await shrink(f);
      pendingImg[key] = blob;
      img.src = URL.createObjectURL(blob);
      img.onload = () => dispatchEvent(new Event('resize'));
      markDirty();
    } catch (err) { status('That file could not be read as a picture. Try a JPG, PNG or WebP.', 'bad'); }
  };
  // big pictures are scaled down so the site stays fast
  function shrink(file) {
    return new Promise((ok, bad) => {
      const im = new Image();
      im.onload = () => {
        const max = 2000, k = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        c.toBlob(b => b ? ok(b) : bad(new Error('encode')), 'image/webp', 0.88);
      };
      im.onerror = bad;
      im.src = URL.createObjectURL(file);
    });
  }

  // while editing, clicks edit things instead of opening projects or following links
  document.addEventListener('click', e => {
    if (e.target.closest('.edit-bar, .ed-tool, .ed-pop')) return;
    const imgBox = e.target.closest('[data-edit-img-key]');
    const txt = e.target.closest('.ed-text');
    if (txt) { e.preventDefault(); e.stopPropagation(); return; }
    if (imgBox) {
      e.preventDefault(); e.stopPropagation();
      const key = imgBox.dataset.editImgKey, img = $('[data-edit-img="' + key + '"]');
      pickFor = [key, img]; picker.click();
      return;
    }
    if (e.target.closest('a, .card, .reel, [data-open]')) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  document.addEventListener('pointerdown', e => { if (e.target.closest('.sticker')) e.stopPropagation(); }, true);

  /* ---------- delete, recolour, move ---------- */
  const copy = o => JSON.parse(JSON.stringify(o || {}));
  const L = LIVE = { hide: copy(EDITS.hide), style: copy(EDITS.style), move: copy(EDITS.move), order: EDITS.order ? EDITS.order.slice() : null, sections: EDITS.sections ? EDITS.sections.slice() : null };
  const touched = () => { layoutDirty++; markDirty(); };
  BLOCKS.forEach(([k, n, label]) => { n.dataset.block = k; n.dataset.blockLabel = label; });
  const keyOf = n => n.dataset.block;

  const outline = document.createElement('div'); outline.className = 'ed-outline'; outline.hidden = true;
  const tool = document.createElement('div'); tool.className = 'ed-tool'; tool.hidden = true;
  tool.innerHTML = `<span class="ed-label"></span>
    <button data-act="up" title="Pick the bigger box around this">⬆ Bigger</button>
    <button data-act="move" title="Hold and drag to move it">✥ Move</button>
    <button data-act="secup" title="Move this section up">▲ Up</button>
    <button data-act="secdown" title="Move this section down">▼ Down</button>
    <button data-act="color" title="Change its colours">● Colour</button>
    <button data-act="del" title="Delete it (you can bring it back)">✕ Delete</button>
    <button data-act="reset" title="Put its colour and position back">↺ Reset</button>`;
  const SW = ['#141414', '#6b6760', '#ffffff', '#faf7f0', '#e8262b', '#ff8a1f', '#ffd23f', '#7ee35b', '#3ad6ff', '#2d3cff', '#ff2e93'];
  const swRow = (prop, name) => `<div class="ed-row"><span>${name}</span>${SW.map(c => `<button class="ed-sw" data-prop="${prop}" data-c="${c}" style="background:${c}" title="${c}"></button>`).join('')}<label class="ed-sw ed-any" title="Any colour"><input type="color" data-prop="${prop}"></label><button class="ed-none" data-prop="${prop}" data-c="">None</button></div>`;
  const pop = document.createElement('div'); pop.className = 'ed-pop'; pop.hidden = true;
  pop.innerHTML = swRow('color', 'Words') + swRow('bg', 'Fill');
  const drop = document.createElement('div'); drop.className = 'ed-drop'; drop.hidden = true;
  const ghost = document.createElement('div'); ghost.className = 'ed-ghost'; ghost.hidden = true;
  document.body.append(outline, tool, pop, drop, ghost);

  let cur = null, lock = false, dragging = false, hoverT = 0;
  const parentBlock = n => n.parentElement && n.parentElement.closest('[data-block]');
  function select(n) {
    cur = n || null; pop.hidden = true;
    if (!cur) { tool.hidden = outline.hidden = true; return; }
    const k = keyOf(cur), sec = k.startsWith('section:'), card = k.startsWith('card:');
    $('.ed-label', tool).textContent = cur.dataset.blockLabel;
    const show = (act, on) => { $(`[data-act="${act}"]`, tool).hidden = !on; };
    show('up', !!parentBlock(cur)); show('move', !sec); show('secup', sec); show('secdown', sec);
    show('reset', !!(L.style[k] || L.move[k]));
    $('[data-act="move"]', tool).textContent = card ? '✥ Drag to reorder' : '✥ Move';
    $('[data-act="del"]', tool).textContent = L.hide[k] ? '↺ Bring back' : '✕ Delete';
    tool.hidden = outline.hidden = false;
    place();
  }
  function place() {
    if (!cur) return;
    const r = cur.getBoundingClientRect();
    Object.assign(outline.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    const tw = tool.offsetWidth, th = tool.offsetHeight;
    let top = r.top - th - 6; if (top < 8) top = Math.min(innerHeight - th - 90, Math.max(8, r.top + 6));
    tool.style.left = Math.max(8, Math.min(innerWidth - tw - 8, r.right - tw)) + 'px';
    tool.style.top = top + 'px';
    if (!pop.hidden) { pop.style.left = Math.max(8, Math.min(innerWidth - pop.offsetWidth - 8, parseFloat(tool.style.left))) + 'px'; pop.style.top = (top + th + 6) + 'px'; }
  }
  addEventListener('scroll', place, { passive: true }); addEventListener('resize', place);
  document.addEventListener('mouseover', e => {
    if (dragging || !pop.hidden) return;
    if (e.target.closest('.ed-tool, .ed-pop, .edit-bar')) { clearTimeout(hoverT); return; }
    if (lock) return;
    const b = e.target.closest('[data-block]');
    clearTimeout(hoverT);
    if (b === cur) return;
    hoverT = setTimeout(() => select(b), cur ? 170 : 0);
  });
  // after "Bigger", stay on the big box until the mouse leaves it
  document.addEventListener('mousemove', e => {
    if (!lock || !cur || e.target.closest('.ed-tool, .ed-pop')) return;
    const r = cur.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) lock = false;
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') { pop.hidden = true; lock = false; } });
  document.addEventListener('pointerdown', e => { if (!pop.hidden && !e.target.closest('.ed-pop, .ed-tool')) pop.hidden = true; }, true);

  tool.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || !cur) return;
    const k = keyOf(cur), act = b.dataset.act;
    if (act === 'up') { lock = true; select(parentBlock(cur)); return; }
    if (act === 'del') {
      if (L.hide[k]) delete L.hide[k]; else L.hide[k] = true;
      cur.classList.toggle('ed-gone', !!L.hide[k]); touched(); select(cur);
      if (!L.hide[k] || k.startsWith('card:')) window.SITE && SITE.relayout();
      return;
    }
    if (act === 'color') { pop.hidden = !pop.hidden; place(); return; }
    if (act === 'reset') { delete L.style[k]; delete L.move[k]; paintStyle(cur, null); placeMove(cur, null); touched(); select(cur); return; }
    if (act === 'secup' || act === 'secdown') {
      const sibs = $$('main > section[id]'), i = sibs.indexOf(cur), j = act === 'secup' ? i - 1 : i + 1;
      if (j < 0 || j >= sibs.length) { status('It\'s already at the ' + (j < 0 ? 'top.' : 'bottom.')); return; }
      if (act === 'secup') sibs[j].before(cur); else sibs[j].after(cur);
      L.sections = $$('main > section[id]').map(n => n.id); touched();
      cur.scrollIntoView({ block: 'start' }); setTimeout(place, 60);
    }
  });
  pop.addEventListener('click', e => { const b = e.target.closest('button[data-prop]'); if (b) setColour(b.dataset.prop, b.dataset.c); });
  pop.addEventListener('input', e => { if (e.target.matches('input[type=color]')) setColour(e.target.dataset.prop, e.target.value); });
  function setColour(prop, c) {
    if (!cur) return;
    const k = keyOf(cur), st = Object.assign({}, L.style[k]);
    if (c) st[prop] = c; else delete st[prop];
    if (Object.keys(st).length) L.style[k] = st; else delete L.style[k];
    paintStyle(cur, L.style[k]); touched();
    $('[data-act="reset"]', tool).hidden = !(L.style[k] || L.move[k]);
  }

  // Move: hold the button and drag
  tool.addEventListener('pointerdown', e => {
    const b = e.target.closest('[data-act="move"]'); if (!b || !cur) return;
    e.preventDefault(); b.setPointerCapture(e.pointerId);
    const k = keyOf(cur), n = cur, sx = e.clientX, sy = e.clientY;
    dragging = true; pop.hidden = true;
    if (k.startsWith('card:')) return dragCard(b, n, e);
    if (innerWidth < MOVE_MIN) status('Moves only show on bigger screens. Make the window wider to move things.', 'bad');
    const m = L.move[k], f = m ? innerWidth / (m.w || innerWidth) : 1, ox = m ? m.x * f : 0, oy = m ? m.y * f : 0;
    const mv = ev => { L.move[k] = { x: Math.round(ox + ev.clientX - sx), y: Math.round(oy + ev.clientY - sy), w: innerWidth }; placeMove(n, L.move[k]); place(); };
    const up = () => {
      b.removeEventListener('pointermove', mv); b.removeEventListener('pointerup', up); b.removeEventListener('pointercancel', up);
      dragging = false;
      if (L.move[k] && !L.move[k].x && !L.move[k].y) delete L.move[k];
      touched(); select(n);
    };
    b.addEventListener('pointermove', mv); b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
  });
  // cards: drag onto another card to put it there
  function dragCard(b, card, e0) {
    let target = null, after = false;
    card.classList.add('ed-lifted');
    ghost.textContent = 'Moving: ' + ($('h3', card).textContent || 'card'); ghost.hidden = false;
    const mv = ev => {
      ghost.style.transform = `translate(${ev.clientX + 14}px,${ev.clientY + 14}px)`;
      const under = document.elementFromPoint(ev.clientX, ev.clientY);
      const t = under && under.closest('#cards .card');
      target = t && t !== card ? t : null;
      if (!target) { drop.hidden = true; return; }
      const r = target.getBoundingClientRect(); after = ev.clientY > r.top + r.height / 2;
      Object.assign(drop.style, { left: r.left + 'px', width: r.width + 'px', top: (after ? r.bottom + 8 : r.top - 12) + 'px' }); drop.hidden = false;
    };
    mv(e0);
    const up = () => {
      b.removeEventListener('pointermove', mv); b.removeEventListener('pointerup', up); b.removeEventListener('pointercancel', up);
      dragging = false; drop.hidden = ghost.hidden = true; card.classList.remove('ed-lifted');
      if (target && window.SITE) {
        const ids = SITE.cardOrder().filter(id => id !== card.dataset.id);
        ids.splice(ids.indexOf(target.dataset.id) + (after ? 1 : 0), 0, card.dataset.id);
        SITE.setCardOrder(ids); L.order = ids; touched();
        setTimeout(() => { card.scrollIntoView({ block: 'center' }); select(card); }, 80);
      } else select(card);
    };
    b.addEventListener('pointermove', mv); b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
  }

  /* ---------- saving ---------- */
  const IDB = 'chinny-editor';
  const idb = (mode, fn) => new Promise((ok, bad) => {
    const r = indexedDB.open(IDB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore('h');
    r.onerror = () => bad(r.error);
    r.onsuccess = () => { try { const tx = r.result.transaction('h', mode); const req = fn(tx.objectStore('h')); tx.oncomplete = () => ok(req && req.result); tx.onerror = () => bad(tx.error); } catch (e) { bad(e); } };
  });
  async function siteFolder() {
    let dir = null;
    try { dir = await idb('readonly', s => s.get('site')); } catch (e) {}
    if (dir) {
      const p = await dir.queryPermission({ mode: 'readwrite' });
      if (p === 'granted' || (await dir.requestPermission({ mode: 'readwrite' })) === 'granted') return dir;
    }
    status('Pick your "website" folder (the one with index.html in it) so I can save into it.');
    dir = await window.showDirectoryPicker({ id: 'chinny-site', mode: 'readwrite' });
    // picked the folder above it? step into "website"
    if (!(await has(dir, 'index.html'))) {
      try { const inner = await dir.getDirectoryHandle('website'); if (await has(inner, 'index.html')) dir = inner; } catch (e) {}
    }
    if (!(await has(dir, 'index.html'))) throw new Error('That folder has no index.html in it. Pick the "website" folder.');
    try { await idb('readwrite', s => s.put(dir, 'site')); } catch (e) {}
    return dir;
  }
  const has = async (dir, name) => { try { await dir.getFileHandle(name); return true; } catch (e) { return false; } };
  async function writeFile(dir, path, data) {
    const parts = path.split('/');
    let d = dir;
    for (const p of parts.slice(0, -1)) d = await d.getDirectoryHandle(p, { create: true });
    const fh = await d.getFileHandle(parts[parts.length - 1], { create: true });
    const w = await fh.createWritable(); await w.write(data); await w.close();
  }
  const editsFile = () => '/* Changes you made in edit mode (EDIT-MY-SITE.html).\n   To undo them all, delete everything in this file and save it. */\nwindow.PORTFOLIO_EDITS = ' + JSON.stringify(EDITS, null, 2) + ';\n';
  const safe = k => k.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();

  $('#editSave').onclick = async () => {
    if (!unsaved()) { status('Nothing new to save yet.'); return; }
    const stamp = Date.now().toString(36);
    const newPaths = {};
    Object.keys(pendingImg).forEach(k => { newPaths[k] = 'media/uploads/' + safe(k) + '-' + stamp + '.webp'; });
    const commit = () => {
      Object.assign(EDITS.text, pendingText); Object.assign(EDITS.img, newPaths);
      EDITS.hide = copy(L.hide); EDITS.style = copy(L.style); EDITS.move = copy(L.move);
      if (L.order) EDITS.order = L.order.slice();
      if (L.sections) EDITS.sections = L.sections.slice();
    };
    if (window.showDirectoryPicker) {
      try {
        const dir = await siteFolder();
        status('Saving…');
        for (const [k, blob] of Object.entries(pendingImg)) await writeFile(dir, newPaths[k], blob);
        commit();
        await writeFile(dir, 'js/edits.js', editsFile());
        Object.keys(pendingText).forEach(k => delete pendingText[k]);
        Object.keys(pendingImg).forEach(k => delete pendingImg[k]);
        layoutDirty = 0;
        status('Saved! Your changes are in your website folder now.', 'good');
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') { status('Saving cancelled. Your changes are still here, unsaved.'); return; }
        status((err && err.message) || 'Saving failed.', 'bad');
        return;
      }
    }
    // browsers that can't save into a folder: download the files instead
    commit();
    download('edits.js', new Blob([editsFile()], { type: 'text/javascript' }));
    for (const [k, blob] of Object.entries(pendingImg)) download(newPaths[k].split('/').pop(), blob);
    status('This browser can\'t save into folders, so the files were downloaded. Put edits.js into website/js and any pictures into website/media/uploads. (Chrome or Edge can save directly.)', 'bad');
  };
  function download(name, blob) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); }
  $('#editDiscard').onclick = () => { if (!unsaved() || confirm('Throw away the changes you haven\'t saved?')) location.reload(); };
  $('#editExit').onclick = () => {
    if (unsaved() && !confirm('You have unsaved changes. Leave edit mode anyway?')) return;
    location.href = location.href.replace(/#.*$/, '');
  };
  addEventListener('beforeunload', e => { if (unsaved()) { e.preventDefault(); e.returnValue = ''; } });
})();
