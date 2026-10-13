/* =============================================================================
   verdict.js (isolated world, LeetCode)
   Single unified verdict detector for all themes (Anime, Crawler, Game, Pixel, Share).
   Receives verdicts from net-verdict.js via lcts:net-verdict event with DOM fallback.
============================================================================= */
(() => {
  if (globalThis.LCTSVerdict) return;

  const subs = [];
  let netWorks = false;
  const recent = [];

  function emit(v) {
    const now = Date.now();
    if (recent.some(([t, k, a]) => now - t < 3000 && k === v.kind && a === v.action)) return;
    recent.push([now, v.kind, v.action]);
    if (recent.length > 8) recent.shift();
    subs.forEach((fn) => {
      try {
        fn(v);
      } catch (e) {}
    });
  }

  const fmtBeats = (n) =>
    typeof n === 'number' && isFinite(n) ? String(Math.round(n * 100) / 100) : null;

  function kindFromStatus(status, action, correct) {
    switch (status) {
      case 'Accepted':
        if (action === 'run') return correct === false ? ['wa', null] : ['run', null];
        return ['ac', null];
      case 'Wrong Answer':
        return ['wa', null];
      case 'Time Limit Exceeded':
        return ['tle', null];
      case 'Memory Limit Exceeded':
        return ['mle', null];
      default:
        return ['err', (status || 'Error').toUpperCase()];
    }
  }

  /* ---- primary: the network ---- */
  document.addEventListener('lcts:net-verdict', (e) => {
    let d;
    try {
      d = JSON.parse(e.detail);
    } catch (err) {
      return;
    }
    if (!d || typeof d !== 'object') return;
    netWorks = true;
    cancelFallback();
    const action = d.action === 'run' ? 'run' : 'submit';
    const [kind, label] = kindFromStatus(String(d.status || ''), action, d.correct);
    emit({
      kind,
      action,
      label,
      source: 'net',
      beats: kind === 'ac' ? fmtBeats(d.beats) : null,
      lang: d.lang || null,
      runtime: d.runtime || null,
      passed: typeof d.passed === 'number' ? d.passed : null,
      total: typeof d.total === 'number' ? d.total : null
    });
  });

  /* ---- fallback: the DOM ---- */
  const VERDICT =
    /^(Accepted|Wrong Answer|Time Limit Exceeded|Memory Limit Exceeded|Output Limit Exceeded|Runtime Error|Compile Error|Internal Error)\b/;
  const SUBMIT_LOC = '[data-e2e-locator="submission-result"]';
  const RUN_LOC = '[data-e2e-locator="console-result"]';

  function scan(action) {
    const found = [];
    document.querySelectorAll(action === 'submit' ? SUBMIT_LOC : RUN_LOC).forEach((n) => {
      const m = VERDICT.exec(n.textContent.trim());
      if (m) found.push([n, m[1]]);
    });
    if (found.length) return found;
    document.querySelectorAll('.flexlayout__tab').forEach((tab) => {
      if (tab.querySelector('#editor, [data-track-load="description_content"]')) return;
      const isConsole = !!tab.querySelector(
        RUN_LOC + ', [data-e2e-locator="console-testcase-input"]'
      );
      if ((action === 'submit') === isConsole) return;
      const walk = document.createTreeWalker(tab, NodeFilter.SHOW_TEXT);
      let n,
        budget = 4000;
      while ((n = walk.nextNode()) && budget-- > 0) {
        const t = n.nodeValue;
        if (t.length < 8 || t.length > 40) continue;
        const m = VERDICT.exec(t.trim());
        if (m && n.parentElement) found.push([n.parentElement, m[1]]);
      }
    });
    return found;
  }

  let armed = null,
    pending = 0;
  function cancelFallback() {
    if (armed) clearInterval(armed.timer);
    armed = null;
    clearTimeout(pending);
  }

  function arm(action) {
    if (netWorks) return;
    cancelFallback();
    const before = new Map();
    scan(action).forEach(([n, t]) => before.set(n, t));
    const state = {
      action,
      before,
      cleared: before.size === 0,
      until: Date.now() + 60000,
      timer: 0
    };
    state.timer = setInterval(() => {
      if (Date.now() > state.until) {
        cancelFallback();
        return;
      }
      const now = scan(action);
      if (!now.length || [...state.before.keys()].every((n) => !n.isConnected))
        state.cleared = true;
      const fresh = now.find(
        ([n, t]) => state.cleared || !state.before.has(n) || state.before.get(n) !== t
      );
      if (!fresh) return;
      clearInterval(state.timer);
      const [node, text] = fresh;
      pending = setTimeout(() => {
        if (netWorks) return;
        armed = null;
        const [kind, label] = kindFromStatus(text, action, null);
        const send = (beats) =>
          emit({
            kind,
            action,
            label,
            beats,
            source: 'dom',
            lang: null,
            runtime: null,
            passed: null,
            total: null
          });
        if (kind !== 'ac') {
          send(null);
          return;
        }
        let tries = 0;
        const look = () => {
          if (netWorks) return;
          const pane = node.isConnected ? node.closest('.flexlayout__tab') : null;
          const m = pane && /Beats\s*([\d.]+)\s*%/.exec(pane.textContent);
          if (m || ++tries > 8) send(m ? m[1] : null);
          else pending = setTimeout(look, 200);
        };
        look();
      }, 900);
    }, 400);
    armed = state;
  }

  document.addEventListener(
    'click',
    (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('[data-e2e-locator="console-submit-button"]')) arm('submit');
      else if (t.closest('[data-e2e-locator="console-run-button"]')) arm('run');
    },
    true
  );

  document.addEventListener(
    'keydown',
    (e) => {
      if (!(e.ctrlKey || e.metaKey) || e.repeat) return;
      if (e.key === 'Enter') arm('submit');
      else if (e.key === "'") arm('run');
    },
    true
  );

  globalThis.LCTSVerdict = {
    subscribe(fn) {
      subs.push(fn);
    },
    simulate(v) {
      emit(Object.assign({ action: 'submit', label: null, beats: null, source: 'sim' }, v));
    }
  };
})();
