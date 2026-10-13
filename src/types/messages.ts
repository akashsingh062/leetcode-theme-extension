/**
 * Runtime messaging contracts between content scripts, inject script, background service worker, and popup.
 */
import { UserSettings, StoragePayload } from './storage';
import { VerdictPayload } from './verdict';

export type RuntimeMessageType =
  | 'GET_SETTINGS'
  | 'SETTINGS_UPDATED'
  | 'THEME_CHANGED'
  | 'SUBMISSION_VERDICT'
  | 'ROUTE_CHANGED'
  | 'PROBLEM_LOADED'
  | 'TIMER_ACTION'
  | 'TIMER_TICK'
  | 'EXPORT_DATA'
  | 'IMPORT_DATA'
  | 'INJECT_READY';

export interface BaseRuntimeMessage {
  type: RuntimeMessageType;
  timestamp?: number;
}

export interface GetSettingsMessage extends BaseRuntimeMessage {
  type: 'GET_SETTINGS';
}

export interface SettingsUpdatedMessage extends BaseRuntimeMessage {
  type: 'SETTINGS_UPDATED';
  payload: Partial<UserSettings>;
}

export interface ThemeChangedMessage extends BaseRuntimeMessage {
  type: 'THEME_CHANGED';
  themeId: string;
}

export interface SubmissionVerdictMessage extends BaseRuntimeMessage {
  type: 'SUBMISSION_VERDICT';
  payload: VerdictPayload;
}

export interface RouteChangedMessage extends BaseRuntimeMessage {
  type: 'ROUTE_CHANGED';
  slug: string;
  pathname: string;
}

export interface ProblemLoadedMessage extends BaseRuntimeMessage {
  type: 'PROBLEM_LOADED';
  slug: string;
  number: string | null;
  title: string | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
}

export interface TimerActionMessage extends BaseRuntimeMessage {
  type: 'TIMER_ACTION';
  action: 'start' | 'pause' | 'reset' | 'set-mode';
  mode?: 'stopwatch' | '15m' | '20m' | '25m' | '45m';
}

export interface TimerTickMessage extends BaseRuntimeMessage {
  type: 'TIMER_TICK';
  mode: string;
  remainingSeconds: number;
  isRunning: boolean;
}

export interface ExportDataMessage extends BaseRuntimeMessage {
  type: 'EXPORT_DATA';
}

export interface ImportDataMessage extends BaseRuntimeMessage {
  type: 'IMPORT_DATA';
  data: StoragePayload;
}

export interface InjectReadyMessage extends BaseRuntimeMessage {
  type: 'INJECT_READY';
}

export type RuntimeMessage =
  | GetSettingsMessage
  | SettingsUpdatedMessage
  | ThemeChangedMessage
  | SubmissionVerdictMessage
  | RouteChangedMessage
  | ProblemLoadedMessage
  | TimerActionMessage
  | TimerTickMessage
  | ExportDataMessage
  | ImportDataMessage
  | InjectReadyMessage;
