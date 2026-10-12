/* =============================================================================
   background.js (service worker)
   Handles extension keyboard shortcuts and initial state installation.
============================================================================= */
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-zen') {
    chrome.storage.local.get('lcZenMode', (res) => {
      chrome.storage.local.set({ lcZenMode: !(res && res.lcZenMode) });
    });
  } else if (command === 'toggle-focus') {
    chrome.storage.local.get('lcFocus', (res) => {
      chrome.storage.local.set({ lcFocus: !(res && res.lcFocus) });
    });
  } else if (command === 'toggle-blind') {
    chrome.storage.local.get('lcBlindMode', (res) => {
      const b = res.lcBlindMode || { active: false, hideDifficulty: true, blurTags: true, hideStats: true };
      b.active = !b.active;
      chrome.storage.local.set({ lcBlindMode: b });
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['lcTheme', 'lcMonacoTheme'], (res) => {
    if (!res.lcTheme) {
      chrome.storage.local.set({ lcTheme: 'tokyonight' });
    }
    if (!res.lcMonacoTheme) {
      chrome.storage.local.set({ lcMonacoTheme: 'default' });
    }
  });
});
