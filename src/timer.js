/* =============================================================================
   timer.js (isolated world, LeetCode)
   Interview Stopwatch & Countdown Timer widget.
   Provides floating or embedded timer with stopwatch, 15m, 25m, and 45m presets.
============================================================================= */
(() => {
  'use strict';

  const CONTAINER_ID = 'lcts-interview-timer';
  let timerInterval = null;
  let enabled = false;

  let state = {
    mode: '25m',        // 'stopwatch', '15m', '25m', '45m'
    remaining: 25 * 60, // in seconds
    isRunning: false,
    startTime: 0,
    elapsedBefore: 0
  };

  const PRESETS = {
    'stopwatch': 0,
    '15m': 15 * 60,
    '25m': 25 * 60,
    '45m': 45 * 60
  };

  function formatTime(totalSec) {
    const sec = Math.max(0, Math.floor(totalSec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function createWidget() {
    let container = document.getElementById(CONTAINER_ID);
    if (container) return container;

    container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.setAttribute('aria-label', 'LeetCode Themes Interview Timer');

    const style = document.createElement('style');
    style.textContent = `
      #${CONTAINER_ID} {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 2147483640;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        background: rgba(18, 20, 26, 0.88);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 9999px;
        color: #f1f5f9;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 13px;
        box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
        user-select: none;
        transition: transform 0.2s ease, opacity 0.2s ease;
      }
      #${CONTAINER_ID}:hover {
        transform: translateY(-2px);
        box-shadow: 0 14px 35px -5px rgba(0, 0, 0, 0.5);
      }
      #${CONTAINER_ID} .lcts-timer-digits {
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 0.05em;
        color: #38bdf8;
        min-width: 48px;
        text-align: center;
      }
      #${CONTAINER_ID} .lcts-timer-digits.warning {
        color: #f87171;
        animation: lcts-pulse 1s infinite alternate;
      }
      #${CONTAINER_ID} .lcts-timer-btn {
        background: rgba(255, 255, 255, 0.08);
        border: none;
        color: #e2e8f0;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 11px;
        transition: all 0.15s ease;
      }
      #${CONTAINER_ID} .lcts-timer-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
        transform: scale(1.08);
      }
      #${CONTAINER_ID} .lcts-timer-select {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 11px;
        font-family: inherit;
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 4px;
        outline: none;
      }
      #${CONTAINER_ID} .lcts-timer-select:hover {
        color: #f1f5f9;
        background: rgba(255, 255, 255, 0.06);
      }
      #${CONTAINER_ID} .lcts-timer-select option {
        background: #1e293b;
        color: #f1f5f9;
      }
      @keyframes lcts-pulse {
        from { opacity: 0.6; }
        to { opacity: 1; }
      }
    `;

    container.innerHTML = `
      <span class="lcts-timer-icon">⏱️</span>
      <select class="lcts-timer-select" title="Timer Mode">
        <option value="25m">25m</option>
        <option value="15m">15m</option>
        <option value="45m">45m</option>
        <option value="stopwatch">Stopwatch</option>
      </select>
      <span class="lcts-timer-digits">25:00</span>
      <button class="lcts-timer-btn lcts-play-btn" title="Start/Pause">▶</button>
      <button class="lcts-timer-btn lcts-reset-btn" title="Reset">↺</button>
    `;

    container.appendChild(style);
    (document.body || document.documentElement).appendChild(container);

    const select = container.querySelector('.lcts-timer-select');
    const digits = container.querySelector('.lcts-timer-digits');
    const playBtn = container.querySelector('.lcts-play-btn');
    const resetBtn = container.querySelector('.lcts-reset-btn');

    select.value = state.mode;

    select.addEventListener('change', () => {
      pause();
      state.mode = select.value;
      if (state.mode === 'stopwatch') {
        state.remaining = 0;
      } else {
        state.remaining = PRESETS[state.mode] || (25 * 60);
      }
      updateUI();
      saveState();
    });

    playBtn.addEventListener('click', () => {
      if (state.isRunning) {
        pause();
      } else {
        start();
      }
    });

    resetBtn.addEventListener('click', () => {
      pause();
      if (state.mode === 'stopwatch') {
        state.remaining = 0;
      } else {
        state.remaining = PRESETS[state.mode] || (25 * 60);
      }
      updateUI();
      saveState();
    });

    updateUI();
    return container;
  }

  function updateUI() {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    const digits = container.querySelector('.lcts-timer-digits');
    const playBtn = container.querySelector('.lcts-play-btn');
    const select = container.querySelector('.lcts-timer-select');

    if (select) select.value = state.mode;
    if (playBtn) playBtn.textContent = state.isRunning ? '⏸' : '▶';

    if (digits) {
      digits.textContent = formatTime(state.remaining);
      if (state.mode !== 'stopwatch' && state.remaining <= 60 && state.remaining > 0) {
        digits.classList.add('warning');
      } else {
        digits.classList.remove('warning');
      }
    }
  }

  function tick() {
    if (!state.isRunning) return;

    if (state.mode === 'stopwatch') {
      state.remaining += 1;
    } else {
      state.remaining -= 1;
      if (state.remaining <= 0) {
        state.remaining = 0;
        pause();
      }
    }
    updateUI();
  }

  function start() {
    if (state.isRunning) return;
    state.isRunning = true;
    timerInterval = setInterval(tick, 1000);
    updateUI();
    saveState();
  }

  function pause() {
    state.isRunning = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    updateUI();
    saveState();
  }

  function saveState() {
    chrome.storage.local.set({ lcTimerState: state });
  }

  function setVisibility(show) {
    enabled = !!show;
    const existing = document.getElementById(CONTAINER_ID);
    if (enabled) {
      if (!existing && (document.body || document.documentElement)) {
        createWidget();
      } else if (existing) {
        existing.style.display = 'flex';
      }
    } else if (existing) {
      existing.style.display = 'none';
      pause();
    }
  }

  chrome.storage.local.get(['lcTimerEnabled', 'lcTimerState'], (res) => {
    if (res && res.lcTimerState) {
      state = Object.assign(state, res.lcTimerState);
      state.isRunning = false; // pause upon fresh tab open
    }
    setVisibility(res && res.lcTimerEnabled);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.lcTimerEnabled !== undefined) {
      setVisibility(changes.lcTimerEnabled.newValue);
    }
  });

  // Check periodically in case body mounts after document_start
  const initInterval = setInterval(() => {
    if (enabled && !document.getElementById(CONTAINER_ID) && document.body) {
      createWidget();
      clearInterval(initInterval);
    }
  }, 300);
})();
