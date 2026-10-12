/* =============================================================================
   zen-mode.js (isolated world, LeetCode)
   Distraction-Free Zen Coding Mode.
   Expands editor to full viewport and hides all distracting navigation chrome.
   Toggle with Ctrl+Shift+Z / Cmd+Shift+Z or Esc to exit.
============================================================================= */
(() => {
  'use strict';

  const STYLE_ID = 'lcts-zen-mode-style';
  const CHIP_ID = 'lcts-zen-exit-chip';
  const root = document.documentElement;

  let isZen = false;

  function ensureStyles() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        /* Zen Mode Layout Maximizer */
        html[data-lc-zen="true"] nav,
        html[data-lc-zen="true"] header,
        html[data-lc-zen="true"] #ide-top-btns,
        html[data-lc-zen="true"] .flexlayout__tabset_tabbar_outer,
        html[data-lc-zen="true"] footer {
          display: none !important;
        }

        html[data-lc-zen="true"] .flexlayout__layout,
        html[data-lc-zen="true"] #__next {
          height: 100vh !important;
          max-height: 100vh !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        #${CHIP_ID} {
          position: fixed;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2147483645;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #e2e8f0;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 9999px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s ease, transform 0.2s ease;
          display: none;
        }
        #${CHIP_ID}:hover {
          opacity: 1;
          transform: translateX(-50%) scale(1.04);
        }
        html[data-lc-zen="true"] #${CHIP_ID} {
          display: block;
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }

    let chip = document.getElementById(CHIP_ID);
    if (!chip && document.body) {
      chip = document.createElement('div');
      chip.id = CHIP_ID;
      chip.textContent = 'Zen Mode Active • Press Esc or Click to Exit';
      chip.addEventListener('click', () => setZen(false));
      document.body.appendChild(chip);
    }
  }

  function setZen(on) {
    isZen = !!on;
    ensureStyles();
    root.toggleAttribute('data-lc-zen', isZen);
    chrome.storage.local.set({ lcZenMode: isZen });
  }

  window.addEventListener('keydown', (e) => {
    // Ctrl+Shift+Z or Cmd+Shift+Z
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'Z' || e.key === 'z')) {
      e.preventDefault();
      setZen(!isZen);
    } else if (e.key === 'Escape' && isZen) {
      setZen(false);
    }
  });

  chrome.storage.local.get('lcZenMode', (res) => {
    if (res && res.lcZenMode) setZen(true);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.lcZenMode !== undefined) {
      setZen(changes.lcZenMode.newValue);
    }
  });

  ensureStyles();
})();
