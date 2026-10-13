/* =============================================================================
   inject.js  — runs in the PAGE (MAIN) world via manifest content_scripts,
   so it can reach window.monaco and is NOT subject to page CSP.
   Recolors the Monaco code editor to match the active theme and keeps it applied
   across editor re-creation and LeetCode's own setTheme() calls.
============================================================================= */
(() => {
  if (window.__lcThemeStudioInjected) return;
  window.__lcThemeStudioInjected = true;

  const NAME = (id) => 'lcts-' + id;

  /* palette = { base, fg, syn{}, colors{} }  (syntax value ending in 'i' = italic) */
  const PALETTES = {
    /* Vintage Paper — iron-gall ink on crumpled kraft stock.
       The background is fully transparent so the sheet's laid lines, fibre and
       pulp mottle run continuously behind the code; the paper IS the editor
       background. Hues are the four inks a 19th-c. press actually stocked —
       oxblood, ink blue, leaf green, teal — plus plum and violet for the roles a
       press never had to print. Each is the lightest value at its hue that
       still clears 4.5:1 on the kraft, because on a mid-tone stock the contrast
       budget IS the chroma budget. They stay legible for anyone with red-green
       colour deficiency: they differ in lightness, not only in hue. */
    paper: {
      base: 'vs', fg: '241d14',
      font: '"Courier Prime","Courier New",monospace',
      /* solved for the editor's deeper stock; keep in sync with monaco-ink.js */
      syn: { comment:'332e25i', keyword:'650500b', control:'5f0043b', string:'003804',
             number:'00343f', func:'00208a', type:'4a007b', variable:'241d14',
             param:'1a2d5a', constant:'00343f', operator:'3a2d1d', regexp:'003804',
             tag:'650500b', attr:'00208a', escape:'00343f' },
      colors: {
        'editor.background':'#00000000','editor.foreground':'#241d14',
        'editorGutter.background':'#00000000',
        'editorLineNumber.foreground':'#483c25','editorLineNumber.activeForeground':'#650500',
        /* a ruler laid across the line, not a highlighted row */
        'editor.lineHighlightBackground':'#3a260c12',
        'editor.lineHighlightBorder':'#00000000',
        'editorCursor.foreground':'#6d190e',
        /* selection is a highlighter, matching ::selection in the prose */
        'editor.selectionBackground':'#fcf0cb9e',
        'editor.selectionHighlightBackground':'#fcf0cb4a',
        'editor.inactiveSelectionBackground':'#fcf0cb33',
        'editorWhitespace.foreground':'#8a7145',
        'editorIndentGuide.background':'#4a361830','editorIndentGuide.activeBackground':'#4a361866',
        'editorBracketMatch.background':'#8a221422','editorBracketMatch.border':'#6d190e',
        'editorError.foreground':'#650500','editorWarning.foreground':'#00343f',
        'scrollbarSlider.background':'#3a2c1847','scrollbarSlider.hoverBackground':'#3a2c1875',
        'editorWidget.background':'#d3b681','editorWidget.border':'#8a7145',
        'editorSuggestWidget.background':'#d3b681','editorSuggestWidget.border':'#8a7145',
        'editorSuggestWidget.selectedBackground':'#ac8d55',
        'editorHoverWidget.background':'#d3b681','editorHoverWidget.border':'#8a7145',
        'input.background':'#d3b681','input.border':'#8a7145',
        'editor.findMatchBackground':'#fcf0cba8','editor.findMatchHighlightBackground':'#fcf0cb55'
      }
    },
    /* Sakura Night — petal pink and cold cyan on plum-indigo. */
    sakura: {
      base: 'vs-dark', fg: 'ece9ff',
      syn: { comment:'6b6395i', keyword:'ff7eb6', control:'ff7eb6', string:'ffd479',
             number:'b98cff', func:'6ee7f0', type:'7ee8a5', variable:'ece9ff',
             param:'c9a6ff', constant:'b98cff', operator:'ff9ec8', regexp:'ffd479',
             tag:'ff7eb6', attr:'6ee7f0', escape:'6ee7f0' },
      colors: {
        'editor.background':'#211d3c','editor.foreground':'#ece9ff',
        'editorLineNumber.foreground':'#4a3f80','editorLineNumber.activeForeground':'#b8b2dd',
        'editor.lineHighlightBackground':'#2d275255','editorCursor.foreground':'#ff7eb6',
        'editor.selectionBackground':'#3d3468','editor.selectionHighlightBackground':'#3d346866',
        'editor.inactiveSelectionBackground':'#3d346844','editorWhitespace.foreground':'#332c5a',
        'editorIndentGuide.background':'#332c5a','editorIndentGuide.activeBackground':'#4a3f80',
        'editorBracketMatch.background':'#3d346877','editorBracketMatch.border':'#ff7eb6',
        'editorGutter.background':'#211d3c','editorError.foreground':'#ff6b8b',
        'editorWarning.foreground':'#ffd479','scrollbarSlider.background':'#3d346899',
        'scrollbarSlider.hoverBackground':'#4a3f80cc','editorWidget.background':'#1a1730',
        'editorSuggestWidget.background':'#1a1730','editorHoverWidget.background':'#1a1730',
        'input.background':'#0e0c18','editor.findMatchBackground':'#ff7eb655',
        'editor.findMatchHighlightBackground':'#ff7eb62e'
      }
    },
    /* Grid — drafting table. Mint and signal blue on blue-black. */
    grid: {
      base: 'vs-dark', fg: 'd7e0ec',
      syn: { comment:'56687fi', keyword:'58a6ff', control:'58a6ff', string:'a5d6ff',
             number:'ffa657', func:'35e0a1', type:'d2a8ff', variable:'d7e0ec',
             param:'9db0c6', constant:'ffa657', operator:'79c0ff', regexp:'a5d6ff',
             tag:'35e0a1', attr:'d2a8ff', escape:'ffa657' },
      colors: {
        'editor.background':'#141c28','editor.foreground':'#d7e0ec',
        'editorLineNumber.foreground':'#3a4a5f','editorLineNumber.activeForeground':'#35e0a1',
        'editor.lineHighlightBackground':'#1e293755','editorCursor.foreground':'#35e0a1',
        'editor.selectionBackground':'#2c3a4c','editor.selectionHighlightBackground':'#2c3a4c66',
        'editor.inactiveSelectionBackground':'#2c3a4c44','editorWhitespace.foreground':'#25303f',
        'editorIndentGuide.background':'#25303f','editorIndentGuide.activeBackground':'#3a4a5f',
        'editorBracketMatch.background':'#2c3a4c88','editorBracketMatch.border':'#35e0a1',
        'editorGutter.background':'#141c28','editorError.foreground':'#ff7b72',
        'editorWarning.foreground':'#e3b341','scrollbarSlider.background':'#2c3a4c99',
        'scrollbarSlider.hoverBackground':'#3a4a5fcc','editorWidget.background':'#111823',
        'editorSuggestWidget.background':'#111823','editorHoverWidget.background':'#111823',
        'input.background':'#080c12','editor.findMatchBackground':'#35e0a155',
        'editor.findMatchHighlightBackground':'#35e0a12e'
      }
    },
    /* Orchid (id "bloom") — rose gold and lavender on silk velvet. Kept in
       sync with INK.bloom in monaco-ink.js; this used to be a light "paper
       white" palette left over from the riso build, which painted light inks
       onto the dark velvet wherever window.monaco was actually reachable. */
    bloom: {
      base: 'vs-dark', fg: 'f4ecf7',
      syn: { comment:'9b86a9i', keyword:'ff9ec9', control:'ff9ec9', string:'f0c27b',
             number:'d89bff', func:'7fe3c0', type:'a8b8ff', variable:'f4ecf7',
             param:'d2c2db', constant:'d89bff', operator:'e3a88f', regexp:'f0c27b',
             tag:'ff9ec9', attr:'7fe3c0', escape:'f0c27b' },
      colors: {
        'editor.background':'#00000000','editor.foreground':'#f4ecf7',
        'editorGutter.background':'#00000000',
        'editorLineNumber.foreground':'#a68fa8','editorLineNumber.activeForeground':'#e9c2ff',
        'editor.lineHighlightBackground':'#d89bff0e','editor.lineHighlightBorder':'#00000000',
        'editorCursor.foreground':'#d89bff',
        'editor.selectionBackground':'#d89bff42','editor.selectionHighlightBackground':'#d89bff22',
        'editor.inactiveSelectionBackground':'#d89bff19','editorWhitespace.foreground':'#5b4272',
        'editorIndentGuide.background':'#d89bff29','editorIndentGuide.activeBackground':'#d89bff55',
        'editorBracketMatch.background':'#d89bff1a','editorBracketMatch.border':'#d89bffb3',
        'editorError.foreground':'#ff9ab0','editorWarning.foreground':'#f0c27b',
        'scrollbarSlider.background':'#d89bff42','scrollbarSlider.hoverBackground':'#d89bff70',
        'editorWidget.background':'#221730','editorWidget.border':'#5b4272',
        'editorSuggestWidget.background':'#221730','editorSuggestWidget.border':'#5b4272',
        'editorSuggestWidget.selectedBackground':'#33243f',
        'editorHoverWidget.background':'#221730','editorHoverWidget.border':'#5b4272',
        'input.background':'#1a1124','input.border':'#5b4272',
        'editor.findMatchBackground':'#e3a88f5c','editor.findMatchHighlightBackground':'#e3a88f2e'
      }
    },
    /* Pixel Art — kept in sync with INK.pixel in monaco-ink.js. */
    pixel: {
      base: 'vs-dark', fg: 'f4f4f4',
      syn: { comment:'8b9bb4i', keyword:'ffcd75', control:'ff8fa3', string:'a7f070',
             number:'c9a0ff', func:'73eff7', type:'6cb6ff', variable:'f4f4f4',
             param:'c5d3e0', constant:'c9a0ff', operator:'ffa36b', regexp:'a7f070',
             tag:'73eff7', attr:'6cb6ff', escape:'c9a0ff' },
      colors: {
        'editor.background':'#00000000','editor.foreground':'#f4f4f4',
        'editorGutter.background':'#00000000',
        'editorLineNumber.foreground':'#566c86','editorLineNumber.activeForeground':'#ffcd75',
        'editor.lineHighlightBackground':'#f4f4f40a','editor.lineHighlightBorder':'#00000000',
        'editorCursor.foreground':'#ffcd75',
        'editor.selectionBackground':'#ffcd7547','editor.selectionHighlightBackground':'#ffcd7522',
        'editor.inactiveSelectionBackground':'#ffcd751a','editorWhitespace.foreground':'#333c57',
        'editorIndentGuide.background':'#333c57','editorIndentGuide.activeBackground':'#566c86',
        'editorBracketMatch.background':'#73eff722','editorBracketMatch.border':'#73eff7',
        'editorError.foreground':'#ff6f86','editorWarning.foreground':'#ffcd75',
        'scrollbarSlider.background':'#566c8699','scrollbarSlider.hoverBackground':'#566c86cc',
        'editorWidget.background':'#1f2338','editorWidget.border':'#566c86',
        'editorSuggestWidget.background':'#1f2338','editorSuggestWidget.border':'#566c86',
        'editorSuggestWidget.selectedBackground':'#333c57',
        'editorHoverWidget.background':'#1f2338','editorHoverWidget.border':'#566c86',
        'input.background':'#171a2b','input.border':'#566c86',
        'editor.findMatchBackground':'#ffcd7560','editor.findMatchHighlightBackground':'#ffcd752e'
      }
    },
    /* Web Crawler — kept in sync with INK.crawler in monaco-ink.js. */
    crawler: {
      base: 'vs-dark', fg: 'eceaf2',
      syn: { comment:'6e6e7ai', keyword:'4db2ff', control:'ff4568', string:'ffcf6b',
             number:'c792ea', func:'4ce0b3', type:'b39dff', variable:'eceaf2',
             param:'b7b7c4', constant:'c792ea', operator:'ff8aa8', regexp:'ffcf6b',
             tag:'4ce0b3', attr:'b39dff', escape:'c792ea' },
      colors: {
        'editor.background':'#17171c','editor.foreground':'#eceaf2',
        'editorLineNumber.foreground':'#38384a','editorLineNumber.activeForeground':'#e0223f',
        'editor.lineHighlightBackground':'#20202755','editorCursor.foreground':'#e0223f',
        'editor.selectionBackground':'#2e2e38','editor.selectionHighlightBackground':'#2e2e3866',
        'editor.inactiveSelectionBackground':'#2e2e3844','editorWhitespace.foreground':'#26262e',
        'editorIndentGuide.background':'#26262e','editorIndentGuide.activeBackground':'#38384a',
        'editorBracketMatch.background':'#2e2e3888','editorBracketMatch.border':'#e0223f',
        'editorGutter.background':'#17171c','editorError.foreground':'#ff4d6a',
        'editorWarning.foreground':'#ffcc4d','scrollbarSlider.background':'#2e2e3899',
        'scrollbarSlider.hoverBackground':'#38384acc','editorWidget.background':'#101013',
        'editorSuggestWidget.background':'#101013','editorHoverWidget.background':'#101013',
        'input.background':'#07070a','editor.findMatchBackground':'#e0223f55',
        'editor.findMatchHighlightBackground':'#e0223f2e'
      }
    },
    /* Tokyo Night */
    tokyonight: {
      base: 'vs-dark', fg: 'c0caf5',
      syn: { comment:'565f89i', keyword:'bb9af7', control:'bb9af7', string:'9ece6a',
             number:'ff9e64', func:'7aa2f7', type:'2ac3de', variable:'c0caf5',
             param:'e0af68', constant:'ff9e64', operator:'89ddff', regexp:'b4f9f8',
             tag:'f7768e', attr:'7aa2f7', escape:'bb9af7' },
      colors: {
        'editor.background':'#1a1b26','editor.foreground':'#c0caf5',
        'editorLineNumber.foreground':'#3b4261','editorLineNumber.activeForeground':'#7aa2f7',
        'editor.lineHighlightBackground':'#24283b55','editorCursor.foreground':'#7aa2f7',
        'editor.selectionBackground':'#283457','editor.selectionHighlightBackground':'#28345766',
        'editor.inactiveSelectionBackground':'#28345744','editorWhitespace.foreground':'#232433',
        'editorIndentGuide.background':'#232433','editorIndentGuide.activeBackground':'#3b4261',
        'editorBracketMatch.background':'#28345788','editorBracketMatch.border':'#7aa2f7',
        'editorGutter.background':'#1a1b26','editorError.foreground':'#f7768e',
        'editorWarning.foreground':'#e0af68','scrollbarSlider.background':'#28345799',
        'scrollbarSlider.hoverBackground':'#3b4261cc','editorWidget.background':'#16161e',
        'editorSuggestWidget.background':'#16161e','editorHoverWidget.background':'#16161e',
        'input.background':'#13141c','editor.findMatchBackground':'#7aa2f755',
        'editor.findMatchHighlightBackground':'#7aa2f72e'
      }
    },
    /* Catppuccin Mocha */
    catppuccin: {
      base: 'vs-dark', fg: 'cdd6f4',
      syn: { comment:'6c7086i', keyword:'cba6f7', control:'cba6f7', string:'a6e3a1',
             number:'fab387', func:'89b4fa', type:'f9e2af', variable:'cdd6f4',
             param:'eba0ac', constant:'fab387', operator:'94e2d5', regexp:'f5c2e7',
             tag:'f38ba8', attr:'89b4fa', escape:'cba6f7' },
      colors: {
        'editor.background':'#1e1e2e','editor.foreground':'#cdd6f4',
        'editorLineNumber.foreground':'#45475a','editorLineNumber.activeForeground':'#cba6f7',
        'editor.lineHighlightBackground':'#31324455','editorCursor.foreground':'#cba6f7',
        'editor.selectionBackground':'#45475a88','editor.selectionHighlightBackground':'#45475a55',
        'editor.inactiveSelectionBackground':'#45475a33','editorWhitespace.foreground':'#313244',
        'editorIndentGuide.background':'#313244','editorIndentGuide.activeBackground':'#45475a',
        'editorBracketMatch.background':'#45475a66','editorBracketMatch.border':'#cba6f7',
        'editorGutter.background':'#1e1e2e','editorError.foreground':'#f38ba8',
        'editorWarning.foreground':'#fab387','scrollbarSlider.background':'#45475a99',
        'scrollbarSlider.hoverBackground':'#585b70cc','editorWidget.background':'#181825',
        'editorSuggestWidget.background':'#181825','editorHoverWidget.background':'#181825',
        'input.background':'#11111b','editor.findMatchBackground':'#cba6f755',
        'editor.findMatchHighlightBackground':'#cba6f72e'
      }
    },
    /* Dracula Dark */
    dracula: {
      base: 'vs-dark', fg: 'f8f8f2',
      syn: { comment:'6272a4i', keyword:'ff79c6', control:'ff79c6', string:'f1fa8c',
             number:'bd93f9', func:'50fa7b', type:'8be9fd', variable:'f8f8f2',
             param:'ffb86c', constant:'bd93f9', operator:'ff79c6', regexp:'f1fa8c',
             tag:'ff79c6', attr:'50fa7b', escape:'ff79c6' },
      colors: {
        'editor.background':'#282a36','editor.foreground':'#f8f8f2',
        'editorLineNumber.foreground':'#6272a4','editorLineNumber.activeForeground':'#ff79c6',
        'editor.lineHighlightBackground':'#44475a55','editorCursor.foreground':'#ff79c6',
        'editor.selectionBackground':'#44475a','editor.selectionHighlightBackground':'#44475a66',
        'editor.inactiveSelectionBackground':'#44475a33','editorWhitespace.foreground':'#383a59',
        'editorIndentGuide.background':'#383a59','editorIndentGuide.activeBackground':'#6272a4',
        'editorBracketMatch.background':'#44475a88','editorBracketMatch.border':'#ff79c6',
        'editorGutter.background':'#282a36','editorError.foreground':'#ff5555',
        'editorWarning.foreground':'#ffb86c','scrollbarSlider.background':'#44475a99',
        'scrollbarSlider.hoverBackground':'#6272a4cc','editorWidget.background':'#21222c',
        'editorSuggestWidget.background':'#21222c','editorHoverWidget.background':'#21222c',
        'input.background':'#191a21','editor.findMatchBackground':'#ff79c655',
        'editor.findMatchHighlightBackground':'#ff79c62e'
      }
    },
    /* Nordic Frost */
    nord: {
      base: 'vs-dark', fg: 'eceff4',
      syn: { comment:'616e88i', keyword:'81a1c1', control:'81a1c1', string:'a3be8c',
             number:'b48ead', func:'88c0d0', type:'8fbcbb', variable:'eceff4',
             param:'d8dee9', constant:'b48ead', operator:'81a1c1', regexp:'ebcb8b',
             tag:'81a1c1', attr:'8fbcbb', escape:'d08770' },
      colors: {
        'editor.background':'#2e3440','editor.foreground':'#eceff4',
        'editorLineNumber.foreground':'#4c566a','editorLineNumber.activeForeground':'#88c0d0',
        'editor.lineHighlightBackground':'#3b425255','editorCursor.foreground':'#88c0d0',
        'editor.selectionBackground':'#434c5e','editor.selectionHighlightBackground':'#434c5e66',
        'editor.inactiveSelectionBackground':'#434c5e33','editorWhitespace.foreground':'#3b4252',
        'editorIndentGuide.background':'#3b4252','editorIndentGuide.activeBackground':'#4c566a',
        'editorBracketMatch.background':'#434c5e88','editorBracketMatch.border':'#88c0d0',
        'editorGutter.background':'#2e3440','editorError.foreground':'#bf616a',
        'editorWarning.foreground':'#ebcb8b','scrollbarSlider.background':'#434c5e99',
        'scrollbarSlider.hoverBackground':'#4c566acc','editorWidget.background':'#242933',
        'editorSuggestWidget.background':'#242933','editorHoverWidget.background':'#242933',
        'input.background':'#1d212a','editor.findMatchBackground':'#88c0d055',
        'editor.findMatchHighlightBackground':'#88c0d02e'
      }
    },
    /* Cyber Matrix */
    matrix: {
      base: 'vs-dark', fg: 'e2fced',
      syn: { comment:'4b6354i', keyword:'22c55e', control:'22c55e', string:'86efac',
             number:'facc15', func:'38bdf8', type:'4ade80', variable:'e2fced',
             param:'a7f3d0', constant:'facc15', operator:'10b981', regexp:'86efac',
             tag:'22c55e', attr:'38bdf8', escape:'4ade80' },
      colors: {
        'editor.background':'#0b0f12','editor.foreground':'#e2fced',
        'editorLineNumber.foreground':'#203328','editorLineNumber.activeForeground':'#22c55e',
        'editor.lineHighlightBackground':'#15241b55','editorCursor.foreground':'#22c55e',
        'editor.selectionBackground':'#153322','editor.selectionHighlightBackground':'#15332266',
        'editor.inactiveSelectionBackground':'#15332233','editorWhitespace.foreground':'#15241b',
        'editorIndentGuide.background':'#15241b','editorIndentGuide.activeBackground':'#203328',
        'editorBracketMatch.background':'#15332288','editorBracketMatch.border':'#22c55e',
        'editorGutter.background':'#0b0f12','editorError.foreground':'#ef4444',
        'editorWarning.foreground':'#facc15','scrollbarSlider.background':'#15332299',
        'scrollbarSlider.hoverBackground':'#203328cc','editorWidget.background':'#080c0e',
        'editorSuggestWidget.background':'#080c0e','editorHoverWidget.background':'#080c0e',
        'input.background':'#05080a','editor.findMatchBackground':'#22c55e55',
        'editor.findMatchHighlightBackground':'#22c55e2e'
      }
    },
    /* Gaming Theme */
    game: {
      base: 'vs-dark', fg: 'eef2ea',
      syn: { comment:'748a76i', keyword:'d4af6a', control:'d4af6a', string:'9fd88f',
             number:'7fc9c0', func:'8fb8e0', type:'c9a6ff', variable:'eef2ea',
             param:'cbb08a', constant:'7fc9c0', operator:'d7c9a0', regexp:'9fd88f',
             tag:'d4af6a', attr:'8fb8e0', escape:'7fc9c0' },
      colors: {
        'editor.background':'#182a1e','editor.foreground':'#eef2ea',
        'editorLineNumber.foreground':'#394f40','editorLineNumber.activeForeground':'#d4af6a',
        'editor.lineHighlightBackground':'#233a2a55','editorCursor.foreground':'#d4af6a',
        'editor.selectionBackground':'#2d4a36','editor.selectionHighlightBackground':'#2d4a3666',
        'editor.inactiveSelectionBackground':'#2d4a3633','editorWhitespace.foreground':'#233a2a',
        'editorIndentGuide.background':'#233a2a','editorIndentGuide.activeBackground':'#394f40',
        'editorBracketMatch.background':'#2d4a3688','editorBracketMatch.border':'#d4af6a',
        'editorGutter.background':'#182a1e','editorError.foreground':'#e0715a',
        'editorWarning.foreground':'#d4af6a','scrollbarSlider.background':'#2d4a3699',
        'scrollbarSlider.hoverBackground':'#394f40cc','editorWidget.background':'#122017',
        'editorSuggestWidget.background':'#122017','editorHoverWidget.background':'#122017',
        'input.background':'#0d1711','editor.findMatchBackground':'#d4af6a55',
        'editor.findMatchHighlightBackground':'#d4af6a2e'
      }
    },
    /* Anime / Wallpaper Themes (frosted glass editor) */
    anime: {
      base: 'vs-dark', fg: 'f6f0f7',
      syn: { comment:'b29cb7i', keyword:'d6b4fb', control:'fbaad2', string:'6ed6a2',
             number:'f7b470', func:'78da0b', type:'94c7f9', variable:'f6f0f7',
             param:'f2dcec', constant:'f7b470', operator:'dcd2e7', regexp:'6ed6a2',
             tag:'d6b4fb', attr:'78da0b', escape:'f7b470' },
      colors: {
        'editor.background':'#00000000','editor.foreground':'#f6f0f7',
        'editorGutter.background':'#00000000',
        'editorLineNumber.foreground':'#a68fa8','editorLineNumber.activeForeground':'#d6b4fb',
        'editor.lineHighlightBackground':'#d6b4fb14','editor.lineHighlightBorder':'#00000000',
        'editorCursor.foreground':'#d6b4fb',
        'editor.selectionBackground':'#d6b4fb44','editor.selectionHighlightBackground':'#d6b4fb22',
        'editor.inactiveSelectionBackground':'#d6b4fb19','editorWhitespace.foreground':'#5b4272',
        'editorIndentGuide.background':'#d6b4fb29','editorIndentGuide.activeBackground':'#d6b4fb55',
        'editorBracketMatch.background':'#d6b4fb22','editorBracketMatch.border':'#d6b4fb'
      }
    }
  };
  PALETTES.orchid = PALETTES.bloom;

  function ruleset(p) {
    const s = p.syn;
    /* a palette value is 6 hex digits plus optional style flags:
       'i' = italic, 'b' = bold. e.g. '9c2f1eb' = oxblood, bold. */
    const R = (tokens, val) => {
      const m = /^([0-9a-fA-F]{6})([ib]*)$/.exec(val) || [null, val, ''];
      const fg = m[1], flags = m[2] || '';
      const style = [flags.indexOf('i') > -1 ? 'italic' : '',
                     flags.indexOf('b') > -1 ? 'bold' : ''].filter(Boolean).join(' ');
      return tokens.map((t) => {
        const r = { token: t, foreground: fg };
        if (style) r.fontStyle = style;
        return r;
      });
    };
    return [
      { token: '', foreground: p.fg },
      ...R(['comment','comment.line','comment.block'], s.comment),
      ...R(['keyword','keyword.json','keyword.flow','storage','storage.type','modifier'], s.keyword),
      ...R(['keyword.control','control'], s.control),
      ...R(['string','string.value','string.key.json','string.quote','string.sql'], s.string),
      ...R(['string.escape','constant.character.escape'], s.escape),
      ...R(['number','number.hex','number.float','constant.numeric'], s.number),
      ...R(['regexp','string.regexp'], s.regexp),
      ...R(['type','type.identifier','struct','class','interface','enum','namespace','entity.name.type'], s.type),
      ...R(['function','entity.name.function','support.function','meta.function-call','function.call'], s.func),
      ...R(['variable','identifier','variable.other'], s.variable),
      ...R(['variable.parameter','parameter','variable.language'], s.param),
      ...R(['constant','constant.language','constant.other','boolean'], s.constant),
      ...R(['operator','keyword.operator','delimiter','delimiter.bracket','delimiter.parenthesis'], s.operator),
      ...R(['tag','metatag','entity.name.tag'], s.tag),
      ...R(['attribute.name','entity.other.attribute-name'], s.attr),
      ...R(['attribute.value'], s.string),
      ...R(['annotation','meta.annotation','decorator'], s.func)
    ];
  }

  let monaco = null;
  const definedFor = new Set();
  /* null when the theme is off: content.js removes the attribute */
  const currentId = () => {
    const override = document.documentElement.getAttribute('data-lc-monaco-theme');
    if (override && PALETTES[override]) return override;
    const id = document.documentElement.getAttribute('data-lc-theme');
    return PALETTES[id] ? id : null;
  };

  function defineAll() {
    if (!monaco || !monaco.editor) return;
    Object.keys(PALETTES).forEach((id) => {
      if (definedFor.has(id)) return;
      try {
        monaco.editor.defineTheme(NAME(id), {
          base: PALETTES[id].base, inherit: true,
          rules: ruleset(PALETTES[id]), colors: PALETTES[id].colors
        });
        definedFor.add(id);
      } catch (e) {}
    });
  }

  /* siteTheme: the last theme LeetCode itself asked for, so 'off' can hand the
     editor back. siteConfig: each editor's original options before we change them. */
  let applying = false, realSetTheme = null, siteTheme = null, oursApplied = false;
  const siteConfig = new WeakMap();

  const FONT_MAP = {
    'default': null,
    'jetbrains': "'JetBrains Mono', monospace",
    'courier': "'Courier Prime', 'Courier New', monospace",
    'consolas': "Consolas, 'Courier New', monospace",
    'system': "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
    'fira': "'Fira Code', monospace",
    'cascadia': "'Cascadia Code', 'Fira Code', monospace",
    'source': "'Source Code Pro', monospace"
  };

  let editorSettings = {
    v: 2,
    font: 'default',
    ligatures: true,
    fontSize: 'default',
    lineHeight: 'default',
    cursorStyle: 'blink'
  };

  function readSettingsAttr() {
    try {
      const raw = document.documentElement.getAttribute('data-lcts-editor-settings');
      if (raw) editorSettings = Object.assign({}, editorSettings, JSON.parse(raw));
    } catch (e) {}
  }

  window.addEventListener('lcts-editor-settings', (e) => {
    if (e.detail) {
      editorSettings = Object.assign({}, editorSettings, e.detail);
      applyEditorConfig();
    }
  });

  function applyEditorConfig(targetEd) {
    if (!monaco || !monaco.editor) return;
    readSettingsAttr();

    const id = currentId();
    let fam = null;
    if (editorSettings.font && editorSettings.font !== 'default') {
      fam = FONT_MAP[editorSettings.font] || editorSettings.font;
    } else if (id && PALETTES[id] && PALETTES[id].font) {
      fam = PALETTES[id].font;
    }

    const eds = targetEd ? [targetEd] : (monaco.editor.getEditors ? monaco.editor.getEditors() : []);
    eds.forEach((ed) => {
      try {
        if (!siteConfig.has(ed)) {
          const raw = ed.getRawOptions ? ed.getRawOptions() : {};
          siteConfig.set(ed, {
            fontFamily: raw.fontFamily,
            fontSize: raw.fontSize,
            lineHeight: raw.lineHeight,
            fontLigatures: raw.fontLigatures
          });
        }

        const orig = siteConfig.get(ed) || {};
        const update = {};

        // Font Family: preserve LeetCode's native monospace unless custom font is selected
        if (fam) {
          update.fontFamily = fam;
        } else if (orig.fontFamily) {
          update.fontFamily = orig.fontFamily;
        }

        // Font Size: preserve LeetCode's native font size unless explicitly chosen
        if (editorSettings.fontSize && editorSettings.fontSize !== 'default') {
          const fs = Number(editorSettings.fontSize);
          if (fs >= 10 && fs <= 32) update.fontSize = fs;
        } else if (orig.fontSize) {
          update.fontSize = orig.fontSize;
        }

        // Line Height: preserve LeetCode's native line height unless explicitly chosen
        if (editorSettings.lineHeight && editorSettings.lineHeight !== 'default') {
          const lh = Number(editorSettings.lineHeight);
          if (lh > 0) {
            const fs = update.fontSize || orig.fontSize || 14;
            update.lineHeight = lh <= 3 ? Math.round(fs * lh) : Math.round(lh);
          }
        } else if (editorSettings.fontSize && editorSettings.fontSize !== 'default') {
          update.lineHeight = Math.round(Number(editorSettings.fontSize) * 1.5);
        } else if (orig.lineHeight) {
          update.lineHeight = orig.lineHeight;
        }

        // Font Ligatures
        if (editorSettings.ligatures !== undefined) {
          update.fontLigatures = !!editorSettings.ligatures;
        }

        // Cursor style: standard blink by default (instant caret response, zero lag)
        let smoothCaret = 'off';
        let blinking = 'blink';
        if (editorSettings.cursorStyle === 'smooth') {
          smoothCaret = 'on';
          blinking = 'smooth';
        } else if (editorSettings.cursorStyle === 'solid') {
          smoothCaret = 'off';
          blinking = 'solid';
        }
        update.cursorSmoothCaretAnimation = smoothCaret;
        update.cursorBlinking = blinking;

        ed.updateOptions(update);
        if (ed.layout) ed.layout();
      } catch (e) {}
    });

    if (monaco.editor.remeasureFonts) monaco.editor.remeasureFonts();

    // If custom font is requested, ensure font binary is loaded and remeasure
    if (fam && document.fonts && document.fonts.load) {
      const match = fam.match(/['"]([^'"]+)['"]/);
      const faceName = match ? match[1] : null;
      if (faceName) {
        document.fonts.load(`14px "${faceName}"`).then(() => {
          remeasureAll();
        }).catch(() => {});
      }
    }
  }

  function remeasureAll() {
    if (!monaco || !monaco.editor) return;
    if (monaco.editor.remeasureFonts) monaco.editor.remeasureFonts();
    const eds = monaco.editor.getEditors ? monaco.editor.getEditors() : [];
    eds.forEach((ed) => {
      try {
        if (ed.layout) ed.layout();
      } catch (e) {}
    });
  }

  if (document.fonts) {
    if (document.fonts.ready) {
      document.fonts.ready.then(() => remeasureAll());
    }
    if (document.fonts.addEventListener) {
      document.fonts.addEventListener('loadingdone', () => remeasureAll());
    }
  }

  function hookCreation() {
    if (!monaco || !monaco.editor || !monaco.editor.onDidCreateEditor) return;
    monaco.editor.onDidCreateEditor((ed) => {
      setTimeout(() => {
        applyCurrent();
        applyEditorConfig(ed);
        remeasureAll();
      }, 50);
    });
  }

  function applyCurrent() {
    if (!monaco || !monaco.editor) return;
    defineAll();
    const id = currentId();
    if (!id) {
      if (!oursApplied) return;
      oursApplied = false;
      try { applying = true; if (siteTheme) realSetTheme(siteTheme); } catch (e) {} finally { applying = false; }
      applyEditorConfig();
      return;
    }
    try { applying = true; realSetTheme(NAME(id)); } catch (e) {} finally { applying = false; }
    oursApplied = true;
    applyEditorConfig();
  }

  function hookSetTheme() {
    if (!monaco || !monaco.editor || realSetTheme) return;
    realSetTheme = monaco.editor.setTheme.bind(monaco.editor);
    monaco.editor.setTheme = function (name) {
      if (applying) return realSetTheme(name);
      siteTheme = name;                                   // remember what LeetCode wanted
      const id = currentId();
      return realSetTheme(id ? NAME(id) : name);          // redirect only while a theme is on
    };
  }

  let tries = 0;
  const waiter = setInterval(() => {
    if (window.monaco && window.monaco.editor) {
      monaco = window.monaco;
      clearInterval(waiter);
      hookSetTheme();
      hookCreation();
      applyCurrent();
      applyEditorConfig();
      remeasureAll();
    } else if (++tries > 600) { clearInterval(waiter); }   // ~90s ceiling
  }, 150);

  window.addEventListener('resize', () => {
    setTimeout(remeasureAll, 100);
  });

  new MutationObserver((mutations) => {
    let hadTheme = false;
    let hadEditor = false;
    for (const m of mutations) {
      if (m.attributeName === 'data-lc-theme' || m.attributeName === 'data-lc-monaco-theme') hadTheme = true;
      if (m.attributeName === 'data-lcts-editor-settings') hadEditor = true;
    }
    if (hadTheme) applyCurrent();
    if (hadEditor) applyEditorConfig();
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-lc-theme', 'data-lc-monaco-theme', 'data-lcts-editor-settings']
  });

  let reapply = 400;
  (function catchUp() {
    applyCurrent();
    if (reapply > 60000) return;
    setTimeout(catchUp, reapply);
    reapply *= 2;
  })();
})();
