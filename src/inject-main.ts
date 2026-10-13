/**
 * MAIN World Content Script Entry Point.
 *
 * Runs at document_start in the MAIN execution world on LeetCode problem pages.
 * Bundles:
 * 1. Network verdict interceptor (inspecting check / submit / run API traffic).
 * 2. Monaco editor theme, syntax tokenizer, and caret options injector.
 * 3. SPA history navigation dispatcher.
 */

// 1. Hook history pushState and replaceState in the MAIN world
(() => {
  if (
    typeof window === 'undefined' ||
    (window as unknown as { __lctsMainRouterInit?: boolean }).__lctsMainRouterInit
  )
    return;
  (window as unknown as { __lctsMainRouterInit?: boolean }).__lctsMainRouterInit = true;

  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function (...args) {
    const res = pushState.apply(this, args);
    try {
      window.dispatchEvent(
        new CustomEvent('lc:spa-navigate', { detail: { url: window.location.href } })
      );
    } catch {}
    return res;
  };

  history.replaceState = function (...args) {
    const res = replaceState.apply(this, args);
    try {
      window.dispatchEvent(
        new CustomEvent('lc:spa-navigate', { detail: { url: window.location.href } })
      );
    } catch {}
    return res;
  };
})();

// 2. Import network verdict interceptor
import './net-verdict.js';

// 3. Import Monaco editor runtime injector
import './inject.js';
