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
  let currentWallpaper = null;
  let focusActive = false;

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
    currentWallpaper = config;
    const layer = ensureWallpaperLayer();
    if (!layer) return;

    if (focusActive || currentTheme === 'off' || !config || (!config.preset && !config.dataUrl)) {
      layer.style.display = 'none';
      root.removeAttribute('data-lc-has-wallpaper');
      return;
    }

    let bgUrl = '';
    if (config.dataUrl) {
      bgUrl = config.dataUrl;
    } else if (config.preset) {
      bgUrl = chrome.runtime.getURL(`textures/anime/${config.preset}.webp`);
    }

    if (!bgUrl) {
      layer.style.display = 'none';
      root.removeAttribute('data-lc-has-wallpaper');
      return;
    }

    layer.style.backgroundImage = `url("${bgUrl}")`;
    layer.style.display = 'block';
    root.setAttribute('data-lc-has-wallpaper', 'true');

    root.style.setProperty('--lc-custom-blur', `${config.blur || 0}px`);
    root.style.setProperty('--lc-custom-opacity', `${config.opacity !== undefined ? config.opacity : 0.85}`);
    root.style.setProperty('--lc-wallpaper-layer-opacity', `${config.layerOpacity !== undefined ? config.layerOpacity : 1}`);
    if (config.accent) {
      root.style.setProperty('--lc-custom-accent', config.accent);
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
      root.removeAttribute('data-lc-has-wallpaper');
      const layer = document.getElementById(WALLPAPER_ID);
      if (layer) layer.style.display = 'none';
      return;
    }

    root.setAttribute('data-lc-theme', theme);
    const isDark = !LIGHT_THEMES.has(theme);
    setMode(isDark);

    // Re-apply wallpaper with updated theme state
    applyWallpaper(currentWallpaper);
  }

  // Load and apply theme and wallpaper on boot
  chrome.storage.local.get([STORAGE_KEY, 'lcThemeStudio', 'lcWallpaper', 'lcCustomWallpaper', 'lcFocus'], (res) => {
    const theme = (res && res[STORAGE_KEY]) || (res && res.lcThemeStudio) || DEFAULT_THEME;
    focusActive = !!(res && res.lcFocus);
    currentWallpaper = (res && res.lcWallpaper) || (res && res.lcCustomWallpaper) || null;
    applyTheme(theme);
    applyWallpaper(currentWallpaper);
  });

  // Listen for live storage updates
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;

    if (changes.lcFocus) {
      focusActive = !!changes.lcFocus.newValue;
      applyWallpaper(currentWallpaper);
    }

    if (changes[STORAGE_KEY]) {
      applyTheme(changes[STORAGE_KEY].newValue || DEFAULT_THEME);
    } else if (changes.lcThemeStudio && !changes[STORAGE_KEY]) {
      applyTheme(changes.lcThemeStudio.newValue || DEFAULT_THEME);
    }

    if (changes.lcWallpaper) {
      applyWallpaper(changes.lcWallpaper.newValue);
    } else if (changes.lcCustomWallpaper && !changes.lcWallpaper) {
      applyWallpaper(changes.lcCustomWallpaper.newValue);
    }
  });

  // Ensure body receives theme mode when attached
  if (!document.body) {
    new MutationObserver((_, obs) => {
      if (!document.body) return;
      obs.disconnect();
      if (currentTheme) applyTheme(currentTheme);
      if (currentWallpaper) applyWallpaper(currentWallpaper);
    }).observe(root, { childList: true });
  }
})();
