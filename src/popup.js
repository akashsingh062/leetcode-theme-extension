/* =============================================================================
   popup.js — LeetCode Themes & Wallpaper Studio Popup.
   Controls wallpaper themes, solid themes, editor settings, and interview tools.
============================================================================= */

const THEMES = {
  tokyonight: {
    name: 'Tokyo Night',
    desc: 'Midnight indigo, neon violet & cyan',
    accent: '#7aa2f7',
    pv: {
      bg: '#1a1b26',
      text: '#c0caf5',
      line: '#3b4261',
      kw: '#bb9af7',
      fn: '#7aa2f7',
      num: '#ff9e64',
      var: '#c0caf5',
      com: '#565f89',
      pn: '#89ddff'
    }
  },
  catppuccin: {
    name: 'Catppuccin Mocha',
    desc: 'Warm soothing dark & pastels',
    accent: '#cba6f7',
    pv: {
      bg: '#1e1e2e',
      text: '#cdd6f4',
      line: '#45475a',
      kw: '#cba6f7',
      fn: '#89b4fa',
      num: '#fab387',
      var: '#cdd6f4',
      com: '#6c7086',
      pn: '#94e2d5'
    }
  },
  sakura: {
    name: 'Sakura Night',
    desc: 'Plum indigo with cherry blossom pink',
    accent: '#ff7eb6',
    pv: {
      bg: '#1f1a2e',
      text: '#f5e9f2',
      line: '#4a385c',
      kw: '#ff7eb6',
      fn: '#6ee7f0',
      num: '#b98cff',
      var: '#ece9ff',
      com: '#7e7399',
      pn: '#ff9ec8'
    }
  },
  paper: {
    name: 'Vintage Paper',
    desc: 'Warm parchment kraft & sepia ink',
    accent: '#8b3a2b',
    pv: {
      bg: '#ebdcc4',
      text: '#2c251e',
      line: '#9c8c77',
      kw: '#7f1d1d',
      fn: '#1e3a8a',
      num: '#0e7490',
      var: '#292524',
      com: '#78716c',
      pn: '#44403c'
    }
  },
  matrix: {
    name: 'Cyber Matrix',
    desc: 'Obsidian terminal & phosphor green',
    accent: '#22c55e',
    pv: {
      bg: '#0b0f12',
      text: '#e2fced',
      line: '#203328',
      kw: '#22c55e',
      fn: '#38bdf8',
      num: '#facc15',
      var: '#e2fced',
      com: '#4b6354',
      pn: '#10b981'
    }
  },
  grid: {
    name: 'Synthwave Grid',
    desc: 'Blueprint dark navy & electric cyan',
    accent: '#06b6d4',
    pv: {
      bg: '#0f172a',
      text: '#e2e8f0',
      line: '#334155',
      kw: '#38bdf8',
      fn: '#06b6d4',
      num: '#fb923c',
      var: '#e2e8f0',
      com: '#64748b',
      pn: '#0ea5e9'
    }
  },
  orchid: {
    name: 'Midnight Orchid',
    desc: 'Royal dark velvet & magenta glow',
    accent: '#d946ef',
    pv: {
      bg: '#181124',
      text: '#f3e8ff',
      line: '#422b5e',
      kw: '#d946ef',
      fn: '#c084fc',
      num: '#fb7185',
      var: '#f3e8ff',
      com: '#705888',
      pn: '#e879f9'
    }
  },
  dracula: {
    name: 'Dracula Dark',
    desc: 'Classic gothic slate & vibrant accents',
    accent: '#ff79c6',
    pv: {
      bg: '#282a36',
      text: '#f8f8f2',
      line: '#44475a',
      kw: '#ff79c6',
      fn: '#50fa7b',
      num: '#bd93f9',
      var: '#f8f8f2',
      com: '#6272a4',
      pn: '#ff79c6'
    }
  },
  nord: {
    name: 'Nordic Frost',
    desc: 'Arctic polar night & frost teal',
    accent: '#88c0d0',
    pv: {
      bg: '#2e3440',
      text: '#eceff4',
      line: '#4c566a',
      kw: '#81a1c1',
      fn: '#88c0d0',
      num: '#b48ead',
      var: '#eceff4',
      com: '#616e88',
      pn: '#81a1c1'
    }
  },
  crawler: {
    name: 'Web Crawler',
    desc: 'Charcoal web & crimson electric current',
    accent: '#e0223f',
    pv: {
      bg: '#17171c',
      text: '#eceaf2',
      line: '#38384a',
      kw: '#4db2ff',
      fn: '#4ce0b3',
      num: '#c792ea',
      var: '#eceaf2',
      com: '#6e6e7a',
      pn: '#ff8aa8'
    }
  },
  game: {
    name: 'Adventure RPG',
    desc: 'Moonlit realm, HUD sidebar & quests',
    accent: '#7dd3fc',
    pv: {
      bg: '#101a2c',
      text: '#e6edf3',
      line: '#6b86a6',
      kw: '#b9a7ff',
      fn: '#67d9e8',
      num: '#e7c873',
      var: '#e6edf3',
      com: '#71869a',
      pn: '#b8c7d9'
    }
  },
  pixel: {
    name: 'Pixel Art (8-Bit)',
    desc: 'Sweetie-16 palette & retro celebration',
    accent: '#ffcd75',
    pv: {
      bg: '#262b44',
      text: '#f4f4f4',
      line: '#566c86',
      kw: '#ffcd75',
      fn: '#73eff7',
      num: '#c9a0ff',
      var: '#c5d3e0',
      com: '#8b9bb4',
      pn: '#ffa36b'
    }
  },
  off: {
    name: 'Default LeetCode',
    desc: 'Standard un-themed view',
    accent: '#94a3b8',
    pv: {
      bg: '#1a1a1a',
      text: '#eff1f6',
      line: '#404040',
      kw: '#c678dd',
      fn: '#61afef',
      num: '#d19a66',
      var: '#eff1f6',
      com: '#7f848e',
      pn: '#abb2bf'
    }
  }
};

