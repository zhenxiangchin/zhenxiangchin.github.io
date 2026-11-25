/* Chinny Portfolio
   Uses the same artwork list as the main site (../website/js/content.js) and the
   words/pictures Chinny changed in edit mode (../website/js/edits.js). */
(function () {
  'use strict';
  const DATA = window.PORTFOLIO;
  const EDITS = window.PORTFOLIO_EDITS || {};
  const ET = EDITS.text || {}, EI = EDITS.img || {}, EH = EDITS.hide || {};
  const $ = (s, n = document) => n.querySelector(s);
  const $$ = (s, n = document) => [...n.querySelectorAll(s)];
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = () => innerWidth <= 700;

  // ON/OFF SWITCHES for the playful extras. true = on, false = off. Nothing is deleted, so any of them can come back.
  const FX = {
    intro: false,   // the opening where a red line sews "CHINNY" (off since 16 Nov 2026)
    crt: true,      // the CRT / VHS look: dark screen, scanlines, on-screen labels (on since 17 Nov 2026). false = the paper look
    line: false,    // the sideways-scrolling section with 6 pieces on a thread (off since 17 Nov 2026)
    thread: false,  // the red thread, needle and knots down the page, and the needle you pull in Contact (off since 17 Nov 2026)
    marquee: false, // the red band of scrolling words under the top of the page (off since 17 Nov 2026)
    puppet: true,   // Ah Kit dangling at the top of the page
    gate: true,     // the "click to continue" screen with the red ENTER button, shown once per visit (on since 17 Nov 2026)
    popups: false,  // old-PC pop-up windows advertising your first three works, once per visit (off since 19 Nov 2026)
    oldCursor: true,// the little pixel mouse arrow on the TV glass. false = the red dot
    lofi: false,    // covers on the home page in low colour. Off since 17 Nov 2026 (words in the artwork became unreadable); its pictures and MAKE-LOFI tool were removed 19 Nov 2026, so leave this off
    headline: false,// the big "I draw stuff" headline at the top (off since 17 Nov 2026)
    tv: true,       // animation works sit inside a retro TV in "All the stuffs"
    books: true,    // comics show as a turning 3D book in "All the stuffs"
    shop: true,     // "All the stuffs" looks like a 90s game item shop: every work in a same-size item slot, in one even grid (on since 17 Nov 2026)
    about: false,   // the photo, intro, quote and numbers block (off since 17 Nov 2026). "Things that happened" stays
    tvRoom: true,   // the site plays inside an old TV (media/tv); scrolling down zooms into the screen. Big screens only (on since 17 Nov 2026)
    chromeName: true,// the shiny chrome "CHINNY" under "Illustrator · Animator · Designer · Malaysia" (on since 17 Nov 2026)
  };
  // works taken off the site completely (by their id). Take an id out of this list to bring the work back.
  const HIDDEN_WORKS = ['sketchbook']; // "Things that belong in the basement", removed 17 Nov 2026
  // edit mode always shows the plain page, so nothing gets in the way of editing
  const EDITING = /edit/i.test(location.hash), LOFI = FX.lofi && !EDITING;
  // a picture tag: the low-colour copy on the home page, falling back to the real one if no copy exists yet
  const pic = (src, alt, cls) => `<img class="${cls || ''}${LOFI ? ' lofi' : ''}" src="${LOFI ? 'lofi/' + src.split('/').pop().replace(/\.\w+$/, '') + '.png' : src}"${LOFI ? ` data-hd="${src}" onerror="this.onerror=null;this.classList.remove('lofi');this.src=this.dataset.hd"` : ''} alt="${esc(alt)}" loading="lazy" draggable="false">`;

  // paths: everything lives in the main site's folder next door
  const isPath = s => /[\/.]/.test(s);
  const site = p => /^(https?:|data:|blob:|\.\.\/)/.test(p) ? p : '../website/' + p;
  const imgSrc = s => site(isPath(s) ? s : 'media/img/' + s + '.webp');
  const thumbSrc = s => site(isPath(s) ? s : 'media/thumb/' + s + '.webp');
  const mix = c => `color-mix(in srgb, ${c} 22%, #fff)`;
  // Chinny's own words from edit mode win over the originals
  const safe = h => String(h).replace(/<(?!\/?(br|b|em|i|strong)\b)[^>]*>/gi, '');
  const said = (key, fallback) => ET[key] ? safe(ET[key].html) : esc(fallback);
  const plain = (key, fallback) => ET[key] ? safe(ET[key].html).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ') : fallback;

  /* =========================================================
     PROJECTS (same ids as the main site, so Chinny's edits match)
     ========================================================= */
  const CATEGORY = { thread: 'Animation', illustration: 'Illustration', identity: 'Design', publications: 'Comics', animation: 'Animation', threed: '3D', activities: 'Events', sketchbook: 'Illustration' };
  const yearOf = s => { const m = String(s || '').match(/20\d\d/g); return m ? m[m.length - 1] : ''; };
  const firstImage = media => { const m = (media || []).find(x => (x.type || 'img') === 'img' && !x.cutout) || (media || []).find(x => x.src || x.poster); return m ? (m.src || m.poster) : ''; };
  let projects = [];
  DATA.sections.filter(s => !s.about).forEach(S => {
    const base = { cat: CATEGORY[S.id] || S.title, color: S.color, ink: S.ink, accent: S.accent };
    if (S.id === 'thread' || S.id === 'animation') {
      projects.push({ ...base, id: S.id, title: S.id === 'animation' ? 'Alien Game' : S.title, zh: S.zh, year: '2025', badge: 'Film', cover: S.cover, intro: S.intro, tag: S.tag, parts: S.projects });
    } else {
      S.projects.forEach((P, i) => projects.push({ ...base, id: S.id + '-' + (i + 1), title: P.title, year: yearOf(P.meta), cover: P.cover || firstImage(P.media), intro: P.text || S.intro, tag: P.meta, parts: P.parts || [{ ...P, title: '' }] })); // parts: a work with several headed parts (Illuspeak)
    }
  });
  const SB = DATA.sketchbook;
  if (SB) projects.push({ id: 'sketchbook', cat: CATEGORY.sketchbook, color: SB.color, ink: SB.ink, accent: SB.accent, title: SB.title, zh: SB.zh, year: '2022 – 2025', cover: SB.projects[0].media[0].src, intro: SB.intro, tag: SB.tag, parts: SB.projects.map(p => ({ ...p, title: '' })) });
  const order = (EDITS.order && EDITS.order.length ? EDITS.order : DATA.workOrder) || [];
  const rank = p => { const i = order.indexOf(p.id); return i < 0 ? order.length + projects.indexOf(p) : i; };
  projects = projects.sort((a, b) => rank(a) - rank(b)).filter(p => !EH['card:' + p.id] && !HIDDEN_WORKS.includes(p.id));
  // the Sozosha Art Battle happened during the Osaka workshop, so it is a second part of that work (Chinny, 17 Nov 2026)
  const osaka = projects.find(p => p.id === 'activities-1'), battle = projects.find(p => p.id === 'activities-2');
  if (osaka && battle) {
    Object.assign(osaka.parts[0], { title: 'The workshop', text: '' }); // its words are already at the top of the page
    osaka.parts.push({ ...battle.parts[0], title: plain('card:activities-2:title', battle.title) });
    projects = projects.filter(p => p !== battle);
  }
  // Illustration Works (22 Nov 2026): Morning Market, Ideal Breakfast, Pixel Art & Self Expression and Characters & Fan Art
  // are one work, each a part of its page. The ids stay as they were, so Chinny's edits still match.
  const illo = ['illustration-3', 'illustration-4', 'illustration-5', 'illustration-6'].map(id => projects.find(p => p.id === id)).filter(Boolean);
  if (illo.length > 1) {
    illo[0].parts = illo.map(w => ({ ...w.parts[0], title: plain('card:' + w.id + ':title', w.title), meta: w.tag }));
    Object.assign(illo[0], { title: 'Illustration Works', year: '2025', tag: 'Illustration · Pixel art · Fan art · 2022 – 2025',
      intro: 'Personal illustrations from 2022 to 2025: a monster market, a breakfast, pixel art, and characters I love.' });
    projects = projects.filter(p => !illo.slice(1).includes(p));
  }
  // Visual Identity | Promotional Design (25 Nov 2026): Popcorn Durian (identity-1) is the second part of the ShoYueMi card (identity-2).
  // Ids stay as they were, so Chinny's edits still match; the card's title is set in website/js/edits.js.
  const shoyu = projects.find(p => p.id === 'identity-2'), durian = projects.find(p => p.id === 'identity-1');
  if (shoyu && durian) {
    shoyu.parts = [{ ...shoyu.parts[0], title: "ShoYueMi Valentine's Day", meta: shoyu.tag }, { ...durian.parts[0], title: plain('card:identity-1:title', durian.title), meta: durian.tag }];
    Object.assign(shoyu, { title: 'Visual Identity | Promotional Design', year: '2024', tag: 'Branding · Posters · Packaging · 2024',
      intro: "Brand and promotional design: a Valentine's Day poster for Snek Ku's ShoYueMi, and the branding, poster and packaging for a durian-flavoured popcorn." });
    projects = projects.filter(p => p !== durian);
  }
  // A Thread of Life (17 Nov 2026): the case film, the newer poster shown big and the concept board go with the film;
  // Ah Kit (made for the merch) joins a smaller, cut-out merch picture
  const tol = projects.find(p => p.id === 'thread');
  if (tol) {
    tol.parts = tol.parts.map(pt => ({ ...pt, media: [...(pt.media || [])] }));
    const film = tol.parts[0], merch = tol.parts.find(pt => /merch/i.test(pt.title)), kit = film.media.find(m => m.src === 'tol-mascot');
    film.media = film.media.filter(m => m !== kit && m.src !== 'tol-poster');
    film.media.splice(1, 0, { type: 'video', poster: 'tol-casefilm', sources: [{ file: 'media/videos/tol-case-film.mp4', label: 'Case film' }] },
      { src: 'tol-poster-2026', caption: 'Poster', aside: true }, { src: 'tol-concept', caption: 'Concept board', wide: true });
    if (merch && kit) merch.media.unshift({ ...kit, cutout: false, bare: true }); // the merch photos themselves are in content.js (19 Nov 2026)
  }
  // the arcade machine from the Interior Room, as an item of its own next to Soda Crackers (Chinny, 17 Nov 2026).
  // Its 3D model: media/3d/arcade-machine.glb, exported from MIA/SEM 5/3D Final Submission/...isometric room.blend (object "Sphere")
  const soda = projects.find(p => p.id === 'threed-1');
  if (soda) projects.splice(projects.indexOf(soda) + 1, 0, { ...soda, id: 'arcade', title: 'Arcade Machine', year: '2025', cover: 'arcade-machine',
    intro: 'The arcade machine from my Interior Room, on its own: Soda Crackers on top, Meowzilla on the screen.', tag: '3D model · 2025',
    parts: [{ title: '', media: [{ type: 'model', model: 'media/3d/arcade-machine.glb', src: 'arcade-machine' }] }] }); // the real 3D model, up close (js/model3d.js)
  // New Life Project (18 Nov 2026): the 3D environments are part of the comic's world, so they go into the comic's page
  // as a second part, and the separate 3D card goes
  const nlp = projects.find(p => p.id === 'publications-3'), nlp3d = projects.find(p => p.id === 'threed-4');
  if (nlp && nlp3d) {
    nlp.parts = [{ ...nlp.parts[0], title: 'The comic', text: '' }, { ...nlp3d.parts[0], title: '3D environments' }]; // its words are already at the top
    projects = projects.filter(p => p !== nlp3d);
  }
  // KFC Malaysia | Socials (was Drumothy, 18 Nov 2026; renamed 25 Nov 2026): KFC Malaysia's brainrot characters and socials, made at Naga DDB Tribal. First in the shop.
  // TikTok numbers were read off the three videos on 18 Nov 2026; update them by hand when they grow.
  const DRUM = 'media/gifs/drumothy.gif';
  projects.unshift({ id: 'drumothy', cat: 'Design', color: '#e4002b', ink: '#ffffff', accent: '#ffd23f', title: 'KFC Malaysia | Socials', sub: 'KFC Malaysia Official TikTok – Brainrot Characters & Socials', year: '2026', cover: DRUM,
    intro: "Social content for KFC Malaysia, made during my internship at Naga DDB Tribal: Drumothy and Uwu-Tart, two of the brainrot characters I created for KFC Malaysia's TikTok series, and thumbnails for the Chicki birthday videos.",
    tag: 'Character design · Social media · KFC Malaysia · Naga DDB Tribal · 2026 · 1M+ views · 110K+ likes',
    parts: [
      { title: 'Meet Drumothy', meta: 'Brainrot character · 2026', text: 'Drumothy, the official brainrot mascot of KFC Malaysia, made during my internship at Naga DDB Tribal and one of my first KFC projects. The life of the party, the main character, he\'s iconic, he\'s really THAT guy. Here for a good time, not a long time! Drumothy wants you to break free, let loose and just have fun. He takes his YOLO mindset too seriously. Finger lickin\' charisma.',
        media: [{ type: 'gif', src: DRUM, cutout: true, bare: true, drum: true }] },
      { title: 'Find him on TikTok', meta: '1M+ views · 110K+ likes on TikTok', text: 'A few of my favourite KFC Malaysia TikToks starring Drumothy. There are lots more on the account.',
        media: [{ type: 'tiktok', id: '7639303220254264584', cover: 'drumothy-tt-1', caption: '592K views · May 2026' },
          { type: 'tiktok', id: '7696455930380176647', cover: 'drumothy-tt-2', caption: '249K views · Oct 2026' },
          { type: 'tiktok', id: '7657881695445683463', cover: 'drumothy-tt-3', caption: '121K views · Jul 2026' }] },
      { title: 'Meet Uwu-Tart', meta: 'Brainrot character · 2026', big: true, text: "An egg tart on tiny legs. Another of the brainrot characters I created for KFC Malaysia's TikTok series.",
        media: [{ src: 'kfc-uwu-tart', cutout: true, bare: true, caption: 'Uwu-Tart' }] },
      { title: 'Chicki Birthday', meta: 'TikTok thumbnails · May 2026', big: true, text: "Thumbnails for KFC Malaysia's Chicki birthday party videos.",
        media: [{ src: 'kfc-chicki-1', caption: 'Meriahkan birthday si manja' }, { src: 'kfc-chicki-2', caption: 'Lebih ceria celebrate together' }, { src: 'kfc-chicki-3', caption: 'Moment berharga di KFC' }] }
    ] });
  // Prudential Malaysia (19 Nov 2026): social content made at Naga DDB Tribal, second in the shop after Drumothy.
  // The Instagram covers were saved from the posts on 19 Nov 2026 (media/img/pru-*.webp); Ep 1's is Chinny's own thumbnail.
  const IG = id => 'https://www.instagram.com/' + id + '/';
  projects.splice(1, 0, { id: 'prudential', cat: 'Design', color: '#ed1b2e', ink: '#ffffff', accent: '#ffd23f', title: 'Prudential Malaysia', sub: 'Social content · Naga DDB Tribal', year: '2026', cover: 'pru-flagship',
    intro: 'Social content for Prudential Malaysia, made during my internship at Naga DDB Tribal: a flagship post on what breast cancer really costs, the Hidden Cost series on critical illness, and the key visuals for the Prudential Agency Awards 2025.',
    tag: 'Social media · Prudential Malaysia · Naga DDB Tribal · 2026',
    parts: [
      { title: 'Flagship post', meta: 'Instagram · Jul 2026', text: 'Breast cancer affects many Malaysian women, and the bills keep coming long after treatment. A carousel on what it really costs.',
        media: [{ type: 'tiktok', href: IG('p/DaT77xZCHK9'), badge: 'Instagram', r: .8, cover: 'pru-flagship', caption: 'Flagship post · Jul 2026' }] },
      { title: 'Hidden Cost series', meta: 'Instagram · PRUMy Critical Care · May – Jun 2026', text: 'Three episodes on the costs of critical illness that come after the hospital: income, home care and the family who rely on you.',
        media: [{ type: 'tiktok', href: IG('p/DYl997wDW_4'), badge: 'Instagram', cover: 'pru-ep1', caption: 'Ep 1 · May 2026' },
          { type: 'tiktok', href: IG('reel/DZZFvCIj97S'), badge: 'Instagram', cover: 'pru-ep2', caption: 'Ep 2 · Reel · Jun 2026' },
          { type: 'tiktok', href: IG('reel/DZMimPnzEpO'), badge: 'Instagram', cover: 'pru-ep3', caption: 'Ep 3 · Reel · Jun 2026' }] },
      { title: 'Prudential Agency Awards 2025', meta: 'Key visuals · Photoshoot', text: 'Key visuals for the Million Dollar Agency and Master Wealth Planner winners, from group shots to solo portraits.',
        media: [{ src: 'pru-mda', wide: true }, { src: 'pru-mda-2' }, { src: 'pru-mda-3' }, { src: 'pru-mda-4' },
          { src: 'pru-mwp', wide: true }, { src: 'pru-mwp-2' }, { src: 'pru-mwp-3' }, { src: 'pru-mwp-4' }, { src: 'pru-mwp-5' }] },
      { title: 'The photoshoot', meta: 'Prudential Agency Awards 2025 · Photography', text: 'My experience at Prudential Agency Awards 2025 photoshoot.', big: true,
        media: [{ src: 'pru-shoot-1', caption: 'At the photoshoot' }, { src: 'pru-shoot-2', caption: 'At the photoshoot' }, { src: 'pru-shoot-3', caption: 'At the photoshoot' }] }
    ] });
  projects.forEach((p, i) => {
    p.index = i;
    p.cutout = p.parts.some(pt => (pt.media || []).some(m => m.src === p.cover && m.cutout));
    p.name = plain('card:' + p.id + ':title', p.title);
    const own = EI['card:' + p.id + ':cover'];
    p.full = own ? site(own) : imgSrc(p.cover);
    p.thumb = own ? site(own) : thumbSrc(p.cover);
    if (own) p.cutout = false;
  });
  const byId = id => projects.find(p => p.id === id);

  /* =========================================================
     POINTER (shared by everything that reacts to the mouse)
     ========================================================= */
  const mouse = { x: -9999, y: -9999, on: false };
  let dot = null;
  addEventListener('pointermove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true;
    if (dot) dot.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
  }, { passive: true });

  // positions of the big pieces, measured once per layout change instead of every frame
  const G = { heroTop: 0, heroH: 0, lineTop: 0, lineH: 0, cz: null };
  function measure() {
    flat(() => {
      const h = docRect($('#top')), l = docRect($('#line'));
      G.heroTop = h.t; G.heroH = h.h; G.lineTop = l.t; G.lineH = l.h; G.cz = docRect($('#cordZone'));
    });
  }
  // run fn with the page at full size for a moment (the TV zoom shrinks it at the top)
  function flat(fn) { const m = $('#main'), t = m.style.transform; m.style.transform = ''; fn(); m.style.transform = t; }
  // a point on the window -> where it would be if the page were full size
  const TVM = { a: 0, b: 0, s: 1 };
  const unTV = (x, y) => [(x - TVM.a) / TVM.s, (y - TVM.b) / TVM.s];
  document.addEventListener('pointerleave', () => { mouse.on = false; });

  /* =========================================================
     OPENING
     ========================================================= */
  function intro() {
    const n = $('#intro');
    let seen = false;
    try { seen = sessionStorage.getItem('chinny-intro') === '1'; sessionStorage.setItem('chinny-intro', '1'); } catch (e) {}
    if (!FX.intro || seen || reduced || location.hash.length > 1) { n.remove(); heroIn(); return; }
    let done = false;
    const go = () => { if (done) return; done = true; n.classList.add('out'); setTimeout(heroIn, 250); setTimeout(() => n.remove(), 900); };
    setTimeout(go, 1750); n.addEventListener('click', go);
  }
  function heroIn() { $('#heroTitle').classList.add('enter'); }

  /* =========================================================
     HERO LETTERS · they get shoved by your mouse (and by Ah Kit)
     ========================================================= */
  let letters = [];
  function splitTitle() {
    const h = $('#heroTitle'), own = Object.values((window.CHINNY_EDITS || {}).text || {}).find(e => e.from.replace(/\s+/g, ' ').trim() === h.textContent.trim());
    // Chinny's own headline from edit mode (js/my-edits.js) goes in before the letters are split
    if (own) h.textContent = own.html.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
    const text = h.textContent.trim().replace(/\s+/g, ' '), words = text.split(' ');
    h.setAttribute('aria-label', text);
    h.innerHTML = words.map((w, wi) => `<span class="w" style="--i:${wi}" aria-hidden="true">${[...w].map(c => `<span class="c${wi === words.length - 1 ? ' red' : ''}">${esc(c)}</span>`).join('')}</span>`).join(' ');
    letters = $$('.c', h).map(n => ({ n, k: .7, x: 0, y: 0, vx: 0, vy: 0, cx: 0, cy: 0, still: true }));
  }
  // the art row under the headline: Chinny's card covers (not the ones on the clothesline), shoved like the letters
  function heroArt() {
    const box = $('#heroArt'), skip = FX.line ? LINE_PICKS.map(x => x[0]) : [];
    projects.filter(p => !p.cutout && !skip.includes(p.id)).slice(0, 12).forEach(p => {
      const a = el('a'); a.href = '#'; a.dataset.cursor = 'Look'; a.title = p.name;
      a.innerHTML = pic(p.thumb, p.name);
      a.onclick = e => { e.preventDefault(); openProject(p.id); };
      a.querySelector('img').addEventListener('load', sizeSoon);
      box.appendChild(a);
      letters.push({ n: a, k: .1, m: .2, x: 0, y: 0, vx: 0, vy: 0, cx: 0, cy: 0, still: true });
    });
  }
  function measureLetters() {
    flat(() => letters.forEach(c => { const r = c.n.getBoundingClientRect(); c.cx = r.left + r.width / 2 - c.x + scrollX; c.cy = r.top + r.height / 2 - c.y + scrollY; }));
  }
  function shove(px, py, R, power) {
    letters.forEach(c => {
      const dx = c.cx + c.x - px, dy = c.cy + c.y - py, d = Math.hypot(dx, dy);
      if (d > R || d < .1) return;
      const f = Math.pow(1 - d / R, 2) * power * (c.m || 1); // m = how easily a thing is pushed
      c.vx += dx / d * f; c.vy += dy / d * f; c.still = false;
    });
  }
  function stepLetters() {
    if (G.heroTop + G.heroH < scrollY) return;
    if (mouse.on) { const [mx, my] = unTV(mouse.x, mouse.y); shove(mx + scrollX, my + scrollY, 150, 2.4); }
    if (puppet) { const e = puppet.rope.p[puppet.rope.p.length - 1]; shove(e.x - puppet.w * .2, e.y + puppet.h * .28, puppet.w * .9, 3.2); }
    letters.forEach(c => {
      if (c.still) return;
      c.vx += -c.x * .07; c.vy += -c.y * .07; c.vx *= .82; c.vy *= .82;
      c.x += c.vx; c.y += c.vy;
      if (Math.abs(c.x) + Math.abs(c.y) + Math.abs(c.vx) + Math.abs(c.vy) < .05) { c.x = c.y = 0; c.still = true; c.n.style.transform = ''; return; }
      c.n.style.transform = `translate(${c.x.toFixed(2)}px,${c.y.toFixed(2)}px) rotate(${(c.x * c.k).toFixed(2)}deg)`;
    });
  }

  /* =========================================================
     HERO BACKGROUND · Chinny's animation clips play softly behind the headline
     ========================================================= */
  function heroReel() {
    const box = $('#heroBg'), vids = $$('video', box);
    const reel = (DATA.showreel || []).filter(s => s.video), clips = reel.map(s => s.video), now = $('#heroNow');
    const label = () => { const s = reel[k]; now.innerHTML = `Now playing · <b>${esc(s.title)}</b>${s.open ? ' →' : ''}`; now.onclick = s.open ? () => openProject(s.open) : null; now.style.cursor = s.open ? '' : 'default'; };
    if (!clips.length || reduced) { box.closest('.hero-reel').remove(); return; }
    let k = 0, on = 0, timer = 0, visible = true, started = false;
    const load = (v, name) => { v.innerHTML = `<source src="${site('media/videos/' + name + '.mp4')}" type="video/mp4"><source src="${site('media/videos/' + name + '.webm')}" type="video/webm">`; v.load(); };
    const next = () => {
      clearTimeout(timer);
      const cur = vids[on], nxt = vids[1 - on];
      nxt.currentTime = 0; nxt.play().catch(() => {});
      nxt.classList.add('on'); cur.classList.remove('on');
      on = 1 - on; k = (k + 1) % clips.length; label();
      setTimeout(() => { cur.pause(); load(cur, clips[(k + 1) % clips.length]); }, 900);
      timer = setTimeout(next, 6000);
    };
    load(vids[0], clips[0]); load(vids[1], clips[1 % clips.length]);
    vids[0].classList.add('on'); label();
    vids.forEach(v => v.addEventListener('ended', () => { if (v === vids[on] && visible) next(); }));
    const start = () => { started = true; vids[on].play().catch(() => {}); timer = setTimeout(next, 6000); };
    // only plays while the top of the page is on screen
    new IntersectionObserver(es => es.forEach(e => {
      visible = e.isIntersecting;
      if (!visible) { clearTimeout(timer); vids.forEach(v => v.pause()); }
      else if (started) { vids[on].play().catch(() => {}); clearTimeout(timer); timer = setTimeout(next, 6000); }
      else start();
    })).observe(box);
  }

  /* =========================================================
     ROPES · a tiny verlet physics engine for every string on the page
     ========================================================= */
  function rope(n, len, x, y, endWeight) {
    const p = [];
    for (let i = 0; i < n; i++) p.push({ x, y: y + i * len, px: x, py: y + i * len, inv: i === 0 ? 0 : 1 });
    p[n - 1].inv = endWeight;
    return { p, len, base: len, grab: null, g: .55, damp: .985 };
  }
  function stepRope(r, anchor, walls) {
    const p = r.p, last = p[p.length - 1];
    p[0].x = p[0].px = anchor.x; p[0].y = p[0].py = anchor.y;
    for (let i = 1; i < p.length; i++) {
      const q = p[i];
      if (q === last && r.grab) { q.px = q.x; q.py = q.y; q.x = r.grab.x; q.y = r.grab.y; continue; }
      const vx = (q.x - q.px) * r.damp, vy = (q.y - q.py) * r.damp;
      q.px = q.x; q.py = q.y; q.x += vx; q.y += vy + r.g;
    }
    for (let k = 0; k < 16; k++) {
      for (let i = 0; i < p.length - 1; i++) {
        const a = p[i], b = p[i + 1];
        const wa = a.inv, wb = (b === last && r.grab) ? 0 : b.inv, s = wa + wb; if (!s) continue;
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .001, diff = (d - r.len) / d;
        a.x += dx * diff * wa / s; a.y += dy * diff * wa / s;
        b.x -= dx * diff * wb / s; b.y -= dy * diff * wb / s;
      }
    }
    let hit = '';
    if (walls && !r.grab) {
      const vx = last.x - last.px, vy = last.y - last.py;
      if (last.x < walls.l) { last.x = walls.l; last.px = last.x + vx * .7; hit = 'x'; }
      if (last.x > walls.r) { last.x = walls.r; last.px = last.x + vx * .7; hit = 'x'; }
      if (last.y > walls.b) { last.y = walls.b; last.py = last.y + vy * .7; hit = 'y'; }
      if (last.y < walls.t) { last.y = walls.t; last.py = last.y + vy * .7; hit = 'y'; }
    }
    return hit;
  }
  function drawRope(ctx, r, ox, oy) {
    const p = r.p;
    ctx.beginPath(); ctx.moveTo(p[0].x - ox, p[0].y - oy);
    for (let i = 1; i < p.length - 1; i++) { const mx = (p[i].x + p[i + 1].x) / 2, my = (p[i].y + p[i + 1].y) / 2; ctx.quadraticCurveTo(p[i].x - ox, p[i].y - oy, mx - ox, my - oy); }
    const l = p[p.length - 1]; ctx.lineTo(l.x - ox, l.y - oy); ctx.stroke();
  }
  const endAngle = r => { const p = r.p, a = p[p.length - 2], b = p[p.length - 1]; return -Math.atan2(b.x - a.x, b.y - a.y) * 180 / Math.PI; };
  // drag the end of a rope with the mouse or a finger
  function grabbable(node, r, toDoc, onRelease) {
    let off = null;
    node.addEventListener('pointerdown', e => {
      e.preventDefault(); node.setPointerCapture(e.pointerId);
      const l = r.p[r.p.length - 1], d = toDoc(e);
      off = { x: d.x - l.x, y: d.y - l.y }; r.grab = { x: l.x, y: l.y }; node.classList.add('grabbed');
    });
    node.addEventListener('pointermove', e => { if (!off) return; const d = toDoc(e); r.grab = { x: d.x - off.x, y: d.y - off.y }; });
    const up = () => { if (!off) return; off = null; r.grab = null; node.classList.remove('grabbed'); onRelease && onRelease(); };
    node.addEventListener('pointerup', up); node.addEventListener('pointercancel', up);
  }

  /* ---------- Ah Kit on a string (hero) ---------- */
  let puppet = null;
  const AT = { x: .7, y: .3 }, BODY = { x: .42, y: .58 };
  // how far he leans so his weight hangs under the knot on his backpack
  const LEAN = Math.atan2((BODY.x - AT.x) * 518, (BODY.y - AT.y) * 900) * 180 / Math.PI;
  const LINES = ['woooo~', 'woahhh!', 'wheee!', 'weeee~', 'woahhh!', 'woooo~'];
  function buildPuppet() {
    const node = $('#puppet'), hero = $('#top'), say = $('#say');
    const W = innerWidth, H = hero.offsetHeight;
    const ax = narrow() ? W * .8 : W - Math.max(120, W * .09), len = H * (narrow() ? .2 : .27) + (narrow() ? 30 : 70), n = 14;
    const r = rope(n, len / (n - 1), ax, -10, .25);
    const w = node.offsetWidth, h = node.offsetHeight || w * 1.74;
    let lastSay = 0, sayT = 0, lastLine = '';
    const talk = line => {
      if (!line) { do line = LINES[Math.random() * LINES.length | 0]; while (line === lastLine); }
      lastLine = line; say.textContent = line; say.classList.add('on'); lastSay = performance.now();
      clearTimeout(sayT); sayT = setTimeout(() => say.classList.remove('on'), 1000);
    };
    // the thread is tied to the top of his backpack (AT = where, as a share of the picture's width/height)
    puppet = { node, say, rope: r, w, h, anchor: { x: ax, y: -10 }, talk, get lastSay() { return lastSay; } };
    grabbable(node, r, e => { const [x, y] = unTV(e.clientX, e.clientY); return { x: x + scrollX, y: y + scrollY - G.heroTop }; }, () => {});
    node.addEventListener('pointerdown', () => talk());
  }
  function stepPuppet(t) {
    if (!puppet) return;
    const r = puppet.rope, l = r.p[r.p.length - 1];
    if (G.heroTop + G.heroH - scrollY < -200) return;
    if (!r.grab) l.x += Math.sin(t / 1100) * .05; // a little breeze
    const W = innerWidth;
    const hit = stepRope(r, puppet.anchor, { l: puppet.w * .6, r: W - puppet.w * .45, t: narrow() ? 64 : 84, b: G.heroH - puppet.h * .78 });
    const sp = Math.hypot(l.x - l.px, l.y - l.py), now = performance.now();
    if (hit && sp > 6 && now - puppet.lastSay > 450) puppet.talk(Math.random() < .5 ? 'boing!' : 'oof!');
    else if (sp > 11 && now - puppet.lastSay > 1300) puppet.talk();
    const ang = endAngle(r);
    const tilt = ang + LEAN;
    puppet.node.style.transform = `translate(${(l.x - puppet.w * AT.x).toFixed(1)}px,${(l.y - puppet.h * AT.y).toFixed(1)}px) rotate(${tilt.toFixed(2)}deg)`;
    puppet.say.style.rotate = (-tilt).toFixed(1) + 'deg'; // the speech bubble stays upright
  }

  /* ---------- the cord at the end of the thread (contact) ---------- */
  let cord = null;
  function buildCord() {
    const zone = $('#cordZone'), tassel = $('#tassel');
    const n = 13, len = narrow() ? 12 : 15;
    const r = rope(n, len, 0, 0, .35);
    cord = { zone, tassel, rope: r, rest: len * (n - 1), armed: false, anchor: { x: 0, y: 0 } };
    const toDoc = e => ({ x: e.clientX + scrollX, y: e.clientY + scrollY });
    grabbable(tassel, r, toDoc, () => { if (cord.armed) ring(); else $('#cordHint').innerHTML = 'pull the needle ↓<br><small>(it copies my email)</small>'; cord.armed = false; });
    tassel.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const l = r.p[r.p.length - 1]; l.py = l.y - 30; ring(); } });
  }
  function placeCord() {
    if (!cord) return;
    const z = cord.zone.getBoundingClientRect();
    cord.anchor = { x: z.left + scrollX + z.width / 2, y: z.top + scrollY + 2 };
    cord.rope.p.forEach((q, i) => { q.x = q.px = cord.anchor.x; q.y = q.py = cord.anchor.y + i * cord.rope.len; });
  }
  function stepCord() {
    if (!cord) return;
    const r = cord.rope, l = r.p[r.p.length - 1], z = G.cz;
    if (!z || z.b - scrollY < -300 || z.t - scrollY > innerHeight + 300) return;
    // the needle you've been following drops off the end of the thread once it arrives
    if (!TH.done) {
      if (cord.shown) { cord.shown = false; cord.tassel.classList.add('away'); }
      r.grab = null; r.len = r.base;
      r.p.forEach((q, i) => { q.x = q.px = cord.anchor.x; q.y = q.py = cord.anchor.y + i * r.base * .3; });
      cord.tassel.style.transform = `translate(${(cord.anchor.x - z.l).toFixed(1)}px,${(cord.anchor.y - z.t - 13).toFixed(1)}px)`;
      return;
    }
    if (!cord.shown) { cord.shown = true; cord.tassel.classList.remove('away'); }
    if (r.grab) {
      // the cord stretches like elastic while you pull
      const d = Math.hypot(r.grab.x - cord.anchor.x, r.grab.y - cord.anchor.y);
      r.len = Math.max(r.base, Math.min(d, cord.rest * 1.8) / (r.p.length - 1));
      const armed = d > cord.rest + 70;
      if (armed !== cord.armed) { cord.armed = armed; $('#cordHint').innerHTML = armed ? 'now let go!' : 'pull the needle ↓<br><small>(it copies my email)</small>'; }
    } else r.len += (r.base - r.len) * .25;
    stepRope(r, cord.anchor, null);
    // the thread goes through the needle's eye
    cord.tassel.style.transform = `translate(${(l.x - z.l).toFixed(1)}px,${(l.y - z.t - 13).toFixed(1)}px) rotate(${endAngle(r).toFixed(2)}deg)`;
  }
  // copies the email (the old way too, for browsers without the clipboard API) and says so; true if it worked
  async function copyMail() {
    const mail = DATA.owner.email;
    let ok = false;
    try { await navigator.clipboard.writeText(mail); ok = true; } catch (e) {
      try { const t = el('textarea'); t.value = mail; document.body.appendChild(t); t.select(); ok = document.execCommand('copy'); t.remove(); } catch (e2) {}
    }
    toast(ok ? `Email copied: ${mail}` : `My email: ${mail}`);
    return ok;
  }
  async function ring() {
    const ok = await copyMail(), mail = DATA.owner.email;
    $('#cordHint').innerHTML = ok ? 'copied! ♥<br><small>now go paste it somewhere nice</small>' : mail;
    clearTimeout(ring.t); ring.t = setTimeout(() => { $('#cordHint').innerHTML = 'pull the needle ↓<br><small>(it copies my email)</small>'; }, 4000);
    $$('.contact-card').forEach((c, i) => { c.classList.remove('ding'); void c.offsetWidth; setTimeout(() => c.classList.add('ding'), i * 90); });
    tieHeart();
  }
  // the thread ties itself into a heart knot, then lets go again
  function heartPoints() {
    const pts = [], s = 3.3;
    const at = (t, k, dy) => ({ x: k * 16 * Math.pow(Math.sin(t), 3), y: dy - k * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) });
    pts.push({ x: 0, y: -70 }, { x: 0, y: -5 * s - 6 });
    for (let k = 0; k <= 72; k++) pts.push(at(k / 72 * Math.PI * 2, s, 0));
    const si = s * .6, dy = 17 * s - 17 * si;
    for (let k = 0; k <= 60; k++) pts.push(at(k / 60 * Math.PI * 2, si, dy));
    pts.push({ x: 0, y: 17 * s - 4 }, { x: -7, y: 17 * s + 8 }, { x: 4, y: 17 * s + 14 }, { x: 0, y: 17 * s + 22 });
    return 'M' + pts.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' L');
  }
  function tieHeart() {
    const h = $('#heart'), path = $('#heartPath');
    if (!path.getAttribute('d')) path.setAttribute('d', heartPoints());
    const len = Math.ceil(path.getTotalLength());
    path.style.strokeDasharray = len; h.style.setProperty('--len', len);
    h.style.top = (cord.anchor.y - G.cz.t + cord.rest - 4) + 'px';
    h.classList.remove('on'); cord.tassel.classList.remove('tied'); void h.offsetWidth;
    h.classList.add('on'); cord.tassel.classList.add('tied');
    clearTimeout(tieHeart.t); tieHeart.t = setTimeout(() => { h.classList.remove('on'); cord.tassel.classList.remove('tied'); }, 2900);
    const b = h.getBoundingClientRect();
    confetti(b.left + b.width / 2, b.top + b.height * .45);
  }
  /* ---------- "Click me": a red button like ENTER that copies the email, with a wave of dots rippling out behind it ---------- */
  function makanButton() {
    const zone = $('#makanZone'); if (!zone) return;
    const btn = $('#makanBtn', zone), cap = $('.gate-cap', btn), cv = $('canvas', zone), x = cv.getContext('2d');
    const GAP = 22, red = [255, 48, 64];
    let w = 0, h = 0, cx = 0, cy = 0, on = false, burst = -1e9, raf = 0;
    const fit = () => {
      const r = zone.getBoundingClientRect(), b = btn.getBoundingClientRect(), d = Math.min(devicePixelRatio, 2);
      w = r.width; h = r.height; cv.width = w * d; cv.height = h * d; x.setTransform(d, 0, 0, d, 0, 0);
      cx = b.left - r.left + b.width / 2; cy = b.top - r.top + b.height / 2;
      if (reduced || !on) draw(0);
    };
    function draw(t) {
      x.clearRect(0, 0, w, h);
      const since = (t - burst) / 1000, ringR = since * 420; // the click's ripple runs out at 420px a second
      for (let px = GAP / 2; px < w; px += GAP) for (let py = GAP / 2; py < h; py += GAP) {
        const d = Math.hypot(px - cx, py - cy), fade = Math.max(0, 1 - d / (Math.min(w, h) * .62)); // fades out in a circle round the button
        let k = .5 + .5 * Math.sin(d / 26 - t / 380);                       // the slow wave, always rolling outwards
        if (since < 1.6) k += 1.6 * Math.max(0, 1 - Math.abs(d - ringR) / 40) * (1 - since / 1.6); // the click's ring
        const s = 1 + k * 2.2;
        x.fillStyle = `rgba(${red},${(.18 + .62 * Math.min(k, 1.6)) * fade})`;
        x.fillRect(px - s / 2, py - s / 2, s, s);                              // square dots, like pixels
      }
    }
    const loop = t => { draw(t); raf = on && !reduced ? requestAnimationFrame(loop) : 0; };
    new IntersectionObserver(es => { on = es[es.length - 1].isIntersecting; if (on && !raf && !reduced) raf = requestAnimationFrame(loop); }).observe(zone);
    new ResizeObserver(fit).observe(zone); fit();
    // the poppy click: the button squashes and springs back (bubble graphics removed 25 Nov 2026)
    const squash = () => {
      if (reduced) return;
      btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
    };
    btn.onclick = async () => {
      burst = performance.now(); if (reduced || !on) draw(burst);
      squash();
      const ok = await copyMail();
      // steel, except for a moment after copying: it says "Copied" and glows red, then goes back to steel after 1.4 s
      cap.textContent = ok ? 'Copied ♥' : 'Click me'; btn.parentElement.classList.toggle('lit', ok);
      clearTimeout(btn.t); btn.t = setTimeout(() => { cap.textContent = 'Click me'; btn.parentElement.classList.remove('lit'); }, 1400);
    };
  }
  function toast(t) { const n = $('#toast'); n.textContent = t; n.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => n.classList.remove('on'), 2600); }
  function confetti(x, y) {
    if (reduced) return;
    const cols = ['#e8262b', '#ffd23f', '#f3eee4', '#ff2e93'];
    for (let i = 0; i < 18; i++) {
      const c = el('i', 'confetti', '♥'); c.style.color = cols[i % cols.length]; c.style.fontSize = (10 + Math.random() * 14) + 'px'; document.body.appendChild(c);
      const a = -Math.PI / 2 + (Math.random() - .5) * 2.4, v = 4 + Math.random() * 6; let px = x, py = y, vx = Math.cos(a) * v, vy = Math.sin(a) * v - 5, rot = Math.random() * 360, life = 0;
      const tick = () => { life++; vy += .35; vx *= .98; px += vx; py += vy; rot += vx * 4; c.style.transform = `translate(${px}px,${py}px) rotate(${rot}deg)`; c.style.opacity = 1 - life / 70; if (life < 70) requestAnimationFrame(tick); else c.remove(); };
      tick();
    }
  }

  /* =========================================================
     THE RED THREAD · drawn down the page as you scroll, with a needle
     ========================================================= */
  const TH = { total: 0, step: 6, ys: [], ok: false };
  function docRect(n) { const r = n.getBoundingClientRect(); return { l: r.left + scrollX, t: r.top + scrollY, r: r.right + scrollX, b: r.bottom + scrollY, w: r.width, h: r.height }; }
  const loop = (cx, cy, rad, dir = 1) => [{ x: cx - rad * dir, y: cy + rad * .2 }, { x: cx, y: cy + rad }, { x: cx + rad * dir, y: cy }, { x: cx, y: cy - rad }, { x: cx - rad * .7 * dir, y: cy + rad * .1 }, { x: cx + rad * .3 * dir, y: cy + rad * 1.2 }];
  // smooth curve through the points. Each bend is only as big as the shorter gap next to it,
  // so a long stretch can't make the thread fling off somewhere it shouldn't be.
  function spline(pts) {
    const gap = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
    const T = pts.map((p, i) => {
      const a = pts[i - 1] || p, b = pts[i + 1] || p, dx = b.x - a.x, dy = b.y - a.y, m = Math.hypot(dx, dy) || 1;
      const k = Math.min(i ? gap(a, p) : 1e9, i < pts.length - 1 ? gap(p, b) : 1e9);
      return { x: dx / m * k, y: dy / m * k };
    });
    const f = n => n.toFixed(1);
    let d = `M${f(pts[0].x)},${f(pts[0].y)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = pts[i], p2 = pts[i + 1], t1 = T[i], t2 = T[i + 1];
      d += ` C${f(p1.x + t1.x / 3)},${f(p1.y + t1.y / 3)} ${f(p2.x - t2.x / 3)},${f(p2.y - t2.y / 3)} ${f(p2.x)},${f(p2.y)}`;
    }
    return d;
  }
  // a little Chinese knot: the thread dives into the middle, ties four loops and carries on downwards
  // (sideways = comes in from the left and leaves to the right)
  function knot(cx, cy, R, sideways) {
    const pts = [];
    for (let k = 0; k < 64; k++) {
      const t = Math.PI / 4 + (k + .5) / 64 * Math.PI * 2, r = Math.cos(2 * t) * R;
      pts.push({ x: r * Math.cos(t), y: r * Math.sin(t) });
    }
    pts.unshift({ x: 0, y: -R * 1.9 }); pts.push({ x: 0, y: R * 1.9 });
    return pts.map(p => sideways ? { x: cx - p.y, y: cy + p.x } : { x: cx + p.x, y: cy + p.y });
  }
  function buildThread() {
    if (!FX.thread) return;
    const svg = $('#thread'), path = $('#threadPath'), shadow = $('#threadShadow'), main = $('#main');
    const W = document.documentElement.clientWidth;
    const wrap = docRect($('#top .wrap')), pad = parseFloat(getComputedStyle($('#top .wrap')).paddingLeft) || 40;
    const gx = wrap.l + pad * .4, gxr = wrap.r - pad * .4;
    const mainTop = docRect(main).t;
    // the art row stands in for the old headline foot: the thread runs down past it and knots below it
    const title = docRect($('#heroTitle')), foot = docRect($('#heroArt')), follow = foot;
    const mq = docRect($('#marquee')), line = docRect($('#line'));
    const ft = docRect($('#filmTitle')), fp = docRect($('#filmPlayer')), sc = docRect($('#scenes'));
    const at = docRect($('#allTitle')), grid = docRect($('#grid'));
    const about = docRect($('#about')), aw = docRect($('#awards'));
    const ct = docRect($('.contact-title')), cz = docRect($('#cordZone'));
    const tt = docRect($('#awTitle'));
    const dotX = aw.l + 6, dots = $$('#awards li').map(li => aw.t + li.offsetTop + 32);
    // knot size: as big as the gutter beside the text allows
    const room = Math.min(at.l, W - sc.r), small = narrow() || room < 50;
    const kr = clamp((room - 30) / 2.4, 12, 34), kx = at.l - kr * 1.25 - 14, sx = sc.r + kr * 1.25 + 14;
    const P = [
      { x: -60, y: title.t + title.h * .3 },
      { x: gx, y: title.t + title.h * .62 },
      { x: gx + 20, y: foot.b + 26 },
      ...(small ? [{ x: W * .4, y: foot.b + 40 }, { x: W * .7, y: foot.b + 30 }] : (() => {
        // a knot tied in the gap under "Follow the thread", then down behind the red band
        const hy = (follow.b + mq.t) / 2, hr = clamp((mq.t - follow.b - 18) / 2, 8, kr), hx = follow.l + follow.w / 2;
        return [{ x: W * .4, y: hy + 4 }, { x: hx - hr * 4, y: hy }, ...knot(hx, hy, hr, true), { x: hx + hr * 4, y: hy + 4 }, { x: hx + hr * 5.5, y: mq.t + 14 }];
      })()),
      // through the red band to where the line's own rope picks it up (behind the line from here on)
      { x: LINE.xs || W * .62, y: mq.t + mq.h / 2 },
      { x: LINE.xs || W * .62, y: line.t + 30 },
      { x: W * .5, y: line.b - 60 },
      { x: gxr, y: ft.t - 30 },
      { x: gxr, y: fp.t + 40 },
      { x: gxr, y: fp.b - 40 },
      ...(small ? [] : knot(sx, sc.t - kr * 2.2, kr)),
      { x: gxr, y: sc.b + 10 },
      { x: W * .5, y: sc.b + 140 },
      { x: gx, y: at.t - 60 },
      ...(small ? [{ x: gx, y: at.t + at.h * .5 }] : knot(kx, at.t + at.h * .45, kr)),
      { x: gx, y: grid.t + 80 },
      { x: gx, y: grid.b - 40 },
      { x: gx, y: about.t + 80 },
      { x: gx, y: tt.t - 90 },
      // runs straight down the gutter beside "Things that happened" (never over the words), then through every dot
      { x: gx, y: tt.b + 6 },
      { x: dotX, y: tt.b + 26 },
      ...dots.map(y => ({ x: dotX, y })),
      { x: dotX, y: aw.b + 40 },
      { x: gx, y: ct.t - 30 },
      { x: gx, y: ct.b - 20 },
      { x: (gx + cz.l + cz.w / 2) / 2, y: Math.max(ct.b + 24, cz.t - 14) },
      { x: cz.l + cz.w / 2, y: cz.t + 2 }
    ].map(p => ({ x: p.x, y: p.y - mainTop }));
    const d = spline(P);
    svg.setAttribute('width', W); svg.style.height = main.scrollHeight + 'px';
    path.setAttribute('d', d); shadow.setAttribute('d', d);
    TH.total = path.getTotalLength();
    TH.ys = []; let maxY = -1e9;
    for (let L = 0; L <= TH.total; L += TH.step) { const pt = path.getPointAtLength(L); maxY = Math.max(maxY, pt.y + mainTop); TH.ys.push(maxY); }
    path.style.strokeDasharray = shadow.style.strokeDasharray = TH.total + ' ' + TH.total;
    TH.ok = true; TH.last = -1; TH.L = Math.min(TH.L || 0, TH.total); drawThread();
    placeCord();
  }
  function drawThread() {
    if (!TH.ok) return;
    const target = scrollY + innerHeight * .66;
    let lo = 0, hi = TH.ys.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (TH.ys[m] < target) lo = m + 1; else hi = m; }
    // the needle sews towards where it should be instead of jumping there
    const goal = lo >= TH.ys.length - 1 ? TH.total : lo * TH.step, gap = goal - TH.L;
    TH.L = Math.abs(gap) < .5 ? goal : TH.L + gap * .12;
    const L = TH.L;
    TH.done = L >= TH.total - 2;
    if (Math.abs(L - TH.last) < .3) return; TH.last = L;
    const off = TH.total - L;
    $('#threadPath').style.strokeDashoffset = off; $('#threadShadow').style.strokeDashoffset = off;
    const needle = $('#needle'), path = $('#threadPath');
    if (L >= TH.total - 2) { needle.style.opacity = 0; return; }
    const a = path.getPointAtLength(L), b = path.getPointAtLength(Math.min(TH.total, L + 4));
    needle.style.opacity = 1;
    needle.setAttribute('transform', `translate(${a.x.toFixed(1)},${a.y.toFixed(1)}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI).toFixed(1)}) translate(24,0)`);
  }

  /* =========================================================
     MARQUEE (speeds up and reverses with your scrolling)
     ========================================================= */
  const MQ = { x: 0, dir: -1, w: 0 };
  function buildMarquee() {
    const words = ['Illustration', 'Animation', 'Comics', 'Posters', 'Merch', '3D', 'The occasional lion', 'Catan (part-time)'];
    const one = words.map(w => `<span>${w}</span><i>✳</i>`).join('');
    const t = $('#marqueeTrack'); t.innerHTML = one + one + one + one;
    MQ.w = t.scrollWidth / 4;
  }
  function stepMarquee(sv) {
    if (!MQ.w) return;
    if (Math.abs(sv) > .5) MQ.dir = sv > 0 ? -1 : 1;
    MQ.x += MQ.dir * (1 + Math.min(18, Math.abs(sv) * .35));
    if (MQ.x < -MQ.w) MQ.x += MQ.w; if (MQ.x > 0) MQ.x -= MQ.w;
    $('#marqueeTrack').style.transform = `translate3d(${MQ.x.toFixed(1)}px,0,0)`;
  }

  /* =========================================================
     THE LINE · the work is threaded on the red thread and sways as it slides by
     ========================================================= */
  const LINE = { cur: 0, maxX: 0, pegs: [], last: 0, lastScroll: 0, speed: 1.5 };
  const HEIGHTS = [38, 44, 36, 34, 42, 37, 35];
  // [project, picture, extras]: video = a clip that plays in the frame, book = a 3D book (front/back/spine pictures), h = height in vh
  const LINE_PICKS = [['thread', 'tol-still-08', { video: ['reel-tol-1', 'reel-tol-2', 'reel-tol-3', 'reel-tol-4', 'reel-tol-5', 'reel-tol-6'], r: 1280 / 588 }], ['illustration-1', 'lion-dance', { h: 34 }], ['illustration-3', 'morning-market'],
    ['publications-2', 'hm-front', { book: ['hm-front', 'hm-back', 'hm-spine'], h: 42 }], ['illustration-8', 'samzilla'], ['illustration-3', 'lookback']];
  function hang(f, onClick) {
    const g = { n: f, a: 0, av: 0, held: false, cx: 0, w: 0, top: 0, h: 0 };
    LINE.pegs.push(g);
    let down = null;
    f.addEventListener('pointerdown', e => {
      if (e.button || !fine) return;
      e.preventDefault(); f.setPointerCapture(e.pointerId);
      down = { x: e.clientX, y: e.clientY, a: g.a, moved: false };
    });
    f.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - down.x;
      const dy = e.clientY - down.y;
      if (!down.moved && Math.abs(dx) + Math.abs(dy) < 6) return;
      down.moved = true; g.held = true; f.classList.add('held');
      // pull down to tip it towards you, push up to tip it away
      const want = clamp(down.a + dy * .2, -32, 32);
      g.av = want - g.a; g.a = want;
    });
    const up = () => { if (!down) return; const moved = down.moved; down = null; g.held = false; f.classList.remove('held'); if (!moved) onClick(); };
    f.addEventListener('pointerup', up);
    f.addEventListener('pointercancel', () => { down = null; g.held = false; f.classList.remove('held'); });
    if (!fine) f.addEventListener('click', onClick);
    return g;
  }
  function buildLine() {
    const track = $('#lineTrack');
    const picks = LINE_PICKS.map(([id, img, x]) => ({ p: byId(id), img, x: x || {} })).filter(x => x.p);
    picks.forEach(({ p, img, x }, i) => {
      const f = el('figure', 'peg' + (x.book ? ' is-book' : ''));
      f.dataset.id = p.id; f.style.setProperty('--c', p.color); f.style.setProperty('--h0', (x.h || HEIGHTS[i % HEIGHTS.length]) + 'vh'); f.style.setProperty('--r', x.r || RATIO[img] || 1.4);
      f.dataset.cursor = 'Look';
      const cap = `<figcaption class="peg-cap"><b>${esc(p.name)}</b><small>${esc(p.cat)}${p.year ? ' · ' + esc(p.year) : ''}</small></figcaption>`;
      const media = x.video
        ? `<video muted playsinline preload="metadata" poster="${imgSrc(img)}" aria-label="${esc(p.name)}"></video>`
        : `<img src="${imgSrc(img)}" alt="${esc(p.name)}" loading="eager" draggable="false">`;
      // frames: the thread pokes through two holes along the top; the book dangles from a string and turns
      f.innerHTML = `<span class="peg-num">${String(i + 1).padStart(2, '0')}</span>` + (x.book
        ? `<i class="book-string"></i><div class="book-wrap"><div class="book-turn"><div class="book">
            <img class="bk-front" src="${imgSrc(x.book[0])}" alt="${esc(p.name)}, front cover" draggable="false">
            <img class="bk-back" src="${imgSrc(x.book[1])}" alt="" draggable="false"><img class="bk-spine" src="${imgSrc(x.book[2])}" alt="" draggable="false"><i class="bk-pages"></i></div></div></div>${cap}`
        : `<div class="peg-frame"><i class="peg-stitch"></i>${media}${cap}</div>`);
      hang(f, () => openProject(p.id));
      track.appendChild(f);
      $$('img', f).forEach(m => m.addEventListener('load', sizeSoon));
      const v = $('video', f);
      if (v) {
        // the film's scenes play one after another, only while on screen
        let k = 0, on = false;
        const load = () => { const n = x.video[k]; v.innerHTML = `<source src="${site('media/videos/' + n + '.mp4')}" type="video/mp4"><source src="${site('media/videos/' + n + '.webm')}" type="video/webm">`; v.load(); if (on) v.play().catch(() => {}); };
        v.addEventListener('ended', () => { k = (k + 1) % x.video.length; load(); });
        load();
        if (!reduced) new IntersectionObserver(es => es.forEach(e => { on = e.isIntersecting; on ? v.play().catch(() => {}) : v.pause(); })).observe(v);
      }
    });
    const end = el('a', 'line-end', 'See every single thing →'); end.href = '#all'; end.dataset.cursor = 'Go';
    track.appendChild(end);
    track.addEventListener('scroll', () => { const v = track.scrollLeft - LINE.lastScroll; LINE.lastScroll = track.scrollLeft; LINE.pegs.forEach(g => { g.av += clamp(-v * .015, -.8, .8); }); }, { passive: true });
    // brush past the prints with the mouse and they swing
    const stage = $('#lineStage');
    stage.addEventListener('pointermove', e => {
      if (!fine || narrow() || Math.abs(e.movementX) < 2) return;
      const sy = e.clientY - stage.getBoundingClientRect().top, tx = e.clientX - LINE.cur;
      LINE.pegs.forEach(g => {
        if (g.held || Math.abs(tx - g.cx) > g.w / 2 + 10 || sy < g.top || sy > g.top + g.h) return;
        g.av -= clamp(Math.abs(e.movementX) * .025, 0, 1);
      });
    }, { passive: true });
  }
  function sizeLine() {
    if (!FX.line) return;
    const sec = $('#line'), track = $('#lineTrack'), stage = $('#lineStage');
    const ropeY = narrow() ? 40 : stage.clientHeight * .14;
    $$('.peg', track).forEach(f => { f.style.marginTop = (narrow() ? 40 : ropeY) + 'px'; });
    LINE.pegs.forEach(g => { g.cx = g.n.offsetLeft + g.n.offsetWidth / 2; g.w = g.n.offsetWidth; g.top = g.n.offsetTop; g.h = g.n.offsetHeight; });
    // the rope: dips between pieces, runs straight through each one (15px below its top, where the holes are)
    const pts = $$('.peg', track).map(f => [f.offsetLeft, f.offsetLeft + f.offsetWidth]);
    const tw = track.scrollWidth, y0 = (narrow() ? 40 + 40 : ropeY) + 15;
    // on big screens the rope carries on from the main thread: it starts at the top edge, just before the first piece
    LINE.xs = narrow() || !pts.length ? 0 : clamp(pts[0][0] - 70, innerWidth * .3, innerWidth - 60);
    let d = LINE.xs ? `M${LINE.xs},0 Q${LINE.xs},${y0} ${pts[0][0]},${y0}` : `M0,${y0 - 30}`, px = LINE.xs ? pts[0][0] : 0;
    pts.forEach(([a, b], i) => { if (i || !LINE.xs) { const sag = Math.min(70, (a - px) * .1); d += ` Q${((px + a) / 2).toFixed(1)},${(y0 + sag).toFixed(1)} ${a.toFixed(1)},${y0}`; } d += ` L${b.toFixed(1)},${y0}`; px = b; });
    d += ` Q${((px + tw) / 2).toFixed(1)},${y0 + 50} ${tw},${y0 - 20}`;
    const svg = $('#lineRope'); svg.setAttribute('width', tw); svg.style.width = tw + 'px'; svg.style.height = track.clientHeight + 'px';
    const rope = $('#lineRopePath'); rope.setAttribute('d', d);
    // how far along the rope you are at each x, so it can be sewn in as you scroll
    LINE.rt = rope.getTotalLength(); LINE.rx = [];
    for (let L = 0, mx = -1e9; L <= LINE.rt; L += 6) { mx = Math.max(mx, rope.getPointAtLength(L).x); LINE.rx.push(mx); }
    rope.style.strokeDasharray = LINE.rt + ' ' + LINE.rt; LINE.rl = Math.min(LINE.rl || 0, LINE.rt); LINE.rlast = -1;
    if (narrow()) { sec.style.height = ''; LINE.maxX = 0; track.style.transform = ''; rope.style.strokeDashoffset = 0; $('#lineNeedle').style.opacity = 0; return; }
    LINE.maxX = Math.max(0, tw - innerWidth);
    // the line slides a bit faster than you scroll, so the section stays short
    sec.style.height = (LINE.maxX / LINE.speed + innerHeight) + 'px';
  }
  let sizeT = 0;
  function sizeSoon() { clearTimeout(sizeT); sizeT = setTimeout(() => { sizeLine(); layoutGrid(); measure(); buildThread(); measureLetters(); }, 250); }
  function stepLine() {
    if (!FX.line) return;
    if (!narrow() && LINE.maxX) {
      const p = clamp((scrollY - G.lineTop) / (LINE.maxX / LINE.speed), 0, 1);
      const target = -p * LINE.maxX;
      LINE.cur += (target - LINE.cur) * .14;
      if (Math.abs(target - LINE.cur) < .1) LINE.cur = target;
      if (LINE.cur !== LINE.shown) { LINE.shown = LINE.cur; $('#lineTrack').style.transform = `translate3d(${LINE.cur.toFixed(1)}px,0,0)`; $('#lineBar').style.transform = `scaleX(${p.toFixed(4)})`; }
      const vel = LINE.cur - LINE.last; LINE.last = LINE.cur;
      LINE.pegs.forEach(g => { g.av += clamp(vel, -30, 30) * .004; });
    }
    if (!narrow() && LINE.rx && LINE.rx.length) sewRope();
    if (scrollY + innerHeight < G.lineTop - 50 || scrollY > G.lineTop + G.lineH + 50) return;
    LINE.pegs.forEach(g => {
      if (!g.held) { g.av += -g.a * .04; g.av *= .9; g.a += g.av; g.a = clamp(g.a, -32, 32); }
      if (Math.abs(g.a) < .01 && Math.abs(g.av) < .01) { if (g.a) { g.a = g.av = 0; g.n.style.transform = ''; } return; }
      // the thread runs through the top, so pieces swing towards you and away (not side to side)
      g.n.style.transform = `perspective(1100px) rotateX(${g.a.toFixed(2)}deg)`;
    });
  }
  // the rope is sewn in as you go: from where the thread comes down, then along with the slide
  function sewRope() {
    const F = Math.max(LINE.xs + 200, innerWidth * .72), enter = G.lineTop - innerHeight * .66;
    const front = scrollY < G.lineTop ? LINE.xs + (F - LINE.xs) * clamp((scrollY - enter) / (innerHeight * .66), 0, 1) : F - LINE.cur;
    let lo = 0, hi = LINE.rx.length - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (LINE.rx[m] < front) lo = m + 1; else hi = m; }
    const goal = scrollY < enter ? 0 : lo >= LINE.rx.length - 1 ? LINE.rt : lo * 6, gap = goal - LINE.rl;
    LINE.rl = Math.abs(gap) < .5 ? goal : LINE.rl + gap * .12;
    if (Math.abs(LINE.rl - LINE.rlast) < .3) return; LINE.rlast = LINE.rl;
    const rope = $('#lineRopePath'), nd = $('#lineNeedle'), L = LINE.rl;
    rope.style.strokeDashoffset = LINE.rt - L;
    if (L < 1 || L >= LINE.rt - 2) { nd.style.opacity = 0; return; }
    const a = rope.getPointAtLength(L), b = rope.getPointAtLength(Math.min(LINE.rt, L + 4));
    nd.style.opacity = 1;
    nd.setAttribute('transform', `translate(${a.x.toFixed(1)},${a.y.toFixed(1)}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI).toFixed(1)}) translate(24,0)`);
  }

  /* =========================================================
     FILM
     ========================================================= */
  // Chinny's A Thread of Life title logo (made in Photoshop: diploma show/booth/title vintage.psd)
  const TOL_LOGO = `<img class="tol-logo" src="${imgSrc('tol-logo')}" alt="A Thread of Life 爱情阿杂 (Ai Qing A Za)">`;
  // the logo tilts toward the mouse only while the mouse is on it, and settles back flat when it leaves
  document.addEventListener('pointermove', e => {
    const l = e.target.closest && e.target.closest('.tol-logo'); if (!l) return;
    const r = l.getBoundingClientRect();
    l.style.setProperty('--tx', ((e.clientX - r.left) / r.width - .5).toFixed(3)); l.style.setProperty('--ty', ((e.clientY - r.top) / r.height - .5).toFixed(3));
  });
  document.addEventListener('pointerout', e => { const l = e.target; if (l.classList && l.classList.contains('tol-logo')) { l.style.removeProperty('--tx'); l.style.removeProperty('--ty'); } });
  function buildFilm() {
    const thread = DATA.sections.find(s => s.id === 'thread'), first = thread.projects[0];
    // the logo goes above the title; the title's words stay (hidden) for screen readers and so saved edits still find them
    if (!EDITING) {
      $('#filmTitle').insertAdjacentHTML('beforebegin', TOL_LOGO.replace('class="tol-logo"', 'class="tol-logo film-logo"')); $('#filmTitle').classList.add('sr-only');
      // the neon sign flickers on when you scroll to it (css: section 8)
      const lg = $('.film-logo'), io2 = new IntersectionObserver(es => { if (es[0].isIntersecting) { lg.classList.add('lit'); io2.disconnect(); } }, { threshold: .4 });
      io2.observe(lg);
    }
    $('#filmText').innerHTML = said('film:p:1', thread.intro + ' ' + (first.text || ''));    const vid = first.media.find(m => m.type === 'video');
    const v = $('#filmVideo'), box = $('#filmPlayer');
    const files = (vid ? vid.sources : []).map(s => site(typeof s === 'string' ? s : s.file));
    $('#filmPlay').onclick = () => {
      let k = 0;
      const next = () => {
        if (k >= files.length) { box.classList.remove('playing'); $('#filmPlay b').textContent = 'Film file not found'; return; }
        v.src = files[k++]; v.load(); v.play().catch(() => {});
      };
      v.onerror = next; v.controls = true; box.classList.add('playing'); next();
    };
    const stills = ['tol-still-01', 'tol-still-02', 'tol-still-09', 'tol-still-05', 'tol-still-10', 'tol-still-11'];
    const sc = $('#scenes');
    stills.forEach((s, i) => {
      const d = el('div', 'scene');
      d.innerHTML = `<video muted loop playsinline preload="auto"><source src="${site('media/videos/reel-tol-' + (i + 1) + '.mp4')}" type="video/mp4"><source src="${site('media/videos/reel-tol-' + (i + 1) + '.webm')}" type="video/webm"></video><span>Scene ${String(i + 1).padStart(2, '0')}</span>`;
      d.dataset.cursor = fine ? 'Play' : '';
      const v2 = d.querySelector('video');
      if (fine) { d.onmouseenter = () => v2.play().catch(() => {}); d.onmouseleave = () => v2.pause(); }
      sc.appendChild(d);
    });
    if (!fine) {
      const io = new IntersectionObserver(es => es.forEach(e => { const v2 = e.target.querySelector('video'); e.isIntersecting ? v2.play().catch(() => {}) : v2.pause(); }), { threshold: .6 });
      $$('.scene').forEach(n => io.observe(n));
    }
  }

  /* =========================================================
     ARCHIVE GRID (nothing cropped; shortest column gets the next card)
     ========================================================= */
  let filter = 'All';
  const cards = [];
  function buildGrid() {
    const cats = ['All', ...new Set(projects.map(p => p.cat))];
    const chips = $('#chips');
    cats.forEach(c => {
      const n = c === 'All' ? projects.length : projects.filter(p => p.cat === c).length;
      const b = el('button', 'chip' + (c === 'All' ? ' on' : ''), `${esc(c)}<sup>${n}</sup>`);
      b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', c === 'All');
      b.onclick = () => {
        filter = c; $$('.chip').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
        cards.forEach(k => { const show = filter === 'All' || k.dataset.cat === filter; k.classList.toggle('out', !show); k.classList.remove('in'); });
        layoutGrid(); requestAnimationFrame(() => cards.forEach((k, i) => { if (!k.classList.contains('out')) setTimeout(() => k.classList.add('in'), 30 + (i % 9) * 40); }));
        sizeSoon();
      };
      chips.appendChild(b);
    });
    projects.forEach(p => {
      const c = el('button', 'gcard');
      c.dataset.cat = p.cat; c.dataset.id = p.id; c.style.setProperty('--c', p.color); c.style.setProperty('--cm', mix(p.color));
      c.dataset.cursor = 'Look';
      const tv = FX.tv && !FX.shop && p.cat === 'Animation', book = FX.books && p.cat === 'Comics';
      const faces = book && (BOOK_FACES[p.id] || ((LINE_PICKS.find(x => x[0] === p.id) || [])[2] || {}).book); // front, back and spine pictures, when they exist
      const badge = p.badge ? `<span class="gcard-badge">▶ ${esc(p.badge)}</span>` : '';
      if (tv) c.classList.add('is-tv'); if (book) c.classList.add('is-bk');
      c.innerHTML = (FX.shop ? `<span class="gcard-no">No.${String(p.index + 1).padStart(3, '0')}</span>` : '') + (tv ? `<div class="gcard-media tvset"><div class="tv-screen">${pic(p.thumb, p.name)}${badge}</div><div class="tv-side" aria-hidden="true"><i></i><i></i><b></b></div></div>`
        : book ? `<div class="gcard-media bkstage"><div class="bk3d">${pic(faces ? imgSrc(faces[0]) : p.thumb, p.name, 'bk-f')}${faces ? pic(imgSrc(faces[1]), '', 'bk-b') + (faces[2] ? pic(imgSrc(faces[2]), '', 'bk-s') : '<i class="bk-s"></i>') : '<i class="bk-b"></i><i class="bk-s"></i>'}<i class="bk-p"></i></div></div>`
        : `<div class="gcard-media${p.cutout ? ' cut' : ''}">${pic(p.thumb, p.name)}${badge}</div>`) + `
        <div class="gcard-meta"><h3>${esc(p.name)}</h3><span><i></i>${esc(p.cat)}${p.year ? ' · ' + esc(p.year) : ''}</span></div>`;
      c.onclick = () => { if (c.dragged) { c.dragged = false; return; } openProject(p.id); }; // dragging a book round doesn't open it
      if (book && faces && !reduced) spinBook(c);
      if (FX.shop && MODELS[p.name] && !EDITING) c.dataset.model = MODELS[p.name]; // js/model3d.js swaps the picture for the real 3D model
      if (FX.shop && BANNERS[p.name]) { c.classList.add('gcard-wide'); const im = c.querySelector('.gcard-media img'); im.src = thumbSrc(BANNERS[p.name]); im.removeAttribute('srcset'); }
      c.ratio = 1.3;
      const img = c.querySelector('img');
      const got = () => { if (img.naturalWidth) { c.ratio = img.naturalWidth / img.naturalHeight; c.style.setProperty('--r', c.ratio.toFixed(3)); sizeSoon(); } };
      if (img.complete) got(); else img.addEventListener('load', got);
      cards.push(c);
    });
    layoutGrid();
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    cards.forEach(c => io.observe(c));
  }
  // works shown as a real 3D model in the item shop (the file is made in Blender and exported as .glb). To add one: 'Name of the work': 'media/3d/file.glb'
  const MODELS = { 'Soda Crackers': 'media/3d/soda-crackers.glb', 'Arcade Machine': 'media/3d/arcade-machine.glb' };
  // works shown whole, as a banner across a full row of the item shop: 'Name of the work': 'picture' (in the main site's media/thumb)
  // a small picture beside a work's title on its page: 'id': 'picture' (Hands to Heart's full lion head, 23 Nov 2026)
  const HERO_ART = {}; // Hands to Heart's lion head removed 25 Nov 2026
  const BANNERS = { 'Hands to Heart: The Dance of the Lion': 'lion-dance' };
  /* ---------- Achievements: the list, biggest first. kind: 'trophy' (an award) or 'frame' (an exhibition). ---------- */
  const ACHIEVEMENTS = [
    { kind: 'trophy', title: 'The Best Student Award 2026', where: ['Malaysian Institute of Art'] },
    { kind: 'trophy', title: 'Master of Everything Award', where: ['Illuspeak@GMBB'] },
    { kind: 'trophy', title: 'Special Mention Award', where: ['Illuspeak@GMBB'] },
    { kind: 'trophy', title: 'Merit Award', where: ['The 2nd TUT National Original Comic Contest, Taiwan', '第二屆「南應盃」全國原創漫畫大賽佳作獎'] },
    { kind: 'frame', title: 'Artwork exhibition', sub: 'Hands to Heart: The Dance of the Lion', where: ['BTS – Behind the Sketches', 'By Us For Real@GMBB', 'MIAVILLE@The Linc KL', 'HEY, IT’S US!@MIACC'] },
  ];
  function buildAchievements() {
    const sec = el('section', 'ach', `<div class="wrap"><h2 class="h2" id="achTitle">Achievements</h2><ol class="ach-list"></ol></div>`);
    sec.id = 'achievements'; sec.dataset.theme = 'dark';
    $('#all').after(sec);
    const list = $('.ach-list', sec);
    ACHIEVEMENTS.forEach((a, i) => {
      const li = el('li', 'ach-item', `<i class="ach-ico ${a.kind}" aria-hidden="true"></i><div><h3>${esc(a.title)}${a.sub ? `<small>${esc(a.sub)}</small>` : ''}</h3><div class="ach-where">${a.where.map(w => `<span>${esc(w)}</span>`).join('')}</div></div>`);
      li.style.setProperty('--d', (i * .12) + 's');
      list.appendChild(li);
    });
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.ach-item', sec).forEach(li => io.observe(li));
  }
  // the comic books' covers: [front, back, spine] (pictures in the main site's media/img; spine null = plain coloured spine).
  // Every book with covers here floats and turns, and can be dragged round. Haunted Mansion's are with its thread print in LINE_PICKS.
  const BOOK_FACES = { 'publications-1': ['smile-cover', 'smile-cover', null], 'publications-3': ['nlp-cover', 'nlp-back', null] };
  const colCount = () => innerWidth > 1100 ? 3 : 2;
  /* ---------- the floating comic books: they hover and slowly turn; the cover turns to you on hover; drag to look round ---------- */
  const spinners = [];
  function spinBook(c) {
    const stage = $('.bkstage', c), s = { b: $('.bk3d', c), a: Math.random() * 360, x: 0, hover: false, drag: null, on: false, t0: Math.random() * 9 };
    s.b.classList.add('spin');
    c.addEventListener('pointerenter', () => { s.hover = true; }); c.addEventListener('pointerleave', () => { s.hover = false; });
    stage.addEventListener('pointerdown', e => { s.drag = { x: e.clientX, y: e.clientY, a: s.a, moved: false }; stage.setPointerCapture(e.pointerId); });
    stage.addEventListener('pointermove', e => {
      const d = s.drag; if (!d) return;
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) d.moved = true;
      s.a = d.a + dx * .8; s.x = clamp(-dy * .3, -20, 20);
    });
    const up = () => { if (s.drag && s.drag.moved) c.dragged = true; s.drag = null; };
    stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
    new IntersectionObserver(es => { s.on = es[es.length - 1].isIntersecting; }).observe(c);
    spinners.push(s);
  }
  let bookT = 0;
  function stepBooks(t) {
    const f = bookT ? Math.min(50, t - bookT) / 16.7 : 1; bookT = t; // frames' worth of time, so fast screens don't spin faster
    spinners.forEach(s => {
      if (!s.on) return;
      if (!s.drag) {
        if (s.hover) s.a += (Math.round(s.a / 360) * 360 - s.a) * (1 - Math.pow(.92, f)); // turn to the nearest front
        else s.a += .3 * f;                                                                // about 20 seconds a turn
        s.x *= Math.pow(.9, f);
      }
      s.b.style.transform = `translateY(${(Math.sin(t / 900 + s.t0) * 7).toFixed(1)}px) rotateX(${s.x.toFixed(1)}deg) rotateY(${s.a.toFixed(1)}deg)`;
    });
  }
  function layoutGrid() {
    const box = $('#grid'), n = colCount();
    if (FX.shop) {
      // the item shop: one even grid, works in their order. The comic books sit together on one row of their own (the shelf),
      // starting at the row where the first book would have been.
      if (!box.classList.contains('shop')) { box.innerHTML = ''; box.classList.add('shop'); }
      cards.forEach(c => { if (c.classList.contains('out')) c.remove(); });
      // Banners (BANNERS) get a full row too. Each full row goes in after the row where its work would have been.
      const shown = cards.filter(c => !c.classList.contains('out')), books = FX.books ? shown.filter(c => c.classList.contains('is-bk')) : [];
      let shelf = $('.shop-shelf', box);
      const blocks = shown.filter(c => c.classList.contains('gcard-wide')).map(c => ({ node: c, first: c }));
      if (books.length) {
        if (!shelf) shelf = el('div', 'shop-shelf');
        shelf.style.setProperty('--n', books.length);
        books.forEach((b, i) => { if (shelf.children[i] !== b) shelf.appendChild(b); });
        blocks.push({ node: shelf, first: books[0] });
      } else if (shelf) shelf.remove();
      const rest = shown.filter(c => !books.includes(c) && !c.classList.contains('gcard-wide'));
      blocks.forEach(b => { b.at = Math.ceil(rest.filter(c => shown.indexOf(c) < shown.indexOf(b.first)).length / n) * n; });
      blocks.sort((a, b) => a.at - b.at || shown.indexOf(a.first) - shown.indexOf(b.first));
      const want = []; let k = 0;
      rest.forEach((c, i) => { while (k < blocks.length && blocks[k].at <= i) want.push(blocks[k++].node); want.push(c); });
      while (k < blocks.length) want.push(blocks[k++].node);
      // only move what is out of place, so the floating things don't restart
      want.forEach((c, i) => { if (box.children[i] !== c) box.insertBefore(c, box.children[i] || null); });
      while (box.children.length > want.length) box.lastElementChild.remove();
      return;
    }
    // comics sit together on one shelf row, at the place of the first one. The works before and after it flow in columns as usual.
    cards.forEach(c => { if (c.classList.contains('out')) c.remove(); });
    const shown = cards.filter(c => !c.classList.contains('out')), books = FX.books ? shown.filter(c => c.classList.contains('is-bk')) : [];
    const rest = shown.filter(c => !books.includes(c)), at = books.length ? shown.indexOf(books[0]) : rest.length;
    let segs = $$('.gseg', box), row = $('.bkrow', box);
    if (segs.length !== 2 || $$('.gcol', segs[0]).length !== n) {
      box.innerHTML = '';
      segs = [0, 1].map(() => { const g = el('div', 'gseg'); for (let k = 0; k < n; k++) g.appendChild(el('div', 'gcol')); return g; });
      row = el('div', 'bkrow'); box.append(segs[0], row, segs[1]);
    }
    const w = $$('.gcol', segs[0])[0].clientWidth || 360;
    const tall = c => (c.querySelector('.cut') ? Math.min(420, (w - 52) / c.ratio) + 52 : w / c.ratio) + 100;
    const shortest = h => { let k = 0; for (let j = 1; j < n; j++) if (h[j] < h[k] - 1) k = j; return k; };
    const above = rest.slice(0, at), below = rest.slice(at), h0 = new Array(n).fill(0);
    above.forEach(c => { h0[shortest(h0)] += tall(c); });
    // fill the short columns above the shelf with the next works, so the shelf doesn't sit under a hole
    while (above.length && below.length) {
      const k = shortest(h0), t = tall(below[0]);
      if (h0[k] + t > Math.max(...h0) + 80) break;
      h0[k] += t; above.push(below.shift());
    }
    [above, below].forEach((list, i) => {
      const cols = $$('.gcol', segs[i]), h = new Array(n).fill(0);
      list.forEach(c => {
        const k = shortest(h); h[k] += tall(c);
        if (c.parentNode !== cols[k] || c.nextSibling) cols[k].appendChild(c);
      });
    });
    books.forEach((c, i) => { if (c.parentNode !== row || row.children[i] !== c) row.appendChild(c); });
    row.classList.toggle('hidden', !books.length);
  }

  /* =========================================================
     ABOUT + CONTACT
     ========================================================= */
  function buildAbout() {
    const A = DATA.sections.find(s => s.about), o = DATA.owner;
    if (EI['about:photo']) $('#aboutImg').src = site(EI['about:photo']);
    $('#aboutCap').textContent = plain('about:figcaption:1', 'Me and a new friend');
    $('#aboutIntro').innerHTML = said('about:p:1', A.intro);
    $('#aboutQuote').innerHTML = said('about:blockquote:1', A.quote);
    A.tools.forEach(t => $('#tools').appendChild(el('li', '', esc(t))));
    A.achievements.forEach(([a, b], i) => $('#awards').appendChild(el('li', '', `<b>${said('ach:' + i + ':a', a)}</b><span>${said('ach:' + i + ':b', b)}</span>`)));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('#awards li').forEach(li => io.observe(li));
    const sio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; sio.unobserve(e.target); $$('[data-count]', e.target).forEach(countUp); }), { threshold: .4 });
    sio.observe($('#stats'));
    const mail = $('#mailLink'); mail.href = 'mailto:' + o.email; $('b', mail).textContent = o.email;
    const ig = $('#igLink'); ig.href = 'https://www.instagram.com/' + o.instagram + '/'; $('b', ig).textContent = '@' + o.instagram;
  }
  function countUp(b) {
    const end = +b.dataset.count, t0 = performance.now();
    const tick = now => { const k = Math.min(1, (now - t0) / 1200); b.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }

  /* =========================================================
     PROJECT PAGE + LIGHTBOX
     ========================================================= */
  let current = -1, lbList = [], lbIndex = 0;
  // width ÷ height of every picture in media/img, so galleries lay out before the pictures arrive
  const RATIO = {"ag-1":2.263,"ag-10":1.732,"ag-11":1.775,"ag-12":1.802,"ag-13":1.778,"ag-2":2.721,"ag-3":1.787,"ag-4":1.782,"ag-5":1.779,"ag-6":1.797,"ag-7":1.773,"ag-8":1.833,"ag-9":1.817,"ag-board":1.733,"ag-chars-1":1.413,"ag-chars-2":1.413,"bazaar-1":1.603,"bazaar-2":2.36,"bazaar-3":2.023,"bazaar-4":0.75,"closeup-1":0.69,"closeup-2":2.028,"closeup-3":0.633,"cover":1.423,"fan-demonslayer":0.658,"fan-mori":1.0,"fight-fright":0.708,"fruity-buddies":0.864,"h2h-gold":1.41,"h2h-lion":0.523,"h2h-lion-full":0.645,"h2h-honorpad":2.0,"h2h-piece-1":1.416,"h2h-piece-2":0.681,"h2h-piece-3":0.637,"h2h-red":0.896,"h2h-spread-1":1.417,"h2h-spread-2":1.417,"hm-1":1.137,"hm-2":1.417,"hm-3":1.162,"hm-4":0.964,"hm-book":1.045,"hm-cover":0.708,"hm-front":0.705,"lion-dance":2.832,"honor-1":1.98,"honor-2":1.998,"honor-3":2.0,"honor-4":1.998,"hotel-1":1.824,"hotel-2":1.778,"hotel-3":0.937,"hotel-4":1.309,"hotel-5":1.235,"ideal-breakfast":1.435,"jp-1":1.5,"jp-2":1.5,"jp-3":1.5,"jp-30days":0.421,"jp-artbattle":1.499,"jp-group":1.49,"jp-manhole":0.654,"lion-banner-2":2.832,"lion-banner":2.832,"lookback":1.432,"mascot-2":0.517,"mascot-3":0.57,"mascot-standee":0.576,"mascot-wave":0.585,"me-photo":1.25,"monin-board":1.416,"monin-booth":1.414,"monin-chibi":0.927,"monin-girl":0.584,"monin-keychains":1.427,"monin-logo":0.998,"monin-page":1.413,"monin-photo":1.78,"monin-tees":1.508,"monin-tote-art":1.0,"morning-market":1.414,"nlp-1":0.711,"nlp-2":0.703,"nlp-3":0.716,"nlp-4":0.728,"nlp-5":0.692,"nlp-6":0.735,"nlp-7":0.705,"nlp-cover":0.705,"nlp3d-1":0.849,"nlp3d-2":1.778,"nlp3d-3":1.778,"nlp3d-4":1.778,"nlp3d-5":1.778,"pixel-snow":1.0,"pixel-vi":1.0,"popcorn-pack-2":1.787,"popcorn-pack":1.489,"popcorn-page":1.413,"posters-page":1.413,"prog-1":1.778,"prog-2":1.778,"prog-3":1.778,"prog-4":1.778,"prog-5":1.778,"redpacket-page":1.413,"reel-manga":1.778,"reel-meowzilla":1.778,"reel-spaceboyfriend":1.333,"reel-watch":1.778,"rhino-phone":0.554,"room-1":1.776,"room-2":1.776,"room-3":1.601,"samzilla-d1":0.943,"samzilla-d2":0.946,"samzilla-d3":0.943,"samzilla":1.432,"sang-kelembai":1.421,"self-expression":0.707,"shoyuemi":0.835,"sketch-1":0.703,"sketch-2":0.683,"sketch-3":0.718,"sketch-4":0.864,"sketch-5":0.583,"sketch-6":0.757,"sketch-7":0.651,"sketch-8":0.8,"sketch-9":0.8,"smile-cover":0.707,"smile-p1":0.707,"smile-p2":0.708,"smile-p3":0.707,"smile-p4":2.549,"soda-1":1.778,"soda-2":1.778,"texture-study":0.831,"tol-fyp-1":1.334,"tol-fyp-2":1.333,"tol-fyp-3":1.342,"tol-fyp-4":1.926,"tol-mascot":0.576,"tol-merch":1.413,"tol-miaville-1":1.302,"tol-miaville-2":1.5,"tol-miaville-3":1.333,"tol-miaville-4":0.871,"tol-miaville-poster":0.707,"tol-poster":0.708,"tol-shop":2.123,"tol-still-01":2.162,"tol-still-02":1.777,"tol-still-03":1.874,"tol-still-04":1.873,"tol-still-05":1.977,"tol-still-06":2.128,"tol-still-07":2.165,"tol-still-08":1.94,"tol-still-09":1.777,"tol-still-10":1.777,"tol-still-11":2.206,"turf-war":1.411,"vi-texture":0.909};
  function videoPlayer(m) {
    const f = el('figure', 'g-item g-video' + (m.tall ? ' tall' : '')); // tall = a phone-shaped (portrait) video
    const v = el('video'); v.controls = !m.muted; v.playsInline = true; v.preload = 'metadata';
    if (m.muted) { v.muted = v.defaultMuted = v.autoplay = v.loop = true; } // a silent loop, like a moving picture
    if (m.poster) v.poster = imgSrc(m.poster);
    const cap = el('figcaption', '', '');
    f.append(v, cap);
    let i = 0;
    const next = () => {
      if (i >= m.sources.length) { v.replaceWith(el('div', 'vid-missing', 'Video coming soon')); cap.textContent = ''; return; }
      const s = m.sources[i++]; v.src = site(typeof s === 'string' ? s : s.file); cap.textContent = (typeof s === 'string' ? '' : s.label) || ''; v.load();
    };
    v.addEventListener('error', next); next();
    return f;
  }
  // every picture keeps its own shape; a row of pictures always shares one height (nothing is cropped)
  function galleryItem(m, title, p) {
    const type = m.type || 'img';
    if (type === 'video') return videoPlayer(m);
    if (type === 'model') { // js/model3d.js puts the 3D model in here to turn round and zoom; the picture shows until it loads (or if 3D can't run)
      const f = el('figure', 'g-item full g-model', `<div class="g-pic"><img src="${imgSrc(m.src)}" alt="${esc(title)}"></div><figcaption class="g-model-hint">Drag to turn it · scroll to zoom</figcaption>`);
      f.dataset.viewer = m.model; f.dataset.cursor = 'Drag';
      return f;
    }
    if (type === 'tiktok') { // a preview card (cover picture from TikTok, saved in media/img) that opens the video on TikTok.
      // Also used for Instagram: href = the post, badge = its label, r = the cover's shape (default 9:16)
      // Not TikTok's player: it said "Player authentication failed" on Chinny's PC, and an iframe hides the pixel cursor.
      const f = el('a', 'g-item g-tiktok'); f.href = m.href || `https://www.tiktok.com/@kfcmalaysia/video/${m.id}`; f.target = '_blank'; f.rel = 'noopener';
      if (m.r) f.style.setProperty('--r', m.r);
      f.dataset.cursor = 'Watch';
      f.innerHTML = `<div class="g-pic"><img loading="lazy" src="${imgSrc(m.cover)}" alt="${esc(m.caption)}"><span class="tt-play" aria-hidden="true"></span><span class="tt-badge">${esc(m.badge || 'TikTok')} ↗</span></div><figcaption>${esc(m.caption)}</figcaption>`;
      return f;
    }
    const full = type === 'gif' ? site(m.src) : imgSrc(m.src), shown = type === 'gif' || m.wide ? full : thumbSrc(m.src);
    const known = RATIO[m.src], r = m.cutout ? 1 : clamp(known || 1.4, .62, 3.2);
    const f = el('figure', 'g-item' + (m.cutout ? ' cut' : '') + (m.wide ? ' full' : '') + (m.bare ? ' bare' : '') + (m.left ? ' left' : '')); // bare = cut-out picture, no box behind it; left = big, on the left of its row
    f.style.setProperty('--r', r.toFixed(3));
    f.innerHTML = `${type === 'gif' ? '<span class="g-badge">GIF</span>' : ''}<div class="g-pic"><img loading="lazy" src="${shown}" alt="${esc(m.caption || title)}"></div>${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ''}`;
    if (!known && !m.cutout) { const img = $('img', f); img.onload = () => { if (img.naturalWidth) f.style.setProperty('--r', clamp(img.naturalWidth / img.naturalHeight, .62, 3.2).toFixed(3)); }; }
    const i = lbList.length; lbList.push({ src: full, cap: m.caption ? `${title} · ${m.caption}` : title });
    f.onclick = () => openLB(i); f.dataset.cursor = 'Zoom';
    if (m.drum) { f.classList.add('g-drum'); f.prepend(drumFX()); }
    return f;
  }
  // Drumothy's spotlight (18 Nov 2026), shown on hover (css section 14): a stage light switches on above him, slow light rays
  // in KFC red, gold and white turn behind him, a pool of light on the floor, a warm glow round him and a few twinkles
  function drumFX() {
    const sparks = [[22, 18], [78, 14], [14, 62], [86, 58], [30, 86], [70, 84]].map(([x, y], i) => `<b class="drum-spark" style="left:${x}%;top:${y}%;--d:${i * .35}s"></b>`).join('');
    return el('div', 'drum-fx', `<i class="drum-rays"></i><i class="drum-halo"></i><i class="drum-cone"></i><i class="drum-floor"></i>${sparks}`);
  }
  function openProject(id, fromHash) {
    const p = byId(id); if (!p) return;
    current = p.index; lbList = [];
    const P = $('#project'), body = $('#pBody');
    P.style.setProperty('--c', p.color); P.style.setProperty('--i', p.ink); P.style.setProperty('--cm', mix(p.color));
    $('#pCount').textContent = `${String(p.index + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')} · ${p.cat}`;
    body.innerHTML = '';
    const name = p.zh ? p.name.split('|')[0].trim() : p.name;
    const tags = (p.tag || '').split(' · ').filter(Boolean);
    const hero = el('header', 'p-hero');
    hero.innerHTML = `<div class="wrap">
      <div class="p-hero-top"><span>${esc(p.cat)}${p.year ? ' · ' + esc(p.year) : ''}</span><span>${String(p.index + 1).padStart(2, '0')}</span></div>
      <h1>${p.id === 'thread' ? 'A Thread of Life | 爱情阿杂' : esc(name) + (p.zh ? `<span class="zh">${esc(p.zh)}</span>` : '')}</h1>${HERO_ART[p.id] ? `<img class="p-hero-art" src="${imgSrc(HERO_ART[p.id])}" alt="">` : ''}${p.sub ? `<p class="p-sub">${esc(p.sub)}</p>` : ''}
      <div class="p-hero-grid"><p class="p-intro">${esc(p.intro || '')}</p>${tags.length ? `<ul class="p-tags">${tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}</div></div>`;
    body.appendChild(hero);
    const multi = p.parts.filter(pt => pt.title).length > 1;
    p.parts.forEach((part, k) => {
      const s = el('section', 'p-part wrap' + (multi ? ' multi' : '') + (part.small ? ' small' : '') + (part.big ? ' big' : ''));
      if (multi) s.innerHTML = `<aside class="p-aside"><span class="p-num">${String(k + 1).padStart(2, '0')}</span><h2>${esc(part.title)}</h2>${part.meta ? `<p class="meta">${esc(part.meta)}</p>` : ''}${part.text ? `<p class="text">${esc(part.text)}</p>` : ''}${part.link ? `<p class="text"><a class="p-link" href="${esc(part.link.href)}" target="_blank" rel="noopener">${esc(part.link.label)} ↗</a></p>` : ''}</aside>`;
      const g = s.appendChild(el('div', 'g-rows')), side = $('.p-aside', s);
      (part.media || []).forEach(m => (m.aside && side ? side : g).appendChild(galleryItem(m, part.title || name, p))); // aside: under the words on the left
      g.appendChild(el('i', 'g-fill'));
      if (part.download) s.appendChild(el('p', 'p-download', `<a class="btn" href="${site(part.download.file)}" download>${esc(part.download.label)} ↓</a>`)); // the whole book, under its pictures
      body.appendChild(s);
    });
    const nx = projects[(p.index + 1) % projects.length];
    const nb = el('button', 'p-next', `<div class="wrap p-next-in"><div><small>Next project →</small><b>${esc(nx.zh ? nx.name.split('|')[0].trim() : nx.name)}</b><span>${esc(nx.cat)}${nx.year ? ' · ' + esc(nx.year) : ''}</span></div><img src="${nx.thumb}" alt=""></div>`);
    nb.style.setProperty('--nc', nx.color);
    nb.onclick = () => openProject(nx.id); nb.dataset.cursor = 'Next';
    body.appendChild(nb);
    P.classList.remove('hidden', 'closing'); document.body.classList.add('locked');
    $('#pScroll').scrollTop = 0; // after showing it: while hidden the browser ignores this and keeps the last place
    if (!fromHash) history.replaceState(null, '', '#p/' + p.id);
  }
  function closeProject() {
    const P = $('#project'); if (P.classList.contains('hidden')) return;
    P.querySelectorAll('video').forEach(v => v.pause());
    P.classList.add('closing');
    setTimeout(() => { P.classList.add('hidden'); P.classList.remove('closing'); $('#pBody').innerHTML = ''; document.body.classList.remove('locked'); }, 340);
    history.replaceState(null, '', location.pathname + location.search);
  }
  const step = d => openProject(projects[(current + d + projects.length) % projects.length].id);
  function openLB(i) { lbIndex = i; $('#lightbox').classList.remove('hidden'); showLB(); }
  function showLB() { const it = lbList[lbIndex]; $('#lbStage').innerHTML = `<img src="${it.src}" alt="">`; $('#lbCap').textContent = `${it.cap}  ·  ${lbIndex + 1} / ${lbList.length}`; }
  const lbGo = d => { lbIndex = (lbIndex + d + lbList.length) % lbList.length; showLB(); };
  const closeLB = () => $('#lightbox').classList.add('hidden');
  function wireOverlays() {
    $('#pClose').onclick = closeProject; $('#pPrev').onclick = () => step(-1); $('#pNext').onclick = () => step(1);
    $('#lbClose').onclick = closeLB; $('#lbPrev').onclick = () => lbGo(-1); $('#lbNext').onclick = () => lbGo(1);
    $('#lightbox').addEventListener('click', e => { if (e.target.id === 'lightbox' || e.target.tagName === 'FIGURE') closeLB(); });
    let tx0 = null;
    $('#lightbox').addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; }, { passive: true });
    $('#lightbox').addEventListener('touchend', e => { if (tx0 == null) return; const dx = e.changedTouches[0].clientX - tx0; if (Math.abs(dx) > 50) lbGo(dx < 0 ? 1 : -1); tx0 = null; });
    addEventListener('keydown', e => {
      if (!$('#lightbox').classList.contains('hidden')) { if (e.key === 'Escape') closeLB(); if (e.key === 'ArrowRight') lbGo(1); if (e.key === 'ArrowLeft') lbGo(-1); return; }
      if (!$('#project').classList.contains('hidden')) { if (e.key === 'Escape') closeProject(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); }
    });
    $$('[data-open]').forEach(b => b.onclick = () => openProject(b.dataset.open));
  }

  /* =========================================================
     CURSOR, THEME, NAV
     ========================================================= */
  function buildCursor(pix) {
    const cur = $('#cursor');
    if (!fine) { cur.remove(); return; }
    document.documentElement.classList.add('has-cursor');
    dot = cur;
    // pix: the pixel arrow on the TV glass, a hand over anything you can click. Otherwise a red dot that grows a little.
    if (pix) { cur.classList.add('pix'); cur.innerHTML = '<i class="pix-arrow"></i><i class="pix-hand"></i>'; }
    document.addEventListener('mouseover', e => cur.classList.toggle('big', !!e.target.closest('[data-cursor],a,button,[role="button"],.peg,.gate,.stk')));
    document.addEventListener('mouseleave', () => cur.classList.add('hide'));
    document.addEventListener('mouseenter', () => cur.classList.remove('hide'));
  }
  function watchTheme() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) document.body.dataset.theme = e.target.dataset.theme; }), { rootMargin: '-50% 0px -50% 0px' });
    $$('main > section[data-theme]').forEach(s => io.observe(s));
  }

  /* =========================================================
     ONE ANIMATION LOOP FOR EVERYTHING
     ========================================================= */
  const canvas = $('#ropes'), ctx = canvas.getContext('2d');
  let dpr = 1;
  function sizeCanvas() { const k = dpr = Math.min(2, devicePixelRatio || 1); canvas.width = innerWidth * k; canvas.height = innerHeight * k; ctx.setTransform(k, 0, 0, k, 0, 0); }
  let lastY = scrollY, lastT = 0, acc = 0, drew = false;
  const nav = $('#nav');
  function frame(t) {
    stepTV(); stepBooks(t);
    const sv = scrollY - lastY; lastY = scrollY;
    const dt = lastT ? Math.min(50, t - lastT) : 16.7; lastT = t; acc += dt;
    let steps = 0;
    while (acc >= 16.6 && steps < 3) { acc -= 16.6; steps++; stepPuppet(t); stepCord(); stepLetters(); }
    if (steps === 3) acc = 0;
    stepLine(); stepMarquee(sv); drawThread();
    // nav hides while scrolling down
    if (Math.abs(sv) > 2) nav.classList.toggle('away', sv > 0 && scrollY > 300);
    // the strings (Ah Kit's and the needle's) only get drawn while they're on screen
    const heroOn = puppet && scrollY < G.heroTop + G.heroH + 100;
    const cordOn = cord && cord.shown && G.cz && scrollY + innerHeight > G.cz.t - 300 && scrollY < G.cz.b + 300;
    if (heroOn || cordOn || drew) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, innerWidth, innerHeight); drew = false;
      ctx.setTransform(dpr * TVM.s, 0, 0, dpr * TVM.s, dpr * TVM.a, dpr * TVM.b);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#e8262b'; ctx.lineWidth = 2.4;
      if (heroOn) { const r = puppet.rope, oy = scrollY - G.heroTop; if (r.p[r.p.length - 1].y - oy > -20) { drawRope(ctx, r, scrollX, oy); drew = true; } }
      if (cordOn) { drawRope(ctx, cord.rope, scrollX, scrollY); drew = true; }
    }
    requestAnimationFrame(frame);
  }

  /* ---------- the chrome name (FX.chromeName) ---------- */
  // the logo is Chinny's logo made in Blender (portoflio/blender/chinny-logo.blend). js/logo3d.js swaps this still picture for the live 3D one
  const LOGO = 'media/logo/chinny-chrome-still.webp';
  // 'PORTFOLIO' in Chinny's Averox font, traced to shapes (the font is personal-use only, so its file is not put online)
  const NEON = 'M90 0V-290H290C427 -290 528 -359 528 -495C528 -632 427 -700 290 -700H50V0ZM290 -330H90V-660H290C408 -660 488 -607 488 -495C488 -383 408 -330 290 -330ZM1126 0C1331 0 1436 -167 1436 -350C1436 -533 1331 -700 1126 -700C921 -700 816 -533 816 -350C816 -166 921 0 1126 0ZM1126 -40C957 -40 856 -172 856 -350C856 -528 957 -660 1126 -660C1295 -660 1396 -528 1396 -350C1396 -172 1295 -40 1126 -40ZM2231 1V-39C2166 -39 2146 -112 2113 -201C2094 -253 2075 -295 2026 -333C2111 -344 2174 -399 2174 -514C2174 -649 2089 -699 1956 -700H1716V0H1756V-330H1913C2124 -330 2053 1 2231 1ZM1961 -370H1756V-660H1956C2072 -659 2134 -622 2134 -514C2134 -407 2074 -370 1961 -370ZM2808 0V-660H3088V-700H2488V-660H2768V0ZM3408 0V-330H3824V-370H3408V-660H3874V-700H3368V0ZM4464 0C4669 0 4774 -167 4774 -350C4774 -533 4669 -700 4464 -700C4259 -700 4154 -533 4154 -350C4154 -166 4259 0 4464 0ZM4464 -40C4295 -40 4194 -172 4194 -350C4194 -528 4295 -660 4464 -660C4633 -660 4734 -528 4734 -350C4734 -172 4633 -40 4464 -40ZM5564 0V-40H5094V-700H5054V0ZM5884 0V-700H5844V0ZM6474 0C6679 0 6784 -167 6784 -350C6784 -533 6679 -700 6474 -700C6269 -700 6164 -533 6164 -350C6164 -166 6269 0 6474 0ZM6474 -40C6305 -40 6204 -172 6204 -350C6204 -528 6305 -660 6474 -660C6643 -660 6744 -528 6744 -350C6744 -172 6643 -40 6474 -40Z';
  const chrome = cls => `<div class="chrome ${cls || ''}" role="img" aria-label="Chinny"><img class="chrome-logo" src="${LOGO}" alt="" draggable="false"><svg class="chrome-neon" viewBox="30 -720 6774 741" aria-hidden="true"><path d="${NEON}"/></svg></div>`;
  // the letters fly in again on the page after ENTER (only the live 3D logo can)
  const replayLogo = () => { const i = $('.chrome-hero .chrome-logo'); if (i && i.replay) i.replay(); };

  /* ---------- the bulging glass (FX.crt) ----------
     A see-through layer over the whole window bends what is behind it, like the curved glass of an old picture tube:
     nothing moves in the middle, and towards the edges and corners the page is squeezed and bowed (an SVG displacement map).
     Works in Chrome and Edge; other browsers just show the page straight. BEND = how strong (0.03 = the corners pull in 3% of the window). */
  const BEND = .03;
  function crtCurve() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'crt-defs'); svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<filter id="crtBend" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feImage x="0" y="0" preserveAspectRatio="none" result="m"/><feDisplacementMap in="SourceGraphic" in2="m" xChannelSelector="R" yChannelSelector="G"/></filter>';
    const lens = el('div', 'crt-curve'); lens.setAttribute('aria-hidden', 'true');
    document.body.append(svg, lens);
    const map = svg.querySelector('feImage'), shift = svg.querySelector('feDisplacementMap');
    const draw = () => {
      const W = innerWidth, H = innerHeight, w = 160, h = Math.max(2, Math.round(w * H / W));
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const x = c.getContext('2d'), d = x.createImageData(w, h), S = Math.max(W, H) * BEND * 4.2; // S: room for the biggest shift both ways
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
        const u = i / (w - 1) * 2 - 1, v = j / (h - 1) * 2 - 1, r2 = u * u + v * v, k = (j * w + i) * 4;
        d.data[k] = 128 + 255 * u * W / 2 * BEND * r2 / S;     // red = how far right to look; at the edges it looks further out,
        d.data[k + 1] = 128 + 255 * v * H / 2 * BEND * r2 / S; // green = how far down        so the page there is squeezed and bowed
        d.data[k + 2] = 0; d.data[k + 3] = 255;
      }
      x.putImageData(d, 0, 0);
      map.setAttribute('href', c.toDataURL()); map.setAttribute('width', W); map.setAttribute('height', H);
      shift.setAttribute('scale', S.toFixed(1));
    };
    draw(); addEventListener('resize', draw);
  }

  /* ---------- the TV's scroll bar (FX.crt) ----------
     Instead of the browser's grey scroll bar, an on-screen-display bar like an old TV's volume: a column of blocks that
     light up as you go down the page, and how far down you are. Blurry, with a red/blue colour fringe, and it sits
     under the curved glass so it bends with the screen. Click or drag on it to move. Hidden on phones and while the TV is shown. */
  const OSD_BLOCKS = 24;
  function scrollOSD() {
    const bar = el('div', 'tv-scroll', `<span class="tv-scroll-up">▲</span><span class="tv-scroll-track">${'<i></i>'.repeat(OSD_BLOCKS)}</span><span class="tv-scroll-down">▼</span><b class="tv-scroll-pc">0%</b>`);
    bar.setAttribute('aria-hidden', 'true'); // the page still scrolls normally with the keyboard and mouse wheel
    document.body.appendChild(bar);
    const track = $('.tv-scroll-track', bar), blocks = $$('i', track), pc = $('.tv-scroll-pc', bar);
    let raf = 0;
    const show = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - innerHeight, k = max > 0 ? clamp(scrollY / max, 0, 1) : 0, lit = Math.round(k * OSD_BLOCKS);
      blocks.forEach((b, i) => b.classList.toggle('on', i < lit));
      pc.textContent = Math.round(k * 100) + '%';
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(show); }, { passive: true });
    addEventListener('resize', show); show();
    const go = e => { const r = track.getBoundingClientRect(); scrollTo(0, clamp((e.clientY - r.top) / r.height, 0, 1) * (document.documentElement.scrollHeight - innerHeight)); };
    track.addEventListener('pointerdown', e => { track.setPointerCapture(e.pointerId); go(e); track.onpointermove = go; });
    track.addEventListener('pointerup', () => { track.onpointermove = null; });
    $('.tv-scroll-up', bar).onclick = () => scrollBy({ top: -innerHeight * .8, behavior: 'smooth' });
    $('.tv-scroll-down', bar).onclick = () => scrollBy({ top: innerHeight * .8, behavior: 'smooth' });
  }

  /* ---------- the TV (FX.tvRoom) ----------
     The page sits inside the screen of an old TV (media/tv/tv.webp: Chinny's cut-out TV with the screen glass removed).
     Scrolling down the first screen-height zooms into the TV until its screen fills the window; after that the page scrolls as usual.
     While zoomed out the screen has the RGB dots and glow of a real CRT (.crt-glow, .crt-dots); they fade away as you zoom in. */
  // where the screen is in tv.webp (1745 x 1218), as shares of its width / height
  const SCR = { w: 1745, h: 1218, l: 283 / 1745, t: 124 / 1218, r: 1459 / 1745, b: 1026 / 1218, rad: 74 / 1745 };
  let tv = null;
  /* The stickers on the TV. TO ADD ONE: put its picture in media/tv (see-through around the shape; its white parts become foil)
     and copy a line below.
       at   = where it sits on the TV picture (share of the TV's width / height) and its tilt
       foil = 'gold' (mirror gold) or 'holo' (rainbow)
       name = what a screen reader calls it
       go   = what a click does. Leave it out and the sticker is just for looking at.
     They don't peel off (Chinny, 25 Nov 2026). */
  const playFilm = () => {
    let y = -40; for (let n = $('#film'); n; n = n.offsetParent) y += n.offsetTop;
    scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    if (!$('#filmPlayer').classList.contains('playing')) $('#filmPlay').click();
  };
  const STICKERS = [
    // all sit wholly on the flat speaker grilles (a sticker across the raised screen edge looked like it was floating)
    { pic: 'sticker-thread.webp', foil: 'gold', at: 'left:89.4%;top:21%;width:9.8%;--r:8deg', name: 'A Thread of Life, animated short: play it', go: playFilm },
    { pic: 'sticker-logo.webp', foil: 'holo', at: 'left:1%;top:67.5%;width:9.6%;--r:7deg' },
    { pic: 'sticker-astronaut.webp', foil: 'holo', at: 'left:89.6%;top:58%;width:9.6%;--r:-7deg' },
  ];
  const stickerFace = pic => `<span class="stk-face"><span class="stk-in" style="-webkit-mask-image:url(media/tv/${pic});mask-image:url(media/tv/${pic})"><img src="media/tv/${pic}" alt=""></span></span>`;
  function sticker(s) {
    const b = el(s.go ? 'button' : 'span', `stk stk-${s.foil}${s.go ? '' : ' stk-still'}`, stickerFace(s.pic));
    b.style.cssText = s.at;
    if (!s.go) { b.setAttribute('aria-hidden', 'true'); return b; }
    b.type = 'button'; b.setAttribute('aria-label', s.name);
    b.onclick = e => {
      if (tv && tv.node.classList.contains('gating')) return; // on the enter screen a click on the TV just enters
      e.stopPropagation(); s.go();
    };
    return b;
  }
  // the small gold one on the film player: just decoration
  const GOLD = `<span class="stk stk-gold stk-deco" aria-hidden="true">${stickerFace('sticker-thread.webp')}</span>`;
  // the foil on the stickers catches the light as the mouse moves
  addEventListener('pointermove', e => {
    const r = document.documentElement.style;
    r.setProperty('--mx', (e.clientX / innerWidth).toFixed(3)); r.setProperty('--my', (e.clientY / innerHeight).toFixed(3));
  }, { passive: true });
  function buildTV() {
    if (!FX.tvRoom || EDITING) return;
    const node = el('div', 'tvrig', `<div class="tv-scr" aria-hidden="true"></div><img class="tv-frame" src="media/tv/tv.webp" alt="" draggable="false"><i class="tv-glass" aria-hidden="true"></i><i class="tv-led" aria-hidden="true"></i>`
      + `<span class="tv-osd" aria-hidden="true">CH 03</span>`);
    node.append(...STICKERS.map(sticker));
    // these live outside the TV so they can tint the page under them (a blend can't reach out of the TV's layer)
    const back = el('div', 'tv-back'), glow = el('div', 'crt-glow'), dots = el('div', 'crt-dots');
    [back, glow, dots].forEach(n => n.setAttribute('aria-hidden', 'true'));
    // under the TV: tells you scrolling zooms in. It fades as you start scrolling; a click does the scroll for you
    const hint = el('button', 'tv-hint', 'Scroll down to see more<i aria-hidden="true">▼</i>');
    hint.type = 'button'; hint.onclick = () => scrollTo({ top: tv.Z, behavior: reduced ? 'auto' : 'smooth' });
    document.body.append(back, node, glow, dots, hint);
    tv = { node, back, hint, fx: [glow, dots], main: $('#main'), last: -1 };
    sizeTV();
  }
  function sizeTV() {
    if (!tv) return;
    const W = document.documentElement.clientWidth, H = innerHeight;
    const tw = Math.min(W * .98, H * 1.1 * SCR.w / SCR.h), th = tw * SCR.h / SCR.w, left = (W - tw) / 2, top = (H - th) / 2 + H * .01; // close to the camera
    const sw = (SCR.r - SCR.l) * tw, sh = (SCR.b - SCR.t) * th, ox = (SCR.l + SCR.r) / 2 * tw, oy = (SCR.t + SCR.b) / 2 * th;
    tv.zoom = fine && W >= 900 && W / H > 1.15 && !reduced; // phones, tablets (touch) and tall windows: no TV around the page (25 Nov 2026: it glitched on iPads)
    tv.G = Math.max(W / sw, H / sh) * 1.04;          // zoom until the screen is a bit bigger than the window
    tv.k = Math.min(sw / W, sh / H);                // how small the page is inside the screen
    Object.assign(tv, { W, H, sw, sh, rad: SCR.rad * tw, c0: { x: left + ox, y: top + oy }, Z: Math.round(H * .9) });
    Object.assign(tv.node.style, { width: tw + 'px', height: th + 'px', left: left + 'px', top: top + 'px', transformOrigin: `${ox}px ${oy}px` });
    tv.fx.forEach(n => Object.assign(n.style, { width: sw + 'px', height: sh + 'px', left: left + SCR.l * tw + 'px', top: top + SCR.t * th + 'px', borderRadius: tv.rad + 'px' }));
    document.documentElement.style.setProperty('--tvz', tv.Z + 'px');
    document.body.classList.toggle('tv-on', tv.zoom);
    tv.last = -1; stepTV();
  }
  function stepTV() {
    if (!tv) return;
    const y = tv.zoom ? scrollY : tv.Z;
    if (y === tv.last) return; tv.last = y;
    const q = clamp(y / tv.Z, 0, 1), e = q * q * (3 - 2 * q), g = 1 + (tv.G - 1) * e;
    const cx = tv.c0.x + (tv.W / 2 - tv.c0.x) * e, cy = tv.c0.y + (tv.H / 2 - tv.c0.y) * e, inTV = tv.zoom && e < 1;
    const move = `translate(${cx - tv.c0.x}px,${cy - tv.c0.y}px) scale(${g})`, dots = inTV ? 1 - clamp((e - .15) / .45, 0, 1) : 0;
    tv.node.style.transform = move;
    tv.node.classList.toggle('gone', !inTV && !tv.node.classList.contains('gating'));
    tv.fx.forEach(n => { n.style.transform = move; n.style.opacity = dots; n.style.visibility = dots ? '' : 'hidden'; });
    tv.back.style.opacity = inTV ? 1 - e : 0;
    const h = inTV ? clamp(1 - e / .12, 0, 1) : 0;
    tv.hint.style.opacity = h; tv.hint.style.visibility = h ? '' : 'hidden';
    document.body.classList.toggle('tv-in', inTV);
    if (!inTV) { TVM.a = TVM.b = 0; TVM.s = 1; tv.main.style.transform = tv.main.style.clipPath = ''; return; }
    // the page is as wide as the screen, its top at the top of the screen (or the window, once the screen is bigger)
    const s = Math.min(1, tv.k * g), top = Math.max(0, cy - tv.sh * g / 2), off = tv.main.offsetTop - scrollY;
    TVM.s = s; TVM.a = cx - s * tv.W / 2; TVM.b = top - s * off;
    tv.main.style.transform = `translate(${TVM.a}px,${top - off}px) scale(${s})`;
    // only the part of the page inside the screen shows (and can be clicked)
    const hx = (cx - tv.sw * g / 2 - TVM.a) / s, hy = (cy - tv.sh * g / 2 - top) / s;
    tv.main.style.clipPath = `xywh(${hx.toFixed(1)}px ${hy.toFixed(1)}px ${(tv.sw * g / s).toFixed(1)}px ${(tv.sh * g / s).toFixed(1)}px round ${(tv.rad * g / s).toFixed(1)}px)`;
  }

  /* ---------- the old PC: enter screen and pop-up windows ---------- */
  function gate(next) {
    let seen = false; try { seen = sessionStorage.getItem('chinny-gate') === '1'; } catch (e) {}
    if (!FX.gate || EDITING || seen || location.hash.length > 1) { next(); return; }
    // big screens: the enter screen is the TV, showing static. Small screens: the static fills the whole window.
    const inTV = tv && tv.zoom, staticVid = '<video class="tv-static" src="media/tv/tv-static.mp4" poster="media/tv/tv-static.jpg" muted loop autoplay playsinline></video>';
    const g = el('div', inTV ? 'gate tv-gate' : 'gate', `${inTV ? '' : staticVid}<div class="gate-in"><p class="gate-top"><i>●</i> REC · PORTFOLIO TAPE</p>${FX.chromeName ? chrome('chrome-gate') : '<p class="gate-name">CHINNY</p>'}<p class="gate-sub">ILLUSTRATOR · ANIMATOR · DESIGNER</p><button class="gate-btn"><span class="gate-cap">ENTER</span></button><p class="gate-hint">CLICK TO CONTINUE</p></div>`);
    const old = $('#intro'); if (old) old.style.visibility = 'hidden'; // the older cream opening stays out of the way
    if (inTV) { $('.tv-scr', tv.node).innerHTML = staticVid; tv.node.classList.add('gating'); tv.node.appendChild(g); }
    else document.body.appendChild(g);
    try { history.scrollRestoration = 'manual'; } catch (e) {} // the enter screen always starts at the top of the page
    scrollTo(0, 0); document.body.classList.add('locked');
    let done = false;
    const go = () => {
      if (done) return; done = true;
      try { sessionStorage.setItem('chinny-gate', '1'); } catch (e) {}
      const gl = g.querySelector('.chrome-logo'); if (gl && gl.powerOff) gl.powerOff(); // the enter screen's logo switches off like an old TV
      const press = reduced ? 0 : 200; // hold the button down for a moment so the press is felt
      g.querySelector('button').classList.add('down');
      if (inTV) {
        // ENTER changes the channel: the static flashes and clears, and the site is on the TV
        setTimeout(() => tv.node.classList.add('tuning'), press);
        setTimeout(() => {
          g.remove(); $('.tv-scr', tv.node).innerHTML = ''; tv.node.classList.remove('gating', 'tuning'); tv.node.classList.add('ch');
          document.body.classList.remove('locked'); next(); replayLogo();
          setTimeout(() => tv.node.classList.remove('ch'), 2600);
        }, press + 650);
        return;
      }
      setTimeout(() => { g.classList.add('off'); document.body.classList.remove('locked'); }, press);
      setTimeout(() => g.remove(), reduced ? 0 : press + 620); setTimeout(() => { next(); replayLogo(); }, reduced ? 0 : press + 380);
    };
    (inTV ? tv.node : g).addEventListener('click', go); g.querySelector('button').focus({ preventScroll: true });
  }
  // the words on the pop-ups: [window title, headline, line before the work's name]
  const ADS = [['CONGRATULATIONS.EXE', 'You are visitor no. 1,000,000!', 'Your prize: a look at'], ['NEW_WORK.EXE', 'Hot and fresh!', 'Just out of the oven:'], ['NOT_A_VIRUS.EXE', 'Free art*', '*free to look at:']];
  function popups() {
    let seen = false; try { seen = sessionStorage.getItem('chinny-ads') === '1'; sessionStorage.setItem('chinny-ads', '1'); } catch (e) {}
    if (!FX.popups || EDITING || seen) return;
    // wide screens: a pile of three in the bottom-right corner. Small screens: one window over the top section.
    const side = innerWidth >= 1100, bar = side ? document.body.appendChild(el('div', 'ads')) : $('#top');
    const gone = () => { if (side && !$('.win', bar)) bar.remove(); };
    for (let i = 0; i < (side ? 3 : 1); i++) {
      const p = projects[i]; if (!p) break;
      setTimeout(() => {
        const w = el('div', 'win', `<div class="win-bar"><span>${ADS[i][0]}</span><button class="win-x" aria-label="Close this pop-up">×</button></div><button class="win-body">${pic(p.thumb, '')}<b>${ADS[i][1]}</b><span>${ADS[i][2]} ${esc(p.name)}</span><em>OPEN ▶</em></button>`);
        if (side) w.style.setProperty('--i', i); else { w.style.left = '8%'; w.style.top = '56%'; }
        w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Pop-up: ' + p.name);
        w.querySelector('.win-x').onclick = () => { w.remove(); gone(); };
        w.querySelector('.win-body').onclick = () => openProject(p.id);
        drag(w, w.querySelector('.win-bar'));
        bar.appendChild(w);
      }, 30000 + i * 700); // they wait 30 seconds, so people see the work first
    }
  }
  // drag a window by its title bar. One from the corner pile lifts out of the pile first.
  function drag(node, handle) {
    let o = null;
    handle.addEventListener('pointerdown', e => {
      if (e.target.closest('button')) return;
      if (node.parentNode.classList.contains('ads') && node.style.position !== 'fixed') {
        const r = node.getBoundingClientRect();
        Object.assign(node.style, { position: 'fixed', right: 'auto', bottom: 'auto', width: r.width + 'px', left: r.left + 'px', top: r.top + 'px' });
      }
      o = { x: e.clientX - node.offsetLeft, y: e.clientY - node.offsetTop }; handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', e => { if (o) { node.style.left = (e.clientX - o.x) + 'px'; node.style.top = (e.clientY - o.y) + 'px'; } });
    const up = () => { o = null; }; handle.addEventListener('pointerup', up); handle.addEventListener('pointercancel', up);
  }

  /* ---------- go ---------- */
  // the switches above turn into classes on the page; css/revamp.css does the hiding and the CRT look
  [['skin-crt', FX.crt], ['no-line', !FX.line], ['no-thread', !FX.thread], ['no-marquee', !FX.marquee], ['no-puppet', !FX.puppet], ['no-about', !FX.about], ['no-headline', !FX.headline], ['lofi-on', LOFI]].forEach(([c, on]) => document.body.classList.toggle(c, on));
  if (!FX.line) { $$('a[href="#line"]').forEach(a => a.setAttribute('href', '#all')); $('.follow').firstChild.textContent = 'See the work '; }
  // the picture tube: a black frame with bowed edges around the whole page
  if (FX.crt) document.body.insertAdjacentHTML('beforeend', '<svg class="tube" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path fill-rule="evenodd" d="M0 0H100V100H0Z M7 3.2Q50 -.8 93 3.2Q97.8 3.5 98 8.5Q101.2 50 98 91.5Q97.8 96.5 93 96.8Q50 100.8 7 96.8Q2.2 96.5 2 91.5Q-1.2 50 2 8.5Q2.2 3.5 7 3.2Z"/></svg>');
  if (FX.crt && !EDITING && fine) { crtCurve(); scrollOSD(); } // touch screens skip the bent glass: too heavy while scrolling on tablets
  if (FX.crt) {
    // the tape counter on the TV at the top of the page
    $('#heroBg').insertAdjacentHTML('beforeend', '<span class="osd osd-tl" aria-hidden="true">PLAY ▶</span><span class="osd osd-tr" id="osdTime" aria-hidden="true">SP 0:00:00</span>');
    const t0 = Date.now(), two = n => String(n).padStart(2, '0');
    setInterval(() => { const s = (Date.now() - t0) / 1000 | 0; $('#osdTime').textContent = `SP ${s / 3600 | 0}:${two(s / 60 % 60 | 0)}:${two(s % 60)}`; }, 1000);
  }
  if (FX.chromeName) $('.hero-eyebrow').insertAdjacentHTML('afterend', chrome('chrome-hero'));
  if (FX.tvRoom) $('#filmPlayer').insertAdjacentHTML('beforeend', GOLD); // in edit mode too, so its size can be changed
  buildTV();
  splitTitle(); heroArt(); heroReel(); if (FX.marquee) buildMarquee(); if (FX.line) buildLine(); buildFilm(); buildGrid(); buildAchievements(); buildAbout(); makanButton();
  if (FX.puppet) buildPuppet(); if (FX.thread) buildCord(); wireOverlays(); watchTheme(); sizeCanvas();
  buildCursor(FX.oldCursor);
  sizeLine(); measure(); buildThread(); measureLetters();
  gate(() => { const old = $('#intro'); if (old) old.style.visibility = ''; intro(); popups(); });
  requestAnimationFrame(frame);
  addEventListener('load', sizeSoon);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeSoon);
  let rw = innerWidth;
  addEventListener('resize', () => {
    sizeCanvas(); sizeTV();
    if (Math.abs(innerWidth - rw) > 40 && puppet) { rw = innerWidth; puppet.anchor.x = narrow() ? innerWidth * .8 : innerWidth - Math.max(120, innerWidth * .09); }
    sizeSoon();
  });
  const h = location.hash.match(/^#p\/(.+)$/); if (h) openProject(h[1], true);
})();
