/* =============================================================================
   editor-settings.js (isolated world, LeetCode)
   Controls coding fonts, font ligatures, font size, line height, and cursor styles.
   Synchronizes settings to the MAIN world (inject.js) to configure Monaco via its
   native API so character measurement and cursor positioning remain 100% pixel-perfect.
============================================================================= */
(() => {
  'use strict';

  const DEFAULTS = {
    v: 2,
    font: 'default',        // Preserve LeetCode's native font by default
    ligatures: true,
    fontSize: 'default',    // Preserve LeetCode's native font size by default
    lineHeight: 'default',  // Preserve LeetCode's native line height by default
    cursorStyle: 'blink'    // Standard crisp blink (instant response, zero lag)
  };

  let settings = Object.assign({}, DEFAULTS);

  // Clean up any legacy CSS style override or font links that may cause desync
  const oldStyle = document.getElementById('lcts-editor-settings-style');
  if (oldStyle) oldStyle.remove();
  const oldFontLink = document.getElementById('lcts-google-fonts');
  if (oldFontLink) oldFontLink.remove();

  function broadcastSettings() {
    const data = JSON.stringify(settings);
    document.documentElement.setAttribute('data-lcts-editor-settings', data);
    try {
      window.dispatchEvent(new CustomEvent('lcts-editor-settings', { detail: settings }));
    } catch (e) {}
  }

  // Load from storage, with automatic upgrade of legacy settings
  chrome.storage.local.get('lcEditorSettings', (res) => {
    if (res && res.lcEditorSettings) {
      const stored = res.lcEditorSettings;
      // If settings are from legacy version without 'v: 2', upgrade them to defaults
      if (!stored.v || stored.v < 2) {
        settings = Object.assign({}, DEFAULTS);
        chrome.storage.local.set({ lcEditorSettings: settings });
      } else {
        settings = Object.assign({}, DEFAULTS, stored);
      }
    } else {
      settings = Object.assign({}, DEFAULTS);
      chrome.storage.local.set({ lcEditorSettings: settings });
    }
    broadcastSettings();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.lcEditorSettings) {
      settings = Object.assign({}, DEFAULTS, changes.lcEditorSettings.newValue || {});
      broadcastSettings();
    }
  });

  broadcastSettings();
})();