const ORDER = [
  'tokyonight',
  'catppuccin',
  'sakura',
  'paper',
  'matrix',
  'grid',
  'orchid',
  'dracula',
  'nord',
  'crawler',
  'game',
  'pixel',
  'off'
];

function pvVars(pv) {
  return (
    `--pv-bg:${pv.bg};--pv-text:${pv.text};--pv-line:${pv.line};` +
    `--pv-kw:${pv.kw};--pv-fn:${pv.fn};--pv-num:${pv.num};` +
    `--pv-var:${pv.var};--pv-com:${pv.com};--pv-pn:${pv.pn};`
  );
}

function setAccent(accentColor) {
  if (accentColor) {
    document.documentElement.style.setProperty('--pop-accent', accentColor);
  }
}

/* ---- Render Solid Themes Grid ---- */
function renderSolidGrid(selected) {
  const grid = document.getElementById('grid');
  if (!grid) return;
  grid.innerHTML = '';

  const CHECK =
    '<svg viewBox="0 0 12 12" fill="none" style="width:12px;height:12px;"><path d="M2.5 6.2 5 8.7 9.6 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  ORDER.forEach((id) => {
    const t = THEMES[id];
    const card = document.createElement('button');
    card.className = 'card';
    card.type = 'button';
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', String(id === selected));
    card.dataset.id = id;
    card.style.setProperty('--card-accent', t.accent);

    card.innerHTML = `
      <div class="preview" style="${pvVars(t.pv)}">
        <div class="row"><span class="ln">1</span><span class="code"><span style="color:var(--pv-kw)">def</span> <span style="color:var(--pv-fn)">solve</span>(nums):</span></div>
        <div class="row"><span class="ln">2</span><span class="code">    seen = {} <span style="color:var(--pv-com)"># map</span></span></div>
        <div class="row"><span class="ln">3</span><span class="code">    <span style="color:var(--pv-kw)">return</span> <span style="color:var(--pv-num)">0</span></span></div>
      </div>
      <div class="meta" style="display:flex;align-items:center;padding:8px 10px;gap:8px;">
        <span class="name" style="font-weight:600;font-size:12.5px;">${t.name}</span>
        <span class="desc" style="font-size:11px;color:var(--pop-muted);flex:1;">${t.desc}</span>
        <span class="check" style="color:var(--card-accent);">${CHECK}</span>
      </div>
    `;

    card.addEventListener('click', () => chooseSolidTheme(id));
    grid.appendChild(card);
  });
}

