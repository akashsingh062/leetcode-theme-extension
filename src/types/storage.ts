/**
 * Storage schemas and payload definitions for chrome.storage.sync and chrome.storage.local.
 */

export interface BlindModeConfig {
  active: boolean;
  hideDifficulty: boolean;
  hideAcceptance: boolean;
  hideSubmissions?: boolean;
  hideStats: boolean;
  blurTags: boolean;
  contestMode: boolean;
  contestRevealed?: boolean;
}

export type TimerMode = 'stopwatch' | '15m' | '20m' | '25m' | '30m' | '45m';

export interface TimerConfig {
  enabled: boolean;
  mode: TimerMode;
  warnAt5m: boolean;
  soundEnabled: boolean;
}

export type MonacoCursorStyle = 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';

export interface EditorSettings {
  v?: number;
  font?: string;
  fontFamily?: string;
  ligatures?: boolean;
  fontLigatures?: boolean;
  fontSize: number | string;
  lineHeight: number | string;
  cursorStyle: MonacoCursorStyle;
  minimap?: boolean;
}

export interface ThemeConfig {
  id: string;
  name: string;
  accent: string;
  accent2?: string;
  bg?: string;
  panel?: string;
  border?: string;
  text?: string;
  muted?: string;
  glassMode: 'auto' | 'dark' | 'light';
  opacity: number;
}

export interface NoteItem {
  slug: string;
  title: string;
  note: string;
  timeComplexity: string;
  spaceComplexity: string;
  approach: string;
  updatedAt: number;
}

export interface ProblemCacheItem {
  n: string | null; // number
  t: string | null; // title
  d: 'easy' | 'medium' | 'hard' | null; // difficulty
}

export interface UserStats {
  days: string[];
  clears: number;
}

export interface UserSettings {
  lcTheme: string;
  lcMonacoTheme: string;
  lcBlindMode: BlindModeConfig;
  lcTimerSettings: TimerConfig;
  lcEditorSettings: EditorSettings;
  lcAudioEnabled: boolean;
  lcFocus: boolean;
  lcZen: boolean;
}

export interface UserSettingsBackup {
  version: string;
  exportedAt: string;
  settings: Record<string, unknown>;
}

export interface StoragePayload {
  // Sync items (lightweight config)
  lcTheme?: string;
  lcMonacoTheme?: string;
  lcBlindMode?: BlindModeConfig;
  lcTimerSettings?: TimerConfig;
  lcEditorSettings?: EditorSettings;
  lcAudioEnabled?: boolean;
  lcFocus?: boolean;
  lcZen?: boolean;

  // Local items (unbounded)
  lcNotes?: Record<string, NoteItem>;
  lcStats?: UserStats;
  lcProblemCache?: Record<string, ProblemCacheItem>;
  lcCustomTheme?: ThemeConfig;
  lcShare?: { enabled: boolean };
}
