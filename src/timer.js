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
    mode: '25m', // 'stopwatch', '15m', '25m', '45m'
    remaining: 25 * 60, // in seconds
    isRunning: false,
    startTime: 0,
    elapsedBefore: 0
  };

  const PRESETS = {
    stopwatch: 0,
    '15m': 15 * 60,
    '20m': 20 * 60,
    '25m': 25 * 60,
    '30m': 30 * 60,
    '45m': 45 * 60
  };

  let audioWarned5m = false;

  function playTimerChime(type = 'warn5m') {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'warn5m') {
        // Subtle, elegant chime for 5 minutes remaining
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.46);
      } else if (type === 'timeup') {
        // Triple chime for time up
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.15);
        osc.frequency.setValueAtTime(659.25, now + 0.3);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.72);
      }
    } catch (e) {}
  }

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
        top: 65px;
        right: 24px;
        z-index: 2147483640;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        background: rgba(18, 20, 26, 0.92);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 9999px;
        color: #f1f5f9;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 13px;
        box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08);
        user-select: none;
        cursor: grab;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      #${CONTAINER_ID}:active {
        cursor: grabbing;
      }
      #${CONTAINER_ID}:hover {
        transform: translateY(-1.5px);
        box-shadow: 0 14px 35px -5px rgba(0, 0, 0, 0.6);
      }
      #${CONTAINER_ID} .lcts-timer-digits {
        font-weight: 700;
        font-size: 14px;
        letter-spacing: 0.05em;
        color: #38bdf8;
        min-width: 48px;
        text-align: center;
      }
      #${CONTAINER_ID}.warning-5m {
        border-color: rgba(245, 158, 11, 0.7);
        box-shadow: 0 0 16px rgba(245, 158, 11, 0.4);
      }
      #${CONTAINER_ID} .lcts-timer-digits.warning-5m {
        color: #fbbf24;
      }
      #${CONTAINER_ID} .lcts-timer-digits.warning {
        color: #f87171;
        animation: lcts-pulse 1s infinite alternate;
      }
      #${CONTAINER_ID} .lcts-timer-digits.time-up {
        color: #ef4444;
        animation: lcts-pulse 0.5s infinite alternate;
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
        background: rgba(255, 255, 255, 0.22);
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
        from { opacity: 0.5; }
        to { opacity: 1; }
      }
    `;

    container.innerHTML = `
      <span class="lcts-timer-icon" style="cursor:grab;">⏱️</span>
      <select class="lcts-timer-select" title="Timer Mode">
        <option value="25m">25m</option>
        <option value="15m">15m</option>
        <option value="20m">20m</option>
        <option value="30m">30m</option>
        <option value="45m">45m</option>
        <option value="stopwatch">Stopwatch</option>
      </select>
      <span class="lcts-timer-digits">25:00</span>
      <button class="lcts-timer-btn lcts-play-btn" title="Start/Pause (Alt+Shift+T)">▶</button>
      <button class="lcts-timer-btn lcts-reset-btn" title="Reset (Alt+Shift+R)">↺</button>
    `;

    container.appendChild(style);

    // Restore saved position if available
    try {
      const pos = JSON.parse(sessionStorage.getItem('lcts_timer_pos'));
      if (pos && pos.left && pos.top) {
        container.style.top = pos.top;
        container.style.left = pos.left;
        container.style.right = 'auto';
        container.style.bottom = 'auto';
      }
    } catch (e) {}

    // Make timer draggable anywhere
    let isDragging = false;
    let startX = 0,
      startY = 0,
      initL = 0,
      initT = 0;

    container.addEventListener('mousedown', (e) => {
      if (e.target.closest('button') || e.target.closest('select')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = container.getBoundingClientRect();
      initL = rect.left;
      initT = rect.top;
      container.style.right = 'auto';
      container.style.bottom = 'auto';
      container.style.left = initL + 'px';
      container.style.top = initT + 'px';
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newX = Math.max(
        10,
        Math.min(window.innerWidth - container.offsetWidth - 10, initL + dx)
      );
      const newY = Math.max(
        10,
        Math.min(window.innerHeight - container.offsetHeight - 10, initT + dy)
      );
      container.style.left = newX + 'px';
      container.style.top = newY + 'px';
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        try {
          sessionStorage.setItem(
            'lcts_timer_pos',
            JSON.stringify({ left: container.style.left, top: container.style.top })
          );
        } catch (e) {}
      }
    });

    if (document.body) {
      document.body.appendChild(container);
    } else {
      const mountOnBody = setInterval(() => {
        if (document.body) {
          clearInterval(mountOnBody);
          if (!document.body.contains(container)) document.body.appendChild(container);
        }
      }, 50);
    }

    const select = container.querySelector('.lcts-timer-select');
    const digits = container.querySelector('.lcts-timer-digits');
    const playBtn = container.querySelector('.lcts-play-btn');
    const resetBtn = container.querySelector('.lcts-reset-btn');

    select.value = state.mode;

    select.addEventListener('change', () => {
      pause();
      audioWarned5m = false;
      state.mode = select.value;
      if (state.mode === 'stopwatch') {
        state.remaining = 0;
      } else {
        state.remaining = PRESETS[state.mode] || 25 * 60;
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
      audioWarned5m = false;
      if (state.mode === 'stopwatch') {
        state.remaining = 0;
      } else {
        state.remaining = PRESETS[state.mode] || 25 * 60;
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
      if (state.mode !== 'stopwatch') {
        if (state.remaining <= 60 && state.remaining > 0) {
          digits.classList.remove('warning-5m');
          digits.classList.add('warning');
          container.classList.add('warning-5m');
        } else if (state.remaining <= 300 && state.remaining > 60) {
          digits.classList.add('warning-5m');
          digits.classList.remove('warning');
          container.classList.add('warning-5m');
        } else if (state.remaining <= 0) {
          digits.classList.remove('warning-5m', 'warning');
          digits.classList.add('time-up');
          container.classList.add('warning-5m');
        } else {
          digits.classList.remove('warning', 'warning-5m', 'time-up');
          container.classList.remove('warning-5m');
        }
      } else {
        digits.classList.remove('warning', 'warning-5m', 'time-up');
        container.classList.remove('warning-5m');
      }
    }
  }

  function tick() {
    if (!state.isRunning) return;

    if (state.mode === 'stopwatch') {
      state.remaining += 1;
    } else {
      state.remaining -= 1;
      if (state.remaining === 300 && !audioWarned5m) {
        audioWarned5m = true;
        playTimerChime('warn5m');
      } else if (state.remaining <= 0) {
        state.remaining = 0;
        pause();
        playTimerChime('timeup');
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

  // Keyboard shortcuts from anywhere (including Monaco Editor)
  // Alt+Shift+T: Start / Pause
  // Alt+Shift+R: Reset
  window.addEventListener(
    'keydown',
    (e) => {
      if (e.altKey && e.shiftKey && (e.key === 'T' || e.key === 't')) {
        e.preventDefault();
        e.stopPropagation();
        if (!enabled) setVisibility(true);
        if (state.isRunning) {
          pause();
        } else {
          start();
        }
      } else if (e.altKey && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault();
        e.stopPropagation();
        pause();
        audioWarned5m = false;
        if (state.mode === 'stopwatch') {
          state.remaining = 0;
        } else {
          state.remaining = PRESETS[state.mode] || 25 * 60;
        }
        updateUI();
        saveState();
      }
    },
    true
  );

  function setVisibility(show) {
    enabled = !!show;
    const existing = document.getElementById(CONTAINER_ID);
    if (enabled) {
      if (!existing) {
        if (document.body) {
          createWidget();
        } else {
          document.addEventListener('DOMContentLoaded', () => {
            if (enabled && !document.getElementById(CONTAINER_ID)) createWidget();
          });
        }
      } else {
        existing.style.display = 'flex';
        if (document.body && !document.body.contains(existing)) {
          document.body.appendChild(existing);
        }
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
  let initTries = 0;
  const initInterval = setInterval(() => {
    initTries++;
    if (enabled && !document.getElementById(CONTAINER_ID) && document.body) {
      createWidget();
      clearInterval(initInterval);
    } else if (initTries > 30 || (document.getElementById(CONTAINER_ID) && !enabled)) {
      clearInterval(initInterval);
    }
  }, 300);
})();
