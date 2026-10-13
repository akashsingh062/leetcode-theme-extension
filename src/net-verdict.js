/* =============================================================================
   net-verdict.js (MAIN world, LeetCode)
   Intercepts solution submissions and test runs directly from LeetCode network
   traffic to guarantee exact verdict reporting (Accepted, Beats %, WA, TLE, MLE).
============================================================================= */
(() => {
  if (window.__lctsNetVerdict) return;
  window.__lctsNetVerdict = true;

  const CHECK = /\/submissions\/detail\/([^/?#]+)\/(?:v\d+\/)?check\/?(?:[?#]|$)/;
  const RUN = /\/interpret_solution\/?(?:[?#]|$)/;
  const SUBMIT = /\/problems\/[^/]+\/submit\/?(?:[?#]|$)/;
  const interesting = (u) => CHECK.test(u) || RUN.test(u) || SUBMIT.test(u);

  const actionOf = new Map();
  const sent = new Set();

  function inspect(url, d) {
    if (!d || typeof d !== 'object') return;
    if (RUN.test(url) && d.interpret_id) { actionOf.set(String(d.interpret_id), 'run'); return; }
    if (SUBMIT.test(url) && d.submission_id != null) { actionOf.set(String(d.submission_id), 'submit'); return; }
    const m = CHECK.exec(url);
    if (!m || d.state !== 'SUCCESS') return;
    const id = m[1];
    if (sent.has(id)) return;
    sent.add(id);
    const action = actionOf.get(id) ||
      (/^runcode/.test(id) || 'correct_answer' in d || 'expected_code_answer' in d ? 'run' : 'submit');
    const out = {
      id, action,
      status: String(d.status_msg || ''),
      correct: typeof d.correct_answer === 'boolean' ? d.correct_answer : null,
      beats: typeof d.runtime_percentile === 'number' ? d.runtime_percentile : null,
      memBeats: typeof d.memory_percentile === 'number' ? d.memory_percentile : null,
      runtime: d.status_runtime || null,
      lang: d.pretty_lang || d.lang || null,
      passed: typeof d.total_correct === 'number' ? d.total_correct : null,
      total: typeof d.total_testcases === 'number' ? d.total_testcases : null
    };
    document.dispatchEvent(new CustomEvent('lcts:net-verdict', { detail: JSON.stringify(out) }));
  }

  /* ---- fetch ---- */
  const origFetch = window.fetch;
  if (typeof origFetch === 'function') {
    window.fetch = function (input, init) {
      const p = origFetch.apply(this, arguments);
      try {
        const url = typeof input === 'string' ? input : (input && input.url) || String(input || '');
        if (interesting(url)) {
          p.then((res) => {
            try { res.clone().json().then((d) => inspect(url, d), () => {}); } catch (e) {}
          }, () => {});
        }
      } catch (e) {}
      return p;
    };
  }

  /* ---- XMLHttpRequest ---- */
  const X = window.XMLHttpRequest && window.XMLHttpRequest.prototype;
  if (X) {
    const origOpen = X.open, origSend = X.send;
    X.open = function (method, url) {
      try { this.__lctsUrl = String(url || ''); } catch (e) {}
      return origOpen.apply(this, arguments);
    };
    X.send = function () {
      try {
        const url = this.__lctsUrl;
        if (url && interesting(url)) {
          this.addEventListener('load', () => {
            try {
              let d = null;
              if (this.responseType === 'json') d = this.response;
              else if (this.responseType === '' || this.responseType === 'text') d = JSON.parse(this.responseText);
              inspect(url, d);
            } catch (e) {}
          });
        }
      } catch (e) {}
      return origSend.apply(this, arguments);
    };
  }
})();
