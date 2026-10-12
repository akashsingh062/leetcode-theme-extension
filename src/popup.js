/* =============================================================================
   popup.js — Clean-Room LeetCode Themes & Productivity Toolkit Popup.
   Controls theme selection, wallpaper gallery, editor fonts, blind mode,
   timers, notes, and settings sync.
============================================================================= */

const THEMES = {
  tokyonight: {
    name: 'Tokyo Night', desc: 'Midnight indigo, neon violet & cyan', accent: '#7aa2f7',
    pv: { bg:'#1a1b26', text:'#c0caf5', line:'#3b4261', kw:'#bb9af7', fn:'#7aa2f7', num:'#ff9e64', var:'#c0caf5', com:'#565f89', pn:'#89ddff' }
  },
  catppuccin: {
    name: 'Catppuccin Mocha', desc: 'Warm soothing dark & pastels', accent: '#cba6f7',
    pv: { bg:'#1e1e2e', text:'#cdd6f4', line:'#45475a', kw:'#cba6f7', fn:'#89b4fa', num:'#fab387', var:'#cdd6f4', com:'#6c7086', pn:'#94e2d5' }
  },
  sakura: {
    name: 'Sakura Night', desc: 'Plum indigo with cherry blossom pink', accent: '#ff7eb6',
    pv: { bg:'#1f1a2e', text:'#f5e9f2', line:'#4a385c', kw:'#ff7eb6', fn:'#6ee7f0', num:'#b98cff', var:'#ece9ff', com:'#7e7399', pn:'#ff9ec8' }
  },
  paper: {
    name: 'Vintage Paper', desc: 'Warm parchment kraft & sepia ink', accent: '#8b3a2b',
    pv: { bg:'#ebdcc4', text:'#2c251e', line:'#9c8c77', kw:'#7f1d1d', fn:'#1e3a8a', num:'#0e7490', var:'#292524', com:'#78716c', pn:'#44403c' }
  },
  matrix: {
    name: 'Cyber Matrix', desc: 'Obsidian terminal & phosphor green', accent: '#22c55e',
    pv: { bg:'#0b0f12', text:'#e2fced', line:'#203328', kw:'#22c55e', fn:'#38bdf8', num:'#facc15', var:'#e2fced', com:'#4b6354', pn:'#10b981' }
  },
  grid: {
    name: 'Synthwave Grid', desc: 'Blueprint dark navy & electric cyan', accent: '#06b6d4',
    pv: { bg:'#0f172a', text:'#e2e8f0', line:'#334155', kw:'#38bdf8', fn:'#06b6d4', num:'#fb923c', var:'#e2e8f0', com:'#64748b', pn:'#0ea5e9' }
  },
  orchid: {
    name: 'Midnight Orchid', desc: 'Royal dark velvet & magenta glow', accent: '#d946ef',
    pv: { bg:'#181124', text:'#f3e8ff', line:'#422b5e', kw:'#d946ef', fn:'#c084fc', num:'#fb7185', var:'#f3e8ff', com:'#705888', pn:'#e879f9' }
  },
  dracula: {
    name: 'Dracula Dark', desc: 'Classic gothic slate & vibrant accents', accent: '#ff79c6',
    pv: { bg:'#282a36', text:'#f8f8f2', line:'#44475a', kw:'#ff79c6', fn:'#50fa7b', num:'#bd93f9', var:'#f8f8f2', com:'#6272a4', pn:'#ff79c6' }
  },
  nord: {
    name: 'Nordic Frost', desc: 'Arctic polar night & frost teal', accent: '#88c0d0',
    pv: { bg:'#2e3440', text:'#eceff4', line:'#4c566a', kw:'#81a1c1', fn:'#88c0d0', num:'#b48ead', var:'#eceff4', com:'#616e88', pn:'#81a1c1' }
  },
  custom: {
    name: 'Custom Glass', desc: 'Personal glassmorphic theme', accent: '#38bdf8',
    pv: { bg:'#0f172a', text:'#f8fafc', line:'#334155', kw:'#38bdf8', fn:'#818cf8', num:'#f59e0b', var:'#f8fafc', com:'#64748b', pn:'#38bdf8' }
  },
  off: {
    name: 'Default LeetCode', desc: 'Standard un-themed view', accent: '#94a3b8',
    pv: { bg:'#1a1a1a', text:'#eff1f6', line:'#404040', kw:'#c678dd', fn:'#61afef', num:'#d19a66', var:'#eff1f6', com:'#7f848e', pn:'#abb2bf' }
  }
};

