/**
 * Centralized LeetCode DOM Selectors with resilient fallback strategies.
 * Prioritizes: data-attributes -> semantic ARIA / roles -> structural hierarchies -> classes.
 */

export interface SelectorStrategy {
  primary: string;
  fallbacks: string[];
  description: string;
}

export const SELECTORS = {
  // Problem Difficulty Badges
  difficulty: {
    primary: '[data-e2e-locator="problem-difficulty"]',
    fallbacks: [
      '[data-degree]',
      'div[class*="text-difficulty-"], span[class*="text-difficulty-"]',
      'div[class*="text-olive"], div[class*="text-yellow"], div[class*="text-pink"], div[class*="text-red"]',
      'div[class*="text-sd-easy"], div[class*="text-sd-medium"], div[class*="text-sd-hard"]',
      'span[class*="difficulty"], div[class*="difficulty"]'
    ],
    description: 'Problem difficulty label (Easy, Medium, Hard)'
  },

  // Problem Title & Number
  problemTitle: {
    primary: '.flexlayout__tab .text-title-large, [data-track-load="description_content"] h4',
    fallbacks: [
      'div[class*="text-title-large"]',
      'div[class*="question-title"]',
      'h1[class*="title"]',
      'a[href^="/problems/"]'
    ],
    description: 'Problem frontend ID and title'
  },

  // Acceptance Rate & Submission Stats
  acceptanceRate: {
    primary: '[data-e2e-locator="acceptance-rate"], [data-cy="question-accept-rate"]',
    fallbacks: [
      '[data-cy="question-card-acceptance"]',
      'div[class*="acceptance-rate"], span[class*="acceptance-rate"]'
    ],
    description: 'Acceptance rate percentage indicator'
  },

  // Like / Dislike reaction buttons
  reactionButtons: {
    primary: '[data-e2e-locator="like-button"], [data-e2e-locator="dislike-button"]',
    fallbacks: [
      'button:has(svg[data-icon="thumbs-up"])',
      'button:has(svg[data-icon="thumbs-down"])',
      'svg[data-icon="thumbs-up"], svg[data-icon="thumbs-down"]',
      'button[aria-label*="like" i]'
    ],
    description: 'Thumbs-up / thumbs-down buttons'
  },

  // Topic & Company Tags
  topicTags: {
    primary: '[data-track-load="topic_tags"]',
    fallbacks: [
      'a[href*="/tag/"]',
      'a[href*="/company/"]',
      'a[href*="/problem-list/"]',
      'a[href*="topicSlugs="]',
      '[class*="topic-tag"]',
      '[class*="company-tag"]'
    ],
    description: 'Topic and company chips'
  },

  // Topic/Company Accordions
  tagAccordions: {
    primary: '[data-state]',
    fallbacks: [
      'div[class*="group"]',
      'div[class*="accordion"]',
      'button:has(svg[class*="transition-transform"])'
    ],
    description: 'Expandable accordion containers for Topics and Companies'
  },

  // Main Problem Description Container
  descriptionContainer: {
    primary: '[data-track-load="description_content"]',
    fallbacks: [
      '#qd-content',
      '.flexlayout__tab:has(.text-title-large)',
      'div[class*="description__"]',
      'div.elfjS',
      'main'
    ],
    description: 'Left-pane problem description panel'
  },

  // Monaco Code Editor Root
  monacoEditor: {
    primary: '.monaco-editor',
    fallbacks: ['[data-mode-id]', 'div[class*="monaco-editor"]', 'div[role="code"]'],
    description: 'Monaco code editor container'
  },

  // Monaco Lines & Cursor
  monacoLines: {
    primary: '.monaco-editor .view-lines',
    fallbacks: ['.view-lines', '.monaco-editor .lines-content'],
    description: 'Monaco editor lines render area'
  },

  // Navigation Bar
  navbar: {
    primary: 'nav',
    fallbacks: ['[role="navigation"]', '#navbar-root', '.ant-menu-horizontal', 'header'],
    description: 'Top global navigation bar'
  },

  // Submission Buttons & Result Pane
  submissionResult: {
    primary: '[data-e2e-locator="submission-result"]',
    fallbacks: [
      '[data-cy="submission-result"]',
      'div[class*="result__"]',
      'div:has(> [class*="text-green-"]), div:has(> [class*="text-red-"])'
    ],
    description: 'Submission verdict result card'
  }
} as const;

/**
 * Resilient query helper that tries the primary selector, then fallbacks in order.
 */
export function queryResilient<T extends Element = Element>(
  strategy: { primary: string; fallbacks: readonly string[] | string[] },
  root: ParentNode = document
): T | null {
  try {
    const el = root.querySelector<T>(strategy.primary);
    if (el) return el;
  } catch {
    // Primary failed (e.g. invalid pseudo-selector on older browser)
  }

  for (const fallback of strategy.fallbacks) {
    try {
      const el = root.querySelector<T>(fallback);
      if (el) return el;
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * Resilient querySelectorAll helper combining primary and fallback selectors.
 */
export function queryAllResilient<T extends Element = Element>(
  strategy: { primary: string; fallbacks: readonly string[] | string[] },
  root: ParentNode = document
): T[] {
  const set = new Set<T>();

  try {
    root.querySelectorAll<T>(strategy.primary).forEach((el) => set.add(el));
  } catch {}

  for (const fallback of strategy.fallbacks) {
    try {
      root.querySelectorAll<T>(fallback).forEach((el) => set.add(el));
    } catch {}
  }

  return Array.from(set);
}

/**
 * Checks whether an element is part of the protected problem statement area
 * to prevent accidental masking or mutation loops.
 */
export function isProtectedContentContainer(node: Element | null): boolean {
  if (!node) return true;
  if (
    typeof document !== 'undefined' &&
    (node === document.body || node === document.documentElement)
  ) {
    return true;
  }
  if (node.hasAttribute('data-track-load')) {
    const val = node.getAttribute('data-track-load');
    if (val === 'description_content' || val === 'qd_content') return true;
  }
  const cls = String(node.className || '');
  const id = String(node.id || '');
  if (
    id === 'qd-content' ||
    cls.includes('flexlayout__tab') ||
    cls.includes('description_content') ||
    cls.includes('elfjS') ||
    node.tagName === 'MAIN'
  ) {
    return true;
  }
  return false;
}