function chooseSolidTheme(id) {
  document
    .querySelectorAll('.card')
    .forEach((c) => c.setAttribute('aria-checked', String(c.dataset.id === id)));

  document.querySelectorAll('.wall-card').forEach((c) => {
    c.setAttribute('aria-checked', 'false');
    const badge = c.querySelector('.wall-badge');
    if (badge) badge.textContent = 'Theme';
  });

  const t = THEMES[id] || THEMES.tokyonight;
  setAccent(t.accent);

  chrome.storage.local.set({ lcTheme: id, lcThemeStudio: id });

  const status = document.getElementById('status');
  if (status) {
    status.textContent =
      id === 'off'
        ? 'Theme off. Standard LeetCode restored.'
        : `${t.name} applied across your problem tabs!`;
  }
}

/* ---- Render Wallpaper Themes Grid ---- */
function renderWallpaperGrid(activePreset) {
  const wallGrid = document.getElementById('wallGrid');
  if (!wallGrid) return;
  wallGrid.innerHTML = '';

  const scenes = globalThis.LCTS_SCENES || {};

  Object.keys(scenes).forEach((sceneId) => {
    const s = scenes[sceneId];
    const card = document.createElement('button');
    card.className = 'wall-card';
    card.type = 'button';
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', String(sceneId === activePreset));
    card.dataset.preset = sceneId;
    const accent = s.theme ? s.theme.roles['--lc-accent'] : '#38bdf8';
    card.style.setProperty('--card-accent', accent);

    card.innerHTML = `
      <img class="wall-thumb" src="../textures/anime/${sceneId}-thumb.webp" alt="${s.name}" loading="lazy" />
      <span class="wall-badge">${sceneId === activePreset ? '✓ Active' : 'Theme'}</span>
      <div class="wall-meta">
        <span class="wall-name">${s.name}</span>
        <span class="wall-desc">${s.desc}</span>
      </div>
    `;

    card.addEventListener('click', () => chooseWallpaperTheme(sceneId));
    wallGrid.appendChild(card);
  });
}

function chooseWallpaperTheme(sceneId) {
  const scenes = globalThis.LCTS_SCENES || {};
  const s = scenes[sceneId];
  if (!s) return;

  // Clear solid theme checkmarks
  document.querySelectorAll('.card').forEach((c) => c.setAttribute('aria-checked', 'false'));

  // Update wallpaper checkmarks
  document.querySelectorAll('.wall-card').forEach((c) => {
    const isThis = c.dataset.preset === sceneId;
    c.setAttribute('aria-checked', String(isThis));
    const badge = c.querySelector('.wall-badge');
    if (badge) badge.textContent = isThis ? '✓ Active' : 'Theme';
  });

  const accent = s.theme ? s.theme.roles['--lc-accent'] : '#ff7eb6';
  setAccent(accent);

  chrome.storage.local.get('lcAnime', (res) => {
    const prev = res && res.lcAnime ? res.lcAnime : {};
    const updated = Object.assign({}, prev, {
      scene: sceneId,
      arcs: false
    });
    chrome.storage.local.set({
      lcTheme: 'anime',
      lcThemeStudio: 'anime',
      lcAnime: updated
    });
  });

  const status = document.getElementById('status');
  if (status) {
    status.textContent = `"${s.name}" wallpaper applied across your problem tabs!`;
  }
}

