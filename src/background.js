/* =============================================================================
   background.js — the focus-mode shortcut.

   Extension shortcuts are delivered here, not to the page. The toggle is
   written to storage, and every open problem tab hears it through
   storage.onChanged, so focus mode flips everywhere at once. The key is
   rebindable at chrome://extensions/shortcuts.
============================================================================= */
chrome.commands.onCommand.addListener((command) => {
  if (command !== 'toggle-focus') return;
  chrome.storage.local.get('lcFocus', (res) => {
    chrome.storage.local.set({ lcFocus: !(res && res.lcFocus) });
  });
});

/* Title cards used to be limited to once per problem per day, remembered in
   lcAnimeSeen. They now follow the problem's solved state instead, so the old
   list is cleared once when the extension installs or updates. */
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.remove('lcAnimeSeen');
});

