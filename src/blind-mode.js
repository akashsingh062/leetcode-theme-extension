/* =============================================================================
   blind-mode.js (isolated world, LeetCode)
   Interview Blind Mode: hides difficulty, blurs topic/company tags,
   and masks stats so users can practice without spoiler bias.
============================================================================= */
(() => {
  'use strict';

  const STYLE_ID = 'lcts-blind-mode-style';
  const root = document.documentElement;

  const DEFAULTS = {
    active: true,
    hideDifficulty: true,
    blurTags: true,
    hideStats: true,
    hideAcceptance: true,
    hideSubmissions: true,
    contestMode: false,
    contestRevealed: false
  };

  let settings = Object.assign({}, DEFAULTS);
  let contestRevealed = false;

  function isProtectedContainer(node) {
    if (!node || node === document.body || node === document.documentElement) return true;
    if (node.hasAttribute && node.hasAttribute('data-track-load')) {
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

  function ensureStyle() {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = `
        /* =====================================================================
           BLIND MODE 1: Problem Difficulty Mask
        ===================================================================== */
        :is(html.lcts-blind-diff, body.lcts-blind-diff, html[data-lc-blind="true"] .lcts-blind-diff) :is(
          [data-lcts-blind-diff="true"],
          [class*="text-difficulty-"],
          div[class*="text-difficulty"],
          [data-e2e-locator="problem-difficulty"],
          span[class*="difficulty"],
          div[class*="difficulty"],
          [data-degree],
          [class*="text-olive"],
          [class*="text-yellow"],
          [class*="text-pink"],
          [class*="text-red"],
          [class*="text-easy"],
          [class*="text-medium"],
          [class*="text-hard"],
          [class*="text-sd-easy"],
          [class*="text-sd-medium"],
          [class*="text-sd-hard"]
        ) {
          position: relative !important;
          color: transparent !important;
          background: rgba(120, 120, 140, 0.22) !important;
          border-radius: 9999px !important;
          cursor: pointer !important;
          user-select: none !important;
          min-width: 68px !important;
          text-align: center !important;
          transition: all 0.2s ease !important;
        }

        :is(html.lcts-blind-diff, body.lcts-blind-diff, html[data-lc-blind="true"] .lcts-blind-diff) :is(
          [data-lcts-blind-diff="true"],
          [class*="text-difficulty-"],
          div[class*="text-difficulty"],
          [data-e2e-locator="problem-difficulty"],
          span[class*="difficulty"],
          div[class*="difficulty"],
          [data-degree],
          [class*="text-olive"],
          [class*="text-yellow"],
          [class*="text-pink"],
          [class*="text-red"],
          [class*="text-easy"],
          [class*="text-medium"],
          [class*="text-hard"],
          [class*="text-sd-easy"],
          [class*="text-sd-medium"],
          [class*="text-sd-hard"]
        )::after {
          content: "Challenge" !important;
          position: absolute !important;
          inset: 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          color: #94a3b8 !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          pointer-events: none !important;
        }

        :is(html.lcts-blind-diff, body.lcts-blind-diff, html[data-lc-blind="true"] .lcts-blind-diff) :is(
          [data-lcts-blind-diff="true"],
          [class*="text-difficulty-"],
          div[class*="text-difficulty"],
          [data-e2e-locator="problem-difficulty"],
          span[class*="difficulty"],
          div[class*="difficulty"],
          [data-degree],
          [class*="text-olive"],
          [class*="text-yellow"],
          [class*="text-pink"],
          [class*="text-red"],
          [class*="text-easy"],
          [class*="text-medium"],
          [class*="text-hard"],
          [class*="text-sd-easy"],
          [class*="text-sd-medium"],
          [class*="text-sd-hard"]
        ):hover {
          color: inherit !important;
          background: inherit !important;
        }

        :is(html.lcts-blind-diff, body.lcts-blind-diff, html[data-lc-blind="true"] .lcts-blind-diff) :is(
          [data-lcts-blind-diff="true"],
          [class*="text-difficulty-"],
          div[class*="text-difficulty"],
          [data-e2e-locator="problem-difficulty"],
          span[class*="difficulty"],
          div[class*="difficulty"],
          [data-degree],
          [class*="text-olive"],
          [class*="text-yellow"],
          [class*="text-pink"],
          [class*="text-red"],
          [class*="text-easy"],
          [class*="text-medium"],
          [class*="text-hard"],
          [class*="text-sd-easy"],
          [class*="text-sd-medium"],
          [class*="text-sd-hard"]
        ):hover::after {
          display: none !important;
        }

        /* =====================================================================
           BLIND MODE 2: Blur Topic & Company Tags Until Hover
        ===================================================================== */
        :is(html.lcts-blind-tags, body.lcts-blind-tags, html[data-lc-blind="true"] .lcts-blind-tags) :is(
          [data-lcts-blind-tag="true"],
          a[href*="/tag/"],
          a[href*="/company/"],
          a[href*="/problem-list/"],
          a[href*="topicSlugs="],
          [class*="topic-tag"],
          [class*="company-tag"],
          div[class*="tag__"],
          [data-track-load="topic_tags"]
        ) {
          filter: blur(6px) !important;
          opacity: 0.65 !important;
          transition: filter 0.2s ease, opacity 0.2s ease !important;
          cursor: pointer !important;
          user-select: none !important;
          display: inline-block !important;
        }

        :is(html.lcts-blind-tags, body.lcts-blind-tags, html[data-lc-blind="true"] .lcts-blind-tags) :is(
          [data-lcts-blind-tag="true"],
          a[href*="/tag/"],
          a[href*="/company/"],
          a[href*="/problem-list/"],
          a[href*="topicSlugs="],
          [class*="topic-tag"],
          [class*="company-tag"],
          div[class*="tag__"],
          [data-track-load="topic_tags"]
        ):hover {
          filter: none !important;
          opacity: 1 !important;
        }

        /* =====================================================================
           BLIND MODE 3: Hide & Blur Acceptance Rate, Stats & Likes Until Hover
        ===================================================================== */
        :is(html.lcts-blind-stats, body.lcts-blind-stats, html[data-lc-blind="true"] .lcts-blind-stats) :is(
          [data-lcts-blind-stat="true"],
          [data-e2e-locator="acceptance-rate"],
          [data-e2e-locator="like-button"],
          [data-e2e-locator="dislike-button"],
          [data-cy="question-accept-rate"],
          [data-cy="question-card-acceptance"]
        ) {
          filter: blur(5px) !important;
          opacity: 0.15 !important;
          user-select: none !important;
          cursor: pointer !important;
          transition: filter 0.2s ease, opacity 0.2s ease !important;
        }

        :is(html.lcts-blind-stats, body.lcts-blind-stats, html[data-lc-blind="true"] .lcts-blind-stats) :is(
          [data-lcts-blind-stat="true"],
          [data-e2e-locator="acceptance-rate"],
          [data-e2e-locator="like-button"],
          [data-e2e-locator="dislike-button"],
          [data-cy="question-accept-rate"],
          [data-cy="question-card-acceptance"]
        ):hover {
          filter: none !important;
          opacity: 1 !important;
        }

        /* =====================================================================
           BLIND MODE 4: Granular Acceptance & Submissions
        ===================================================================== */
        :is(html.lcts-blind-acc, body.lcts-blind-acc, html[data-lc-blind="true"] .lcts-blind-acc) [data-lcts-blind-acc="true"] {
          filter: blur(5px) !important;
          opacity: 0.15 !important;
          user-select: none !important;
          cursor: pointer !important;
          transition: filter 0.2s ease, opacity 0.2s ease !important;
        }
        :is(html.lcts-blind-acc, body.lcts-blind-acc, html[data-lc-blind="true"] .lcts-blind-acc) [data-lcts-blind-acc="true"]:hover {
          filter: none !important;
          opacity: 1 !important;
        }

        :is(html.lcts-blind-sub, body.lcts-blind-sub, html[data-lc-blind="true"] .lcts-blind-sub) [data-lcts-blind-sub="true"] {
          filter: blur(5px) !important;
          opacity: 0.15 !important;
          user-select: none !important;
          cursor: pointer !important;
          transition: filter 0.2s ease, opacity 0.2s ease !important;
        }
        :is(html.lcts-blind-sub, body.lcts-blind-sub, html[data-lc-blind="true"] .lcts-blind-sub) [data-lcts-blind-sub="true"]:hover {
          filter: none !important;
          opacity: 1 !important;
        }

        /* =====================================================================
           CONTEST MODE: Strict Lock (no hover reveal until solved or revealed)
        ===================================================================== */
        :is(html.lcts-contest-locked, body.lcts-contest-locked) :is([data-lcts-blind-diff], [data-lcts-blind-tag], [data-lcts-blind-stat], [data-lcts-blind-acc], [data-lcts-blind-sub]):hover {
          filter: blur(6px) !important;
          opacity: 0.15 !important;
          cursor: not-allowed !important;
        }
        :is(html.lcts-contest-locked, body.lcts-contest-locked) :is([data-lcts-blind-diff]):hover {
          color: transparent !important;
          background: rgba(120, 120, 140, 0.22) !important;
        }
        :is(html.lcts-contest-locked, body.lcts-contest-locked) :is([data-lcts-blind-diff]):hover::after {
          display: flex !important;
          content: "Contest Locked" !important;
        }

        #lcts-contest-badge {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 2147483640;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(18, 20, 26, 0.94);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(245, 158, 11, 0.5);
          border-radius: 9999px;
          color: #fbbf24;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          user-select: none;
        }
        #lcts-contest-reveal-btn {
          background: rgba(245, 158, 11, 0.2);
          border: 1px solid rgba(245, 158, 11, 0.5);
          color: #fef3c7;
          padding: 2px 10px;
          border-radius: 9999px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
          transition: all 0.15s ease;
        }
        #lcts-contest-reveal-btn:hover {
          background: rgba(245, 158, 11, 0.4);
          transform: scale(1.05);
        }
      `;
      (document.head || document.documentElement).appendChild(style);
    }
  }

  function scanDifficulty() {
    if (!settings.active || !settings.hideDifficulty) return;
    const candidates = document.querySelectorAll(
      '[class*="text-olive"], [class*="text-yellow"], [class*="text-pink"], [class*="text-red"], ' +
        '[class*="text-difficulty-"], [data-e2e-locator="problem-difficulty"], [data-degree]'
    );
    candidates.forEach((el) => {
      if (isProtectedContainer(el)) return;
      if (
        el.closest('.monaco-editor') ||
        el.closest('pre') ||
        el.closest('code') ||
        el.closest('textarea')
      )
        return;
      if (el.children.length <= 1) {
        const txt = (el.textContent || '').trim();
        if (
          txt === 'Easy' ||
          txt === 'Medium' ||
          txt === 'Hard' ||
          txt === '简单' ||
          txt === '中等' ||
          txt === '困难'
        ) {
          if (!el.hasAttribute('data-lcts-blind-diff')) {
            el.setAttribute('data-lcts-blind-diff', 'true');
          }
        }
      }
    });
  }

  function scanTags() {
    if (!settings.active || !settings.blurTags) return;

    // 1. Direct tag links and known tag classes across the entire page
    const directTags = document.querySelectorAll(
      'a[href*="/tag/"], a[href*="/company/"], a[href*="/problem-list/"], a[href*="topicSlugs="], ' +
        '[class*="topic-tag"], [class*="company-tag"], [data-track-load="topic_tags"]'
    );
    directTags.forEach((el) => {
      if (isProtectedContainer(el)) return;
      if (
        el.closest('.monaco-editor') ||
        el.closest('pre') ||
        el.closest('code') ||
        el.closest('textarea')
      )
        return;
      if (!el.hasAttribute('data-lcts-blind-tag')) {
        el.setAttribute('data-lcts-blind-tag', 'true');
      }
    });

    // 2. Expandable Accordions: Topics, Companies & Similar Questions
    const rootContainers = document.querySelectorAll(
      '.flexlayout__tab, #qd-content, [data-track-load="description_content"], main, .content__u3I1'
    );
    const searchRoots = rootContainers.length > 0 ? rootContainers : [document.body];

    searchRoots.forEach((rootEl) => {
      if (!rootEl) return;
      const headers = rootEl.querySelectorAll('div, button, span');
      headers.forEach((h) => {
        if (h.children.length > 3) return;
        const txt = (h.textContent || '').trim();
        const isTagHeader =
          /^(Topics|Related Topics|Companies|Company|Similar Questions|相关标签|标签|企业|相似题目)(\s*\(\d+\))?$/i.test(
            txt
          );
        if (isTagHeader) {
          const container =
            h.closest('[data-state]') ||
            h.closest('.group') ||
            h.closest('[class*="accordion"]') ||
            h.parentElement;
          if (container && !isProtectedContainer(container)) {
            const items = container.querySelectorAll(
              'a, button, [class*="rounded"], [class*="badge"], [class*="chip"], span'
            );
            items.forEach((item) => {
              if (item === h || h.contains(item) || isProtectedContainer(item)) return;
              if (
                item.tagName === 'A' ||
                item.tagName === 'BUTTON' ||
                (item.children.length === 0 && (item.textContent || '').trim().length > 0)
              ) {
                if (
                  !item.closest('svg') &&
                  !item.closest('.monaco-editor') &&
                  !item.hasAttribute('data-lcts-blind-tag')
                ) {
                  item.setAttribute('data-lcts-blind-tag', 'true');
                }
              }
            });
          }
        }
      });
    });
  }

  function scanStats() {
    if (!settings.active) return;
    const wantAcc = settings.hideAcceptance !== false;
    const wantSub = settings.hideSubmissions !== false;
    const wantGen = settings.hideStats !== false;

    // 1. Like/dislike buttons with SVG icons
    if (wantGen) {
      const svgs = document.querySelectorAll(
        'svg[data-icon="thumbs-up"], svg[data-icon="thumbs-down"], svg[data-icon="like"], svg[data-icon="dislike"], svg[data-icon*="thumb"]'
      );
      svgs.forEach((svg) => {
        const btn = svg.closest('button') || svg.closest('div');
        if (btn && !isProtectedContainer(btn) && !btn.closest('.monaco-editor')) {
          if (!btn.hasAttribute('data-lcts-blind-stat')) {
            btn.setAttribute('data-lcts-blind-stat', 'true');
          }
        }
      });
    }

    // 2. Direct attribute selectors (safe, specific to stats)
    if (wantAcc) {
      document
        .querySelectorAll(
          '[data-e2e-locator="acceptance-rate"], [data-cy="question-accept-rate"], [data-cy="question-card-acceptance"]'
        )
        .forEach((el) => {
          if (!isProtectedContainer(el) && !el.hasAttribute('data-lcts-blind-acc')) {
            el.setAttribute('data-lcts-blind-acc', 'true');
          }
        });
    }

    // 3. Scan leaf text elements in metadata areas
    const rootContainers = document.querySelectorAll(
      '.flexlayout__tab, #qd-content, [data-track-load="description_content"], main, .content__u3I1'
    );
    const searchRoots = rootContainers.length > 0 ? rootContainers : [document.body];

    searchRoots.forEach((rootEl) => {
      if (!rootEl) return;
      const candidates = rootEl.querySelectorAll('div, span, p');
      candidates.forEach((el) => {
        if (isProtectedContainer(el)) return;
        if (
          el.closest('.monaco-editor') ||
          el.closest('pre') ||
          el.closest('code') ||
          el.closest('textarea')
        )
          return;

        const rawTxt = (el.textContent || '').trim();
        if (!rawTxt || rawTxt.length > 40) return;
        if (/(Example|Constraints|Input:|Output:|Explanation:|Follow-up:)/i.test(rawTxt)) return;

        const isAcceptedLabel = /^(Accepted|通过次数|通过)$/i.test(rawTxt);
        const isSubmissionsLabel = /^(Submissions|提交次数|提交)$/i.test(rawTxt);
        const isRateLabel = /^(Acceptance\s*Rate|Acceptance|通过率)$/i.test(rawTxt);
        const isRatePercent = /^\d+(\.\d+)?%$/.test(rawTxt) && el.children.length === 0;

        if ((isRateLabel || isRatePercent) && wantAcc) {
          if (!el.hasAttribute('data-lcts-blind-acc'))
            el.setAttribute('data-lcts-blind-acc', 'true');
          const p = el.parentElement;
          if (
            p &&
            !isProtectedContainer(p) &&
            p.children.length <= 3 &&
            !p.hasAttribute('data-lcts-blind-acc')
          ) {
            p.setAttribute('data-lcts-blind-acc', 'true');
          }
        }

        if ((isAcceptedLabel || isSubmissionsLabel) && wantSub) {
          if (!el.hasAttribute('data-lcts-blind-sub'))
            el.setAttribute('data-lcts-blind-sub', 'true');
          const p = el.parentElement;
          if (
            p &&
            !isProtectedContainer(p) &&
            p.children.length <= 3 &&
            !p.hasAttribute('data-lcts-blind-sub')
          ) {
            p.setAttribute('data-lcts-blind-sub', 'true');
          }
        }

        if ((isAcceptedLabel || isSubmissionsLabel || isRateLabel || isRatePercent) && wantGen) {
          if (!el.hasAttribute('data-lcts-blind-stat'))
            el.setAttribute('data-lcts-blind-stat', 'true');
        }
      });
    });
  }

  function scanDOM() {
    // Safety check: ensure main content containers NEVER have blind attributes
    document
      .querySelectorAll(
        '[data-track-load="description_content"], #qd-content, .flexlayout__tab, main'
      )
      .forEach((el) => {
        el.removeAttribute('data-lcts-blind-stat');
        el.removeAttribute('data-lcts-blind-tag');
        el.removeAttribute('data-lcts-blind-diff');
        el.removeAttribute('data-lcts-blind-acc');
        el.removeAttribute('data-lcts-blind-sub');
      });

    if (!settings.active) {
      document
        .querySelectorAll('[data-lcts-blind-diff]')
        .forEach((el) => el.removeAttribute('data-lcts-blind-diff'));
      document
        .querySelectorAll('[data-lcts-blind-tag]')
        .forEach((el) => el.removeAttribute('data-lcts-blind-tag'));
      document
        .querySelectorAll('[data-lcts-blind-stat]')
        .forEach((el) => el.removeAttribute('data-lcts-blind-stat'));
      document
        .querySelectorAll('[data-lcts-blind-acc]')
        .forEach((el) => el.removeAttribute('data-lcts-blind-acc'));
      document
        .querySelectorAll('[data-lcts-blind-sub]')
        .forEach((el) => el.removeAttribute('data-lcts-blind-sub'));
      return;
    }

    if (!settings.hideDifficulty) {
      document
        .querySelectorAll('[data-lcts-blind-diff]')
        .forEach((el) => el.removeAttribute('data-lcts-blind-diff'));
    } else {
      scanDifficulty();
    }

    if (!settings.blurTags) {
      document
        .querySelectorAll('[data-lcts-blind-tag]')
        .forEach((el) => el.removeAttribute('data-lcts-blind-tag'));
    } else {
      scanTags();
    }

    if (!settings.hideStats && !settings.hideAcceptance && !settings.hideSubmissions) {
      document
        .querySelectorAll('[data-lcts-blind-stat]')
        .forEach((el) => el.removeAttribute('data-lcts-blind-stat'));
      document
        .querySelectorAll('[data-lcts-blind-acc]')
        .forEach((el) => el.removeAttribute('data-lcts-blind-acc'));
      document
        .querySelectorAll('[data-lcts-blind-sub]')
        .forEach((el) => el.removeAttribute('data-lcts-blind-sub'));
    } else {
      scanStats();
    }
  }

  function updateContestBadge(locked) {
    let badge = document.getElementById('lcts-contest-badge');
    if (!locked) {
      if (badge) badge.remove();
      return;
    }
    if (!badge && document.body) {
      badge = document.createElement('div');
      badge.id = 'lcts-contest-badge';
      badge.innerHTML = `<span>🏆 Contest Mode</span> <button type="button" id="lcts-contest-reveal-btn">Reveal</button>`;
      document.body.appendChild(badge);
      badge.querySelector('#lcts-contest-reveal-btn')?.addEventListener('click', () => {
        contestRevealed = true;
        apply();
      });
    }
  }

  function apply() {
    ensureStyle();
    const isActive = !!settings.active;
    const isContestLocked = isActive && !!settings.contestMode && !contestRevealed;
    const hideDiff = isActive && settings.hideDifficulty !== false;
    const blurTags = isActive && settings.blurTags !== false;
    const hideStats = isActive && settings.hideStats !== false;
    const hideAcc = isActive && settings.hideAcceptance !== false;
    const hideSub = isActive && settings.hideSubmissions !== false;

    if (isActive) {
      root.setAttribute('data-lc-blind', 'true');
    } else {
      root.removeAttribute('data-lc-blind');
    }

    root.classList.toggle('lcts-blind-diff', hideDiff);
    root.classList.toggle('lcts-blind-tags', blurTags);
    root.classList.toggle('lcts-blind-stats', hideStats);
    root.classList.toggle('lcts-blind-acc', hideAcc);
    root.classList.toggle('lcts-blind-sub', hideSub);
    root.classList.toggle('lcts-contest-locked', isContestLocked);

    if (document.body) {
      document.body.classList.toggle('lcts-blind-diff', hideDiff);
      document.body.classList.toggle('lcts-blind-tags', blurTags);
      document.body.classList.toggle('lcts-blind-stats', hideStats);
      document.body.classList.toggle('lcts-blind-acc', hideAcc);
      document.body.classList.toggle('lcts-blind-sub', hideSub);
      document.body.classList.toggle('lcts-contest-locked', isContestLocked);
    }

    updateContestBadge(isContestLocked);
    scanDOM();
  }

  chrome.storage.local.get('lcBlindMode', (res) => {
    if (res && res.lcBlindMode) {
      settings = Object.assign({}, DEFAULTS, res.lcBlindMode);
    }
    apply();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.lcBlindMode) {
      settings = Object.assign({}, DEFAULTS, changes.lcBlindMode.newValue || {});
      apply();
    }
  });

  // Re-scan when dynamic content mounts or changes with 250ms debounce
  let scanTimer = null;
  const debouncedScan = () => {
    if (scanTimer) clearTimeout(scanTimer);
    scanTimer = setTimeout(scanDOM, 250);
  };

  const observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    for (let i = 0; i < mutations.length; i++) {
      if (mutations[i].addedNodes.length > 0 || mutations[i].removedNodes.length > 0) {
        shouldScan = true;
        break;
      }
    }
    if (shouldScan) debouncedScan();
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.body) observer.observe(document.body, { childList: true, subtree: true });
      apply();
    });
  }

  // Accordion click listener to instantly re-scan on user expanding Topics / Companies
  document.addEventListener(
    'click',
    (e) => {
      const target = e.target;
      if (!target) return;
      const txt = (target.textContent || '').trim();
      if (
        /^(Topics|Related Topics|Companies|Company|Similar Questions|相关标签|标签|企业|相似题目)/i.test(
          txt
        ) ||
        target.closest('[data-state]')
      ) {
        setTimeout(scanDOM, 60);
        setTimeout(scanDOM, 260);
      }
    },
    true
  );

  window.addEventListener('popstate', debouncedScan);

  // Auto-reveal Contest Mode on Accepted verdict
  document.addEventListener('lcts:net-verdict', (e) => {
    try {
      const data = typeof e.detail === 'string' ? JSON.parse(e.detail) : e.detail;
      if (data && (data.status === 'Accepted' || data.correct === true)) {
        contestRevealed = true;
        apply();
      }
    } catch (err) {}
  });

  // Reset contest reveal on SPA problem navigation
  window.addEventListener('lc:route-changed', () => {
    contestRevealed = false;
    apply();
  });
  window.addEventListener('lc:problem-loaded', () => {
    debouncedScan();
  });

  if (globalThis.LCTSProblem && typeof globalThis.LCTSProblem.onChange === 'function') {
    globalThis.LCTSProblem.onChange(() => {
      contestRevealed = false;
      setTimeout(scanDOM, 100);
      setTimeout(scanDOM, 400);
    });
  }

  // Shortcut: Ctrl+Shift+B / Cmd+Shift+B to toggle Blind Mode
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'B' || e.key === 'b')) {
      e.preventDefault();
      settings.active = !settings.active;
      chrome.storage.local.set({ lcBlindMode: settings });
      apply();
    }
  });

  apply();
})();
