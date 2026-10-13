/**
 * Unified Storage Manager for LeetCode Theme Extension.
 *
 * Implements:
 * - Smart routing: sync for lightweight configs, local for unbounded data (notes, base64 art).
 * - Defensive quota guards against QUOTA_BYTES_PER_ITEM_EXCEEDED (8,192 bytes).
 * - Automatic data migration and legacy key alignment.
 * - JSON Export & Import helpers for backups and transfer.
 */

import type {
  UserSettingsBackup,
  NoteItem,
  EditorSettings,
  BlindModeConfig,
  TimerConfig
} from '../types/storage';

export const SYNC_KEYS = new Set<string>([
  'lcTheme',
  'lcThemeStudio',
  'lcMonacoTheme',
  'lcBlindMode',
  'lcDayNight',
  'lcTimerEnabled',
  'lcTimerState',
  'lcZenMode',
  'lcNotesEnabled',
  'lcEditorSettings',
  'lcAudioEnabled',
  'lcContestMode',
  'lcFocus'
]);

export const LOCAL_ONLY_KEYS = new Set<string>([
  'lcProblemNotes',
  'lcAnimeArt',
  'lcCustomWallpaper',
  'lcProblemCache'
]);

const SYNC_ITEM_MAX_BYTES = 7000; // Chrome limit is 8192 bytes, keep safe buffer

function approximateByteSize(val: unknown): number {
  try {
    return new Blob([JSON.stringify(val)]).size;
  } catch {
    return 0;
  }
}

function hasSyncStorage(): boolean {
  return typeof chrome !== 'undefined' && Boolean(chrome.storage?.sync);
}

function hasLocalStorage(): boolean {
  return typeof chrome !== 'undefined' && Boolean(chrome.storage?.local);
}

export class StorageManager {
  /**
   * Retrieves a single item by key with fallback from sync to local.
   */
  static async get<T = unknown>(key: string, defaultValue?: T): Promise<T | undefined> {
    if (!hasLocalStorage()) {
      return defaultValue;
    }

    // Unbounded keys go directly to local
    if (LOCAL_ONLY_KEYS.has(key) || !hasSyncStorage()) {
      return new Promise((resolve) => {
        chrome.storage.local.get(key, (items) => {
          const val = items?.[key];
          resolve(val !== undefined ? (val as T) : defaultValue);
        });
      });
    }

    // Lightweight keys check sync first, then local fallback
    return new Promise((resolve) => {
      chrome.storage.sync.get(key, (syncItems) => {
        if (!chrome.runtime.lastError && syncItems?.[key] !== undefined) {
          resolve(syncItems[key] as T);
          return;
        }

        // Check local storage fallback
        chrome.storage.local.get(key, (localItems) => {
          const val = localItems?.[key];
          resolve(val !== undefined ? (val as T) : defaultValue);
        });
      });
    });
  }

  /**
   * Retrieves multiple items matching the given keys.
   */
  static async getMultiple<T extends Record<string, unknown>>(keys: string[]): Promise<Partial<T>> {
    const result: Record<string, unknown> = {};

    const syncSubset: string[] = [];
    const localSubset: string[] = [];

    for (const k of keys) {
      if (LOCAL_ONLY_KEYS.has(k) || !hasSyncStorage()) {
        localSubset.push(k);
      } else {
        syncSubset.push(k);
      }
    }

    await Promise.all([
      new Promise<void>((resolve) => {
        if (localSubset.length === 0 || !hasLocalStorage()) return resolve();
        chrome.storage.local.get(localSubset, (items) => {
          if (items) Object.assign(result, items);
          resolve();
        });
      }),
      new Promise<void>((resolve) => {
        if (syncSubset.length === 0 || !hasSyncStorage()) return resolve();
        chrome.storage.sync.get(syncSubset, (syncItems) => {
          const missingKeys: string[] = [];
          if (syncItems) {
            for (const k of syncSubset) {
              if (syncItems[k] !== undefined) {
                result[k] = syncItems[k];
              } else {
                missingKeys.push(k);
              }
            }
          } else {
            missingKeys.push(...syncSubset);
          }

          if (missingKeys.length > 0 && hasLocalStorage()) {
            chrome.storage.local.get(missingKeys, (localItems) => {
              if (localItems) Object.assign(result, localItems);
              resolve();
            });
          } else {
            resolve();
          }
        });
      })
    ]);

    return result as Partial<T>;
  }

