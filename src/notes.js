/* =============================================================================
   notes.js (isolated world, LeetCode)
   Local Problem Scratchpad & Notes Drawer.
   Saves private notes, time/space complexity, and approach per problem slug.
============================================================================= */
(() => {
  'use strict';

  const DRAWER_ID = 'lcts-notes-drawer';
  const TOGGLE_BTN_ID = 'lcts-notes-toggle-btn';

  const slugOf = () => {
    const m = /^\/problems\/([^/]+)/.exec(location.pathname);
    return m ? m[1] : null;
  };

  let isOpen = false;
  let currentSlug = null;
  let enabled = true;

  function createDrawer() {
    if (document.getElementById(DRAWER_ID)) return;

    const drawer = document.createElement('div');
    drawer.id = DRAWER_ID;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = TOGGLE_BTN_ID;
    toggleBtn.setAttribute('title', 'Toggle Problem Notes');
    toggleBtn.innerHTML = '📝 <span>Notes</span>';

    const style = document.createElement('style');
    style.textContent = `
      #${TOGGLE_BTN_ID} {
        position: fixed;
        right: 0;
        top: 48%;
        transform: translateY(-50%);
        z-index: 2147483630;
        background: rgba(30, 41, 59, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        color: #f8fafc;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-right: none;
        border-radius: 8px 0 0 8px;
        padding: 8px 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 600;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
        transition: transform 0.2s ease, background 0.2s ease;
      }
      #${TOGGLE_BTN_ID}:hover {
        background: rgba(51, 65, 85, 0.95);
        transform: translateY(-50%) translateX(-2px);
      }
      #${DRAWER_ID} {
        position: fixed;
        top: 0;
        right: 0;
        width: 380px;
        max-width: 90vw;
        height: 100vh;
        z-index: 2147483635;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-left: 1px solid rgba(255, 255, 255, 0.12);
        box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
        transform: translateX(100%);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        display: flex;
        flex-direction: column;
        color: #f1f5f9;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      #${DRAWER_ID}.open {
        transform: translateX(0);
      }
      #${DRAWER_ID} .lcts-notes-header {
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      #${DRAWER_ID} .lcts-notes-title {
        font-size: 15px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      #${DRAWER_ID} .lcts-notes-close {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
        line-height: 1;
      }
      #${DRAWER_ID} .lcts-notes-close:hover {
        color: #fff;
      }
      #${DRAWER_ID} .lcts-notes-body {
        padding: 20px;
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      #${DRAWER_ID} .lcts-notes-row {
        display: flex;
        gap: 12px;
      }
      #${DRAWER_ID} .lcts-field-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      #${DRAWER_ID} label {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #94a3b8;
      }
      #${DRAWER_ID} input, #${DRAWER_ID} textarea {
        background: rgba(30, 41, 59, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: #f1f5f9;
        font-family: inherit;
        font-size: 13px;
        padding: 8px 10px;
        outline: none;
        transition: border 0.15s ease;
      }
      #${DRAWER_ID} input:focus, #${DRAWER_ID} textarea:focus {
        border-color: #38bdf8;
      }
      #${DRAWER_ID} textarea {
        min-height: 220px;
        resize: vertical;
        line-height: 1.5;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      }
      #${DRAWER_ID} .lcts-notes-footer {
        padding: 14px 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }
      #${DRAWER_ID} .lcts-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: #f1f5f9;
        padding: 7px 12px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      #${DRAWER_ID} .lcts-btn:hover {
        background: rgba(255, 255, 255, 0.16);
      }
      #${DRAWER_ID} .lcts-btn-primary {
        background: #0284c7;
        border-color: #38bdf8;
      }
      #${DRAWER_ID} .lcts-btn-primary:hover {
        background: #0369a1;
      }
    `;

    drawer.innerHTML = `
      <div class="lcts-notes-header">
        <span class="lcts-notes-title">📝 Solution Notes</span>
        <button class="lcts-notes-close" title="Close Notes">✕</button>
      </div>
      <div class="lcts-notes-body">
        <div class="lcts-notes-row">
          <div class="lcts-field-group">
            <label for="lcts-time-comp">Time</label>
            <input id="lcts-time-comp" type="text" placeholder="O(N log N)" />
          </div>
          <div class="lcts-field-group">
            <label for="lcts-space-comp">Space</label>
            <input id="lcts-space-comp" type="text" placeholder="O(1)" />
          </div>
        </div>
        <div class="lcts-field-group">
          <label for="lcts-approach">Approach / Technique</label>
          <input id="lcts-approach" type="text" placeholder="Two Pointers, Sliding Window, DP..." />
        </div>
        <div class="lcts-field-group" style="flex: 1;">
          <label for="lcts-notes-content">Scratchpad & Notes (Markdown supported)</label>
          <textarea id="lcts-notes-content" placeholder="Write your algorithm breakdown, edge cases, formulas, or key insights here..."></textarea>
        </div>
      </div>
      <div class="lcts-notes-footer">
        <button class="lcts-btn" id="lcts-export-btn">⬇ Export .md</button>
        <button class="lcts-btn lcts-btn-primary" id="lcts-copy-btn">📋 Copy</button>
      </div>
    `;

    drawer.appendChild(style);
    if (document.body) {
      document.body.appendChild(toggleBtn);
      document.body.appendChild(drawer);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        if (document.body) {
          if (!document.body.contains(toggleBtn)) document.body.appendChild(toggleBtn);
          if (!document.body.contains(drawer)) document.body.appendChild(drawer);
        }
      });
    }

    const timeInput = drawer.querySelector('#lcts-time-comp');
    const spaceInput = drawer.querySelector('#lcts-space-comp');
    const approachInput = drawer.querySelector('#lcts-approach');
    const contentInput = drawer.querySelector('#lcts-notes-content');
    const closeBtn = drawer.querySelector('.lcts-notes-close');
    const copyBtn = drawer.querySelector('#lcts-copy-btn');
    const exportBtn = drawer.querySelector('#lcts-export-btn');

    const save = () => {
      const slug = slugOf();
      if (!slug) return;
      const data = {
        time: timeInput.value,
        space: spaceInput.value,
        approach: approachInput.value,
        content: contentInput.value,
        updatedAt: Date.now()
      };
      chrome.storage.local.set({ ['lcNotes_' + slug]: data });
    };

    [timeInput, spaceInput, approachInput, contentInput].forEach((el) => {
      el.addEventListener('input', save);
    });

    toggleBtn.addEventListener('click', () => toggleDrawer());
    closeBtn.addEventListener('click', () => toggleDrawer(false));

    copyBtn.addEventListener('click', () => {
      const slug = slugOf() || 'problem';
      const text = [
        `# LeetCode Solution Notes: ${slug}`,
        `- **Time Complexity**: ${timeInput.value || 'N/A'}`,
        `- **Space Complexity**: ${spaceInput.value || 'N/A'}`,
        `- **Approach**: ${approachInput.value || 'N/A'}`,
        '',
        '## Notes & Breakdown',
        contentInput.value || '(No notes recorded)'
      ].join('\n');

      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyBtn.textContent = '📋 Copy';
        }, 1500);
      });
    });

    exportBtn.addEventListener('click', () => {
      const slug = slugOf() || 'problem';
      const text = [
        `# LeetCode Notes: ${slug}`,
        `- **Time Complexity**: ${timeInput.value || 'N/A'}`,
        `- **Space Complexity**: ${spaceInput.value || 'N/A'}`,
        `- **Approach**: ${approachInput.value || 'N/A'}`,
        '',
        '## Notes & Breakdown',
        contentInput.value || '(No notes recorded)'
      ].join('\n');

      const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}_notes.md`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function loadNotes(slug) {
    if (!slug) return;
    const drawer = document.getElementById(DRAWER_ID);
    if (!drawer) return;

    chrome.storage.local.get(['lcNotes_' + slug], (res) => {
      const data = res['lcNotes_' + slug] || {};
      const timeInput = drawer.querySelector('#lcts-time-comp');
      const spaceInput = drawer.querySelector('#lcts-space-comp');
      const approachInput = drawer.querySelector('#lcts-approach');
      const contentInput = drawer.querySelector('#lcts-notes-content');

      if (timeInput) timeInput.value = data.time || '';
      if (spaceInput) spaceInput.value = data.space || '';
      if (approachInput) approachInput.value = data.approach || '';
      if (contentInput) contentInput.value = data.content || '';
    });
  }

  function toggleDrawer(force) {
    const drawer = document.getElementById(DRAWER_ID);
    if (!drawer) return;
    isOpen = force !== undefined ? !!force : !isOpen;
    drawer.classList.toggle('open', isOpen);
    if (isOpen) {
      const slug = slugOf();
      if (slug !== currentSlug) {
        currentSlug = slug;
        loadNotes(slug);
      }
    }
  }

  function ensureMounted() {
    if (!enabled) return;
    const slug = slugOf();
    if (!slug) return;
    if (!document.body) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureMounted);
      } else {
        setTimeout(ensureMounted, 50);
      }
      return;
    }
    if (!document.getElementById(DRAWER_ID)) {
      createDrawer();
    }
    if (slug !== currentSlug) {
      currentSlug = slug;
      loadNotes(slug);
    }
    const btn = document.getElementById(TOGGLE_BTN_ID);
    if (btn) btn.style.display = 'flex';
  }

  function setVisibility(show) {
    enabled = show !== false;
    const btn = document.getElementById(TOGGLE_BTN_ID);
    const drawer = document.getElementById(DRAWER_ID);
    if (enabled) {
      ensureMounted();
      if (btn) btn.style.display = 'flex';
    } else {
      if (btn) btn.style.display = 'none';
      if (drawer) drawer.classList.remove('open');
      isOpen = false;
    }
  }

  chrome.storage.local.get('lcNotesEnabled', (res) => {
    enabled = res && res.lcNotesEnabled !== undefined ? !!res.lcNotesEnabled : true;
    setVisibility(enabled);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.lcNotesEnabled !== undefined) {
      setVisibility(changes.lcNotesEnabled.newValue);
    }
  });

  window.addEventListener('popstate', () => {
    if (enabled) ensureMounted();
  });

  window.addEventListener('lcts-toggle-notes', () => {
    if (!document.getElementById(DRAWER_ID)) ensureMounted();
    toggleDrawer();
  });

  // Shortcut: Ctrl+Shift+N or Cmd+Shift+N to toggle Notes Drawer
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'N' || e.key === 'n')) {
      e.preventDefault();
      if (!document.getElementById(DRAWER_ID)) ensureMounted();
      toggleDrawer();
    }
  });

  // Check periodically for DOM mounting or problem slug change
  setInterval(() => {
    if (!enabled) return;
    const slug = slugOf();
    if (!slug) {
      const btn = document.getElementById(TOGGLE_BTN_ID);
      if (btn) btn.style.display = 'none';
      return;
    }
    if (document.body && !document.getElementById(DRAWER_ID)) {
      ensureMounted();
    } else if (slug !== currentSlug) {
      currentSlug = slug;
      loadNotes(slug);
    }
  }, 1000);
})();
