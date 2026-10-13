import { build } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function bundleThemesCss() {
  const themesDir = path.resolve(rootDir, 'themes');
  const cssOrder = [
    'core.css',
    'paper.css',
    'sakura.css',
    'grid.css',
    'orchid.css',
    'anime.css',
    'crawler.css',
    'game.css',
    'pixel.css',
    'themes.css'
  ];

  let combinedCss = '/* LeetCode Themes Combined CSS Bundle - Zero FOUC */\n';
  for (const file of cssOrder) {
    const filePath = path.join(themesDir, file);
    if (fs.existsSync(filePath)) {
      combinedCss += `\n/* --- themes/${file} --- */\n` + fs.readFileSync(filePath, 'utf-8');
    }
  }

  fs.writeFileSync(path.join(distDir, 'themes.css'), combinedCss, 'utf-8');
  console.log('✓ themes.css bundled');
}

async function generateManifest() {
  const raw = fs.readFileSync(path.resolve(rootDir, 'manifest.json'), 'utf-8');
  const manifest = JSON.parse(raw);

  // Modernize content scripts: replace 30+ loose scripts with single bundles
  manifest.content_scripts = [
    {
      matches: [
        'https://leetcode.com/problems/*',
        'https://leetcode.cn/problems/*'
      ],
      js: ['inject-main.js'],
      world: 'MAIN',
      run_at: 'document_start',
      all_frames: false
    },
    {
      matches: [
        'https://leetcode.com/problems/*',
        'https://leetcode.cn/problems/*'
      ],
      js: ['content-bundle.js'],
      css: ['themes.css'],
      run_at: 'document_start',
      all_frames: false
    }
  ];

  manifest.background = {
    service_worker: 'background.js'
  };

  manifest.action = {
    default_title: 'LeetCode Themes',
    default_popup: 'src/popup.html',
    default_icon: {
      '16': 'icons/icon16.png',
      '48': 'icons/icon48.png',
      '128': 'icons/icon128.png'
    }
  };

  fs.writeFileSync(path.join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
  console.log('✓ manifest.json generated with 2 clean content_script bundles');
}

async function runBuild() {
  console.log('Building LeetCode Theme Extension with Vite...');
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });

  // 1. Build background service worker
  await build({
    configFile: false,
    build: {
      outDir: distDir,
      emptyOutDir: false,
      lib: {
        entry: path.resolve(rootDir, 'src/background.ts'),
        name: 'Background',
        formats: ['iife'],
        fileName: () => 'background.js'
      }
    }
  });
  console.log('✓ background.js compiled');

  // 2. Build content-bundle (ISOLATED world)
  await build({
    configFile: false,
    build: {
      outDir: distDir,
      emptyOutDir: false,
      lib: {
        entry: path.resolve(rootDir, 'src/content-bundle.ts'),
        name: 'LeetCodeThemesContent',
        formats: ['iife'],
        fileName: () => 'content-bundle.js'
      }
    }
  });
  console.log('✓ content-bundle.js compiled');

  // 3. Build inject-main (MAIN world)
  await build({
    configFile: false,
    build: {
      outDir: distDir,
      emptyOutDir: false,
      lib: {
        entry: path.resolve(rootDir, 'src/inject-main.ts'),
        name: 'LeetCodeThemesMain',
        formats: ['iife'],
        fileName: () => 'inject-main.js'
      }
    }
  });
  console.log('✓ inject-main.js compiled');

  // 4. Bundle themes.css
  await bundleThemesCss();

  // 5. Copy static assets: icons, fonts, textures, src HTML & assets
  copyDirSync(path.resolve(rootDir, 'icons'), path.resolve(distDir, 'icons'));
  copyDirSync(path.resolve(rootDir, 'fonts'), path.resolve(distDir, 'fonts'));
  copyDirSync(path.resolve(rootDir, 'textures'), path.resolve(distDir, 'textures'));
  copyDirSync(path.resolve(rootDir, 'src'), path.resolve(distDir, 'src'));

  // 6. Generate modern manifest.json
  await generateManifest();

  console.log('Build complete! Output in dist/');
}

runBuild().catch((err) => {
  console.error('Build error:', err);
  process.exit(1);
});