  /**
   * Writes a key-value pair defensively with quota protection.
   */
  static async set<T = unknown>(key: string, value: T): Promise<void> {
    const isUnbounded = LOCAL_ONLY_KEYS.has(key);
    const size = approximateByteSize(value);

    // If unbounded or size exceeds sync quota, store strictly in local
    if (isUnbounded || size > SYNC_ITEM_MAX_BYTES || !hasSyncStorage()) {
      return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, () => {
          if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
          else resolve();
        });
      });
    }

    // Otherwise, attempt sync write with automatic local fallback on quota failure
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          // Sync quota or network error -> fallback to local
          console.warn(
            `[StorageManager] sync.set failed for "${key}", falling back to local:`,
            chrome.runtime.lastError.message
          );
          chrome.storage.local.set({ [key]: value }, () => resolve());
        } else {
          // Mirror to local for instant offline availability
          chrome.storage.local.set({ [key]: value }, () => resolve());
        }
      });
    });
  }

  /**
   * Sets multiple items according to their sync / local policy.
   */
  static async setMultiple(items: Record<string, unknown>): Promise<void> {
    const toSync: Record<string, unknown> = {};
    const toLocal: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(items)) {
      const size = approximateByteSize(val);
      if (LOCAL_ONLY_KEYS.has(key) || size > SYNC_ITEM_MAX_BYTES || !hasSyncStorage()) {
        toLocal[key] = val;
      } else {
        toSync[key] = val;
        toLocal[key] = val; // Also mirror to local
      }
    }

    const promises: Promise<void>[] = [];

    if (Object.keys(toLocal).length > 0 && hasLocalStorage()) {
      promises.push(
        new Promise((resolve) => {
          chrome.storage.local.set(toLocal, () => resolve());
        })
      );
    }

    if (Object.keys(toSync).length > 0 && hasSyncStorage()) {
      promises.push(
        new Promise((resolve) => {
          chrome.storage.sync.set(toSync, () => {
            if (chrome.runtime.lastError) {
              console.warn(
                '[StorageManager] sync.setMultiple fallback:',
                chrome.runtime.lastError.message
              );
            }
            resolve();
          });
        })
      );
    }

    await Promise.all(promises);
  }

  /**
   * Removes one or more keys from both sync and local storage.
   */
  static async remove(keys: string | string[]): Promise<void> {
    const keyList = Array.isArray(keys) ? keys : [keys];
    await Promise.all([
      new Promise<void>((resolve) => {
        if (!hasLocalStorage()) return resolve();
        chrome.storage.local.remove(keyList, () => resolve());
      }),
      new Promise<void>((resolve) => {
        if (!hasSyncStorage()) return resolve();
        chrome.storage.sync.remove(keyList, () => resolve());
      })
    ]);
  }

  /**
   * Automatically migrates legacy or unaligned keys forward to modern structure.
   */
  static async migrateFromLegacyStorage(): Promise<void> {
    if (!hasLocalStorage()) return;

    return new Promise((resolve) => {
      chrome.storage.local.get(null, async (allItems) => {
        if (!allItems) return resolve();

        const updates: Record<string, unknown> = {};

        // 1. Unify lcTheme vs lcThemeStudio
        if (allItems.lcTheme && !allItems.lcThemeStudio) {
          updates.lcThemeStudio = allItems.lcTheme;
        }

        // 2. Ensure EditorSettings schema v2
        if (allItems.lcEditorSettings) {
          const ed = allItems.lcEditorSettings as EditorSettings;
          if (!ed.v || ed.v < 2) {
            updates.lcEditorSettings = {
              v: 2,
              font: ed.font || 'default',
              ligatures: ed.ligatures !== undefined ? ed.ligatures : true,
              fontSize: ed.fontSize || 'default',
              lineHeight: ed.lineHeight || 'default',
              cursorStyle: ed.cursorStyle || 'blink'
            };
          }
        }

        // 3. Ensure BlindModeConfig schema
        if (allItems.lcBlindMode) {
          const bm = allItems.lcBlindMode as BlindModeConfig;
          if (bm.hideAcceptance === undefined || bm.hideSubmissions === undefined) {
            updates.lcBlindMode = {
              active: bm.active !== undefined ? bm.active : true,
              hideDifficulty: bm.hideDifficulty !== undefined ? bm.hideDifficulty : true,
              blurTags: bm.blurTags !== undefined ? bm.blurTags : true,
              hideStats: bm.hideStats !== undefined ? bm.hideStats : true,
              hideAcceptance: bm.hideStats !== undefined ? bm.hideStats : true,
              hideSubmissions: bm.hideStats !== undefined ? bm.hideStats : true,
              contestMode: bm.contestMode || false,
              contestRevealed: false
            };
          }
        }

        if (Object.keys(updates).length > 0) {
          await StorageManager.setMultiple(updates);
        }

        resolve();
      });
    });
  }

  /**
   * Exports all user configuration and custom data into a JSON file download.
   */
  static async exportSettings(): Promise<UserSettingsBackup> {
    const allKeys = Array.from(new Set([...SYNC_KEYS, ...LOCAL_ONLY_KEYS, 'lcAnime']));
    const data = await StorageManager.getMultiple(allKeys);

    const payload: UserSettingsBackup = {
      version: '3.6.0',
      exportedAt: new Date().toISOString(),
      settings: data as Record<string, unknown>
    };

    if (typeof document !== 'undefined') {
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leetcode-themes-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    return payload;
  }

  /**
   * Imports configuration from a JSON string, writes to stores, and validates keys.
   */
  static async importSettings(jsonString: string): Promise<Record<string, unknown>> {
    const parsed = JSON.parse(jsonString) as UserSettingsBackup | Record<string, unknown>;
    const rawSettings = (parsed as UserSettingsBackup).settings || parsed;

    if (!rawSettings || typeof rawSettings !== 'object') {
      throw new Error('Invalid settings JSON format: missing settings object');
    }

    const toSet: Record<string, unknown> = {};
    const allowed = new Set([...SYNC_KEYS, ...LOCAL_ONLY_KEYS, 'lcAnime', 'lcAnimeArt']);

    for (const [key, val] of Object.entries(rawSettings)) {
      if (allowed.has(key)) {
        toSet[key] = val;
      }
    }

    await StorageManager.setMultiple(toSet);
    return toSet;
  }
}
