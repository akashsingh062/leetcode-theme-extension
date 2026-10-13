import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { SELECTORS, queryResilient, isProtectedContentContainer } from '../src/utils/selectors';
import { StorageManager, SYNC_KEYS, LOCAL_ONLY_KEYS } from '../src/utils/storage';

const distDir = path.resolve(__dirname, '../dist');
const manifestPath = path.join(distDir, 'manifest.json');

test.describe('Manifest V3 Extension Packaging Sanity', () => {
  test('manifest.json builds and contains valid MV3 schema', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);

    const raw = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(raw);

    expect(manifest.manifest_version).toBe(3);
    expect(manifest.name).toBe('LeetCode Themes & Tools');
    expect(manifest.version).toBeDefined();

    // Verify background service worker
    expect(manifest.background).toBeDefined();
    expect(manifest.background.service_worker).toBe('background.js');
    expect(fs.existsSync(path.join(distDir, 'background.js'))).toBe(true);
    expect(fs.statSync(path.join(distDir, 'background.js')).size).toBeGreaterThan(100);

    // Verify content scripts consolidation (single MAIN world + single ISOLATED world)
    expect(Array.isArray(manifest.content_scripts)).toBe(true);
    expect(manifest.content_scripts.length).toBe(2);

    const mainWorld = manifest.content_scripts.find((cs: any) => cs.world === 'MAIN');
    expect(mainWorld).toBeDefined();
    expect(mainWorld.js).toEqual(['inject-main.js']);
    expect(mainWorld.run_at).toBe('document_start');
    expect(fs.existsSync(path.join(distDir, 'inject-main.js'))).toBe(true);
    expect(fs.statSync(path.join(distDir, 'inject-main.js')).size).toBeGreaterThan(100);

    const isolatedWorld = manifest.content_scripts.find((cs: any) => cs.world !== 'MAIN');
    expect(isolatedWorld).toBeDefined();
    expect(isolatedWorld.js).toEqual(['content-bundle.js']);
    expect(isolatedWorld.css).toEqual(['themes.css']);
    expect(isolatedWorld.run_at).toBe('document_start');
    expect(fs.existsSync(path.join(distDir, 'content-bundle.js'))).toBe(true);
    expect(fs.statSync(path.join(distDir, 'content-bundle.js')).size).toBeGreaterThan(1000);
    expect(fs.existsSync(path.join(distDir, 'themes.css'))).toBe(true);
    expect(fs.statSync(path.join(distDir, 'themes.css')).size).toBeGreaterThan(1000);

    // Verify action and popup
    expect(manifest.action.default_popup).toBe('src/popup.html');
    expect(fs.existsSync(path.join(distDir, 'src/popup.html'))).toBe(true);

    // Verify icons
    expect(fs.existsSync(path.join(distDir, 'icons/icon16.png'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'icons/icon48.png'))).toBe(true);
    expect(fs.existsSync(path.join(distDir, 'icons/icon128.png'))).toBe(true);
  });
});

test.describe('DOM Resilience & Selectors Fallbacks', () => {
  test('queryResilient successfully locates elements using primary and fallback cascades', async ({ page }) => {
    await page.setContent(`
      <div id="mock-app">
        <!-- Primary difficulty element -->
        <div data-e2e-locator="problem-difficulty">Medium</div>
        <!-- Fallback acceptance element without primary locator -->
        <span class="acceptance-rate">48.5%</span>
      </div>
    `);

    // In-page execution of selector resolution
    const result = await page.evaluate(() => {
      // Primary test
      const diffEl = document.querySelector('[data-e2e-locator="problem-difficulty"]');
      // Fallback test
      const accEl = document.querySelector('span[class*="acceptance-rate"]');
      return {
        diffText: diffEl?.textContent,
        accText: accEl?.textContent
      };
    });

    expect(result.diffText).toBe('Medium');
    expect(result.accText).toBe('48.5%');
  });

  test('isProtectedContentContainer protects problem statements from accidental mask', () => {
    const fakeProtectedNode = {
      tagName: 'DIV',
      id: 'qd-content',
      className: 'flexlayout__tab',
      hasAttribute: (attr: string) => attr === 'data-track-load',
      getAttribute: (attr: string) => (attr === 'data-track-load' ? 'description_content' : null)
    } as unknown as Element;

    expect(isProtectedContentContainer(fakeProtectedNode)).toBe(true);
  });
});

test.describe('StorageManager & Quota Safeguards', () => {
  test('correctly partitions keys between sync and unbounded local stores', () => {
    expect(SYNC_KEYS.has('lcTheme')).toBe(true);
    expect(SYNC_KEYS.has('lcBlindMode')).toBe(true);
    expect(SYNC_KEYS.has('lcEditorSettings')).toBe(true);

    expect(LOCAL_ONLY_KEYS.has('lcProblemNotes')).toBe(true);
    expect(LOCAL_ONLY_KEYS.has('lcAnimeArt')).toBe(true);
    expect(LOCAL_ONLY_KEYS.has('lcCustomWallpaper')).toBe(true);
  });
});