function disableWallpaper() {
  document.querySelectorAll('.wall-card').forEach((c) => {
    c.setAttribute('aria-checked', 'false');
    const badge = c.querySelector('.wall-badge');
    if (badge) badge.textContent = 'Theme';
  });

  chooseSolidTheme('tokyonight');

  const status = document.getElementById('status');
  if (status) {
    status.textContent = 'Wallpaper disabled. Tokyo Night theme restored.';
  }
}

/* ---- Boot & Initial Load ---- */
chrome.storage.local.get(['lcTheme', 'lcThemeStudio', 'lcAnime'], (res) => {
  const scenes = globalThis.LCTS_SCENES || {};
  let currentTheme = (res && res.lcThemeStudio) || (res && res.lcTheme) || 'anime';
  const cfg = (res && res.lcAnime) || {};
  let currentScene = cfg.scene || 'moonlit-shrine';

  const isWallpaperMode = currentTheme === 'anime';

  if (isWallpaperMode) {
    renderWallpaperGrid(currentScene);
    renderSolidGrid(null);

    const s = scenes[currentScene];
    if (s && s.theme) setAccent(s.theme.roles['--lc-accent']);

    // Default to displaying the active Wallpaper Themes tab
    switchSubNav('sub-wallpapers');
  } else {
    renderSolidGrid(currentTheme);
    renderWallpaperGrid(null);
    if (THEMES[currentTheme]) setAccent(THEMES[currentTheme].accent);
    switchSubNav('sub-colors');
  }
});

/* ---- Sub Navigation (Color Themes vs Wallpaper Themes) ---- */
function switchSubNav(targetSubtab) {
  document.querySelectorAll('.sub-nav-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.subtab === targetSubtab);
  });
  document.querySelectorAll('.sub-pane').forEach((p) => {
    p.classList.toggle('active', p.id === targetSubtab);
  });
}

document.querySelectorAll('.sub-nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => switchSubNav(btn.dataset.subtab));
});

const clearWallBtn = document.getElementById('clearWallBtn');
if (clearWallBtn) {
  clearWallBtn.addEventListener('click', disableWallpaper);
}

const openStudioBtn = document.getElementById('openStudioBtn');
if (openStudioBtn) {
  openStudioBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('src/studio.html') });
  });
}

/* ---- Main Tab Navigation ---- */
document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.tab);
    if (target) target.classList.add('active');
  });
});

/* ---- Monaco Editor Theme Select ---- */
const monacoSelect = document.getElementById('monacoThemeSelect');
if (monacoSelect) {
  chrome.storage.local.get('lcMonacoTheme', (res) => {
    if (res && res.lcMonacoTheme) monacoSelect.value = res.lcMonacoTheme;
  });
  monacoSelect.addEventListener('change', () => {
    chrome.storage.local.set({ lcMonacoTheme: monacoSelect.value });
  });
}

/* ---- Custom Wallpaper Upload & Glass Sliders ---- */
const customWallToggle = document.getElementById('customWallToggle');
const customWallBody = document.getElementById('customWallBody');
const wallFileInput = document.getElementById('wallFileInput');
const wallUploadBtn = document.getElementById('wallUploadBtn');
const wallOpacityRange = document.getElementById('wallOpacityRange');
const wallOpacityVal = document.getElementById('wallOpacityVal');
const wallBlurRange = document.getElementById('wallBlurRange');
const wallBlurVal = document.getElementById('wallBlurVal');

let customWallData = {
  dataUrl: null,
  opacity: 0.85,
  blur: 0
};

if (customWallToggle && customWallBody) {
  customWallToggle.addEventListener('click', () => {
    const isHidden = customWallBody.style.display === 'none';
    customWallBody.style.display = isHidden ? 'flex' : 'none';
    customWallToggle.classList.toggle('open', isHidden);
  });
}

