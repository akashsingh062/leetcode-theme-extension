/**
 * ISOLATED World Content Script Entry Point.
 *
 * Runs at document_start in the ISOLATED execution world on LeetCode pages.
 * Replaces the 30+ separate content_scripts entries with a single optimized,
 * zero-FOUC bundle containing all theme engines, interview widgets, and tool handlers.
 */

// 1. Initialize DOM Resilience & SPA Route Lifecycle Observer
import { initSpaRouter } from './utils/spa-router';
initSpaRouter();

// 2. Storage Migration
import { StorageManager } from './utils/storage';
StorageManager.migrateFromLegacyStorage().catch(() => {});

// 3. Core theme application (document_start immediate attribute and class injection)
import './content.js';

// 4. Problem metadata observer and cache
import './problem.js';

// 5. Anime and dynamic wallpaper themes
import './anime/scenes.js';
import './anime/css.js';
import './anime/anime.js';

// 6. Monaco editor styling & smooth scroll
import './monaco-ink.js';
import './sheet-scroll.js';

// 7. Submission verdict listeners & share card generator
import './verdict.js';
import './share.js';

// 8. Anime moments, audio effects & game engine
import './anime/moments-ui.js';
import './anime/sounds.js';
import './anime/moments.js';
import './game/petals.js';
import './game/sounds.js';
import './game/title-card.js';
import './game/game.js';
import './game/icons.js';
import './game/ambient.js';
import './game/result.js';
import './game/sidebar.js';

// 9. Pixel art engine
import './pixel/sprites.js';
import './pixel/pixel.js';

// 10. Editor settings, Blind mode, Timer, Notes & Zen Mode
import './editor-settings.js';
import './blind-mode.js';
import './timer.js';
import './notes.js';
import './zen-mode.js';

// 11. Command palette, Day/Night schedule, Theme sync
import './command-palette.js';
import './day-night.js';
import './theme-sync.js';
