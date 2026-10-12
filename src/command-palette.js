/* =============================================================================
   command-palette.js (isolated world, LeetCode)
   Spotlight Command Palette (Ctrl+K / Cmd+K).
   Quick problem jumper, instant theme switcher, and tool toggles.
============================================================================= */
(() => {
  'use strict';

  const MODAL_ID = 'lcts-command-palette-modal';

  const POPULAR_PROBLEMS = [
    { num: '1', title: 'Two Sum', slug: 'two-sum', diff: 'Easy' },
    { num: '2', title: 'Add Two Numbers', slug: 'add-two-numbers', diff: 'Medium' },
    { num: '3', title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters', diff: 'Medium' },
    { num: '5', title: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring', diff: 'Medium' },
    { num: '15', title: '3Sum', slug: '3sum', diff: 'Medium' },
    { num: '20', title: 'Valid Parentheses', slug: 'valid-parentheses', diff: 'Easy' },
    { num: '21', title: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', diff: 'Easy' },
    { num: '42', title: 'Trapping Rain Water', slug: 'trapping-rain-water', diff: 'Hard' },
    { num: '53', title: 'Maximum Subarray', slug: 'maximum-subarray', diff: 'Medium' },
    { num: '70', title: 'Climbing Stairs', slug: 'climbing-stairs', diff: 'Easy' },
    { num: '121', title: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', diff: 'Easy' },
    { num: '146', title: 'LRU Cache', slug: 'lru-cache', diff: 'Medium' },
    { num: '200', title: 'Number of Islands', slug: 'number-of-islands', diff: 'Medium' },
    { num: '206', title: 'Reverse Linked List', slug: 'reverse-linked-list', diff: 'Easy' },
    { num: '226', title: 'Invert Binary Tree', slug: 'invert-binary-tree', diff: 'Easy' }
  ];

  const COMMANDS = [
    { title: 'Theme: Tokyo Night', action: () => chrome.storage.local.set({ lcTheme: 'tokyonight', lcThemeStudio: 'tokyonight' }), icon: '🌃' },
    { title: 'Theme: Catppuccin Mocha', action: () => chrome.storage.local.set({ lcTheme: 'catppuccin', lcThemeStudio: 'catppuccin' }), icon: '☕' },
    { title: 'Theme: Sakura Blossom', action: () => chrome.storage.local.set({ lcTheme: 'sakura', lcThemeStudio: 'sakura' }), icon: '🌸' },
    { title: 'Theme: Vintage Paper', action: () => chrome.storage.local.set({ lcTheme: 'paper', lcThemeStudio: 'paper' }), icon: '📜' },
    { title: 'Theme: Cyber Matrix', action: () => chrome.storage.local.set({ lcTheme: 'matrix', lcThemeStudio: 'matrix' }), icon: '💻' },
    { title: 'Theme: Synthwave Grid', action: () => chrome.storage.local.set({ lcTheme: 'grid', lcThemeStudio: 'grid' }), icon: '🌐' },
    { title: 'Theme: Midnight Orchid', action: () => chrome.storage.local.set({ lcTheme: 'orchid', lcThemeStudio: 'orchid' }), icon: '🔮' },
    { title: 'Theme: Dracula Dark', action: () => chrome.storage.local.set({ lcTheme: 'dracula', lcThemeStudio: 'dracula' }), icon: '🧛' },
    { title: 'Theme: Nordic Frost', action: () => chrome.storage.local.set({ lcTheme: 'nord', lcThemeStudio: 'nord' }), icon: '❄️' },
    { title: 'Monaco Theme: Tokyo Night', action: () => chrome.storage.local.set({ lcMonacoTheme: 'tokyonight' }), icon: '🎨' },
    { title: 'Monaco Theme: Catppuccin', action: () => chrome.storage.local.set({ lcMonacoTheme: 'catppuccin' }), icon: '🎨' },
    { title: 'Monaco Theme: Dracula', action: () => chrome.storage.local.set({ lcMonacoTheme: 'dracula' }), icon: '🎨' },
    { title: 'Toggle Zen Mode', action: () => chrome.storage.local.get('lcZenMode', (r) => chrome.storage.local.set({ lcZenMode: !(r && r.lcZenMode) })), icon: '🧘' },
    { title: 'Toggle Interview Blind Mode', action: () => chrome.storage.local.get('lcBlindMode', (r) => { const b = r.lcBlindMode || {}; chrome.storage.local.set({ lcBlindMode: Object.assign({}, b, { active: !b.active }) }); }), icon: '🎯' },
    { title: 'Toggle Interview Timer', action: () => chrome.storage.local.get('lcTimerEnabled', (r) => chrome.storage.local.set({ lcTimerEnabled: !(r && r.lcTimerEnabled) })), icon: '⏱️' }
  ];

  let isOpen = false;
  let activeIndex = 0;
  let currentResults = [];

  function createModal() {
    if (document.getElementById(MODAL_ID)) return;

    const modal = document.createElement('div');
    modal.id = MODAL_ID;

    const style = document.createElement('style');
    style.textContent = `
      #${MODAL_ID} {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        background: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: none;
        align-items: flex-start;
        justify-content: center;
        padding-top: 14vh;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      #${MODAL_ID}.open {
        display: flex;
      }
      #${MODAL_ID} .lcts-palette-card {
        width: 580px;
        max-width: 90vw;
        background: rgba(30, 41, 59, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
        overflow: hidden;
        animation: lcts-palette-scale 0.15s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes lcts-palette-scale {
        from { transform: scale(0.96) translateY(-8px); opacity: 0; }
        to { transform: scale(1) translateY(0); opacity: 1; }
      }
      #${MODAL_ID} .lcts-palette-input-wrap {
        padding: 14px 18px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        gap: 12px;
      }
      #${MODAL_ID} .lcts-palette-input-wrap span {
        font-size: 18px;
        color: #94a3b8;
      }
      #${MODAL_ID} input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: #f8fafc;
        font-size: 15px;
      }
      #${MODAL_ID} .lcts-palette-list {
        max-height: 340px;
        overflow-y: auto;
        padding: 8px;
      }
      #${MODAL_ID} .lcts-palette-item {
        padding: 9px 12px;
        border-radius: 8px;
        color: #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 13px;
        cursor: pointer;
        transition: background 0.1s;
      }
      #${MODAL_ID} .lcts-palette-item.active {
        background: #0284c7;
        color: #ffffff;
      }
      #${MODAL_ID} .lcts-palette-item .lcts-item-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      #${MODAL_ID} .lcts-palette-badge {
        font-size: 11px;
        padding: 2px 6px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        color: #94a3b8;
      }
      #${MODAL_ID} .lcts-palette-item.active .lcts-palette-badge {
        background: rgba(255, 255, 255, 0.2);
        color: #ffffff;
      }
      #${MODAL_ID} .lcts-palette-footer {
        padding: 8px 16px;
        background: rgba(15, 23, 42, 0.4);
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        font-size: 11px;
        color: #94a3b8;
        display: flex;
        gap: 14px;
      }
      #${MODAL_ID} kbd {
        background: rgba(255, 255, 255, 0.08);
        padding: 2px 5px;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
    `;

    modal.innerHTML = `
      <div class="lcts-palette-card">
        <div class="lcts-palette-input-wrap">
          <span>🔍</span>
          <input type="text" placeholder="Type a problem name/number, or command (>)..." autofocus />
        </div>
        <div class="lcts-palette-list"></div>
        <div class="lcts-palette-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    `;

    modal.appendChild(style);
    (document.body || document.documentElement).appendChild(modal);

    const input = modal.querySelector('input');
    const list = modal.querySelector('.lcts-palette-list');

    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    input.addEventListener('input', () => {
      renderList(input.value.trim());
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % Math.max(1, currentResults.length);
        updateActiveItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + currentResults.length) % Math.max(1, currentResults.length);
        updateActiveItem();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeItem(currentResults[activeIndex]);
      } else if (e.key === 'Escape') {
        close();
      }
    });
  }

  function renderList(query) {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    const list = modal.querySelector('.lcts-palette-list');
    list.innerHTML = '';
    currentResults = [];
    activeIndex = 0;

    const q = query.toLowerCase();

    // 1. Check for number direct jump
    if (/^\d+$/.test(q)) {
      currentResults.push({
        type: 'jump',
        title: `Search Problem #${q}`,
        action: () => { window.location.href = `https://leetcode.com/problemset/all/?search=${q}`; },
        badge: 'Jump'
      });
    }

    // 2. Filter commands
    COMMANDS.forEach((c) => {
      if (!q || c.title.toLowerCase().includes(q)) {
        currentResults.push({
          type: 'cmd',
          title: c.title,
          action: c.action,
          icon: c.icon,
          badge: 'Command'
        });
      }
    });

    // 3. Filter popular problems
    POPULAR_PROBLEMS.forEach((p) => {
      if (!q || p.num === q || p.title.toLowerCase().includes(q) || p.slug.includes(q)) {
        currentResults.push({
          type: 'problem',
          title: `${p.num}. ${p.title}`,
          action: () => { window.location.href = `/problems/${p.slug}/`; },
          icon: '📄',
          badge: p.diff
        });
      }
    });

    if (!currentResults.length) {
      list.innerHTML = '<div style="padding: 16px; text-align: center; color: #94a3b8;">No matching problems or commands.</div>';
      return;
    }

    currentResults.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'lcts-palette-item' + (index === 0 ? ' active' : '');
      el.innerHTML = `
        <div class="lcts-item-left">
          <span>${item.icon || '⚡'}</span>
          <span>${item.title}</span>
        </div>
        <span class="lcts-palette-badge">${item.badge || ''}</span>
      `;
      el.addEventListener('click', () => executeItem(item));
      list.appendChild(el);
    });
  }

  function updateActiveItem() {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    const items = modal.querySelectorAll('.lcts-palette-item');
    items.forEach((it, idx) => {
      it.classList.toggle('active', idx === activeIndex);
      if (idx === activeIndex) it.scrollIntoView({ block: 'nearest' });
    });
  }

  function executeItem(item) {
    if (!item) return;
    close();
    if (typeof item.action === 'function') {
      item.action();
    }
  }

  function open() {
    createModal();
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    modal.classList.add('open');
    isOpen = true;
    const input = modal.querySelector('input');
    if (input) {
      input.value = '';
      input.focus();
    }
    renderList('');
  }

  function close() {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    modal.classList.remove('open');
    isOpen = false;
  }

  window.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (isOpen) close(); else open();
    }
  });
})();