chrome.storage.local.get('lcCustomWallpaper', (res) => {
  const wall = res && res.lcCustomWallpaper;
  if (wall) {
    customWallData = Object.assign(customWallData, wall);
    if (wallOpacityRange) wallOpacityRange.value = Math.round(customWallData.opacity * 100);
    if (wallOpacityVal) wallOpacityVal.textContent = Math.round(customWallData.opacity * 100) + '%';
    if (wallBlurRange) wallBlurRange.value = customWallData.blur;
    if (wallBlurVal) wallBlurVal.textContent = customWallData.blur + 'px';
  }
});

function updateCustomWallSettings() {
  chrome.storage.local.get('lcCustomWallpaper', (res) => {
    const wall = res && res.lcCustomWallpaper ? res.lcCustomWallpaper : {};
    wall.opacity = customWallData.opacity;
    wall.blur = customWallData.blur;
    chrome.storage.local.set({ lcCustomWallpaper: wall });
  });
}

if (wallFileInput && wallUploadBtn) {
  wallUploadBtn.addEventListener('click', () => wallFileInput.click());
  wallFileInput.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    wallUploadBtn.textContent = 'Processing...';

    try {
      if (globalThis.LCTSAnimeProcess && globalThis.LCTSAnimeSolver) {
        const p = await globalThis.LCTSAnimeProcess.prepare(file);
        const [wall, blur] = await Promise.all([
          globalThis.LCTSAnimeProcess.blobToDataURL(p.wallBlob),
          globalThis.LCTSAnimeProcess.blobToDataURL(p.blurBlob)
        ]);
        const customTheme = globalThis.LCTSAnimeSolver.analyze(p.sharp, p.blurSamples, {
          glass: 'auto',
          visibility: customWallData.opacity,
          cols: p.cols
        });
        await chrome.storage.local.set({
          lcAnimeArt: { wall, blur, name: file.name }
        });
        chrome.storage.local.get('lcAnime', (res) => {
          const prev = res && res.lcAnime ? res.lcAnime : {};
          const themes = Object.assign({}, prev.themes || {}, { custom: customTheme });
          const updated = Object.assign({}, prev, {
            scene: 'custom',
            arcs: false,
            themes,
            theme: customTheme,
            themeFor: 'custom'
          });
          chrome.storage.local.set({
            lcTheme: 'anime',
            lcThemeStudio: 'anime',
            lcAnime: updated
          });
        });
      }
      wallUploadBtn.textContent = '✓ ' + file.name.slice(0, 14);
      document.querySelectorAll('.wall-card').forEach((c) => {
        c.setAttribute('aria-checked', 'false');
        const badge = c.querySelector('.wall-badge');
        if (badge) badge.textContent = 'Theme';
      });
      const status = document.getElementById('status');
      if (status) status.textContent = 'Custom wallpaper processed and applied!';
    } catch (err) {
      wallUploadBtn.textContent = 'Upload Image';
      console.error(err);
      alert('Could not process image: ' + err.message);
    }
  });
}

if (wallOpacityRange && wallOpacityVal) {
  wallOpacityRange.addEventListener('input', () => {
    customWallData.opacity = parseInt(wallOpacityRange.value, 10) / 100;
    wallOpacityVal.textContent = wallOpacityRange.value + '%';
    updateCustomWallSettings();
  });
}

if (wallBlurRange && wallBlurVal) {
  wallBlurRange.addEventListener('input', () => {
    customWallData.blur = parseInt(wallBlurRange.value, 10);
    wallBlurVal.textContent = wallBlurRange.value + 'px';
    updateCustomWallSettings();
  });
}

/* ---- Editor Settings (Fonts, Ligatures, Size, Caret) ---- */
const fontSelect = document.getElementById('fontSelect');
const ligaturesToggle = document.getElementById('ligaturesToggle');
const fontSizeRange = document.getElementById('fontSizeRange');
const fontSizeVal = document.getElementById('fontSizeVal');
const lineHeightSelect = document.getElementById('lineHeightSelect');
const cursorSelect = document.getElementById('cursorSelect');