const WALLPAPERS = [
  { id: 'blossom-night', name: 'Sakura Night', desc: 'Night temple blossoms', accent: '#ff7eb6' },
  { id: 'neon-rain', name: 'Neon Rain', desc: 'Cyberpunk rain metropolis', accent: '#06b6d4' },
  { id: 'starfield', name: 'Cosmic Starfield', desc: 'Deep starry galaxy & nebula', accent: '#818cf8' },
  { id: 'golden-hour', name: 'Golden Hour', desc: 'Warm sunset skyline', accent: '#f59e0b' },
  { id: 'blue-dragon', name: 'Azure Dragon', desc: 'Mythical dragon pagoda', accent: '#38bdf8' },
  { id: 'torii-forest', name: 'Torii Forest', desc: 'Misty torii shrine path', accent: '#f43f5e' },
  { id: 'city-cat', name: 'Midnight Cat', desc: 'Cozy rooftop cat under stars', accent: '#a78bfa' },
  { id: 'train-window', name: 'Train Journey', desc: 'Sunset railway reflection', accent: '#fb923c' },
  { id: 'moonlit-shrine', name: 'Moonlit Shrine', desc: 'Full moon over ancient shrine', accent: '#c084fc' },
  { id: 'harvest-moon', name: 'Harvest Moon', desc: 'Golden autumn leaves & moon', accent: '#eab308' },
  { id: 'forest-road', name: 'Emerald Forest', desc: 'Tranquil verdant woods road', accent: '#22c55e' },
  { id: 'moon-field', name: 'Starry Meadow', desc: 'Breezy grass field under stars', accent: '#34d399' },
  { id: 'crimson-dragon', name: 'Crimson Dragon', desc: 'Fiery dragon emperor realm', accent: '#ef4444' },
  { id: 'dragon-bride', name: 'Dragon Maiden', desc: 'Ethereal anime fantasy', accent: '#ec4899' },
  { id: 'new-year', name: 'Lantern Fest', desc: 'Warm glowing festival lanterns', accent: '#f97316' },
  { id: 'map-room', name: 'Grand Archives', desc: 'Scholarly candlelit library', accent: '#d97706' },
  { id: 'moon-wanderer', name: 'Moon Wanderer', desc: 'Solitary figure beneath moon', accent: '#93c5fd' },
  { id: 'sakura-dusk', name: 'Sakura Dusk', desc: 'Pink twilight petals drifting', accent: '#f472b6' }
];

const ORDER = ['tokyonight', 'catppuccin', 'sakura', 'paper', 'matrix', 'grid', 'orchid', 'dracula', 'nord', 'custom', 'off'];

function pvVars(pv) {
  return `--pv-bg:${pv.bg};--pv-text:${pv.text};--pv-line:${pv.line};`
       + `--pv-kw:${pv.kw};--pv-fn:${pv.fn};--pv-num:${pv.num};`
       + `--pv-var:${pv.var};--pv-com:${pv.com};--pv-pn:${pv.pn};`;
}

function renderGrid(selected) {
  const grid = document.getElementById('grid');
  if (!grid) return;
  grid.innerHTML = '';

  const CHECK = '<svg viewBox="0 0 12 12" fill="none" style="width:12px;height:12px;"><path d="M2.5 6.2 5 8.7 9.6 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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

    card.addEventListener('click', () => chooseTheme(id));
    grid.appendChild(card);
  });

  setAccent(selected);
}

