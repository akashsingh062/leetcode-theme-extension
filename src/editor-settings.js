/* =============================================================================
   editor-settings.js (isolated world, LeetCode)
   Controls coding fonts, font ligatures, font size, line height, and cursor styles.
============================================================================= */
(() => {
  'use strict';

  const STYLE_ID = 'lcts-editor-settings-style';
  const FONT_MAP = {
    'jetbrains': "'JetBrains Mono', monospace",
    'fira': "'Fira Code', monospace",
    'cascadia': "'Cascadia Code', 'Fira Code', monospace",
    'source': "'Source Code Pro', monospace",
    'system': "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
  };

  const DEFAULTS = {
    font: 'jetbrains',
    ligatures: true,
    fontSize: 14,
    lineHeight: 1.5,
    cursorStyle: 'smooth'
  };

  let settings = Object.assign({}, DEFAULTS);

  function getFontCSS(fontKey) {
    return FONT_MAP[fontKey] || FONT_MAP.jetbrains;
  }

  function applySettings() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }

    const fontVal = getFontCSS(settings.font);
    const ligaturesVal = settings.ligatures ? 'contextual normal' : 'none';
    const featuresVal = settings.ligatures ? '"liga" 1, "calt" 1' : '"liga" 0, "calt" 0';
    const sizeVal = settings.fontSize ? settings.fontSize + 'px' : '14px';
    const lineVal = settings.lineHeight ? settings.lineHeight : '1.5';

    let cursorAnimation = '';
    if (settings.cursorStyle === 'smooth') {
      cursorAnimation = `
        .monaco-editor .cursors-layer .cursor {
          transition: transform 0.08s ease-out !important;
        }
      `;
    } else if (settings.cursorStyle === 'solid') {
      cursorAnimation = `
        .monaco-editor .cursors-layer .cursor {
          animation: none !important;
          opacity: 1 !important;
        }
      `;
    }

    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Source+Code+Pro:wght@400;500;600&display=swap');

      :root {
        --lcts-editor-font: ${fontVal};
        --lcts-editor-size: ${sizeVal};
        --lcts-editor-line: ${lineVal};
      }

      .monaco-editor,
      .monaco-editor .view-lines,
      .monaco-editor .view-line,
      .monaco-editor .monaco-mouse-cursor-text,
      .monaco-editor .line-numbers {
        font-family: var(--lcts-editor-font) !important;
        font-size: var(--lcts-editor-size) !important;
        line-height: var(--lcts-editor-line) !important;
        font-variant-ligatures: ${ligaturesVal} !important;
        font-feature-settings: ${featuresVal} !important;
      }

      ${cursorAnimation}
    `;
  }

  chrome.storage.local.get('lcEditorSettings', (res) => {
    if (res && res.lcEditorSettings) {
      settings = Object.assign({}, DEFAULTS, res.lcEditorSettings);
    }
    applySettings();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.lcEditorSettings) {
      settings = Object.assign({}, DEFAULTS, changes.lcEditorSettings.newValue || {});
      applySettings();
    }
  });

  applySettings();
})();
