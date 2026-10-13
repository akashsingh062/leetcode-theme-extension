/* =============================================================================
   studio.js — Anime Studio.

   Every change re-solves the scene here, previews it, and saves the solved
   result. LeetCode tabs then only read storage; they never decode, resize or
   solve anything themselves.
============================================================================= */
(() => {
  'use strict';

  const SCENES = globalThis.LCTS_SCENES, DEF = globalThis.LCTS_SCENE_DEFAULT;
  const ARC = globalThis.LCTS_ARC_DEFAULT || { easy: DEF, medium: DEF, hard: DEF };
  const SLOTS = [['easy', 'Easy', 'Warm-up'], ['medium', 'Medium', 'Practice'], ['hard', 'Hard', 'Challenge']];
  const Solver = globalThis.LCTSAnimeSolver, Proc = globalThis.LCTSAnimeProcess;
  const $ = (id) => document.getElementById(id);
  const MAX_INPUT = 30 * 1024 * 1024;

  const settings = { scene: DEF, arcs: true, arcScenes: {}, glass: 'auto', visibility: 0.85,
                     titleCard: false, moments: false, sound: false, volume: 0 };
  let slot = 'medium';          // the difficulty slot being edited while arcs are on
  const preparedCache = {};     // scene id -> samples + blobs
  let themes = {};              // scene id -> solve at the current glass settings

  /* which scene the preview shows (and a gallery click changes) */
  const arcScene = (d) => (SCENES[settings.arcScenes[d]] ? settings.arcScenes[d] : ARC[d]);
  const viewId = () => settings.scene === 'custom' ? 'custom' : (settings.arcs ? arcScene(slot) : settings.scene);
  /* every scene LeetCode may show with the current settings */
  const neededIds = () => settings.scene === 'custom' ? ['custom']
    : settings.arcs ? [...new Set(SLOTS.map(([d]) => arcScene(d)))] : [settings.scene];
  let prepared = null;          // samples + blobs for the current scene
  let theme = null;             // the current solve
  let previewUrls = null;       // object URLs the preview is showing
  let hasArt = false;
  let customThumb = null;

  /* ---- preview frame --------------------------------------------------------- */
  const frame = $('frame');
  /* Poll for the preview's API rather than wait for the iframe's load event:
     that event can fire before this script attaches a listener, and then the
     whole Studio would wait forever. */
  const frameReady = new Promise((res) => {
    const check = () => {
      let w = null;
      try { w = frame.contentWindow; } catch (e) {}
      if (w && w.LCTSPreview && w.document.readyState !== 'loading') res();
      else setTimeout(check, 40);
    };
    check();
  });
  function fitFrame() {
    const box = $('frameBox');
    frame.style.transform = `scale(${box.clientWidth / 1280})`;
  }
  new ResizeObserver(fitFrame).observe($('frameBox'));

  async function showPreview() {
    await frameReady;
    if (!theme || !prepared) return;
    if (previewUrls) { URL.revokeObjectURL(previewUrls.wall); URL.revokeObjectURL(previewUrls.blur); }
    previewUrls = { wall: URL.createObjectURL(prepared.wallBlob), blur: URL.createObjectURL(prepared.blurBlob) };
    frame.contentWindow.LCTSPreview.apply(theme, previewUrls);
  }

  /* the studio's own accent follows the scene */
  function tintStudio() {
    if (!theme) return;
    const r = document.documentElement.style;
    r.setProperty('--accent', theme.roles['--lc-accent']);
    r.setProperty('--accent-ink', theme.mode === 'dark' ? theme.scrim : '#ffffff');
  }

  /* ---- solving ---------------------------------------------------------------- */
  function solveNow() {
    if (!prepared) return;
    theme = Solver.analyze(prepared.sharp, prepared.blurSamples, {
      glass: settings.glass, visibility: settings.visibility, cols: prepared.cols
    });
    renderReport();
    tintStudio();
  }

  function renderReport() {
    const r = theme.report;
    const inks = Object.entries(r.ink).filter(([k]) => !['variable', 'regexp', 'comment'].includes(k)).map(([, v]) => v);
    const chip = (label, v) => `<span class="chip">${label} <b>${v.toFixed(1)}:1</b></span>`;
    $('report').innerHTML =
      chip('Text', r.text) + chip('Code', r.editorText) + chip('Syntax colours ≥', Math.min(...inks)) +
      chip('Accent', r.accent) + chip('Submit', r.submit);
  }

  async function blobFromExtension(path) {
    const res = await fetch(chrome.runtime.getURL(path));
    return res.blob();
  }

  async function samplesFor(id) {
    if (preparedCache[id]) return preparedCache[id];
    let p;
    if (id === 'custom') {
      const art = (await chrome.storage.local.get('lcAnimeArt')).lcAnimeArt;
      if (!art) return samplesFor(DEF);
      const [w, b] = await Promise.all([Proc.dataURLToBlob(art.wall), Proc.dataURLToBlob(art.blur)]);
      p = await Proc.samplesFrom(w, b);
    } else {
      const s = SCENES[id] || SCENES[DEF];
      const [w, b] = await Promise.all([blobFromExtension(s.wall), blobFromExtension(s.blur)]);
      p = await Proc.samplesFrom(w, b);
    }
    return (preparedCache[id] = p);
  }
  async function loadScene(id) { prepared = await samplesFor(id); }

  const solveOf = (p) => Solver.analyze(p.sharp, p.blurSamples, {
    glass: settings.glass, visibility: settings.visibility, cols: p.cols
  });
  /* solve every scene LeetCode may show, so each difficulty gets the same
     glass settings (a few tens of ms per scene) */
  async function solveAll() {
    const out = {};
    for (const id of neededIds()) out[id] = solveOf(await samplesFor(id));
    themes = out;
  }

  /* ---- saving ------------------------------------------------------------------ */
  let saveTimer = 0;
  async function solveAndSave() { await solveAll(); save(true); }
  function save(immediate) {
    clearTimeout(saveTimer);
    const write = () => chrome.storage.local.set({
      lcAnime: Object.assign({}, settings, { themes, theme, themeFor: viewId() })
    });
    if (immediate) write(); else saveTimer = setTimeout(write, 220);
  }

  /* ---- scene tiles ---------------------------------------------------------------- */
  function renderScenes() {
    const box = $('scenes');
    box.innerHTML = '';
    /* your own picture comes first, so it is never scrolled out of sight */
    const presets = document.createDocumentFragment();
    Object.entries(SCENES).forEach(([id, s]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'scene';
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(viewId() === id));
      b.style.backgroundImage = `url("${chrome.runtime.getURL(s.thumb || s.wall)}")`;
      b.innerHTML = `<span class="name">${s.name}</span>`;
      b.title = s.desc + (s.credit ? ' · ' + s.credit : '');
      b.addEventListener('click', () => pickScene(id));
      presets.appendChild(b);
    });

    const up = document.createElement('button');
    up.type = 'button';
    up.className = 'scene upload' + (hasArt ? ' has-art' : '');
    up.setAttribute('role', 'radio');
    up.setAttribute('aria-checked', String(settings.scene === 'custom'));
    if (hasArt && customThumb) up.style.backgroundImage = `url("${customThumb}")`;
    up.innerHTML = `<span class="plus" aria-hidden="true">+</span><span class="name">${hasArt ? 'Your picture' : 'Add your picture'}</span>`;
    up.addEventListener('click', () => { if (hasArt && settings.scene !== 'custom') pickScene('custom'); else $('file').click(); });
    ['dragenter', 'dragover'].forEach((t) => up.addEventListener(t, (e) => { e.preventDefault(); up.classList.add('dragging'); }));
    ['dragleave', 'drop'].forEach((t) => up.addEventListener(t, () => up.classList.remove('dragging')));
    up.addEventListener('drop', (e) => {
      e.preventDefault();
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) upload(f);
    });
    if (hasArt) {
      const x = document.createElement('span');
      /* an SVG cross, not the × character: a glyph sits on the font's
         baseline and never lands in the circle's true centre */
      x.className = 'remove'; x.title = 'Remove your picture';
      x.setAttribute('aria-label', 'Remove your picture');
      x.innerHTML = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5"/></svg>';
      x.setAttribute('role', 'button');
      x.addEventListener('click', (e) => { e.stopPropagation(); removeArt(); });
      up.appendChild(x);
    }
    box.appendChild(up);
    box.appendChild(presets);
    const picked = box.querySelector('[aria-checked="true"]');
    if (picked) box.scrollTop = Math.max(0, picked.offsetTop - box.offsetTop - 8);
    renderCredit();
  }

  /* the picked scene's credit; the free Freepik/Magnific licence requires
     "designed by Freepik - Magnific.com" wherever its pictures are shown */
  function renderCredit() {
    const s = SCENES[settings.scene];
    const n = $('sceneCredit');
    if (!n) return;
    if (!s || !s.credit || s.credit === 'Original') { n.textContent = ''; return; }
    n.textContent = s.credit.indexOf('Freepik') === 0
      ? `${s.name}: designed by Freepik – Magnific.com`
      : `${s.name}: ${s.credit}`;
  }

  async function pickScene(id) {
    busy(true);
    try {
      if (id === 'custom') settings.scene = 'custom';
      else {
        settings.scene = id;                        // remembered for "one scene" mode
        if (settings.arcs) settings.arcScenes = Object.assign({}, settings.arcScenes, { [slot]: id });
      }
      await refresh();
      await solveAndSave();
      activate();
    } finally { busy(false); }
  }

  /* re-solve and redraw whatever the preview should show now */
  async function refresh() {
    await loadScene(viewId());
    solveNow();
    renderScenes();
    renderArcs();
    await showPreview();
  }

  /* ---- scenes by difficulty ------------------------------------------------------ */
  function renderArcs() {
    $('arcs').checked = settings.arcs;
    const box = $('arcSlots'), custom = settings.scene === 'custom';
    box.hidden = !settings.arcs || custom;
    $('arcNote').textContent = custom
      ? 'Your picture is used for every difficulty.'
      : settings.arcs ? 'Pick a slot, then a scene for it. The scene changes with each problem’s difficulty.' : '';
    box.innerHTML = '';
    SLOTS.forEach(([d, label, jp]) => {
      const s = SCENES[arcScene(d)];
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'slot'; b.dataset.slot = d;
      b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', String(d === slot));
      b.style.backgroundImage = `url("${chrome.runtime.getURL(s.thumb || s.wall)}")`;
      b.innerHTML = `<span class="slot-label"><b>${label}</b> <span class="jp">${jp}</span></span><span class="slot-name">${s.name}</span>`;
      b.addEventListener('click', async () => { slot = d; busy(true); try { await refresh(); } finally { busy(false); } });
      box.appendChild(b);
    });
  }

  function busy(on, text) {
    $('busy').hidden = !on;
    if (text) $('busy').lastChild.textContent = text;
  }

  function note(text, error) {
    const n = $('uploadNote');
    n.textContent = text;
    n.classList.toggle('error', !!error);
  }

  async function upload(file) {
    if (!/^image\//.test(file.type)) { note('That file is not an image.', true); return; }
    if (file.size > MAX_INPUT) { note('That image is over 30 MB. Try a smaller copy.', true); return; }
    busy(true, 'Preparing your picture…');
    try {
      const p = await Proc.prepare(file);
      const [wall, blur] = await Promise.all([Proc.blobToDataURL(p.wallBlob), Proc.blobToDataURL(p.blurBlob)]);
      await chrome.storage.local.set({ lcAnimeArt: { wall, blur, name: file.name } });
      preparedCache.custom = p;
      hasArt = true;
      customThumb = blur;
      settings.scene = 'custom';
      await refresh();
      await solveAndSave();
      activate();
      const soft = p.width < 1280 ? ' It is under 1280 px wide, so it may look soft on a large screen.' : '';
      note(`Ready: ${file.name}, ${Math.round(p.wallBlob.size / 1024)} KB.${soft}`);
    } catch (e) {
      note('That image could not be read. Try a PNG, JPEG or WebP.', true);
    } finally { busy(false); }
  }

  async function removeArt() {
    await chrome.storage.local.remove('lcAnimeArt');
    hasArt = false; customThumb = null;
    note('Your picture was removed from this browser.');
    delete preparedCache.custom;
    await pickScene(settings.scene === 'custom' ? DEF : settings.scene);
  }

  /* ---- theme on/off ---------------------------------------------------------- */
  function activate() { chrome.storage.local.set({ lcThemeStudio: 'anime' }); }
  function renderActive(themeId) {
    const on = (themeId || 'anime') === 'anime';   // nothing saved = fresh install = anime (content.js DEFAULT)
    $('activeState').textContent = on ? 'Active on LeetCode' : 'Not active on LeetCode';
    $('activeState').classList.toggle('on', on);
    $('activate').hidden = on;
  }
  $('activate').addEventListener('click', activate);
  if (globalThis.LCTSSupportButton && $('support')) globalThis.LCTSSupportButton($('support'));
  if (globalThis.LCTSBugButton && $('bug')) globalThis.LCTSBugButton($('bug'));

  /* ---- controls ---------------------------------------------------------------- */
  function renderGlass() {
    document.querySelectorAll('#glass button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.v === settings.glass)));
  }
  document.querySelectorAll('#glass button').forEach((b) => b.addEventListener('click', async () => {
    settings.glass = b.dataset.v;
    renderGlass();
    solveNow(); await showPreview(); solveAndSave();
  }));

  const vis = $('visibility');
  const showVis = () => { $('visibilityOut').textContent = Math.round(settings.visibility * 100); };
  let raf = 0;
  vis.addEventListener('input', () => {
    settings.visibility = vis.value / 100;
    showVis();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(async () => { solveNow(); await showPreview(); });
  });
  vis.addEventListener('change', () => solveAndSave());

  $('arcs').addEventListener('change', async () => {
    settings.arcs = $('arcs').checked;
    if (settings.arcs && settings.scene === 'custom') settings.scene = ARC.medium;
    busy(true);
    try { await refresh(); await solveAndSave(); } finally { busy(false); }
  });

  $('file').addEventListener('change', (e) => { const f = e.target.files[0]; if (f) upload(f); e.target.value = ''; });

  ['titleCard', 'moments'].forEach((k) => {
    const el = $(k);
    if (el) el.addEventListener('change', () => { settings[k] = el.checked; save(); });
  });

  const renderSound = () => {
    if (!$('sound')) return;
    $('sound').checked = settings.sound;
    if ($('volume')) $('volume').value = Math.round(settings.volume * 100);
    if ($('volumeOut')) $('volumeOut').textContent = Math.round(settings.volume * 100);
  };

  const focusEl = $('focus');
  if (focusEl) {
    focusEl.addEventListener('change', async () => {
      const on = focusEl.checked;
      chrome.storage.local.set({ lcFocus: on });
      await frameReady;
      frame.contentWindow.LCTSPreview.focus(on);
    });
  }
  const shortcutsEl = $('shortcuts');
  if (shortcutsEl) {
    shortcutsEl.addEventListener('click', () => chrome.tabs.create({ url: 'chrome://extensions/shortcuts' }));
  }

  /* ---- boot --------------------------------------------------------------------- */
  (async () => {
    const res = await chrome.storage.local.get(['lcAnime', 'lcAnimeArt', 'lcThemeStudio', 'lcFocus']);
    const A = res.lcAnime;
    Object.assign(settings, A ? {
      scene: A.scene || DEF,
      arcs: A.arcs !== undefined ? !!A.arcs : !A.scene,
      arcScenes: A.arcScenes || {},
      glass: A.glass || 'auto',
      visibility: typeof res.lcAnime.visibility === 'number' ? res.lcAnime.visibility : 0.85
    } : {});
    hasArt = !!res.lcAnimeArt;
    customThumb = hasArt ? res.lcAnimeArt.blur : null;
    if (settings.scene === 'custom' && !hasArt) settings.scene = DEF;

    vis.value = Math.round(settings.visibility * 100); showVis();
    renderGlass();
    if (focusEl) focusEl.checked = !!res.lcFocus;
    renderActive(res.lcThemeStudio);

    try {
      const cmds = await chrome.commands.getAll();
      const c = cmds.find((x) => x.name === 'toggle-focus');
      const sc = $('shortcut');
      if (sc) {
        sc.textContent = c && c.shortcut
          ? c.shortcut.replace('Period', '.').replace('Comma', ',')
          : 'Ctrl+Shift+.';
      }
    } catch (e) {}

    busy(true, 'Loading scene…');
    try {
      await refresh();
      await solveAll();
      if (res.lcFocus && frame.contentWindow && frame.contentWindow.LCTSPreview) {
        frame.contentWindow.LCTSPreview.focus(true);
      }
    } finally { busy(false); }
  })();

  chrome.storage.onChanged.addListener((ch, area) => {
    if (area !== 'local') return;
    if (ch.lcThemeStudio) renderActive(ch.lcThemeStudio.newValue);
    if (ch.lcFocus && $('focus')) $('focus').checked = !!ch.lcFocus.newValue;
  });
})();
