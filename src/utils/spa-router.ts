/**
 * LeetCode SPA Route Lifecycle Observer.
 * Observes client-side route transitions (pushState, replaceState, popstate, hashchange)
 * and dispatches custom lifecycle events:
 *   - 'lc:route-changed': whenever the URL changes
 *   - 'lc:problem-loaded': whenever a problem page is rendered and ready in the DOM
 */

import { SELECTORS, queryResilient } from './selectors';

export interface RouteChangedDetail {
  url: string;
  previousUrl: string;
  problemSlug: string | null;
  previousProblemSlug: string | null;
}

export interface ProblemLoadedDetail {
  problemSlug: string;
  url: string;
}

const PROBLEM_REGEX = /\/problems\/([^/?#]+)/i;

/**
 * Extracts problem slug from URL string or current window location.
 */
export function getProblemSlug(url?: string): string | null {
  const path = url ? new URL(url, 'https://leetcode.com').pathname : window.location.pathname;
  const match = PROBLEM_REGEX.exec(path);
  return match ? match[1].toLowerCase() : null;
}

let isInitialized = false;
let currentUrl = typeof window !== 'undefined' ? window.location.href : '';
let currentProblemSlug = typeof window !== 'undefined' ? getProblemSlug() : null;
let problemReadyObserver: MutationObserver | null = null;
let problemReadyTimeout: number | null = null;

/**
 * Checks if the DOM contains sufficient problem elements to consider it "loaded".
 */
export function isProblemDomReady(): boolean {
  if (!getProblemSlug()) return false;
  const title = queryResilient(SELECTORS.problemTitle);
  const desc = queryResilient(SELECTORS.descriptionContainer);
  const editor = queryResilient(SELECTORS.monacoEditor);
  return Boolean(title || desc || editor);
}

/**
 * Waits for the problem DOM to become ready, then dispatches 'lc:problem-loaded'.
 */
function waitForProblemReady(slug: string, url: string, maxWaitMs = 10000): void {
  // Clear any pending observer
  if (problemReadyObserver) {
    problemReadyObserver.disconnect();
    problemReadyObserver = null;
  }
  if (problemReadyTimeout !== null) {
    window.clearTimeout(problemReadyTimeout);
    problemReadyTimeout = null;
  }

  // If already ready, dispatch immediately
  if (isProblemDomReady()) {
    dispatchProblemLoaded(slug, url);
    return;
  }

  // Observe DOM additions until problem container exists
  const startTime = Date.now();
  problemReadyObserver = new MutationObserver(() => {
    if (isProblemDomReady()) {
      if (problemReadyObserver) {
        problemReadyObserver.disconnect();
        problemReadyObserver = null;
      }
      if (problemReadyTimeout !== null) {
        window.clearTimeout(problemReadyTimeout);
        problemReadyTimeout = null;
      }
      dispatchProblemLoaded(slug, url);
    } else if (Date.now() - startTime > maxWaitMs) {
      if (problemReadyObserver) {
        problemReadyObserver.disconnect();
        problemReadyObserver = null;
      }
    }
  });

  const root = document.body || document.documentElement;
  if (root) {
    problemReadyObserver.observe(root, { childList: true, subtree: true });
  }

  // Timeout fallback to dispatch anyway if elements mount slower
  problemReadyTimeout = window.setTimeout(() => {
    if (problemReadyObserver) {
      problemReadyObserver.disconnect();
      problemReadyObserver = null;
    }
    if (getProblemSlug() === slug) {
      dispatchProblemLoaded(slug, url);
    }
  }, maxWaitMs);
}

function dispatchProblemLoaded(slug: string, url: string): void {
  const detail: ProblemLoadedDetail = { problemSlug: slug, url };
  const event = new CustomEvent('lc:problem-loaded', {
    detail,
    bubbles: true,
    composed: true
  });
  window.dispatchEvent(event);
  document.dispatchEvent(event);
}

function dispatchRouteChanged(newUrl: string, prevUrl: string): void {
  const prevSlug = currentProblemSlug;
  const newSlug = getProblemSlug(newUrl);

  currentUrl = newUrl;
  currentProblemSlug = newSlug;

  const detail: RouteChangedDetail = {
    url: newUrl,
    previousUrl: prevUrl,
    problemSlug: newSlug,
    previousProblemSlug: prevSlug
  };

  const event = new CustomEvent('lc:route-changed', {
    detail,
    bubbles: true,
    composed: true
  });
  window.dispatchEvent(event);
  document.dispatchEvent(event);

  if (newSlug) {
    waitForProblemReady(newSlug, newUrl);
  }
}

/**
 * Initializes SPA router observation.
 * Safe to call multiple times (idempotent).
 */
export function initSpaRouter(): () => void {
  if (typeof window === 'undefined' || isInitialized) {
    return () => {};
  }
  isInitialized = true;

  currentUrl = window.location.href;
  currentProblemSlug = getProblemSlug(currentUrl);

  // 1. Monkey-patch History API
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    const prevUrl = currentUrl;
    const result = originalPushState.apply(this, args);
    const newUrl = window.location.href;
    if (newUrl !== prevUrl) {
      dispatchRouteChanged(newUrl, prevUrl);
    }
    return result;
  };

  history.replaceState = function (...args) {
    const prevUrl = currentUrl;
    const result = originalReplaceState.apply(this, args);
    const newUrl = window.location.href;
    if (newUrl !== prevUrl) {
      dispatchRouteChanged(newUrl, prevUrl);
    }
    return result;
  };

  // 2. Standard navigation events
  const onPopState = () => {
    const prevUrl = currentUrl;
    const newUrl = window.location.href;
    if (newUrl !== prevUrl) {
      dispatchRouteChanged(newUrl, prevUrl);
    }
  };

  const onHashChange = () => {
    const prevUrl = currentUrl;
    const newUrl = window.location.href;
    if (newUrl !== prevUrl) {
      dispatchRouteChanged(newUrl, prevUrl);
    }
  };

  window.addEventListener('popstate', onPopState);
  window.addEventListener('hashchange', onHashChange);

  // 3. Custom cross-world event from MAIN world injector
  const onMainWorldNav = (e: Event) => {
    const custom = e as CustomEvent<{ url?: string }>;
    const newUrl = custom.detail?.url || window.location.href;
    if (newUrl !== currentUrl) {
      dispatchRouteChanged(newUrl, currentUrl);
    }
  };
  window.addEventListener('lc:spa-navigate', onMainWorldNav);

  // 4. Polling fallback to catch any framework router state mutations
  const pollInterval = window.setInterval(() => {
    const newUrl = window.location.href;
    if (newUrl !== currentUrl) {
      dispatchRouteChanged(newUrl, currentUrl);
    }
  }, 400);

  // Initial trigger if already on a problem
  if (currentProblemSlug) {
    waitForProblemReady(currentProblemSlug, currentUrl);
  }

  // Teardown function
  return () => {
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
    window.removeEventListener('popstate', onPopState);
    window.removeEventListener('hashchange', onHashChange);
    window.removeEventListener('lc:spa-navigate', onMainWorldNav);
    window.clearInterval(pollInterval);
    if (problemReadyObserver) problemReadyObserver.disconnect();
    if (problemReadyTimeout !== null) window.clearTimeout(problemReadyTimeout);
    isInitialized = false;
  };
}

/**
 * Type-safe listener for 'lc:problem-loaded' events.
 */
export function onProblemLoaded(callback: (detail: ProblemLoadedDetail) => void): () => void {
  const handler = (e: Event) => {
    const ce = e as CustomEvent<ProblemLoadedDetail>;
    if (ce.detail) callback(ce.detail);
  };
  window.addEventListener('lc:problem-loaded', handler);
  return () => window.removeEventListener('lc:problem-loaded', handler);
}

/**
 * Type-safe listener for 'lc:route-changed' events.
 */
export function onRouteChange(callback: (detail: RouteChangedDetail) => void): () => void {
  const handler = (e: Event) => {
    const ce = e as CustomEvent<RouteChangedDetail>;
    if (ce.detail) callback(ce.detail);
  };
  window.addEventListener('lc:route-changed', handler);
  return () => window.removeEventListener('lc:route-changed', handler);
}
