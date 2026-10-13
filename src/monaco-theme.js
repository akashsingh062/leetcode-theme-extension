/* =============================================================================
   monaco-theme.js (isolated world, LeetCode)
   Clean-Room Monaco Editor Syntax Highlighter.
   Applies curated syntax palettes to Monaco editor tokens across all themes.
============================================================================= */
(() => {
  'use strict';

  const STYLE_ID = 'lcts-monaco-theme';

  const PALETTES = {
    tokyonight: {
      keyword: '#bb9af7',
      control: '#9d7cd8',
      string: '#9ece6a',
      number: '#ff9e64',
      func: '#7aa2f7',
      type: '#2ac3de',
      variable: '#c0caf5',
      param: '#e0af68',
      comment: '#565f89',
      operator: '#89ddff'
    },
    catppuccin: {
      keyword: '#cba6f7',
      control: '#f38ba8',
      string: '#a6e3a1',
      number: '#fab387',
      func: '#89b4fa',
      type: '#f9e2af',
      variable: '#cdd6f4',
      param: '#eba0ac',
      comment: '#6c7086',
      operator: '#94e2d5'
    },
    sakura: {
      keyword: '#ff7eb6',
      control: '#ff7eb6',
      string: '#ffd479',
      number: '#b98cff',
      func: '#6ee7f0',
      type: '#7ee8a5',
      variable: '#ece9ff',
      param: '#c9a6ff',
      comment: '#7e7399',
      operator: '#ff9ec8'
    },
    paper: {
      keyword: '#7f1d1d',
      control: '#701a75',
      string: '#14532d',
      number: '#0e7490',
      func: '#1e3a8a',
      type: '#581c87',
      variable: '#292524',
      param: '#1e293b',
      comment: '#78716c',
      operator: '#44403c'
    },
    matrix: {
      keyword: '#22c55e',
      control: '#4ade80',
      string: '#86efac',
      number: '#facc15',
      func: '#38bdf8',
      type: '#a7f3d0',
      variable: '#e2fced',
      param: '#bbf7d0',
      comment: '#4b6354',
      operator: '#10b981'
    },
    grid: {
      keyword: '#38bdf8',
      control: '#818cf8',
      string: '#34d399',
      number: '#fb923c',
      func: '#06b6d4',
      type: '#a78bfa',
      variable: '#e2e8f0',
      param: '#94a3b8',
      comment: '#64748b',
      operator: '#0ea5e9'
    },
    orchid: {
      keyword: '#d946ef',
      control: '#f43f5e',
      string: '#fde047',
      number: '#fb7185',
      func: '#c084fc',
      type: '#e879f9',
      variable: '#f3e8ff',
      param: '#f5d0fe',
      comment: '#705888',
      operator: '#e879f9'
    },
    dracula: {
      keyword: '#ff79c6',
      control: '#ff79c6',
      string: '#f1fa8c',
      number: '#bd93f9',
      func: '#50fa7b',
      type: '#8be9fd',
      variable: '#f8f8f2',
      param: '#ffb86c',
      comment: '#6272a4',
      operator: '#ff79c6'
    },
    nord: {
      keyword: '#81a1c1',
      control: '#81a1c1',
      string: '#a3be8c',
      number: '#b48ead',
      func: '#88c0d0',
      type: '#8fbcbb',
      variable: '#eceff4',
      param: '#d8dee9',
      comment: '#616e88',
      operator: '#81a1c1'
    },
    custom: {
      keyword: '#38bdf8',
      control: '#818cf8',
      string: '#34d399',
      number: '#fb923c',
      func: '#06b6d4',
      type: '#a78bfa',
      variable: '#f8fafc',
      param: '#94a3b8',
      comment: '#64748b',
      operator: '#0ea5e9'
    }
  };

  // Known VS Code / Monaco default token hex mappings
  const ROLE_MAP = {
    // Dark+ / Monaco Default Dark
    '569cd6': 'keyword',
    c586c0: 'control',
    ce9178: 'string',
    b5cea8: 'number',
    dcdcaa: 'func',
    '4ec9b0': 'type',
    d4d4d4: 'variable',
    '9cdcfe': 'param',
    '6a9955': 'comment',
    808080: 'comment',
    '608b4e': 'comment',
    da70d6: 'operator',
    ffd700: 'operator',
    '179fff': 'operator',
    d16969: 'regex',
    f44747: 'error',
    '3dc9b0': 'type',
    '4fc1ff': 'type',
    c8c8c8: 'variable',

    // Light / Monaco Default Light (vs)
    '0000ff': 'keyword',
    af00db: 'control',
    a31515: 'string',
    '098658': 'number',
    '795e26': 'func',
    '267f99': 'type',
    '001080': 'variable',
    '008000': 'comment',
    '811f3f': 'regex',
    cd3131: 'error',
    '0451a5': 'variable',

    // High Contrast
    '00ffff': 'type',
    ff00ff: 'keyword',
    ffff00: 'string',
    '00ff00': 'comment'
  };

  // Pre-seed all palette colors to prevent recursive reclassification
  for (const palName in PALETTES) {
    const pal = PALETTES[palName];
    for (const role in pal) {
      const h = pal[role].replace('#', '').toLowerCase();
      if (!ROLE_MAP[h]) ROLE_MAP[h] = role;
    }
  }

  // Pre-seeded standard Monarch/Monaco token class mappings
  const CLASSIFIED_CLASSES = new Map([
    ['1', 'variable'],
    ['2', 'comment'],
    ['3', 'comment'],
    ['4', 'type'],
    ['5', 'keyword'],
    ['6', 'type'],
    ['7', 'string'],
    ['8', 'number'],
    ['9', 'func'],
    ['10', 'control'],
    ['11', 'param'],
    ['12', 'operator'],
    ['13', 'regex'],
    ['14', 'operator'],
    ['22', 'type']
  ]);

  let activeMonacoOverride = 'default';

  function hexToHsl(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3)
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    const num = parseInt(hex, 16);
    if (isNaN(num)) return { h: 0, s: 0, l: 50 };
    const r = ((num >> 16) & 255) / 255;
    const g = ((num >> 8) & 255) / 255;
    const b = (num & 255) / 255;

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function classifyHex(hex) {
    hex = hex.toLowerCase();
    if (ROLE_MAP[hex]) return ROLE_MAP[hex];

    const { h, s, l } = hexToHsl(hex);
    if (s < 18) {
      return l < 58 ? 'comment' : 'variable';
    }
    if (h >= 75 && h <= 155) {
      return s < 45 && l < 50 ? 'comment' : 'string';
    }
    if (h >= 255 && h <= 325) {
      return 'keyword';
    }
    if (h >= 170 && h < 255) {
      return h < 210 ? 'type' : 'func';
    }
    if (h >= 25 && h < 75) {
      return h >= 40 && h <= 68 ? 'func' : 'number';
    }
    if (h >= 325 || h < 25) {
      return 'control';
    }
    return 'variable';
  }

  function normalizeColorToHex(color) {
    if (!color) return null;
    color = color.trim().toLowerCase();
    if (color.startsWith('#')) {
      let h = color.replace('#', '');
      if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
      if (h.length >= 6) return h.slice(0, 6);
      return null;
    }
    const rgbMatch = color.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10).toString(16).padStart(2, '0');
      const g = parseInt(rgbMatch[2], 10).toString(16).padStart(2, '0');
      const b = parseInt(rgbMatch[3], 10).toString(16).padStart(2, '0');
      return `${r}${g}${b}`;
    }
    return null;
  }

  function getActivePalette() {
    if (activeMonacoOverride !== 'default' && PALETTES[activeMonacoOverride]) {
      return PALETTES[activeMonacoOverride];
    }
    const sceneId = document.documentElement.getAttribute('data-lc-scene');
    if (sceneId && globalThis.LCTS_SCENES && globalThis.LCTS_SCENES[sceneId]) {
      return globalThis.LCTS_SCENES[sceneId].theme.ink;
    }
    if (globalThis.__lctsSceneInk) {
      return globalThis.__lctsSceneInk;
    }
    const theme = document.documentElement.getAttribute('data-lc-theme') || 'tokyonight';
    return PALETTES[theme] || PALETTES.tokyonight;
  }

  function scanTextForTokens(text) {
    if (!text || !text.includes('.mtk')) return;
    const regex = /\.mtk(\d+)\s*\{[^}]*color:\s*(#[0-9a-fA-F]{3,8}|rgb\([^)]+\))/g;
    let m;
    while ((m = regex.exec(text)) !== null) {
      const cls = m[1];
      const hex = normalizeColorToHex(m[2]);
      if (!hex) continue;
      const role = classifyHex(hex);
      if (role !== 'variable' || !CLASSIFIED_CLASSES.has(cls)) {
        CLASSIFIED_CLASSES.set(cls, role);
      }
    }
  }

  function scanExistingStyles() {
    const styles = document.querySelectorAll('style');
    for (const s of styles) {
      // CRITICAL: NEVER scan our own generated theme style sheet!
      if (s.id === STYLE_ID) continue;

      if (s.textContent) {
        scanTextForTokens(s.textContent);
      }

      try {
        if (s.sheet && s.sheet.cssRules) {
          for (let i = 0; i < s.sheet.cssRules.length; i++) {
            const rule = s.sheet.cssRules[i];
            if (rule.cssText && rule.cssText.includes('.mtk')) {
              scanTextForTokens(rule.cssText);
            }
          }
        }
      } catch (e) {
        // Safe to ignore CORS/security exceptions on external sheets
      }
    }
  }

  function applyHighlighting() {
    scanExistingStyles();
    const pal = getActivePalette();

    let css = `
      /* Monaco Theme Enhancement */
      .monaco-editor .bracket-match {
        border-bottom: 2px solid ${pal.keyword || pal.func} !important;
        background-color: rgba(255, 255, 255, 0.08) !important;
      }
      .monaco-editor .current-line {
        background: rgba(255, 255, 255, 0.035) !important;
      }
      .monaco-editor .selected-text {
        background: rgba(122, 162, 247, 0.28) !important;
      }
    `;

    CLASSIFIED_CLASSES.forEach((role, cls) => {
      const color = pal[role] || pal.variable;
      css += `
        .monaco-editor .mtk${cls},
        .monaco-editor .view-line .mtk${cls},
        .monaco-editor .view-lines .mtk${cls},
        span.mtk${cls} {
          color: ${color} !important;
        }
      `;
    });

    let el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(el);
    }
    el.textContent = css;
  }

  // Initial load from storage
  chrome.storage.local.get('lcMonacoTheme', (res) => {
    if (res && res.lcMonacoTheme) activeMonacoOverride = res.lcMonacoTheme;
    applyHighlighting();
  });

  // Live storage change listener
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    if (changes.lcMonacoTheme) {
      activeMonacoOverride = changes.lcMonacoTheme.newValue || 'default';
      applyHighlighting();
    }
    if (changes.lcTheme) {
      applyHighlighting();
    }
  });

  // Watch for theme and scene attribute changes on documentElement
  new MutationObserver(() => applyHighlighting()).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-lc-theme', 'data-lc-scene']
  });

  window.addEventListener('lcts-theme-changed', () => applyHighlighting());

  // Watch for newly inserted style tags in <head>
  const headObserver = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.tagName === 'STYLE' && node.id !== STYLE_ID) {
          shouldUpdate = true;
          break;
        }
      }
      if (shouldUpdate) break;
    }
    if (shouldUpdate) applyHighlighting();
  });

  if (document.head) {
    headObserver.observe(document.head, { childList: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.head) headObserver.observe(document.head, { childList: true });
    });
  }

  // Periodic heartbeat every 2s ensures dynamic editor/language switches are styled
  setInterval(applyHighlighting, 2000);
})();
