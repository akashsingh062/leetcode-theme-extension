/* =============================================================================
   blind-mode.js (isolated world, LeetCode)
   Interview Blind Mode: hides difficulty, blurs topic/company tags,
   and masks stats so users can practice without spoiler bias.
============================================================================= */
(() => {
  'use strict';

  const STYLE_ID = 'lcts-blind-mode-style';
  const root = document.documentElement;

  const DEFAULTS = {
    active: false,
    hideDifficulty: true,
    blurTags: true,
    hideStats: true
  };

  let settings = Object.assign({}, DEFAULTS);

  function ensureStyle() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        /* Blind Mode Root Styles */
        html[data-lc-blind="true"] .lcts-blind-diff [class*="text-difficulty-"],
        html[data-lc-blind="true"] .lcts-blind-diff div[class*="text-difficulty"] {
          position: relative !important;
          color: transparent !important;
          background: rgba(120, 120, 140, 0.2) !important;
          border-radius: 9999px !important;
          cursor: pointer !important;
          user-select: none !important;
          min-width: 60px !important;
          text-align: center !important;
          transition: all 0.2s ease !important;
        }
        html[data-lc-blind="true"] .lcts-blind-diff [class*="text-difficulty-"]::after,
        html[data-lc-blind="true"] .lcts-blind-diff div[class*="text-difficulty"]::after {
          content: "Challenge" !important;
          position: absolute !important;
          inset: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #94a3b8 !important;
          font-size: 11px !important;
          font-weight: 600 !important;
        }
        html[data-lc-blind="true"] .lcts-blind-diff [class*="text-difficulty-"]:hover,
        html[data-lc-blind="true"] .lcts-blind-diff div[class*="text-difficulty"]:hover {
          color: inherit !important;
          background: inherit !important;
        }
        html[data-lc-blind="true"] .lcts-blind-diff [class*="text-difficulty-"]:hover::after,
        html[data-lc-blind="true"] .lcts-blind-diff div[class*="text-difficulty"]:hover::after {
          display: none !important;
        }

        /* Blur topic and company tags until hover */
        html[data-lc-blind="true"] .lcts-blind-tags a[href*="/tag/"],
        html[data-lc-blind="true"] .lcts-blind-tags a[href*="/company/"],
        html[data-lc-blind="true"] .lcts-blind-tags [class*="topic-tag"],
        html[data-lc-blind="true"] .lcts-blind-tags div[class*="tag__"] {
          filter: blur(5px) !important;
          transition: filter 0.2s ease !important;
          cursor: pointer !important;
          user-select: none !important;
        }
        html[data-lc-blind="true"] .lcts-blind-tags a[href*="/tag/"]:hover,
        html[data-lc-blind="true"] .lcts-blind-tags a[href*="/company/"]:hover,
        html[data-lc-blind="true"] .lcts-blind-tags [class*="topic-tag"]:hover,
        html[data-lc-blind="true"] .lcts-blind-tags div[class*="tag__"]:hover {
          filter: none !important;
        }

        /* Hide / fade acceptance stats and like counts */
        html[data-lc-blind="true"] .lcts-blind-stats div[class*="text-sd-secondary-text"],
        html[data-lc-blind="true"] .lcts-blind-stats div[data-track-load="description_content"] + div {
          opacity: 0.15 !important;
          transition: opacity 0.2s ease !important;
        }
        html[data-lc-blind="true"] .lcts-blind-stats div[class*="text-sd-secondary-text"]:hover,
        html[data-lc-blind="true"] .lcts-blind-stats div[data-track-load="description_content"] + div:hover {
          opacity: 1 !important;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
  }

  function apply() {
    ensureStyle();
    if (settings.active) {
      root.setAttribute('data-lc-blind', 'true');
      root.classList.toggle('lcts-blind-diff', !!settings.hideDifficulty);
      root.classList.toggle('lcts-blind-tags', !!settings.blurTags);
      root.classList.toggle('lcts-blind-stats', !!settings.hideStats);
    } else {
      root.removeAttribute('data-lc-blind');
      root.classList.remove('lcts-blind-diff', 'lcts-blind-tags', 'lcts-blind-stats');
    }
  }

  chrome.storage.local.get('lcBlindMode', (res) => {
    if (res && res.lcBlindMode) {
      settings = Object.assign({}, DEFAULTS, res.lcBlindMode);
    }
    apply();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.lcBlindMode) {
      settings = Object.assign({}, DEFAULTS, changes.lcBlindMode.newValue || {});
      apply();
    }
  });

  apply();
})();