function saveEditorSettings() {
  const isCustomSize = fontSizeRange && fontSizeRange.dataset.touched === 'true';
  const settings = {
    v: 2,
    font: fontSelect ? fontSelect.value : 'default',
    ligatures: ligaturesToggle ? ligaturesToggle.checked : true,
    fontSize: isCustomSize ? parseInt(fontSizeRange.value, 10) : 'default',
    lineHeight: lineHeightSelect ? lineHeightSelect.value : 'default',
    cursorStyle: cursorSelect ? cursorSelect.value : 'blink'
  };
  chrome.storage.local.set({ lcEditorSettings: settings });
}

if (fontSelect && ligaturesToggle && fontSizeRange && cursorSelect) {
  chrome.storage.local.get('lcEditorSettings', (res) => {
    const s = res && res.lcEditorSettings ? res.lcEditorSettings : {};
    if (s.v === 2 && s.font) {
      fontSelect.value = s.font;
    } else {
      fontSelect.value = 'default';
    }
    if (s.ligatures !== undefined) ligaturesToggle.checked = !!s.ligatures;
    if (s.v === 2 && s.fontSize && s.fontSize !== 'default') {
      fontSizeRange.dataset.touched = 'true';
      fontSizeRange.value = s.fontSize;
      if (fontSizeVal) fontSizeVal.textContent = s.fontSize + 'px';
    } else {
      fontSizeRange.dataset.touched = 'false';
      if (fontSizeVal) fontSizeVal.textContent = 'Default';
    }
    if (lineHeightSelect && s.v === 2 && s.lineHeight) {
      lineHeightSelect.value = s.lineHeight;
    }
    if (s.v === 2 && s.cursorStyle) {
      cursorSelect.value = s.cursorStyle;
    } else {
      cursorSelect.value = 'blink';
    }
  });

  fontSelect.addEventListener('change', saveEditorSettings);
  ligaturesToggle.addEventListener('change', saveEditorSettings);
  if (lineHeightSelect) lineHeightSelect.addEventListener('change', saveEditorSettings);
  fontSizeRange.addEventListener('input', () => {
    fontSizeRange.dataset.touched = 'true';
    if (fontSizeVal) fontSizeVal.textContent = fontSizeRange.value + 'px';
    saveEditorSettings();
  });
  cursorSelect.addEventListener('change', saveEditorSettings);
}

const resetEditorBtn = document.getElementById('resetEditorBtn');
if (resetEditorBtn) {
  resetEditorBtn.addEventListener('click', () => {
    if (fontSelect) fontSelect.value = 'default';
    if (ligaturesToggle) ligaturesToggle.checked = true;
    if (fontSizeRange) {
      fontSizeRange.value = 14;
      fontSizeRange.dataset.touched = 'false';
    }
    if (fontSizeVal) fontSizeVal.textContent = 'Default';
    if (lineHeightSelect) lineHeightSelect.value = 'default';
    if (cursorSelect) cursorSelect.value = 'blink';
    saveEditorSettings();
    if (monacoSelect) {
      monacoSelect.value = 'default';
      chrome.storage.local.set({ lcMonacoTheme: 'default' });
    }
    const status = document.getElementById('status');
    if (status) status.textContent = 'Editor settings reset to defaults!';
  });
}

/* ---- Interview Blind Mode ---- */
const blindMaster = document.getElementById('blindMasterToggle');
const blindDiff = document.getElementById('blindDiffToggle');
const blindTags = document.getElementById('blindTagsToggle');
const blindAcceptance = document.getElementById('blindAcceptanceToggle');
const blindSubmissions = document.getElementById('blindSubmissionsToggle');
const contestMode = document.getElementById('contestModeToggle');

function saveBlindMode() {
  const isAcc = blindAcceptance ? blindAcceptance.checked : true;
  const isSub = blindSubmissions ? blindSubmissions.checked : true;
  const mode = {
    active: blindMaster ? blindMaster.checked : false,
    hideDifficulty: blindDiff ? blindDiff.checked : true,
    blurTags: blindTags ? blindTags.checked : true,
    hideStats: isAcc || isSub,
    hideAcceptance: isAcc,
    hideSubmissions: isSub,
    contestMode: contestMode ? contestMode.checked : false,
    contestRevealed: false
  };
  chrome.storage.local.set({ lcBlindMode: mode });
}

