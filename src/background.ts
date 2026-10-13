/**
 * Background Service Worker.
 *
 * Handles extension commands, shortcut dispatching, and installation lifecycle.
 */

import { StorageManager } from './utils/storage';

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-zen') {
    const current = await StorageManager.get<boolean>('lcZenMode', false);
    await StorageManager.set('lcZenMode', !current);
  } else if (command === 'toggle-focus') {
    const current = await StorageManager.get<boolean>('lcFocus', false);
    await StorageManager.set('lcFocus', !current);
  } else if (command === 'toggle-blind') {
    const current = await StorageManager.get<{ active?: boolean }>('lcBlindMode', { active: true });
    const updated = Object.assign({}, current, { active: !(current && current.active) });
    await StorageManager.set('lcBlindMode', updated);
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  // Migrate any legacy storage keys defensively
  await StorageManager.migrateFromLegacyStorage();

  const theme = await StorageManager.get<string>('lcTheme');
  if (!theme) {
    await StorageManager.set('lcTheme', 'tokyonight');
  }

  const monaco = await StorageManager.get<string>('lcMonacoTheme');
  if (!monaco) {
    await StorageManager.set('lcMonacoTheme', 'default');
  }
});