function setAccent(id) {
  const t = THEMES[id] || THEMES.tokyonight;
  document.documentElement.style.setProperty('--pop-accent', t.accent);
}

function chooseTheme(id) {
  document.querySelectorAll('.card').forEach((c) =>
    c.setAttribute('aria-checked', String(c.dataset.id === id)));
  setAccent(id);

  chrome.storage.local.set({ lcTheme: id, lcThemeStudio: id });

  const status = document.getElementById('status');
  if (status) {
    status.textContent = id === 'off'
      ? 'Theme off. Standard LeetCode restored.'
      : `${THEMES[id].name} applied across your problem tabs!`;
  }
}

/* ---- Wallpaper Gallery Rendering ---- */
function renderWallpaperGrid(activePreset) {
  const wallGrid = document.getElementById('wallGrid');
  if (!wallGrid) return;
  wallGrid.innerHTML = '';

  WALLPAPERS.forEach((w) => {
    const card = document.createElement('button');
    card.className = 'wall-card';
    card.type = 'button';
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', String(w.id === activePreset));
    card.dataset.preset = w.id;
    card.style.setProperty('--card-accent', w.accent);

    card.innerHTML = `
      <img class="wall-thumb" src="../textures/anime/${w.id}-thumb.webp" alt="${w.name}" loading="lazy" />
      <span class="wall-badge">${w.id === activePreset ? '✓ Active' : 'Theme'}</span>
      <div class="wall-meta">
        <span class="wall-name">${w.name}</span>
        <span class="wall-desc">${w.desc}</span>
      </div>
    `;

    card.addEventListener('click', () => chooseWallpaper(w.id, w.accent, w.name));
    wallGrid.appendChild(card);
  });
}

function chooseWallpaper(preset, accent, name) {
  document.querySelectorAll('.wall-card').forEach((c) => {
    const isThis = c.dataset.preset === preset;
    c.setAttribute('aria-checked', String(isThis));
    const badge = c.querySelector('.wall-badge');
    if (badge) badge.textContent = isThis ? '✓ Active' : 'Theme';
  });

  const wallConfig = {
    preset: preset,
    dataUrl: null,
    opacity: customWallData.opacity,
    blur: customWallData.blur,
    accent: accent
  };

  chrome.storage.local.set({ lcWallpaper: wallConfig, lcCustomWallpaper: wallConfig });

  const status = document.getElementById('status');
  if (status) {
    status.textContent = `"${name}" wallpaper enabled across your problem tabs!`;
  }
}

function disableWallpaper() {
  document.querySelectorAll('.wall-card').forEach((c) => {
    c.setAttribute('aria-checked', 'false');
    const badge = c.querySelector('.wall-badge');
    if (badge) badge.textContent = 'Theme';
  });

  chrome.storage.local.remove(['lcWallpaper', 'lcCustomWallpaper']);

  const status = document.getElementById('status');
  if (status) {
    status.textContent = 'Wallpaper disabled. Pure solid theme restored.';
  }
}

/* ---- Boot & Initial Load ---- */
chrome.storage.local.get(['lcTheme', 'lcThemeStudio', 'lcWallpaper', 'lcCustomWallpaper'], (res) => {
  const selectedTheme = (res && res.lcTheme) || (res && res.lcThemeStudio) || 'tokyonight';
  renderGrid(selectedTheme);

  const activeWall = (res && res.lcWallpaper) || (res && res.lcCustomWallpaper);
  const activePreset = activeWall ? activeWall.preset : null;
  renderWallpaperGrid(activePreset);
});

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

/* ---- Sub Navigation (Color Themes vs Wallpaper Themes) ---- */
document.querySelectorAll('.sub-nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sub-nav-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.sub-pane').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.subtab);
    if (target) target.classList.add('active');
  });
});

