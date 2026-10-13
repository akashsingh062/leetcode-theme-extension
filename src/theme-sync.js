/* =============================================================================
   theme-sync.js
   Theme and extension settings import/export utility (JSON).
============================================================================= */
(function (root) {
  'use strict';

  const KEYS = [
    'lcTheme',
    'lcThemeStudio',
    'lcMonacoTheme',
    'lcCustomWallpaper',
    'lcEditorSettings',
    'lcBlindMode',
    'lcDayNight',
    'lcTimerEnabled',
    'lcZenMode',
    'lcNotesEnabled',
    'lcAnime',
    'lcAnimeArt',
    'lcFocus'
  ];

  async function exportConfig() {
    return new Promise((resolve) => {
      chrome.storage.local.get(KEYS, (data) => {
        const payload = {
          version: '3.6.0',
          exportedAt: new Date().toISOString(),
          settings: data
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leetcode-themes-settings-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        resolve(payload);
      });
    });
  }

  async function importConfig(jsonString) {
    return new Promise((resolve, reject) => {
      try {
        const data = JSON.parse(jsonString);
        const settings = data.settings || data;
        const toSet = {};
        KEYS.forEach((k) => {
          if (settings[k] !== undefined) toSet[k] = settings[k];
        });
        chrome.storage.local.set(toSet, () => {
          resolve(toSet);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  root.LCTSThemeSync = { exportConfig, importConfig };
})(globalThis);
