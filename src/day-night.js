/* =============================================================================
   day-night.js (isolated world, LeetCode)
   Automatic Day / Night Theme Scheduler.
   Automatically toggles theme based on system time (7am-7pm) or OS dark mode.
============================================================================= */
(() => {
  'use strict';

  const DEFAULTS = {
    enabled: false,
    mode: 'time', // 'time' or 'system'
    dayTheme: 'paper',
    nightTheme: 'anime'
  };

  let config = Object.assign({}, DEFAULTS);

  function checkAndApply() {
    if (!config.enabled) return;

    let targetTheme = config.nightTheme;

    if (config.mode === 'system') {
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      targetTheme = isDark ? config.nightTheme : config.dayTheme;
    } else {
      const hours = new Date().getHours();
      // Daytime: 7:00 (7 AM) to 19:00 (7 PM)
      const isDay = hours >= 7 && hours < 19;
      targetTheme = isDay ? config.dayTheme : config.nightTheme;
    }

    chrome.storage.local.get(['lcThemeStudio', 'lcTheme'], (res) => {
      if (res && (res.lcThemeStudio !== targetTheme || res.lcTheme !== targetTheme)) {
        chrome.storage.local.set({ lcThemeStudio: targetTheme, lcTheme: targetTheme });
      }
    });
  }

  chrome.storage.local.get('lcDayNight', (res) => {
    if (res && res.lcDayNight) {
      config = Object.assign({}, DEFAULTS, res.lcDayNight);
    }
    checkAndApply();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.lcDayNight) {
      config = Object.assign({}, DEFAULTS, changes.lcDayNight.newValue || {});
      checkAndApply();
    }
  });

  // Re-check periodically every 5 minutes
  setInterval(checkAndApply, 5 * 60 * 1000);

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (config.enabled && config.mode === 'system') checkAndApply();
    });
  }
})();