const clearWallBtn = document.getElementById('clearWallBtn');
if (clearWallBtn) {
  clearWallBtn.addEventListener('click', disableWallpaper);
}

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

/* ---- Wallpaper Settings & Custom Uploader ---- */
const customWallToggle = document.getElementById('customWallToggle');
const customWallBody = document.getElementById('customWallBody');
const wallFileInput = document.getElementById('wallFileInput');
const wallUploadBtn = document.getElementById('wallUploadBtn');
const wallOpacityRange = document.getElementById('wallOpacityRange');
const wallOpacityVal = document.getElementById('wallOpacityVal');
const wallBlurRange = document.getElementById('wallBlurRange');
const wallBlurVal = document.getElementById('wallBlurVal');

let customWallData = {
  preset: null,
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

chrome.storage.local.get(['lcWallpaper', 'lcCustomWallpaper'], (res) => {
  const wall = (res && res.lcWallpaper) || (res && res.lcCustomWallpaper);
  if (wall) {
    customWallData = Object.assign(customWallData, wall);
    if (wallOpacityRange) wallOpacityRange.value = Math.round(customWallData.opacity * 100);
    if (wallOpacityVal) wallOpacityVal.textContent = Math.round(customWallData.opacity * 100) + '%';
    if (wallBlurRange) wallBlurRange.value = customWallData.blur;
    if (wallBlurVal) wallBlurVal.textContent = customWallData.blur + 'px';
  }
});

function updateActiveWallpaperSettings() {
  chrome.storage.local.get(['lcWallpaper', 'lcCustomWallpaper'], (res) => {
    const wall = (res && res.lcWallpaper) || (res && res.lcCustomWallpaper) || {};
    wall.opacity = customWallData.opacity;
    wall.blur = customWallData.blur;
    chrome.storage.local.set({ lcWallpaper: wall, lcCustomWallpaper: wall });
  });
}

if (wallFileInput && wallUploadBtn) {
  wallUploadBtn.addEventListener('click', () => wallFileInput.click());
  wallFileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      customWallData.dataUrl = evt.target.result;
      customWallData.preset = null;
      wallUploadBtn.textContent = '✓ ' + file.name.slice(0, 14);

      const wallConfig = {
        preset: null,
        dataUrl: customWallData.dataUrl,
        opacity: customWallData.opacity,
        blur: customWallData.blur,
        accent: '#38bdf8'
      };
      chrome.storage.local.set({ lcWallpaper: wallConfig, lcCustomWallpaper: wallConfig });

      document.querySelectorAll('.wall-card').forEach((c) => {
        c.setAttribute('aria-checked', 'false');
        const badge = c.querySelector('.wall-badge');
        if (badge) badge.textContent = 'Theme';
      });

      const status = document.getElementById('status');
      if (status) status.textContent = 'Custom wallpaper uploaded & applied!';
    };
    reader.readAsDataURL(file);
  });
}

if (wallOpacityRange && wallOpacityVal) {
  wallOpacityRange.addEventListener('input', () => {
    customWallData.opacity = parseInt(wallOpacityRange.value, 10) / 100;
    wallOpacityVal.textContent = wallOpacityRange.value + '%';
    updateActiveWallpaperSettings();
  });
}

if (wallBlurRange && wallBlurVal) {
  wallBlurRange.addEventListener('input', () => {
    customWallData.blur = parseInt(wallBlurRange.value, 10);
    wallBlurVal.textContent = wallBlurRange.value + 'px';
    updateActiveWallpaperSettings();
  });
}

/* ---- Editor Settings (Fonts, Ligatures, Size, Caret) ---- */
const fontSelect = document.getElementById('fontSelect');
const ligaturesToggle = document.getElementById('ligaturesToggle');
const fontSizeRange = document.getElementById('fontSizeRange');
const fontSizeVal = document.getElementById('fontSizeVal');
const cursorSelect = document.getElementById('cursorSelect');