function syncBlindVisuals() {
  const isActive = blindMaster && blindMaster.checked;
  [blindDiff, blindTags, blindAcceptance, blindSubmissions, contestMode].forEach((el) => {
    if (el) {
      const row = el.closest('.control-row');
      if (row && row !== blindMaster.closest('.control-row')) {
        row.style.opacity = isActive ? '1' : '0.55';
        row.style.transition = 'opacity 0.2s ease';
      }
    }
  });
}

if (blindMaster) {
  chrome.storage.local.get('lcBlindMode', (res) => {
    const b = res && res.lcBlindMode ? res.lcBlindMode : null;
    if (b) {
      blindMaster.checked = b.active !== false;
      if (blindDiff && b.hideDifficulty !== undefined) blindDiff.checked = !!b.hideDifficulty;
      if (blindTags && b.blurTags !== undefined) blindTags.checked = !!b.blurTags;
      if (blindAcceptance) {
        blindAcceptance.checked =
          b.hideAcceptance !== undefined
            ? !!b.hideAcceptance
            : b.hideStats !== undefined
              ? !!b.hideStats
              : true;
      }
      if (blindSubmissions) {
        blindSubmissions.checked =
          b.hideSubmissions !== undefined
            ? !!b.hideSubmissions
            : b.hideStats !== undefined
              ? !!b.hideStats
              : true;
      }
      if (contestMode && b.contestMode !== undefined) contestMode.checked = !!b.contestMode;
    } else {
      blindMaster.checked = true;
      if (blindDiff) blindDiff.checked = true;
      if (blindTags) blindTags.checked = true;
      if (blindAcceptance) blindAcceptance.checked = true;
      if (blindSubmissions) blindSubmissions.checked = true;
      if (contestMode) contestMode.checked = false;
      saveBlindMode();
    }
    syncBlindVisuals();
  });

  blindMaster.addEventListener('change', () => {
    syncBlindVisuals();
    saveBlindMode();
  });

  [blindDiff, blindTags, blindAcceptance, blindSubmissions, contestMode].forEach((el) => {
    if (!el) return;
    el.addEventListener('change', () => {
      const anyChecked =
        (blindDiff && blindDiff.checked) ||
        (blindTags && blindTags.checked) ||
        (blindAcceptance && blindAcceptance.checked) ||
        (blindSubmissions && blindSubmissions.checked) ||
        (contestMode && contestMode.checked);
      if (anyChecked && blindMaster && !blindMaster.checked) {
        blindMaster.checked = true;
      }
      syncBlindVisuals();
      saveBlindMode();
    });
  });
}

/* ---- Interview & Tools Sync (Timer & Notes & Zen) ---- */
const timerToggle = document.getElementById('timerToggle');
const interviewTimerToggle = document.getElementById('interviewTimerToggle');

function setTimerToggles(val) {
  if (timerToggle) timerToggle.checked = !!val;
  if (interviewTimerToggle) interviewTimerToggle.checked = !!val;
}

chrome.storage.local.get('lcTimerEnabled', (res) => {
  setTimerToggles(res && res.lcTimerEnabled);
});

[timerToggle, interviewTimerToggle].forEach((toggle) => {
  if (toggle) {
    toggle.addEventListener('change', () => {
      const isChecked = toggle.checked;
      setTimerToggles(isChecked);
      chrome.storage.local.set({ lcTimerEnabled: isChecked });
    });
  }
});

const interviewNotesToggle = document.getElementById('interviewNotesToggle');
const toolsNotesToggle = document.getElementById('toolsNotesToggle');

function setNotesToggles(val) {
  if (interviewNotesToggle) interviewNotesToggle.checked = !!val;
  if (toolsNotesToggle) toolsNotesToggle.checked = !!val;
}

