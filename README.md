# 🚀 LeetCode Themes & Tools

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-brightgreen.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://developer.chrome.com/docs/extensions/)
[![WCAG Compliant](https://img.shields.io/badge/Contrast-WCAG%20AA%2FAAA-purple.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Zero Telemetry](https://img.shields.io/badge/Privacy-100%25%20Local-success.svg)](https://github.com/akashsingh062/leetcode-theme-extension)
[![License: Open](https://img.shields.io/badge/License-MIT%20%2F%20OFL-orange.svg)](https://github.com/akashsingh062/leetcode-theme-extension)

> **Transform LeetCode into an aesthetic, distraction-free, and interview-ready coding powerhouse.**
> Custom color palettes, scenic wallpaper glassmorphism, Monaco editor styling, coding typography, interview blind mode, floating timer, scratchpad notes, command palette, and celebration moments.

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Key Features](#-key-features)
   - [Aesthetic & Solid Color Themes](#1-aesthetic--solid-color-themes)
   - [Scenic Wallpaper Themes & Wallpaper Studio](#2-scenic-wallpaper-themes--wallpaper-studio)
   - [Monaco Code Editor Styling & Typography](#3-monaco-code-editor-styling--typography)
   - [Interview Blind Mode (Anti-Bias)](#4-interview-blind-mode-anti-bias)
   - [Productivity & Interview Tools](#5-productivity--interview-tools)
   - [Submission Celebrations & Social Share Cards](#6-submission-celebrations--social-share-cards)
   - [Automation & Settings Synchronization](#7-automation--settings-synchronization)
3. [Theme Catalog](#-theme-catalog)
   - [Curated Solid Themes](#curated-solid-themes)
   - [Scenic & Anime Wallpaper Presets](#scenic--anime-wallpaper-presets)
4. [Technical Architecture & Design](#-technical-architecture--design)
   - [Manifest V3 Architecture](#manifest-v3-architecture)
   - [Dual Execution Worlds (MAIN vs. ISOLATED)](#dual-execution-worlds-main-vs-isolated)
   - [Clean-Room Monaco Editor Re-Theming](#clean-room-monaco-editor-re-theming)
   - [Network Verdict Interceptor Engine](#network-verdict-interceptor-engine)
   - [Mathematical WCAG Scrim Contrast Solver](#mathematical-wcag-scrim-contrast-solver)
   - [3-Layer CSS Design System](#3-layer-css-design-system)
   - [Cost Control & Zero-Lag Performance Rules](#cost-control--zero-lag-performance-rules)
5. [Complete Directory & File Structure](#-complete-directory--file-structure)
6. [Keyboard Shortcuts](#-keyboard-shortcuts)
7. [Storage Schema (`chrome.storage.local`)](#-storage-schema-chromestoragelocal)
8. [Installation & Setup](#-installation--setup)
9. [Privacy & Security](#-privacy--security)
10. [Font Attributions & Credits](#-font-attributions--credits)

---

## 🌟 Overview

**LeetCode Themes & Tools** is a comprehensive browser extension built for competitive programmers and interview candidates practicing on [LeetCode](https://leetcode.com) and [LeetCode CN](https://leetcode.cn).

The default LeetCode interface can feel monotonous and distracting. This extension completely redesigns the problem-solving workspace with:
- **Rich Visual Aesthetics**: Choose between 13 meticulously designed solid color themes or 18 anime and scenic wallpapers with adjustable glassmorphism.
- **Uncompromised Readability**: Custom algorithmic contrast solver verifies and guarantees WCAG AAA/AA text readability against any image or background.
- **Deep Monaco Integration**: Full token-level syntax palette recoloring, ligatures, cursor animations, and bundled professional monospace fonts.
- **Interview Simulation**: Hides psychological spoilers (difficulty levels, acceptance rates, topic/company tags) to mirror real technical interview conditions.
- **Productivity Superchargers**: Draggable countdown stopwatch, slide-out solution scratchpad, spotlight search palette (`Ctrl+K`), and fullscreen Zen mode.

---

## ⚡ Key Features

### 1. Aesthetic & Solid Color Themes
- **13 Handcrafted Palettes**: Includes developer favorites such as *Tokyo Night*, *Catppuccin Mocha*, *Dracula Dark*, *Nordic Frost*, *Sakura Night*, *Cyber Matrix*, *Synthwave Grid*, *Midnight Orchid*, *Web Crawler*, *Adventure RPG*, *Pixel Art (8-Bit)*, and *Vintage Paper*.
- **Vintage Paper Special Material**: Simulates a 19th-century letterpress with laid kraft parchment texture, fiber pulp, iron-gall inks (oxblood, ink blue, teal), and realistic texture parallax during scrolling.
- **Instant Live Switching**: Changes are applied immediately across all open LeetCode problem tabs without page reloads.

### 2. Scenic Wallpaper Themes & Wallpaper Studio
- **18 Wallpaper Presets**: High-definition curated anime landscapes, night shrines, cyberpunk cityscapes, sunset train windows, and fantasy dragons.
- **Dynamic Difficulty Arcs**: Automatically transitions the workspace background based on problem difficulty (e.g. *Train Window* for Easy, *Moonlit Shrine* for Medium, *Crimson Dragon* for Hard).
- **Custom Image Upload**: Upload any PNG, JPG, WebP, AVIF, or GIF directly from your device. Images are processed and stored locally in browser storage.
- **Interactive Wallpaper Studio (`studio.html`)**:
  - **Glass Mode Switcher**: Auto, Dark, or Light glass tints.
  - **Glass Panel Opacity & Background Blur**: Fine-tune transparency from 30% to 98% and blur from 0px to 20px.
  - **Live WCAG Contrast Meter**: Displays real-time contrast ratios for problem text, code editor text, accents, and submit buttons.

### 3. Monaco Code Editor Styling & Typography
- **Independent Syntax Palette**: Decouple interface themes from code syntax. Pair any Monaco syntax palette with any interface theme.
- **Bundled Fonts (WOFF2)**:
  - **JetBrains Mono**: Clean, high-legibility developer typeface with clear character distinctions.
  - **Courier Prime**: Classic typewriter monospace tailored for code.
- **System Fonts Support**: One-click selection of *Fira Code*, *Cascadia Code*, *Source Code Pro*, *Consolas*, or system default.
- **Programming Ligatures**: Full support for glyph ligatures (`===`, `!=`, `=>`, `<=`).
- **Cursor Animation Modes**:
  - *Standard Blink*: Crisp, instant caret blinking with zero lag.
  - *Smooth Slide*: Fluid caret glide motion while typing and navigating.
  - *Solid*: Steady caret without blinking.
- **Font Size Control**: Granular slider from 11px to 22px.

### 4. Interview Blind Mode (Anti-Bias)
*Simulate high-pressure technical interviews by eliminating unconscious bias and spoilers:*
- **Difficulty Masking**: Replaces the prominent "Easy", "Medium", and "Hard" pills with a neutral, non-judgmental `"Challenge"` badge.
- **Topic & Company Tag Blurring**: Blurs spoiler tags (e.g., "Dynamic Programming", "Trie", "Google", "Amazon"). Tags are revealed on hover if hints are needed.
- **Distraction-Free Stats**: Hides acceptance percentages, total submissions, and user ratings to keep focus entirely on problem-solving.
- **Instant Shortcut**: Toggle Blind Mode on/off anytime using <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> (<kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> on macOS).

### 5. Productivity & Interview Tools
- **Floating Stopwatch & Interview Timer (`timer.js`)**:
  - Compact, draggable glassmorphic timer pill pinned to your viewport.
  - Presets for **Stopwatch**, **15 Minutes**, **25 Minutes (Pomodoro)**, and **45 Minutes (Mock Interview)**.
  - Dynamic visual pulses: glows amber under 2 minutes, flashes red when time expires.
- **Problem Solution Notes Drawer (`notes.js`)**:
  - Slide-out markdown scratchpad drawer anchored to the right edge of the screen (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>N</kbd>).
  - Automatically isolates and saves notes per problem slug (`two-sum`, `lru-cache`, etc.).
  - Dedicated fields for **Intuition / Notes**, **Time Complexity** ($O(N)$), and **Space Complexity** ($O(1)$).
- **Fullscreen Zen Mode (`zen-mode.js`)**:
  - Maximizes the Monaco editor to 100% of the viewport (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>).
  - Strips away top navigation, status bars, and UI chrome for pure algorithmic focus. Press <kbd>Esc</kbd> or click the floating chip to exit.
- **Focus Mode (`Ctrl+Shift+.`)**:
  - Temporarily suppresses custom wallpapers and effects to provide pure high-contrast flat backgrounds.
- **Spotlight Command Palette (`command-palette.js`)**:
  - Summoned via <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>Cmd</kbd> + <kbd>K</kbd>.
  - Search and jump directly to popular LeetCode problems (e.g., *Two Sum*, *LRU Cache*, *Trapping Rain Water*).
  - Execute instant commands: switch themes, toggle Zen mode, open notes, or enable the timer without touching the mouse.

### 6. Submission Celebrations & Social Share Cards
- **Interactive Moments**:
  - **Pixel Art Theme**: Upon an Accepted submit, triggers an 8-bit rocket and railgun animation that tears the UI into chunky pixels, displays `"STAGE CLEAR"`, and rewinds time back together.
  - **Adventure RPG Theme**: Moonlit fantasy HUD with level title cards, drifting ambient sakura petals, quest sidebars, and celebratory verdict banners (*QUEST COMPLETE*, *CHECKPOINT*, *ATTEMPT FAILED*).
  - **Anime Theme**: Cinematic episode title cards upon opening unsolved problems.
- **Social Share Card Generator (`share.js`)**:
  - Generates a polished 1200×630 canvas graphic upon an Accepted submission.
  - Displays your problem number, title, Beats % percentile, runtime, programming language, day streak, and active theme artwork.
  - One-click **Copy Image**, **Download PNG**, or pre-fill post composer for **LinkedIn** and **X (Twitter)**.

### 7. Automation & Settings Synchronization
- **Automatic Day / Night Scheduler (`day-night.js`)**:
  - Automatically flips between a designated daytime theme (e.g., *Vintage Paper*) and nighttime theme (e.g., *Tokyo Night*).
  - Triggers by local clock (7:00 AM – 7:00 PM) or OS appearance (`prefers-color-scheme`).
- **Backup & Restore (`theme-sync.js`)**:
  - Export all theme selections, custom uploaded wallpapers, editor preferences, and interview settings into a portable `.json` file.
  - One-click import restores your exact environment on any browser or machine.

---

## 🎨 Theme Catalog

### Curated Solid Themes

| Theme ID | Name | Description | Accent | Base Color |
| :--- | :--- | :--- | :--- | :--- |
| `tokyonight` | **Tokyo Night** | Midnight indigo, neon violet & cyan accents | `#7aa2f7` | `#1a1b26` |
| `catppuccin` | **Catppuccin Mocha** | Soothing warm dark pastels | `#cba6f7` | `#1e1e2e` |
| `sakura` | **Sakura Night** | Plum indigo with delicate cherry blossom pink | `#ff7eb6` | `#1f1a2e` |
| `paper` | **Vintage Paper** | 19th-century kraft parchment & iron-gall sepia ink | `#8b3a2b` | `#ebdcc4` |
| `matrix` | **Cyber Matrix** | Obsidian terminal & phosphor green matrix glow | `#22c55e` | `#0b0f12` |
| `grid` | **Synthwave Grid** | Blueprint dark navy & electric cyan vectors | `#06b6d4` | `#0f172a` |
| `orchid` | **Midnight Orchid** | Royal dark velvet & vivid magenta glow | `#d946ef` | `#181124` |
| `dracula` | **Dracula Dark** | Classic gothic slate with vampire pink & green | `#ff79c6` | `#282a36` |
| `nord` | **Nordic Frost** | Arctic polar night with muted frost teal | `#88c0d0` | `#2e3440` |
| `crawler` | **Web Crawler** | Charcoal dark web & electric crimson current | `#e0223f` | `#17171c` |
| `game` | **Adventure RPG** | Moonlit realm with fantasy HUD & quest cards | `#7dd3fc` | `#101a2c` |
| `pixel` | **Pixel Art (8-Bit)** | Sweetie-16 retro arcade palette & explosion | `#ffcd75` | `#262b44` |
| `off` | **Default LeetCode** | Restores clean, un-themed default LeetCode view | `#94a3b8` | Native |

### Scenic & Anime Wallpaper Presets

| Preset ID | Scene Name | Description | Default Glass Role |
| :--- | :--- | :--- | :--- |
| `moonlit-shrine` | **Moonlit Shrine** | Torii gate, cherry blossoms, and a full moon | Dark Scrim (`#1d0a22`) |
| `blossom-night` | **Blossom Night** | Hanging lanterns under a glowing pink moon | Dark Scrim (`#190b21`) |
| `moon-field` | **Moon Field** | Lone swordsman standing in grass under a massive moon | Deep Teal (`#091923`) |
| `harvest-moon` | **Harvest Moon** | Straw hat on a peaceful moonlit hill | Midnight Cyan (`#091623`) |
| `moon-wanderer` | **Moon Wanderer** | Distant blue hills and a wandering traveler | Indigo Slate (`#091223`) |
| `golden-hour` | **Golden Hour** | Power lines against a glowing sunset horizon | Warm Dark (`#091b23`) |
| `city-cat` | **City Night** | Solitary cat watching a sparkling metropolitan skyline | Deep Blue (`#091c23`) |
| `starfield` | **Starfield** | Two figures stargazing under a brilliant blue cosmos | Cosmic Indigo (`#091823`) |
| `torii-forest` | **Torii Forest** | Vivid red shinto gate in a moonlit pine forest | Deep Pine (`#090c23`) |
| `train-window` | **Train Window** | Relaxing dusk skyline through a passenger train window | Dusk Plum (`#160e1d`) |
| `new-year` | **New Year's Eve** | Celebratory fireworks bursting over the city | Midnight Violet (`#090c22`) |
| `forest-road` | **Forest Road** | Quiet road winding through a canopy at dusk | Cold Slate (`#0d141e`) |
| `map-room` | **Map Room** | Charting an adventure map by warm lamplight | Amber Charcoal (`#10171c`) |
| `blue-dragon` | **Blue Dragon** | A fearless traveler and her legendary dragon | Warm Umber (`#20150b`) |
| `dragon-bride` | **Dragon Bride** | Crimson silk embroidery and dark dragon scales | Dark Burgundy (`#1b1014`) |
| `crimson-dragon` | **Crimson Dragon** | Brave warrior facing a massive red dragon | Crimson Coal (`#1b1013`) |
| `sakura-dusk` | **Sakura Dusk** | Procedurally painted shrine hill with falling petals | Plum Violet (`#150b21`) |
| `neon-rain` | **Neon Rain** | Procedurally painted rainy rooftop with neon reflections | Rainy Navy (`#0c0b21`) |

---

## 🏗️ Technical Architecture & Design

```
+---------------------------------------------------------------------------------------+
|                                    LEETCODE BROWSER TAB                               |
|                                                                                       |
|   +----------------------------------+     +--------------------------------------+   |
|   |         MAIN World Script        |     |        ISOLATED World Scripts        |   |
|   |   (run_at: document_start)       |     |      (run_at: document_start)        |   |
|   |                                  |     |                                      |   |
|   |  - net-verdict.js                |     |  - content.js (Theme & Base Sync)    |   |
|   |    (Intercepts Fetch/XHR checks) |     |  - problem.js (Slug & Difficulty)    |   |
|   |  - inject.js                     |     |  - monaco-ink.js (CSS Token Overrides)|  |
|   |    (Reaches window.monaco API)   |     |  - verdict.js (Unified Aggregator)   |   |
|   +-----------------+----------------+     |  - blind-mode.js (Masking Engine)    |   |
|                     | CustomEvents         |  - timer.js, notes.js, zen-mode.js   |   |
|                     +--------------------> |  - command-palette.js, share.js      |   |
|                                            |  - anime/*, game/*, pixel/* (Moments)|   |
|                                            +-------------------+------------------+   |
|                                                                |                      |
|                                              chrome.storage.local Event Bus           |
|                                                                |                      |
+----------------------------------------------------------------+----------------------+
                                                                 |
                                +--------------------------------+------------------+
                                |                                                   |
                 +--------------+-----------------+                +----------------+---------------+
                 |       Background Worker        |                |           Action Popup         |
                 |       (background.js)          |                |           (popup.html)         |
                 |                                |                |                                |
                 | - Command shortcut handler     |                | - Color theme selector         |
                 | - Storage defaults on install  |                | - Wallpaper & Studio launcher  |
                 +--------------------------------+                | - Editor & font configuration  |
                                                                   | - Interview tools toggles      |
                                                                   | - Day/night & JSON sync        |
                                                                   +--------------------------------+
```

### Manifest V3 Architecture
The extension complies fully with modern **Chrome Extension Manifest V3** specifications:
- No remote code execution or dynamically hosted scripts.
- Pure declarative web accessible resources.
- Service worker lifecycle handling keyboard commands and default setup.

### Dual Execution Worlds (MAIN vs. ISOLATED)
LeetCode relies heavily on dynamic single-page application (SPA) rendering and webpack-bundled scripts. Standard isolated content scripts cannot communicate directly with LeetCode's in-memory `window.monaco` instance or capture streaming WebSocket/Fetch responses without hitting page Content Security Policy (CSP).

To solve this, the extension uses two execution contexts:
1. **`world: "MAIN"`**:
   - `src/net-verdict.js`: Patches `window.fetch` and `XMLHttpRequest.prototype.open/send` before any page scripts execute. It inspects only LeetCode submission check requests (`/submissions/detail/.../check/`) and test run endpoints, emitting sanitized `lcts:net-verdict` custom events.
   - `src/inject.js`: Interacts directly with `window.monaco.editor` to set theme tokens, define custom themes, and adjust editor options natively.
2. **`world: "ISOLATED"`**:
   - Manages DOM modifications, listens to extension storage changes, mounts floating UI widgets, and handles all user interactions safely separated from the webpage's JavaScript namespace.

### Clean-Room Monaco Editor Re-Theming
LeetCode bundles Monaco Editor inside a private webpack closure and often does not expose it on `window.monaco`. Standard approaches using DOM observers to re-scan inline stylesheets cause severe lag during editor scrolling.
- **Bijective Token Resolution**: Monaco emits tokens like `.mtk1`, `.mtk5`, `.mtk10`. `monaco-ink.js` decodes Monaco's token rules and publishes a zero-lag override stylesheet (`lcts-monaco-ink`).
- **Decaying Heartbeat**: Instead of continuous mutation observers, the injector employs a decaying mounting schedule ($0.3\text{s}, 0.6\text{s}, 1.2\text{s} \dots 40\text{s}$) followed by a low-overhead 2-second stylesheet length check.

### Network Verdict Interceptor Engine
Unlike brittle web scrapers that read verdict text from DOM nodes (which break whenever LeetCode updates its CSS classes or localization strings), `src/net-verdict.js` intercepts the actual JSON payloads returned by LeetCode's backend:
- Accurately captures `Accepted`, `Wrong Answer`, `Time Limit Exceeded`, `Memory Limit Exceeded`, `Runtime Error`, and `Compile Error`.
- Retrieves exact **Runtime Percentile (Beats %)**, **Memory Percentile**, **Execution Time (ms)**, and **Passed Testcases count**.
- Automatically falls back to DOM scanning (`verdict.js`) if network interception is unavailable.

### Mathematical WCAG Scrim Contrast Solver
Wallpaper transparency can easily render code text illegible. `src/anime/solver.js` implements a mathematical solver that calculates color luminance in gamma-encoded sRGB:
$$\text{Luminance} = 0.2126 \times R_{\text{lin}} + 0.7152 \times G_{\text{lin}} + 0.0722 \times B_{\text{lin}}$$
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$
The solver analyzes sample pixels of any wallpaper image, calculates the worst-case background luminance, and dynamically solves for the minimum scrim alpha required to ensure text meets or exceeds **WCAG AA (4.5:1)** and **WCAG AAA (7.0:1)** standards.

### 3-Layer CSS Design System
`themes/core.css` abstracts LeetCode's layout into three clean layers:
1. **Token Remapping**: Maps LeetCode's internal design tokens (`--layer-01`, `--fill-tertiary`, `--text-primary`, `--sd-*`, FlexLayout's `--color-*`) to the extension's `--lc-*` variables.
2. **Utilities**: Overrides hardcoded Tailwind utility classes with exact token selectors.
3. **Structural Layout**: Targets stable structural nodes (`.flexlayout__*`, `#ide-top-btns`, `.monaco-editor`).

### Cost Control & Zero-Lag Performance Rules
- **No Idle CPU Burn**: No unbounded `requestAnimationFrame` loops or aggressive full-document `MutationObserver` instances.
- **Hardware-Accelerated Motion**: All animations in celebration overlays (petals, particle explosions, drawer slides) use exclusively `transform` and `opacity` properties to run directly on the browser compositor thread without triggering layout reflows.
- **Automatic Resource Cleanup**: Floating dialogs, canvases, and overlays are immediately detached and garbage-collected once dismissed.

---

## 📁 Complete Directory & File Structure

```text
├── manifest.json              # Chrome Manifest V3 manifest
├── fonts/                     # Bundled open-source coding & display typefaces (WOFF2)
│   ├── cinzel-*.woff2         # Cinzel font (Title cards)
│   ├── courierprime-*.woff2   # Courier Prime monospace
│   ├── delagothic-sub.woff2   # Dela Gothic One (Japanese display)
│   ├── garamond-*.woff2       # EB Garamond (Problem prose)
│   ├── imfell-*.woff2         # IM Fell English (Parchment letterpress)
│   ├── jbmono-*.woff2         # JetBrains Mono (Default coding font)
│   ├── macondo-400.woff2      # Macondo display font
│   ├── metamorphous-400.woff2 # Metamorphous fantasy font
│   ├── pixelify-sub.woff2     # Pixelify Sans (Retro 8-bit font)
│   └── LICENSE-*.txt          # OFL / Apache license files for all fonts
├── icons/                     # Extension branding icons
│   ├── icon.svg               # Vector icon source
│   ├── icon16.png             # 16x16 browser action icon
│   ├── icon48.png             # 48x48 extension management icon
│   └── icon128.png            # 128x128 Chrome Web Store icon
├── src/                       # Extension logic and content scripts
│   ├── background.js          # Background service worker (commands & initial state)
│   ├── content.js             # Content script: Early theme and color scheme synchronizer
│   ├── inject.js              # MAIN world script: Monaco theme & options API injector
│   ├── net-verdict.js         # MAIN world script: Network Fetch/XHR verdict interceptor
│   ├── verdict.js             # Unified verdict event dispatcher & DOM fallback
│   ├── problem.js             # Problem metadata tracker (slug, title, difficulty cache)
│   ├── editor-settings.js     # Monaco font family, ligatures, size & caret bridge
│   ├── blind-mode.js          # Interview Blind Mode (difficulty & spoiler tag mask)
│   ├── timer.js               # Draggable floating interview timer & stopwatch widget
│   ├── notes.js               # Slide-out markdown solution scratchpad drawer
│   ├── zen-mode.js            # Fullscreen distraction-free Monaco Zen mode
│   ├── command-palette.js     # Spotlight command palette & quick problem jumper (Ctrl+K)
│   ├── share.js               # Social share card canvas renderer (1200x630)
│   ├── day-night.js           # Automated Day/Night theme schedule manager
│   ├── theme-sync.js          # JSON configuration export/import utility
│   ├── monaco-ink.js          # Token-level Monaco editor palette synthesizer
│   ├── monaco-theme.js        # Curated Monaco editor color definitions
│   ├── sheet-scroll.js        # Texture scroll parallax engine for Paper theme
│   ├── popup.html             # Extension action popup markup
│   ├── popup.css              # Action popup styling
│   ├── popup.js               # Action popup controller (tab navigation & state sync)
│   ├── studio.html            # Wallpaper Studio web app
│   ├── studio.css             # Wallpaper Studio styling
│   ├── studio.js              # Wallpaper Studio controller (contrast & preset solver)
│   ├── anime/                 # Anime theme module
│   │   ├── anime.js           # Anime scene lifecycle driver
│   │   ├── css.js             # Dynamic CSS rule generator for anime scenes
│   │   ├── moments.js         # Episode title cards & result celebration triggers
│   │   ├── moments-ui.js      # Title card & verdict overlay DOM generator
│   │   ├── preview.html       # Wallpaper Studio live preview frame
│   │   ├── preview.js         # Preview frame communication bridge
│   │   ├── process.js         # Client-side image downsampling & color extraction
│   │   ├── scenes.js          # Precomputed color & contrast solutions for 18 scenes
│   │   ├── solver.js          # Mathematical WCAG contrast & scrim solver
│   │   └── sounds.js          # Web Audio sound driver
│   ├── game/                  # Adventure RPG theme module
│   │   ├── game.js            # RPG HUD lifecycle & problem level manager
│   │   ├── ambient.js         # Ambient drifting petals & floating particles
│   │   ├── icons.js           # RPG HUD icon styling
│   │   ├── petals.js          # Particle physics simulator for floating sakura petals
│   │   ├── result.js          # RPG Quest Complete / Checkpoint celebratory banners
│   │   ├── sidebar.js         # Vertical RPG navigation sidebar
│   │   ├── sounds.js          # RPG audio driver
│   │   ├── title-card.js      # RPG Level title card banner
│   │   ├── preview.html       # RPG preview frame
│   │   └── preview.css        # RPG preview frame styling
│   └── pixel/                 # Retro 8-Bit Pixel Art module
│       ├── pixel.js           # 8-bit rocket destruction & time-rewind animation
│       └── sprites.js         # Sweetie-16 pixel sprite matrices
├── textures/                  # High-performance WebP & PNG graphics
│   ├── anime/                 # Wallpaper images, blurred scrims, and thumbnails
│   ├── game/                  # RPG textures & HUD icons
│   ├── orchid-desk.webp       # Velvet desk texture for Midnight Orchid
│   ├── orchid-velvet.webp     # Velvet backdrop for Midnight Orchid
│   ├── paper-desk.webp        # Wood desk texture for Vintage Paper
│   ├── paper-grain.png        # Transparent laid-paper grain overlay
│   └── paper-sheet.webp       # Parchment kraft texture
└── themes/                    # Modular theme CSS stylesheets
    ├── core.css               # Base design system, token remaps & font definitions
    ├── themes.css             # Tokyo Night, Catppuccin, Dracula, Nord, Matrix styles
    ├── paper.css              # Vintage Paper stylesheet
    ├── sakura.css             # Sakura Night stylesheet
    ├── grid.css               # Synthwave Grid stylesheet
    ├── orchid.css             # Midnight Orchid stylesheet
    ├── anime.css              # Anime wallpaper glassmorphic theme styles
    ├── crawler.css            # Web Crawler charcoal & crimson styles
    ├── game.css               # Adventure RPG HUD styles
    └── pixel.css              # Pixel Art 8-bit theme styles
```

---

## ⌨️ Keyboard Shortcuts

All key bindings are designed to boost ergonomics while coding:

| Shortcut | macOS Equivalent | Action | Scope |
| :--- | :--- | :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> | <kbd>Cmd</kbd> + <kbd>K</kbd> | **Spotlight Command Palette** (Search problems, launch commands) | LeetCode Problem Page |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd> | **Toggle Interview Blind Mode** (Hide difficulty & blur tags) | Global Extension Shortcut |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> | **Toggle Fullscreen Zen Mode** (Maximize Monaco editor) | Global Extension Shortcut |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>.</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>.</kbd> | **Toggle Focus Mode** (Hide custom wallpaper & effects) | Global Extension Shortcut |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>N</kbd> | <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>N</kbd> | **Toggle Problem Notes Drawer** (Open/close scratchpad) | LeetCode Problem Page |
| <kbd>Esc</kbd> | <kbd>Esc</kbd> | **Exit Zen Mode / Close Drawer / Close Modal** | Active Overlay |

> 💡 *Note: Shortcuts can be remapped anytime by visiting `chrome://extensions/shortcuts` in your browser.*

---

## 🗄️ Storage Schema (`chrome.storage.local`)

The extension preserves all user configuration locally using `chrome.storage.local`:

| Storage Key | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `lcTheme` | `string` | `'tokyonight'` | Active theme ID (e.g. `'paper'`, `'sakura'`, `'anime'`, `'off'`) |
| `lcThemeStudio` | `string` | `'tokyonight'` | Synchronized studio theme identifier |
| `lcMonacoTheme` | `string` | `'default'` | Dedicated Monaco syntax palette (`'default'`, `'tokyonight'`, `'catppuccin'`, etc.) |
| `lcBlindMode` | `object` | `{ active: true, hideDifficulty: true, blurTags: true, hideStats: true }` | Interview Blind Mode configuration |
| `lcEditorSettings` | `object` | `{ v: 2, font: 'default', ligatures: true, fontSize: 'default', cursorStyle: 'blink' }` | Monaco font family, ligatures, size, and caret motion |
| `lcTimerEnabled` | `boolean` | `false` | Whether the floating interview stopwatch/timer widget is visible |
| `lcNotesEnabled` | `boolean` | `true` | Whether the slide-out problem notes scratchpad button is enabled |
| `lcZenMode` | `boolean` | `false` | Distraction-free full-screen editor state |
| `lcFocus` | `boolean` | `false` | Focus mode state (hides wallpaper background) |
| `lcCustomWallpaper` | `object` | `null` | Uploaded image data URL, enabled state, custom opacity, and blur |
| `lcDayNight` | `object` | `{ enabled: false, mode: 'time', dayTheme: 'paper', nightTheme: 'anime' }` | Automatic day/night scheduler settings |
| `lcShare` | `object` | `{ enabled: true }` | Whether to offer social celebration cards after Accepted submit |
| `lcProblemCache` | `object` | `{}` | Local LRU cache of problem difficulties (up to 400 problems) to eliminate layout shift |
| `lcNotesData` | `object` | `{}` | Map of problem slugs to user solution notes and time/space complexity |
| `lcStats` | `object` | `{ days: [], clears: 0 }` | Local problem solve streak tracker and clear count |

---

## 🚀 Installation & Setup

### Developer Mode (Local Installation)

1. **Clone or Download** this repository:
   ```bash
   git clone https://github.com/akashsingh062/leetcode-theme-extension.git
   ```
2. Open your Chromium-based browser (Google Chrome, Brave, Microsoft Edge, Opera, or Vivaldi).
3. Navigate to `chrome://extensions/` in your address bar.
4. Enable **Developer mode** using the toggle in the top-right corner.
5. Click **Load unpacked** in the top-left corner.
6. Select the root folder of this project (the folder containing `manifest.json`).
7. Open any LeetCode problem, e.g. [Two Sum](https://leetcode.com/problems/two-sum/), and click the extension icon in your browser toolbar to choose your theme!

---

## 🔒 Privacy & Security

- **100% Offline & Client-Side**: All themes, solvers, notes, and animations run entirely within your local browser.
- **Zero Remote Network Requests**: The extension makes **no external API calls** and includes **no tracking, telemetry, or analytics**.
- **Secure Code Execution**: No `eval()` or unvetted remote scripts. Compliant with strict Manifest V3 Content Security Policies.
- **Data Ownership**: Your notes, streaks, and custom wallpapers stay on your device and can be backed up or wiped at any time using the JSON export/import tool.

---

## 📜 Font Attributions & Credits

All fonts bundled in `/fonts` are licensed under the [SIL Open Font License (OFL)](http://scripts.sil.org/OFL) or [Apache 2.0 License]:
- **JetBrains Mono**: Created by JetBrains ([OFL-1.1](fonts/LICENSE-jetbrains-mono.txt))
- **Courier Prime**: Created by Quote-Unquote Apps ([OFL-1.1](fonts/LICENSE-courier-prime.txt))
- **EB Garamond**: Created by Georg Duffner & Octavio Pardo ([OFL-1.1](fonts/LICENSE-eb-garamond.txt))
- **IM Fell English**: Designed by Igino Marini ([OFL-1.1](fonts/LICENSE-im-fell-english.txt))
- **Cinzel**: Designed by Natanael Gama ([OFL-1.1](fonts/LICENSE-cinzel.txt))
- **Dela Gothic One**: Designed by Artkana ([OFL-1.1](fonts/LICENSE-dela-gothic-one.txt))
- **Pixelify Sans**: Designed by Stefie Justprince ([OFL-1.1](fonts/LICENSE-pixelify-sans.txt))
- **Macondo**: Designed by John Vargas Beltrán ([OFL-1.1](fonts/LICENSE-macondo.txt))
- **Metamorphous**: Designed by James Grieshaber ([OFL-1.1](fonts/LICENSE-metamorphous.txt))

*Scenic and wallpaper art are procedurally rendered or licensed under commercial asset terms (Freepik / Magnific / Pixabay). Credits are individually detailed in `src/anime/scenes.js` and visible in Wallpaper Studio.*
