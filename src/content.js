/* =============================================================================
   content.js (isolated world, LeetCode)
   Clean-Room Theme Engine.
   Applies selected theme, synchronizes dark/light mode, and mounts custom wallpapers.
============================================================================= */
(() => {
  'use strict';

  const STORAGE_KEY = 'lcTheme';
  const DEFAULT_THEME = 'tokyonight';
  const LIGHT_THEMES = new Set(['paper']);
  const WALLPAPER_ID = 'lcts-custom-wallpaper-layer';

  const root = document.documentElement;
  let currentTheme = null;

  function ensureWallpaperLayer() {
    let layer = document.getElementById(WALLPAPER_ID);
    if (!layer && (document.body || root)) {
      layer = document.createElement('div');
      layer.id = WALLPAPER_ID;
      (document.body || root).prepend(layer);
    }
    return layer;
  }

  function applyWallpaper(config) {
    const layer = ensureWallpaperLayer();
    if (!layer) return;

    if (config && config.dataUrl) {
      layer.style.backgroundImage = `url("${config.dataUrl}")`;
      layer.style.display = 'block';
      root.style.setProperty('--lc-custom-blur', `${config.blur || 0}px`);
      root.style.setProperty('--lc-custom-opacity', `${config.opacity !== undefined ? config.opacity : 0.85}`);
      if (config.accent) {
        root.style.setProperty('--lc-custom-accent', config.accent);
      }
    } else {
      layer.style.display = 'none';
    }
  }

  function setMode(isDark) {
    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (document.body) {
      document.body.classList.toggle('dark', isDark);
      document.body.classList.toggle('light', !isDark);
    }
    root.style.colorScheme = isDark ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (!theme) theme = DEFAULT_THEME;
    currentTheme = theme;

    if (theme === 'off') {
      root.removeAttribute('data-lc-theme');
      const layer = document.getElementById(WALLPAPER_ID);
      if (layer) layer.style.display = 'none';
      return;
    }

    root.setAttribute('data-lc-theme', theme);
    const isDark = !LIGHT_THEMES.has(theme);
    setMode(isDark);

    if (theme === 'custom') {
      chrome.storage.local.get('lcCustomWallpaper', (res) => {
        applyWallpaper(res && res.lcCustomWallpaper);
      });
    } else {
      const layer = document.getElementById(WALLPAPER_ID);
      if (layer) layer.style.display = 'none';
    }
  }

  // Load and apply theme on boot
  chrome.storage.local.get([STORAGE_KEY, 'lcThemeStudio', 'lcCustomWallpaper'], (res) => {
    // Graceful backward compatibility with lcThemeStudio
    const theme = (res && res[STORAGE_KEY]) || (res && res.lcThemeStudio) || DEFAULT_THEME;
    applyTheme(theme);
  });

  // Listen for live storage updates
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;

    if (changes[STORAGE_KEY]) {
      applyTheme(changes[STORAGE_KEY].newValue || DEFAULT_THEME);
    } else if (changes.lcThemeStudio && !changes[STORAGE_KEY]) {
      applyTheme(changes.lcThemeStudio.newValue || DEFAULT_THEME);
    }

    if (changes.lcCustomWallpaper && currentTheme === 'custom') {
      applyWallpaper(changes.lcCustomWallpaper.newValue);
    }
  });

  // Ensure body receives theme mode when attached
  if (!document.body) {
    new MutationObserver((_, obs) => {
      if (!document.body) return;
      obs.disconnect();
      if (currentTheme) applyTheme(currentTheme);
    }).observe(root, { childList: true });
  }
})();