chrome.storage.local.get('lcNotesEnabled', (res) => {
  const enabled = res && res.lcNotesEnabled !== undefined ? !!res.lcNotesEnabled : true;
  setNotesToggles(enabled);
});

[interviewNotesToggle, toolsNotesToggle].forEach((toggle) => {
  if (toggle) {
    toggle.addEventListener('change', () => {
      const isChecked = toggle.checked;
      setNotesToggles(isChecked);
      chrome.storage.local.set({ lcNotesEnabled: isChecked });
    });
  }
});

const zenToggle = document.getElementById('zenToggle');
if (zenToggle) {
  chrome.storage.local.get('lcZenMode', (res) => {
    zenToggle.checked = !!(res && res.lcZenMode);
  });
  zenToggle.addEventListener('change', () => {
    chrome.storage.local.set({ lcZenMode: zenToggle.checked });
  });
}

/* ---- Day / Night Auto Scheduler ---- */
const dayNightToggle = document.getElementById('dayNightToggle');
const dayNightOptions = document.getElementById('dayNightOptions');
const dayNightModeSelect = document.getElementById('dayNightModeSelect');
const dayThemeSelect = document.getElementById('dayThemeSelect');
const nightThemeSelect = document.getElementById('nightThemeSelect');

function saveDayNightConfig() {
  const cfg = {
    enabled: dayNightToggle ? dayNightToggle.checked : false,
    mode: dayNightModeSelect ? dayNightModeSelect.value : 'time',
    dayTheme: dayThemeSelect ? dayThemeSelect.value : 'paper',
    nightTheme: nightThemeSelect ? nightThemeSelect.value : 'tokyonight'
  };
  chrome.storage.local.set({ lcDayNight: cfg });
}

if (dayNightToggle) {
  chrome.storage.local.get('lcDayNight', (res) => {
    const dn =
      res && res.lcDayNight
        ? res.lcDayNight
        : { enabled: false, mode: 'time', dayTheme: 'paper', nightTheme: 'tokyonight' };
    dayNightToggle.checked = !!dn.enabled;
    if (dayNightOptions) dayNightOptions.style.display = dn.enabled ? 'flex' : 'none';
    if (dayNightModeSelect && dn.mode) dayNightModeSelect.value = dn.mode;
    if (dayThemeSelect && dn.dayTheme) dayThemeSelect.value = dn.dayTheme;
    if (nightThemeSelect && dn.nightTheme) nightThemeSelect.value = dn.nightTheme;
  });

  dayNightToggle.addEventListener('change', () => {
    if (dayNightOptions) dayNightOptions.style.display = dayNightToggle.checked ? 'flex' : 'none';
    saveDayNightConfig();
  });

  if (dayNightModeSelect) dayNightModeSelect.addEventListener('change', saveDayNightConfig);
  if (dayThemeSelect) dayThemeSelect.addEventListener('change', saveDayNightConfig);
  if (nightThemeSelect) nightThemeSelect.addEventListener('change', saveDayNightConfig);
}

/* ---- Export & Import Settings ---- */
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFileInput = document.getElementById('importFileInput');

if (exportBtn && globalThis.LCTSThemeSync) {
  exportBtn.addEventListener('click', () => {
    globalThis.LCTSThemeSync.exportConfig();
  });
}

if (importBtn && importFileInput && globalThis.LCTSThemeSync) {
  importBtn.addEventListener('click', () => {
    importFileInput.click();
  });
  importFileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      globalThis.LCTSThemeSync.importConfig(evt.target.result)
        .then(() => {
          alert('Settings imported successfully!');
          window.location.reload();
        })
        .catch((err) => {
          alert('Failed to import configuration: ' + err.message);
        });
    };
    reader.readAsText(file);
    e.target.value = '';
  });
}

try {
  const v = chrome.runtime.getManifest().version;
  const el = document.getElementById('ver');
  if (el) el.textContent = 'v' + v;
} catch (e) {}
