/* =============================================================================
   content.js (isolated world, LeetCode)
   - Applies the saved theme to <html> as early as possible via data-lc-theme
     (that attribute drives themes/*.css AND is read by inject.js in the MAIN world).
   - Forces LeetCode's own light/dark mode to match, the way the site expects it:
     the `dark` class on <html> and <body>, plus data-theme. This is what makes
     dark: utilities resolve, so hardcoded light surfaces go dark too.
   - Switches live: a change in the popup lands here through storage.onChanged,
     and 'off' hands LeetCode back the mode it had, with no reload.
   - Re-asserts on SPA navigation / when LeetCode toggles its own theme.
============================================================================= */
(() => {
  const KEY = 'lcThemeStudio';
  const ALT_KEY = 'lcTheme';
  const DEFAULT = 'anime';
  const DARK_THEMES = new Set([
    'sakura',
    'grid',
    'bloom',
    'orchid',
    'pixel',
    'crawler',
    'tokyonight',
    'catppuccin',
    'dracula',
    'nord',
    'matrix'
  ]); // paper is light
  const VALID = new Set([
    'paper',
    'sakura',
    'grid',
    'bloom',
    'orchid',
    'anime',
    'crawler',
    'game',
    'pixel',
    'tokyonight',
    'catppuccin',
    'dracula',
    'nord',
    'matrix',
    'off'
  ]);

  const isDark = (theme) =>
    theme === 'anime'
      ? globalThis.__lctsAnimeMode !== 'light'
      : theme === 'game'
        ? globalThis.__lctsGameMode !== 'light'
        : DARK_THEMES.has(theme);
  const root = document.documentElement;

  const site = {
    dark: root.classList.contains('dark'),
    light: root.classList.contains('light'),
    dataTheme: root.getAttribute('data-theme'),
    scheme: root.style.colorScheme,
    bodySeen: false,
    bodyDark: false,
    bodyLight: false
  };
  function captureBody() {
    if (site.bodySeen || !document.body) return;
    site.bodySeen = true;
    site.bodyDark = document.body.classList.contains('dark');
    site.bodyLight = document.body.classList.contains('light');
  }

  let current = null;

  function setBaseMode(theme) {
    const dark = isDark(theme);
    root.classList.toggle('dark', dark);
    root.classList.toggle('light', !dark);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (document.body) {
      captureBody();
      document.body.classList.toggle('dark', dark);
      document.body.classList.toggle('light', !dark);
    }
    root.style.colorScheme = dark ? 'dark' : 'light';
  }

  function restoreBaseMode() {
    root.classList.toggle('dark', site.dark);
    root.classList.toggle('light', site.light);
    if (site.dataTheme === null) root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', site.dataTheme);
    root.style.colorScheme = site.scheme;
    if (document.body && site.bodySeen) {
      document.body.classList.toggle('dark', site.bodyDark);
      document.body.classList.toggle('light', site.bodyLight);
    }
  }

  function apply(theme) {
    if (!VALID.has(theme)) theme = DEFAULT;
    if (theme === current) return;
    const was = current;
    current = theme;
    if (theme === 'off') {
      root.removeAttribute('data-lc-theme');
      if (was !== null) restoreBaseMode();
      return;
    }
    root.setAttribute('data-lc-theme', theme);
    setBaseMode(theme);
  }

  globalThis.__lctsReassertMode = () => {
    if (current && current !== 'off') setBaseMode(current);
  };

  apply(DEFAULT);
  function syncMonacoTheme(val) {
    if (val && val !== 'default') {
      root.setAttribute('data-lc-monaco-theme', val);
    } else {
      root.removeAttribute('data-lc-monaco-theme');
    }
  }

  chrome.storage.local.get(['lcMonacoTheme', KEY, ALT_KEY], (res) => {
    syncMonacoTheme(res && res.lcMonacoTheme);
    apply((res && res[KEY]) || (res && res[ALT_KEY]) || DEFAULT);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes.lcMonacoTheme) syncMonacoTheme(changes.lcMonacoTheme.newValue);
    if (changes[KEY]) apply(changes[KEY].newValue || DEFAULT);
    else if (changes[ALT_KEY]) apply(changes[ALT_KEY].newValue || DEFAULT);
  });

  // body may not exist at document_start; sync the base classes onto it once ready.
  if (!document.body) {
    new MutationObserver((_, obs) => {
      if (!document.body) return;
      obs.disconnect();
      if (current !== 'off') setBaseMode(current);
    }).observe(root, { childList: true });
  }

  // Re-assert if LeetCode's SPA / its own theme switch overrides us.
  const guard = new MutationObserver(() => {
    if (current === 'off') return;
    if (root.getAttribute('data-lc-theme') !== current) root.setAttribute('data-lc-theme', current);
    const dark = isDark(current);
    if (root.classList.contains('dark') !== dark) {
      site.dark = root.classList.contains('dark');
      site.light = root.classList.contains('light');
      setBaseMode(current);
    }
  });
  guard.observe(root, {
    attributes: true,
    attributeFilter: ['class', 'data-lc-theme', 'data-theme']
  });

  /* Custom Wallpaper support for developer and solid themes */
  function syncWallpaper(customWall, animeArt) {
    if (current === 'anime' || current === 'off') {
      root.removeAttribute('data-lc-has-wallpaper');
      return;
    }
    const wallUrl =
      (customWall && (customWall.dataUrl || customWall.url)) || (animeArt && animeArt.wall) || null;
    if (wallUrl && (!customWall || customWall.enabled !== false)) {
      root.setAttribute('data-lc-has-wallpaper', 'true');
      root.style.setProperty('--lc-wallpaper-url', `url("${wallUrl}")`);
      const opacity =
        customWall && typeof customWall.opacity === 'number' ? customWall.opacity : 0.22;
      root.style.setProperty('--lc-wallpaper-opacity', String(opacity));
      const blur = customWall && typeof customWall.blur === 'number' ? customWall.blur : 0;
      root.style.setProperty('--lc-wallpaper-blur', `${blur}px`);
    } else {
      root.removeAttribute('data-lc-has-wallpaper');
      root.style.removeProperty('--lc-wallpaper-url');
    }
  }

  chrome.storage.local.get(['lcCustomWallpaper', 'lcAnimeArt'], (res) => {
    syncWallpaper(res && res.lcCustomWallpaper, res && res.lcAnimeArt);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes.lcCustomWallpaper || changes.lcAnimeArt || changes[KEY] || changes[ALT_KEY]) {
      chrome.storage.local.get(['lcCustomWallpaper', 'lcAnimeArt'], (res) => {
        syncWallpaper(res && res.lcCustomWallpaper, res && res.lcAnimeArt);
      });
    }
  });
})();