function saveEditorSettings() {
  const settings = {
    font: fontSelect ? fontSelect.value : 'jetbrains',
    ligatures: ligaturesToggle ? ligaturesToggle.checked : true,
    fontSize: fontSizeRange ? parseInt(fontSizeRange.value, 10) : 14,
    lineHeight: 1.5,
    cursorStyle: cursorSelect ? cursorSelect.value : 'smooth'
  };
  chrome.storage.local.set({ lcEditorSettings: settings });
}

if (fontSelect && ligaturesToggle && fontSizeRange && cursorSelect) {
  chrome.storage.local.get('lcEditorSettings', (res) => {
    const s = res && res.lcEditorSettings ? res.lcEditorSettings : {};
    if (s.font) fontSelect.value = s.font;
    if (s.ligatures !== undefined) ligaturesToggle.checked = !!s.ligatures;
    if (s.fontSize) {
      fontSizeRange.value = s.fontSize;
      if (fontSizeVal) fontSizeVal.textContent = s.fontSize + 'px';
    }
    if (s.cursorStyle) cursorSelect.value = s.cursorStyle;
  });

  fontSelect.addEventListener('change', saveEditorSettings);
  ligaturesToggle.addEventListener('change', saveEditorSettings);
  fontSizeRange.addEventListener('input', () => {
    if (fontSizeVal) fontSizeVal.textContent = fontSizeRange.value + 'px';
    saveEditorSettings();
  });
  cursorSelect.addEventListener('change', saveEditorSettings);
}

/* ---- Interview Blind Mode ---- */
const blindMaster = document.getElementById('blindMasterToggle');
const blindDiff = document.getElementById('blindDiffToggle');
const blindTags = document.getElementById('blindTagsToggle');
const blindStats = document.getElementById('blindStatsToggle');

function saveBlindMode() {
  const mode = {
    active: blindMaster ? blindMaster.checked : false,
    hideDifficulty: blindDiff ? blindDiff.checked : true,
    blurTags: blindTags ? blindTags.checked : true,
    hideStats: blindStats ? blindStats.checked : true
  };
  chrome.storage.local.set({ lcBlindMode: mode });
}

if (blindMaster && blindDiff && blindTags && blindStats) {
  chrome.storage.local.get('lcBlindMode', (res) => {
    const b = res && res.lcBlindMode ? res.lcBlindMode : {};
    blindMaster.checked = !!b.active;
    if (b.hideDifficulty !== undefined) blindDiff.checked = !!b.hideDifficulty;
    if (b.blurTags !== undefined) blindTags.checked = !!b.blurTags;
    if (b.hideStats !== undefined) blindStats.checked = !!b.hideStats;
  });

  [blindMaster, blindDiff, blindTags, blindStats].forEach((el) => {
    el.addEventListener('change', saveBlindMode);
  });
}

/* ---- Tools (Timer & Zen Mode) ---- */
const timerToggle = document.getElementById('timerToggle');
if (timerToggle) {
  chrome.storage.local.get('lcTimerEnabled', (res) => {
    timerToggle.checked = !!(res && res.lcTimerEnabled);
  });
  timerToggle.addEventListener('change', () => {
    chrome.storage.local.set({ lcTimerEnabled: timerToggle.checked });
  });
}

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
if (dayNightToggle) {
  chrome.storage.local.get('lcDayNight', (res) => {
    const dn = res && res.lcDayNight ? res.lcDayNight : {};
    dayNightToggle.checked = !!dn.enabled;
  });
  dayNightToggle.addEventListener('change', () => {
    chrome.storage.local.get('lcDayNight', (res) => {
      const prev = res && res.lcDayNight ? res.lcDayNight : { mode: 'time', dayTheme: 'paper', nightTheme: 'tokyonight' };
      prev.enabled = dayNightToggle.checked;
      chrome.storage.local.set({ lcDayNight: prev });
    });
  });
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
