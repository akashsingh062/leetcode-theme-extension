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
      keyword: '#bb9af7', control: '#9d7cd8', string: '#9ece6a', number: '#ff9e64',
      func: '#7aa2f7', type: '#2ac3de', variable: '#c0caf5', param: '#e0af68',
      comment: '#565f89', operator: '#89ddff'
    },
    catppuccin: {
      keyword: '#cba6f7', control: '#f38ba8', string: '#a6e3a1', number: '#fab387',
      func: '#89b4fa', type: '#f9e2af', variable: '#cdd6f4', param: '#eba0ac',
      comment: '#6c7086', operator: '#94e2d5'
    },
    sakura: {
      keyword: '#ff7eb6', control: '#ff7eb6', string: '#ffd479', number: '#b98cff',
      func: '#6ee7f0', type: '#7ee8a5', variable: '#ece9ff', param: '#c9a6ff',
      comment: '#7e7399', operator: '#ff9ec8'
    },
    paper: {
      keyword: '#7f1d1d', control: '#701a75', string: '#14532d', number: '#0e7490',
      func: '#1e3a8a', type: '#581c87', variable: '#292524', param: '#1e293b',
      comment: '#78716c', operator: '#44403c'
    },
    matrix: {
      keyword: '#22c55e', control: '#4ade80', string: '#86efac', number: '#facc15',
      func: '#38bdf8', type: '#a7f3d0', variable: '#e2fced', param: '#bbf7d0',
      comment: '#4b6354', operator: '#10b981'
    },
    grid: {
      keyword: '#38bdf8', control: '#818cf8', string: '#34d399', number: '#fb923c',
      func: '#06b6d4', type: '#a78bfa', variable: '#e2e8f0', param: '#94a3b8',
      comment: '#64748b', operator: '#0ea5e9'
    },
    orchid: {
      keyword: '#d946ef', control: '#f43f5e', string: '#fde047', number: '#fb7185',
      func: '#c084fc', type: '#e879f9', variable: '#f3e8ff', param: '#f5d0fe',
      comment: '#705888', operator: '#e879f9'
    },
    dracula: {
      keyword: '#ff79c6', control: '#ff79c6', string: '#f1fa8c', number: '#bd93f9',
      func: '#50fa7b', type: '#8be9fd', variable: '#f8f8f2', param: '#ffb86c',
      comment: '#6272a4', operator: '#ff79c6'
    },
    nord: {
      keyword: '#81a1c1', control: '#81a1c1', string: '#a3be8c', number: '#b48ead',
      func: '#88c0d0', type: '#8fbcbb', variable: '#eceff4', param: '#d8dee9',
      comment: '#616e88', operator: '#81a1c1'
    }
  };

  // Known VS Code Dark+ default token hex mappings
  const ROLE_MAP = {
    '569cd6': 'keyword', 'c586c0': 'control', 'ce9178': 'string', 'b5cea8': 'number',
    'dcdcaa': 'func',    '4ec9b0': 'type',    'd4d4d4': 'variable', '9cdcfe': 'param',
    '6a9955': 'comment', '808080': 'comment', 'da70d6': 'operator', 'ffd700': 'operator'
  };

  let activeMonacoOverride = 'default';

  function getActivePalette() {
    if (activeMonacoOverride !== 'default' && PALETTES[activeMonacoOverride]) {
      return PALETTES[activeMonacoOverride];
    }
    const theme = document.documentElement.getAttribute('data-lc-theme') || 'tokyonight';
    return PALETTES[theme] || PALETTES.tokyonight;
  }

  function findTokenRules() {
    const rules = {};
    const styles = document.querySelectorAll('style');
    const regex = /\.mtk(\d+)\s*\{[^}]*color:\s*#([0-9a-fA-F]{6})/g;

    for (const s of styles) {
      const text = s.textContent || '';
      if (!text.includes('.mtk')) continue;
      let m;
      regex.lastIndex = 0;
      while ((m = regex.exec(text)) !== null) {
        rules[m[1]] = m[2].toLowerCase();
      }
    }
    return rules;
  }

  function applyHighlighting() {
    const pal = getActivePalette();
    const tokenClasses = findTokenRules();

    let css = '';
    for (const cls in tokenClasses) {
      const hex = tokenClasses[cls];
      const role = ROLE_MAP[hex] || 'variable';
      const color = pal[role] || pal.variable;
      css += `.monaco-editor .mtk${cls} { color: ${color} !important; }\n`;
    }

    if (!css) return;

    let el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(el);
    }
    el.textContent = css;
  }

  chrome.storage.local.get('lcMonacoTheme', (res) => {
    if (res && res.lcMonacoTheme) activeMonacoOverride = res.lcMonacoTheme;
    applyHighlighting();
  });

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

  new MutationObserver(() => applyHighlighting())
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-lc-theme'] });

  // Periodically re-check during first few seconds as Monaco loads dynamically
  let attempts = 0;
  const poll = setInterval(() => {
    applyHighlighting();
    if (++attempts > 12) clearInterval(poll);
  }, 1000);
})();