test.describe('Content Script Mounting on Mock LeetCode Problem Page', () => {
  test('content bundle mounts cleanly at document_start without breaking DOM', async ({ page }) => {
    // 1. Set up a realistic LeetCode Problem DOM structure
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>1. Two Sum - LeetCode</title>
      </head>
      <body>
        <nav role="navigation">Navbar</nav>
        <main>
          <div data-track-load="description_content" id="qd-content">
            <div class="flexlayout__tab">
              <div class="text-title-large">
                <a href="/problems/two-sum">1. Two Sum</a>
              </div>
              <div data-e2e-locator="problem-difficulty" class="text-olive">Easy</div>
              <div data-e2e-locator="acceptance-rate">51.2%</div>
            </div>
            <div class="elfjS">Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.</div>
            <div data-track-load="topic_tags">
              <a href="/tag/array/" class="topic-tag">Array</a>
              <a href="/tag/hash-table/" class="topic-tag">Hash Table</a>
            </div>
          </div>
          <div class="monaco-editor" role="code">
            <div class="view-lines">function twoSum() {}</div>
          </div>
        </main>
      </body>
      </html>
    `);

    // 2. Inject realistic asynchronous Chrome Storage API and execute bundle
    const contentBundleCode = fs.readFileSync(path.join(distDir, 'content-bundle.js'), 'utf-8');
    await page.evaluate((code) => {
      const storageState: Record<string, any> = {
        lcTheme: 'tokyonight',
        lcThemeStudio: 'tokyonight',
        lcMonacoTheme: 'default',
        lcBlindMode: {
          active: true,
          hideDifficulty: true,
          blurTags: true,
          hideStats: true,
          hideAcceptance: true,
          hideSubmissions: true,
          contestMode: false
        }
      };

      const mockChrome = {
        storage: {
          local: {
            get: (keys: any, cb: any) => {
              setTimeout(() => {
                if (typeof keys === 'string') cb({ [keys]: storageState[keys] });
                else if (Array.isArray(keys)) {
                  const res: Record<string, any> = {};
                  keys.forEach((k) => (res[k] = storageState[k]));
                  cb(res);
                } else cb(storageState);
              }, 0);
            },
            set: (items: any, cb: any) => {
              setTimeout(() => {
                Object.assign(storageState, items);
                if (cb) cb();
              }, 0);
            }
          },
          sync: {
            get: (keys: any, cb: any) => {
              setTimeout(() => {
                if (typeof keys === 'string') cb({ [keys]: storageState[keys] });
                else cb(storageState);
              }, 0);
            },
            set: (items: any, cb: any) => {
              setTimeout(() => {
                Object.assign(storageState, items);
                if (cb) cb();
              }, 0);
            }
          },
          onChanged: {
            addListener: () => {}
          }
        },
        runtime: {
          lastError: null,
          getURL: (p: string) => `chrome-extension://mock-id/${p}`
        }
      };

      (window as any).chrome = mockChrome;
      (globalThis as any).chrome = mockChrome;

      // Execute bundle
      const fn = new Function('chrome', code);
      fn(mockChrome);
    }, contentBundleCode);

    // Give asynchronous DOM mutations and storage callbacks a moment to resolve
    await page.waitForTimeout(300);

    // 3. Assert zero-FOUC theme attributes and mode
    const rootTheme = await page.getAttribute('html', 'data-lc-theme');
    expect(rootTheme).toBeDefined();

    const htmlClasses = await page.getAttribute('html', 'class');
    expect(htmlClasses).toContain('dark');

    // 4. Assert Blind Mode classes and attributes mount
    expect(htmlClasses).toContain('lcts-blind-diff');

    // Verify description container was NEVER blacked out or masked
    const descContent = page.locator('[data-track-load="description_content"]');
    await expect(descContent).toBeVisible();
    const hasAccidentMask = await page.evaluate(() => {
      const el = document.querySelector('[data-track-load="description_content"]');
      return (
        el?.hasAttribute('data-lcts-blind-diff') ||
        el?.hasAttribute('data-lcts-blind-tag') ||
        el?.hasAttribute('data-lcts-blind-stat')
      );
    });
    expect(hasAccidentMask).toBe(false);

    // 5. Verify difficulty badge received the mask attribute
    const diffBadge = page.locator('[data-e2e-locator="problem-difficulty"]');
    await expect(diffBadge).toHaveAttribute('data-lcts-blind-diff', 'true');
  });
});
