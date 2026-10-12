/* =============================================================================
   content.js (isolated world, LeetCode)
   Theme & Wallpaper Engine.
   Applies wallpaper themes, solid color themes, and custom glass styling.
============================================================================= */
(() => {
  'use strict';

  const THEME_KEY = 'lcTheme';
  const SCENE_KEY = 'lcAnimeScene';
  const DEFAULT_THEME = 'anime';
  const DEFAULT_SCENE = 'blossom-night';
  const STYLE_ID = 'lcts-wallpaper-theme-style';

  const root = document.documentElement;
  let currentTheme = null;
  let currentScene = null;

  function rgba(hex, a) {
    if (!hex || !hex.startsWith('#')) return `rgba(15, 23, 42, ${+a.toFixed(3)})`;
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${+a.toFixed(3)})`;
  }

  function over(total, under) {
    return Math.max(0, 1 - (1 - total) / (1 - under));
  }

  function getStyleEl() {
    let el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      (document.head || root).appendChild(el);
    }
    return el;
  }

  function buildPresetCSS(sceneId, scene) {
    const wallUrl = chrome.runtime.getURL(scene.wall);
    const blurUrl = chrome.runtime.getURL(scene.blur);
    const t = scene.theme;
    const r = t.roles, a = t.alpha, scrim = t.scrim;

    const veil = (x) => `linear-gradient(${rgba(scrim, x)},${rgba(scrim, x)})`;
    const wall = `url("${wallUrl}")`;
    const blur = `url("${blurUrl}")`;

    const out = Object.keys(r).map((k) => `${k}:${r[k]} !important;`);
    out.push(
      `color-scheme:${t.mode} !important;`,
      `--lc-anime-scrim:${scrim} !important;`,
      `--lc-anime-desk:${veil(a.desk)},${wall} !important;`,
      `--lc-anime-glass:${rgba(scrim, over(a.panel, a.desk))} !important;`,
      `--lc-anime-editor:${veil(a.editor)},${blur} !important;`,
      `--lc-nav-bg:${rgba(scrim, a.nav)} !important;`
    );
    return `html[data-lc-theme="anime"] { ${out.join('')} }`;
  }

  function buildCustomCSS(art) {
    const wall = `url("${art.dataUrl}")`;
    const scrim = '#0f172a';
    const op = art.opacity !== undefined ? art.opacity : 0.82;
    const blurPx = art.blur || 0;
    const veil = (x) => `linear-gradient(${rgba(scrim, x)},${rgba(scrim, x)})`;

    return `
      html[data-lc-theme="anime"] {
        color-scheme: dark !important;
        --lc-custom-blur: ${blurPx}px !important;
        --lc-anime-scrim: ${scrim} !important;
        --lc-anime-desk: ${veil(0.18)}, ${wall} !important;
        --lc-anime-glass: rgba(15, 23, 42, ${op}) !important;
        --lc-anime-editor: ${veil(op)}, ${wall} !important;
        --lc-nav-bg: rgba(15, 23, 42, 0.88) !important;
        --lc-bg: transparent !important;
        --lc-panel: rgba(15, 23, 42, ${op}) !important;
        --lc-panel-elevated: rgba(30, 41, 59, ${Math.min(1, op + 0.05)}) !important;
        --lc-border: rgba(255, 255, 255, 0.14) !important;
        --lc-text: #f8fafc !important;
        --lc-text2: #cbd5e1 !important;
        --lc-text3: #94a3b8 !important;
        --lc-accent: #38bdf8 !important;
        --lc-submit-bg: #38bdf8 !important;
        --lc-submit-text: #0f172a !important;
        --lc-glow: rgba(56, 189, 248, 0.4) !important;
      }
    `;
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

  function apply(theme, sceneId, customArt) {
    if (!theme) theme = DEFAULT_THEME;
    currentTheme = theme;
    currentScene = sceneId || DEFAULT_SCENE;

    if (theme === 'off') {
      root.removeAttribute('data-lc-theme');
      root.removeAttribute('data-lc-scene');
      const style = document.getElementById(STYLE_ID);
      if (style) style.textContent = '';
      return;
    }

    const scenes = globalThis.LCTS_SCENES || {};

    // Is it an anime/wallpaper scene?
    if (theme === 'anime' || scenes[theme] || theme === 'custom') {
      let activePreset = scenes[theme] ? theme : currentScene;

      if (theme === 'custom' || activePreset === 'custom') {
        root.setAttribute('data-lc-theme', 'anime');
        root.setAttribute('data-lc-scene', 'custom');
        setMode(true);
        if (customArt && customArt.dataUrl) {
          getStyleEl().textContent = buildCustomCSS(customArt);
        }
      } else {
        if (!scenes[activePreset]) activePreset = DEFAULT_SCENE;
        const s = scenes[activePreset];
        root.setAttribute('data-lc-theme', 'anime');
        root.setAttribute('data-lc-scene', activePreset);
        getStyleEl().textContent = buildPresetCSS(activePreset, s);
        setMode(s.theme.mode !== 'light');
        globalThis.__lctsSceneInk = s.theme.ink;
      }
    } else {
      // Solid color theme
      root.removeAttribute('data-lc-scene');
      root.setAttribute('data-lc-theme', theme);
      const style = document.getElementById(STYLE_ID);
      if (style) style.textContent = '';
      const isDark = theme !== 'paper';
      setMode(isDark);
      globalThis.__lctsSceneInk = null;
    }

    window.dispatchEvent(new CustomEvent('lcts-theme-changed'));
  }

  // Load and apply theme on boot
  chrome.storage.local.get([THEME_KEY, 'lcThemeStudio', SCENE_KEY, 'lcCustomWallpaper', 'lcFocus'], (res) => {
    const theme = (res && res[THEME_KEY]) || (res && res.lcThemeStudio) || DEFAULT_THEME;
    const scene = (res && res[SCENE_KEY]) || DEFAULT_SCENE;
    const customArt = (res && res.lcCustomWallpaper) || null;
    root.toggleAttribute('data-lc-focus', !!(res && res.lcFocus));
    apply(theme, scene, customArt);
  });

  // Listen for live storage updates
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;

    if (changes.lcFocus) {
      root.toggleAttribute('data-lc-focus', !!changes.lcFocus.newValue);
    }

    if (changes[THEME_KEY] || changes.lcThemeStudio || changes[SCENE_KEY] || changes.lcCustomWallpaper) {
      chrome.storage.local.get([THEME_KEY, 'lcThemeStudio', SCENE_KEY, 'lcCustomWallpaper'], (res) => {
        const theme = (res && res[THEME_KEY]) || (res && res.lcThemeStudio) || DEFAULT_THEME;
        const scene = (res && res[SCENE_KEY]) || DEFAULT_SCENE;
        const customArt = (res && res.lcCustomWallpaper) || null;
        apply(theme, scene, customArt);
      });
    }
  });

  // Ensure body receives theme mode when attached
  if (!document.body) {
    new MutationObserver((_, obs) => {
      if (!document.body) return;
      obs.disconnect();
      if (currentTheme) apply(currentTheme, currentScene);
    }).observe(root, { childList: true });
  }
})();
