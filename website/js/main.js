/* Chin Zhen Xiang · portfolio behaviour. Your text and artwork lists live in content.js. */
(function () {
  'use strict';
  const DATA = window.PORTFOLIO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const isPath = s => /[\/.]/.test(s);
  const imgSrc = s => isPath(s) ? s : 'media/img/' + s + '.webp';
  const thumbSrc = s => isPath(s) ? s : 'media/thumb/' + s + '.webp';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const finePointer = matchMedia('(hover:hover) and (min-width:901px)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mix = c => `color-mix(in srgb, ${c} 22%, #fff)`;
  // changes saved from edit mode (js/edits.js): card order and deleted cards are used here
  const EDITS = window.PORTFOLIO_EDITS || {};
  const editing = /edit/.test(location.hash);

  /* =========================================================
     BUILD THE PROJECT LIST FROM content.js
     ========================================================= */
  const CATEGORY = { thread: 'Animation', illustration: 'Illustration', identity: 'Design', publications: 'Comics', animation: 'Animation', threed: '3D', activities: 'Events', sketchbook: 'Illustration' };
  const yearOf = s => { const m = String(s || '').match(/20\d\d/g); return m ? m[m.length - 1] : ''; };
  const firstImage = media => { const m = (media || []).find(x => (x.type || 'img') === 'img' && !x.cutout) || (media || []).find(x => x.src || x.poster); return m ? (m.src || m.poster) : ''; };
  let projects = [];
  const sections = DATA.sections.filter(s => !s.about);
  sections.forEach(S => {
    const base = { cat: CATEGORY[S.id] || S.title, color: S.color, ink: S.ink, accent: S.accent };
    if (S.id === 'thread' || S.id === 'animation') {
      // films are one big project each
      const title = S.id === 'animation' ? 'Alien Game' : S.title;
      projects.push({ ...base, id: S.id, title, zh: S.zh, year: '2025', badge: 'Film', cover: S.cover, intro: S.intro, tag: S.tag, parts: S.projects });
    } else {
      S.projects.forEach((P, i) => projects.push({ ...base, id: S.id + '-' + (i + 1), title: P.title, year: yearOf(P.meta), cover: P.cover || firstImage(P.media), intro: P.text || S.intro, tag: P.meta, parts: [{ ...P, title: '' }] }));
    }
  });
  const SB = DATA.sketchbook;
  if (SB) projects.push({ id: 'sketchbook', cat: CATEGORY.sketchbook, color: SB.color, ink: SB.ink, accent: SB.accent, title: SB.title, zh: SB.zh, year: '2022 – 2025', cover: SB.projects[0].media[0].src, intro: SB.intro, tag: SB.tag, parts: SB.projects.map(p => ({ ...p, title: '' })) });
  // put the cards in the order chosen in content.js (anything not listed goes at the end)
  // (a card order saved in edit mode wins over workOrder)
  const order = (EDITS.order && EDITS.order.length ? EDITS.order : DATA.workOrder) || [];
  const rank = p => { const i = order.indexOf(p.id); return i < 0 ? order.length + projects.indexOf(p) : i; };
  projects = projects.slice().sort((a, b) => rank(a) - rank(b));
  // cards deleted in edit mode are left out for visitors (edit mode still shows them, faded, so they can come back)
  if (!editing && EDITS.hide) projects = projects.filter(p => !EDITS.hide['card:' + p.id]);
  projects.forEach((p, i) => {
    p.index = i;
    // a cover that is a cut-out character/product sits on the project's colour instead of being cropped
    p.cutout = p.parts.some(pt => (pt.media || []).some(m => m.src === p.cover && m.cutout));
  });

  /* =========================================================
     HELLO · the backpack guy. Drag him, fling him: he slides on,
     bounces off the edges of the section and yells about it.
     ========================================================= */
  function buildHero() {
    const art = $('#heroArt');
    const s = el('div', 'sticker', `<div class="body"><img src="${imgSrc('mascot-standee')}" alt="Ah Kit, the main character of A Thread of Life" draggable="false" data-edit-img="hello.mascot"></div><span class="tip">drag me around</span><span class="say"></span>`);
    s.setAttribute('aria-hidden', 'true');
    art.appendChild(s);
    makeThrowable(s, art.closest('section') || document.body);
  }
  const SAYS = ['woooo~', 'woahhh!', 'wheee!', 'woooo~', 'weeee~', 'woahhh!'];
  function makeThrowable(s, room) {
    const say = $('.say', s), body = $('.body', s);
    let x = 0, y = 0, vx = 0, vy = 0, grab = null, trail = [], raf = 0, sayTimer = 0, lastSay = 0, lastLine = '';
    // the walls, measured in the same units as his left/top
    const walls = () => {
      const p = s.offsetParent.getBoundingClientRect(), r = room.getBoundingClientRect();
      return { l: r.left - p.left, t: r.top - p.top, r: r.right - p.left - s.offsetWidth, b: r.bottom - p.top - s.offsetHeight };
    };
    const put = () => { s.style.left = x + 'px'; s.style.top = y + 'px'; s.style.right = 'auto'; s.style.bottom = 'auto'; };
    const tilt = d => body.style.setProperty('--tilt', Math.max(-22, Math.min(22, d)).toFixed(1) + 'deg');
    const talk = line => {
      if (!line) { do line = SAYS[Math.random() * SAYS.length | 0]; while (line === lastLine); }
      lastLine = line; say.textContent = line; say.classList.add('on'); lastSay = performance.now();
      clearTimeout(sayTimer); sayTimer = setTimeout(() => say.classList.remove('on'), 1000);
    };
    const squash = side => {
      body.style.setProperty('--sq', side === 'x' ? .8 : 1.18); body.style.setProperty('--sqy', side === 'x' ? 1.14 : .84);
      setTimeout(() => { body.style.removeProperty('--sq'); body.style.removeProperty('--sqy'); }, 110);
    };
    s.addEventListener('pointerdown', e => {
      e.preventDefault(); s.setPointerCapture(e.pointerId); cancelAnimationFrame(raf);
      x = s.offsetLeft; y = s.offsetTop; grab = { dx: e.clientX - x, dy: e.clientY - y };
      trail = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
      s.style.zIndex = 30; s.classList.remove('flying'); s.classList.add('dragging', 'moved');
      talk();
    });
    s.addEventListener('pointermove', e => {
      if (!grab) return;
      const w = walls(), now = performance.now(), prev = trail[trail.length - 1];
      x = Math.max(w.l, Math.min(w.r, e.clientX - grab.dx)); y = Math.max(w.t, Math.min(w.b, e.clientY - grab.dy));
      put();
      trail.push({ x: e.clientX, y: e.clientY, t: now }); while (trail.length > 2 && now - trail[0].t > 100) trail.shift();
      tilt((e.clientX - prev.x) * 1.6);
      const fast = Math.hypot(e.clientX - prev.x, e.clientY - prev.y) / Math.max(1, now - prev.t) > .9;
      if (fast && now - lastSay > 1300) talk();
    });
    const drop = () => {
      if (!grab) return;
      grab = null; s.classList.remove('dragging');
      const a = trail[0], b = trail[trail.length - 1], dt = Math.max(16, b.t - a.t);
      if (performance.now() - b.t > 90) { vx = vy = 0; } else { vx = (b.x - a.x) / dt * 16; vy = (b.y - a.y) / dt * 16; }
      const sp = Math.hypot(vx, vy); if (sp > 55) { vx *= 55 / sp; vy *= 55 / sp; }
      if (Math.hypot(vx, vy) < 1 || reduced) { tilt(0); return; }
      s.classList.add('flying');
      let t0 = performance.now();
      const fly = now => {
        const k = Math.min(3, (now - t0) / 16.7); t0 = now;
        x += vx * k; y += vy * k;
        const f = Math.pow(.95, k); vx *= f; vy *= f;
        const w = walls(); let hit = '';
        if (x < w.l) { x = w.l; vx = Math.abs(vx) * .72; hit = 'x'; } else if (x > w.r) { x = w.r; vx = -Math.abs(vx) * .72; hit = 'x'; }
        if (y < w.t) { y = w.t; vy = Math.abs(vy) * .72; hit = 'y'; } else if (y > w.b) { y = w.b; vy = -Math.abs(vy) * .72; hit = 'y'; }
        if (hit) { squash(hit); if (Math.hypot(vx, vy) > 7 && now - lastSay > 500) talk(Math.random() < .5 ? 'boing!' : 'oof!'); }
        put(); tilt(vx * 1.4);
        if (Math.hypot(vx, vy) > .2) raf = requestAnimationFrame(fly); else { s.classList.remove('flying'); tilt(0); }
      };
      raf = requestAnimationFrame(fly);
    };
    s.addEventListener('pointerup', drop); s.addEventListener('pointercancel', drop);
    // keep him inside if the window changes size
    addEventListener('resize', () => { if (!s.classList.contains('moved')) return; const w = walls(); x = Math.max(w.l, Math.min(w.r, s.offsetLeft)); y = Math.max(w.t, Math.min(w.b, s.offsetTop)); put(); });
  }

  /* =========================================================
     SHOWREEL · clips and artwork at the top, each shown whole.
     The list lives in content.js (showreel). A clip that can't be found
     falls back to its picture; a shot with neither is skipped.
     ========================================================= */
  const REEL = (DATA.showreel || []).filter(sh => sh.video || sh.img);
  const IMG_TIME = 3800, MAX_CLIP = 7500;
  let reelOn = true, reelIdx = -1, reelCur = null, reelTimer = 0, reelNext = null;
  function prepareShot(i) {
    const sh = REEL[i];
    return new Promise(done => {
      const el = document.createElement('div');
      el.className = 'shot';
      const asImage = () => {
        if (!sh.img) return done(null);
        el.innerHTML = '';
        const img = new Image();
        img.alt = '';
        img.src = imgSrc(sh.img);
        el.appendChild(img);
        const ok = () => done({ el, sh, i, dur: IMG_TIME });
        if (img.complete && img.naturalWidth) ok(); else { img.onload = ok; img.onerror = () => done(null); }
      };
      if (!sh.video) return asImage();
      const v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.preload = 'auto'; v.setAttribute('muted', '');
      const files = /[\/.]/.test(sh.video) ? [sh.video] : ['media/videos/' + sh.video + '.mp4', 'media/videos/' + sh.video + '.webm'];
      let k = 0, settled = false;
      const fail = () => { if (settled) return; if (k < files.length) { v.src = files[k++]; v.load(); } else { settled = true; v.removeAttribute('src'); asImage(); } };
      v.addEventListener('error', fail);
      v.addEventListener('loadeddata', () => {
        if (settled) return; settled = true;
        done({ el, sh, i, video: v, dur: Math.min(MAX_CLIP, Math.max(2500, (v.duration || 6) * 1000 - 250)) });
      });
      setTimeout(() => { if (!settled) { settled = true; asImage(); } }, 6000);
      el.appendChild(v); fail();
    });
  }
  async function nextUsable(from) {
    for (let n = 0; n < REEL.length; n++) {
      const i = (from + n) % REEL.length;
      const shot = await prepareShot(i);
      if (shot) return shot;
    }
    return null;
  }
  function buildReel() {
    if (!REEL.length) return;
    const dots = $('#reelDots');
    REEL.forEach((sh, i) => {
      const d = el('button', 'reel-dot', '<i></i>'); d.setAttribute('aria-label', 'Show ' + sh.title);
      d.onclick = () => goShot(i); dots.appendChild(d);
    });
    $('.reel').onclick = () => $('#reelNow').click();
    $('#reelNow').onclick = () => { if (reelCur && projects.some(p => p.id === reelCur.sh.open)) openProject(reelCur.sh.open); else location.hash = '#work'; };
    new IntersectionObserver(es => es.forEach(e => {
      reelOn = e.isIntersecting;
      if (reelCur && reelCur.video) reelOn ? reelCur.video.play().catch(() => {}) : reelCur.video.pause();
    })).observe($('.reel'));
    goShot(0);
  }
  async function goShot(i) {
    clearTimeout(reelTimer);
    const shot = reelNext && reelNext.i === i ? reelNext : await nextUsable(i);
    reelNext = null;
    if (!shot) return;
    showShot(shot);
  }
  const WIPES = [['#ffd23f', '#e8262b'], ['#2d3cff', '#ff2e93'], ['#7ee35b', '#ffd23f'], ['#ff2e93', '#2d3cff'], ['#e8262b', '#141414']];
  let wipeN = 0;
  function showShot(shot) {
    const stage = $('#reelStage'), old = reelCur;
    reelCur = shot; reelIdx = shot.i;
    const swap = () => {
      stage.appendChild(shot.el);
      if (shot.video) { shot.video.currentTime = 0; shot.video.play().catch(() => {}); }
      if (old) { if (old.video) old.video.pause(); old.el.remove(); }
    };
    if (old && !reduced) {
      // two coloured boxes zip across and the shot changes behind them
      const w = $('#reelWipe'), c = WIPES[wipeN++ % WIPES.length];
      w.style.setProperty('--w1', c[0]); w.style.setProperty('--w2', c[1]);
      w.classList.remove('go'); w.offsetWidth; w.classList.add('go');
      setTimeout(swap, 320);
    } else swap();
    $('#reelTitle').textContent = shot.sh.title;
    $$('.reel-dot').forEach((d, k) => {
      d.classList.toggle('on', k === shot.i); d.classList.toggle('done', k < shot.i);
      const bar = d.querySelector('i'); bar.style.transition = 'none'; bar.style.width = k < shot.i ? '100%' : '0';
      if (k === shot.i) { bar.offsetWidth; bar.style.transition = `width ${shot.dur}ms linear`; bar.style.width = '100%'; }
    });
    // get the next one ready while this one plays
    const upcoming = nextUsable((shot.i + 1) % REEL.length).then(n => (reelNext = n));
    const advance = () => {
      if (!reelOn || reduced) { reelTimer = setTimeout(advance, 800); return; }
      upcoming.then(n => { if (n && reelCur === shot) { reelNext = null; showShot(n); } });
    };
    reelTimer = setTimeout(advance, shot.dur);
  }

  /* =========================================================
     VIDEO (tries each file in order)
     ========================================================= */
  function videoPlayer(m, wrapCls) {
    const f = el('figure', wrapCls || '');
    f.style.margin = 0;
    const v = el('video'); v.controls = true; v.playsInline = true; v.preload = 'metadata';
    if (m.poster) v.poster = imgSrc(m.poster);
    const cap = el('figcaption', '', 'Loading video…');
    f.append(v, cap);
    let i = 0;
    const next = () => {
      if (i >= m.sources.length) { v.replaceWith(el('div', 'vid-missing', 'Video coming soon')); cap.textContent = ''; return; }
      const s = m.sources[i++]; const file = typeof s === 'string' ? s : s.file;
      cap.textContent = (typeof s === 'string' ? '' : s.label) || file;
      v.src = file; v.load();
    };
    v.addEventListener('error', next); next();
    return f;
  }

  function buildFilm() {
    const thread = DATA.sections.find(s => s.id === 'thread');
    const first = thread.projects[0];
    const vid = first.media.find(m => m.type === 'video');
    if (vid) $('#filmPlayer').appendChild(videoPlayer(vid));
    $('#filmText').textContent = thread.intro + ' ' + (first.text || '');
  }

  /* =========================================================
     WORK GRID + LIST + FILTERS
     Cards are laid out left to right, top to bottom, in the order from
     content.js. Each picture keeps its real shape (nothing is cropped);
     every new card goes into the shortest column so the grid stays even.
     ========================================================= */
  let filter = 'All';
  const cardEls = [];
  function buildWork() {
    const cats = ['All', ...new Set(projects.map(p => p.cat))];
    const fbox = $('#filters');
    cats.forEach(c => {
      const n = c === 'All' ? projects.length : projects.filter(p => p.cat === c).length;
      const b = el('button', 'chip' + (c === 'All' ? ' on' : ''), `${esc(c)}<sup>${n}</sup>`);
      b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', c === 'All');
      b.onclick = () => { filter = c; $$('.chip', fbox).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); applyFilter(); };
      fbox.appendChild(b);
    });
    const rows = $('#rows');
    projects.forEach((p, i) => {
      const c = el('button', 'card reveal');
      c.dataset.cat = p.cat; c.dataset.id = p.id; c.style.setProperty('--c', p.color);
      c.innerHTML = `<div class="card-media${p.cutout ? ' cutout' : ''}"><img src="${thumbSrc(p.cover)}" alt="${esc(p.title)}">${p.badge ? `<span class="card-badge">▶ ${esc(p.badge)}</span>` : ''}</div>
        <div class="card-meta"><h3>${esc(p.title)}</h3><span class="card-sub"><i></i>${esc(p.cat)}${p.year ? ' · ' + esc(p.year) : ''}</span></div>`;
      c.onclick = () => openProject(p.id);
      const img = c.querySelector('img');
      c.ratio = 1.4;
      const got = () => { if (img.naturalWidth) { c.ratio = img.naturalWidth / img.naturalHeight; layoutSoon(); } };
      if (img.complete) got(); else img.addEventListener('load', got);
      cardEls.push(c);
      const r = el('li', 'row');
      r.dataset.cat = p.cat; r.dataset.id = p.id; r.dataset.img = thumbSrc(p.cover); r.style.setProperty('--c', p.color);
      r.tabIndex = 0; r.setAttribute('role', 'button');
      r.innerHTML = `<span class="row-n">${String(i + 1).padStart(2, '0')}</span><span class="row-t">${esc(p.title)}</span><span class="row-c">${esc(p.cat)}</span><span class="row-y">${esc(p.year)}</span>`;
      r.onclick = () => openProject(p.id);
      r.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(p.id); } };
      rows.appendChild(r);
    });
    layout();
    if (editing) projects.forEach(p => { if (EDITS.hide && EDITS.hide['card:' + p.id]) { const c = cardEls.find(x => x.dataset.id === p.id); if (c) c.classList.add('ed-gone'); } });
    $$('.vt').forEach(b => b.onclick = () => {
      const list = b.dataset.view === 'list';
      $$('.vt').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      $('#cards').classList.toggle('hidden', list); rows.classList.toggle('hidden', !list);
    });
  }
  const colCount = () => innerWidth > 1000 ? 3 : innerWidth > 560 ? 2 : 1;
  let lastCols = 0, layoutTimer = 0;
  const layoutSoon = () => { clearTimeout(layoutTimer); layoutTimer = setTimeout(layout, 30); };
  function layout() {
    const box = $('#cards'), n = colCount();
    let cols = $$('.col', box);
    if (cols.length !== n) { box.innerHTML = ''; cols = []; for (let k = 0; k < n; k++) cols.push(box.appendChild(el('div', 'col'))); }
    lastCols = n;
    const w = (cols[0].clientWidth || 360), h = new Array(n).fill(0), place = [];
    cardEls.forEach(c => {
      if (c.classList.contains('out')) return;
      let k = 0; for (let j = 1; j < n; j++) if (h[j] < h[k] - 1) k = j;
      const est = (c.querySelector('.cutout') ? Math.min(420, (w - 56) / c.ratio) + 56 : w / c.ratio) + 90;
      h[k] += (c.isConnected && c.offsetHeight) ? c.offsetHeight + 40 : est; place.push([c, k]);
    });
    // only touch the page if something actually moves
    const same = place.every(([c, k]) => c.parentNode === cols[k]) && place.every(([c, k], i) => {
      const prev = place.slice(0, i).filter(x => x[1] === k).pop();
      return prev ? c.previousElementSibling === prev[0] : c.previousElementSibling === null;
    });
    if (!same) place.forEach(([c, k]) => cols[k].appendChild(c));
    cardEls.forEach(c => { if (c.classList.contains('out') && c.parentNode) c.remove(); });
  }
  function applyFilter() {
    cardEls.forEach(c => c.classList.toggle('out', !(filter === 'All' || c.dataset.cat === filter)));
    $$('.row').forEach(r => r.classList.toggle('out', !(filter === 'All' || r.dataset.cat === filter)));
    layout(); layoutSoon();
    cardEls.forEach(c => { if (!c.classList.contains('out')) { c.classList.remove('in'); requestAnimationFrame(() => c.classList.add('in')); } });
  }

  /* =========================================================
     ABOUT + CONTACT
     ========================================================= */
  function buildAbout() {
    const A = DATA.sections.find(s => s.about), o = DATA.owner;
    $('#aboutIntro').textContent = A.intro;
    $('#aboutQuote').textContent = A.quote;
    A.tools.forEach(t => $('#tools').appendChild(el('li', '', esc(t))));
    A.achievements.forEach(([a, b]) => $('#ach').appendChild(el('li', 'reveal', `<b>${esc(a)}</b><span>${esc(b)}</span>`)));
    const mail = $('#mailLink'); mail.href = 'mailto:' + o.email; mail.innerHTML = `email<small>${esc(o.email)}</small>`;
    const ig = $('#igLink'); ig.href = 'https://www.instagram.com/' + o.instagram + '/'; ig.innerHTML = `instagram<small>@${esc(o.instagram)}</small>`;
  }
  function countUp(b) {
    const end = +b.dataset.count, t0 = performance.now(), d = 1100;
    const tick = now => { const k = Math.min(1, (now - t0) / d); b.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }

  /* =========================================================
     PROJECT PAGE
     ========================================================= */
  let current = -1, lbList = [], lbIndex = 0;
  function openProject(id, fromHash) {
    const p = projects.find(x => x.id === id); if (!p) return;
    current = p.index;
    const P = $('#project'), body = $('#pBody'); lbList = [];
    P.style.setProperty('--c', p.color); P.style.setProperty('--i', p.ink);
    $('#pCount').textContent = `${String(p.index + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')} · ${p.cat}`;
    body.innerHTML = '';
    const hero = el('header', 'p-hero');
    hero.innerHTML = `<div class="wrap p-hero-grid"><div><span class="tag"><i></i>${esc(p.cat)}${p.year ? ' · ' + esc(p.year) : ''}</span><h1>${esc(p.title)}${p.zh ? `<span class="zh">${esc(p.zh)}</span>` : ''}</h1></div>
      <div><p class="p-intro">${esc(p.intro || '')}</p>${p.tag ? `<div class="p-meta">${p.tag.split(' · ').map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}</div></div>`;
    body.appendChild(hero);
    p.parts.forEach(part => {
      const s = el('section', 'p-section wrap');
      if (part.title) s.innerHTML = `<h2>${esc(part.title)}</h2>${part.meta ? `<p class="meta">${esc(part.meta)}</p>` : ''}${part.text ? `<p class="text">${esc(part.text)}</p>` : ''}`;
      // wide pieces get the full width; the rest sit in a column grid at their real shape, in order
      let g = null;
      (part.media || []).forEach(m => {
        const wide = m.wide || m.type === 'video';
        if (wide) { g = null; s.appendChild(el('div', 'gallery-wide')).appendChild(galleryItem(m, part.title || p.title)); return; }
        if (!g) g = s.appendChild(el('div', 'gallery'));
        g.appendChild(galleryItem(m, part.title || p.title));
      });
      body.appendChild(s);
    });
    const nx = projects[(p.index + 1) % projects.length];
    const nb = el('button', 'p-next', `<div class="wrap"><small>Next project →</small><b>${esc(nx.title)}</b></div>`);
    nb.onclick = () => openProject(nx.id);
    body.appendChild(nb);
    $('#pScroll').scrollTop = 0;
    P.classList.remove('hidden', 'closing'); document.body.classList.add('locked');
    if (!fromHash) history.replaceState(null, '', '#p/' + p.id);
    $('#pClose').focus({ preventScroll: true });
  }
  function closeProject() {
    const P = $('#project'); if (P.classList.contains('hidden')) return;
    P.querySelectorAll('video').forEach(v => v.pause());
    P.classList.add('closing');
    setTimeout(() => { P.classList.add('hidden'); P.classList.remove('closing'); $('#pBody').innerHTML = ''; document.body.classList.remove('locked'); }, 380);
    history.replaceState(null, '', '#work');
    const card = $(`.card[data-id="${projects[current].id}"]`); if (card) card.focus({ preventScroll: true });
  }
  const step = d => openProject(projects[(current + d + projects.length) % projects.length].id);
  $('#pClose').onclick = closeProject; $('#pPrev').onclick = () => step(-1); $('#pNext').onclick = () => step(1);

  function galleryItem(m, title) {
    const type = m.type || 'img';
    if (type === 'video') { const f = videoPlayer(m, 'g-item video wide'); f.prepend(el('span', 'g-badge', 'VIDEO')); return f; }
    const f = el('figure', 'g-item' + (m.wide ? ' wide' : '') + (m.cutout ? ' cutout' : '') + (m.pixel ? ' pixel' : ''));
    if (m.cutout) f.style.setProperty('--c', mix(current >= 0 ? projects[current].color : '#f1ede4'));
    const full = type === 'gif' ? m.src : imgSrc(m.src);
    const shown = type === 'gif' || m.wide ? full : thumbSrc(m.src);
    f.innerHTML = `${type === 'gif' ? '<span class="g-badge">GIF</span>' : ''}<img loading="lazy" src="${shown}" alt="${esc(m.caption || title)}">${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ''}`;
    const i = lbList.length; lbList.push({ src: full, cap: m.caption ? `${title} · ${m.caption}` : title });
    f.onclick = () => openLB(i);
    return f;
  }

  /* ---------- lightbox ---------- */
  function openLB(i) { lbIndex = i; $('#lightbox').classList.remove('hidden'); showLB(); }
  function showLB() { const it = lbList[lbIndex]; $('#lbStage').innerHTML = `<img src="${it.src}" alt="">`; $('#lbCap').textContent = `${it.cap}  ·  ${lbIndex + 1} / ${lbList.length}`; }
  function lbGo(d) { lbIndex = (lbIndex + d + lbList.length) % lbList.length; showLB(); }
  function closeLB() { $('#lightbox').classList.add('hidden'); }
  $('#lbClose').onclick = closeLB; $('#lbPrev').onclick = () => lbGo(-1); $('#lbNext').onclick = () => lbGo(1);
  $('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox' || e.target.tagName === 'FIGURE') closeLB(); });
  let tx0 = null;
  $('#lightbox').addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; }, { passive: true });
  $('#lightbox').addEventListener('touchend', e => { if (tx0 == null) return; const dx = e.changedTouches[0].clientX - tx0; if (Math.abs(dx) > 50) lbGo(dx < 0 ? 1 : -1); tx0 = null; });

  addEventListener('keydown', e => {
    const lbOpen = !$('#lightbox').classList.contains('hidden'), pOpen = !$('#project').classList.contains('hidden');
    if (lbOpen) { if (e.key === 'Escape') closeLB(); if (e.key === 'ArrowRight') lbGo(1); if (e.key === 'ArrowLeft') lbGo(-1); return; }
    if (pOpen) { if (e.key === 'Escape') closeProject(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); }
  });
  $$('[data-open]').forEach(b => b.onclick = () => openProject(b.dataset.open));

  /* =========================================================
     LIST VIEW PREVIEW + MAGNETIC BUTTONS (mouse only)
     ========================================================= */
  if (finePointer) {
    const preview = $('.preview'), pImg = $('.preview img');
    let mx = 0, my = 0, px = 0, py = 0, running = false;
    $$('.row').forEach(n => {
      n.onmouseenter = () => { pImg.src = n.dataset.img; preview.classList.add('on'); if (!running) { running = true; px = mx; py = my; loop(); } };
      n.onmouseleave = () => preview.classList.remove('on');
    });
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const loop = () => {
      px += (mx - px) * .14; py += (my - py) * .14;
      preview.style.transform = `translate(${px + 30}px,${py - 120}px) rotate(${(mx - px) * .04}deg)`;
      if (preview.classList.contains('on') || Math.abs(mx - px) > .5) requestAnimationFrame(loop); else running = false;
    };
    if (!reduced) $$('.magnetic').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .15}px,${(e.clientY - r.top - r.height / 2) * .2}px)`; });
      b.addEventListener('mouseleave', () => b.style.transform = '');
    });
  }

  /* =========================================================
     SCROLL: reveals, nav, active link
     ========================================================= */
  function watchScroll() {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
      $$('[data-count]', e.target).forEach(countUp);
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(n => io.observe(n));

    const nav = $('.nav'); let lastY = scrollY;
    const links = $$('.nav-links a');
    const secIO = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id && !a.classList.contains('nav-cta')));
    }), { rootMargin: '-45% 0px -50% 0px' });
    ['work', 'film', 'about', 'contact'].forEach(id => secIO.observe(document.getElementById(id)));
    const onScroll = () => {
      const y = scrollY;
      nav.classList.toggle('scrolled', y > 10);
      nav.classList.toggle('away', y > lastY && y > 400); lastY = y;
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* =========================================================
     CIRCLE CURSOR (mouse only)
     ========================================================= */
  function buildCursor() {
    const cur = $('#cursor');
    if (!finePointer) { cur.remove(); return; }
    document.documentElement.classList.add('has-cursor');
    const ring = $('.cursor-ring', cur), dot = $('.cursor-dot', cur);
    let mx = -100, my = -100, rx = mx, ry = my;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.classList.remove('gone'); });
    document.addEventListener('mouseleave', () => cur.classList.add('gone'));
    addEventListener('mousedown', () => cur.classList.add('down'));
    addEventListener('mouseup', () => cur.classList.remove('down'));
    document.addEventListener('mouseover', e => {
      const t = e.target;
      const big = t.closest('.card, .row, .hero-art-frame, .g-item:not(.video), .p-next');
      const label = !big ? '' : big.matches('.g-item') ? 'Zoom' : big.matches('.p-next') ? 'Next' : 'View';
      cur.classList.toggle('big', !!big);
      ring.textContent = label;
      cur.classList.toggle('link', !big && !!t.closest('a, button, .chip, .vt, .sticker, video, [role="button"]'));
      cur.classList.toggle('light', !!t.closest('.contact, #lightbox, .p-next'));
      if (!big && t.closest('.reel')) { cur.classList.add('big'); ring.textContent = 'Open'; }
    });
    const loop = () => {
      rx += (mx - rx) * .16; ry += (my - ry) * .16;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      dot.style.transform = `translate(${mx}px,${my}px)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- go ---------- */
  buildHero(); buildReel(); buildFilm(); buildWork(); buildAbout();
  watchScroll(); buildCursor();
  // used by edit mode to move cards around
  window.SITE = {
    cardOrder: () => cardEls.map(c => c.dataset.id),
    setCardOrder(ids) {
      const r = id => { const i = ids.indexOf(id); return i < 0 ? 1e4 : i; };
      cardEls.sort((a, b) => r(a.dataset.id) - r(b.dataset.id));
      const rows = $('#rows');
      [...rows.children].sort((a, b) => r(a.dataset.id) - r(b.dataset.id)).forEach((x, i) => { rows.appendChild(x); x.querySelector('.row-n').textContent = String(i + 1).padStart(2, '0'); });
      layout(); layoutSoon();
    },
    relayout() { layout(); layoutSoon(); }
  };
  addEventListener('resize', () => { if (colCount() !== lastCols) layout(); else layoutSoon(); });
  const h = location.hash.match(/^#p\/(.+)$/); if (h) openProject(h[1], true);
})();
