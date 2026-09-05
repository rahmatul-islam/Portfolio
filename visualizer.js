/* ==========================================================================
   VISUALIZER UI — renders VizCore events into the Section 2.4 labs.
   Requires: viz-core.js (window.VizCore), markup in index.html, visualizer.css
   ========================================================================== */
(function () {
  'use strict';
  if (typeof document === 'undefined') return;

  const C = window.VizCore;
  const $ = (id) => document.getElementById(id);
  const TICK_MS = C.TICK_MS;

  /* ========================================================================
     STATE
     ======================================================================== */
  const state = {
    sched: null,
    playing: false,
    timer: null,
    live: false,          // connected to Go backend
    ws: null,
    vizVisible: false,    // for keyboard guard
    reducedMotion: localStorage.getItem('ratul_motion') === 'reduced',
    bst: null,
    bstTimer: null,
    bstBusy: false
  };

  /* ========================================================================
     HELPERS
     ======================================================================== */
  function vpToast(msg) {
    const box = $('toastBox');
    if (!box) return;
    const t = document.createElement('div');
    t.className = 'toast-item';
    t.innerHTML = `<span>${msg}</span>`;
    box.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2600);
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  /* ========================================================================
     CONFIG (controls <-> URL <-> scheduler)
     ======================================================================== */
  const CFG_KEYS = ['workers', 'buffer', 'producer', 'processing', 'failRate', 'maxRetries'];

  function readControls() {
    return {
      workers:    parseInt($('vpCfgWorkers').value, 10),
      buffer:     parseInt($('vpCfgBuffer').value, 10),
      producer:   $('vpCfgProducer').value,
      processing: $('vpCfgProcessing').value,
      failRate:   parseInt($('vpCfgFailRate').value, 10),
      maxRetries: parseInt($('vpCfgMaxRetries').value, 10)
    };
  }

  function writeControls(cfg) {
    CFG_KEYS.forEach(k => {
      const el = $('vpCfg' + k.charAt(0).toUpperCase() + k.slice(1));
      if (el) el.value = cfg[k];
    });
  }

  function applyUrlParams() {
    const p = new URLSearchParams(location.search);
    const map = { w: 'workers', buf: 'buffer', prod: 'producer', proc: 'processing', fail: 'failRate', retry: 'maxRetries' };
    let touched = false;
    for (const [short, key] of Object.entries(map)) {
      if (!p.has(short)) continue;
      const el = $('vpCfg' + key.charAt(0).toUpperCase() + key.slice(1));
      if (!el) continue;
      const v = p.get(short);
      if ([...el.options].some(o => o.value === v)) { el.value = v; touched = true; }
    }
    return { touched, auto: p.get('auto') === '1', backend: p.get('backend') };
  }

  function buildShareUrl() {
    const cfg = readControls();
    const p = new URLSearchParams();
    p.set('w', cfg.workers); p.set('buf', cfg.buffer); p.set('prod', cfg.producer);
    p.set('proc', cfg.processing); p.set('fail', cfg.failRate); p.set('retry', cfg.maxRetries);
    const url = new URL(location.href);
    url.search = p.toString();
    return url.toString();
  }

  /* ========================================================================
     CODE PANEL
     ======================================================================== */
  const CODE_LINE_IDS = { spawn: 'cl-spawn', send: 'cl-send', recv: 'cl-recv', proc: 'cl-proc', retry: 'cl-retry', done: 'cl-done' };

  function highlightCode(codeKey) {
    document.querySelectorAll('#vpCode .cl.hl').forEach(el => el.classList.remove('hl'));
    const id = CODE_LINE_IDS[codeKey];
    if (!id) return;
    const el = $(id);
    if (el) {
      el.classList.add('hl');
      el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
    }
  }

  function syncCodeHeader() {
    const cfg = readControls();
    const b = $('codeBuf'), w = $('codeW'), cap = $('vpCap');
    if (b) b.textContent = cfg.buffer;
    if (w) w.textContent = cfg.workers;
    if (cap) cap.textContent = cfg.buffer;
  }

  /* ========================================================================
     PIPELINE RENDERING
     ======================================================================== */
  function renderProducer() {
    const s = state.sched;
    const parked = s.blocked.some(b => b.kind === 'prod');
    const el = $('vpProducer');
    el.classList.toggle('blocked', parked);
    $('vpProducerState').textContent = parked ? 'BLOCKED on send' : 'ready';
    $('vpProducerRate').textContent = s.pattern.label;
  }

  function renderChannel() {
    const s = state.sched;
    const strip = $('vpSlots');
    strip.innerHTML = '';
    for (let i = 0; i < s.capacity; i++) {
      const slot = document.createElement('span');
      const task = s.channel[i];
      if (task) {
        slot.className = 'vp-slot filled' + (task.attempt > 1 ? ' retried' : '');
        slot.textContent = `T#${task.id}` + (task.attempt > 1 ? `·a${task.attempt}` : '');
      } else {
        slot.className = 'vp-slot';
        slot.textContent = '·';
      }
      strip.appendChild(slot);
    }
    if (s.capacity === 0) {
      const slot = document.createElement('span');
      slot.className = 'vp-slot unbuffered';
      slot.textContent = 'unbuffered — rendezvous';
      strip.appendChild(slot);
    }
    const blocked = s.blockedCount;
    const badge = $('vpBlockedBadge');
    badge.hidden = blocked === 0;
    badge.textContent = `${blocked} goroutine${blocked > 1 ? 's' : ''} parked on send`;
  }

  function renderWorkers() {
    const s = state.sched;
    const grid = $('vpWorkers');
    const seen = new Set();
    // update existing cards, remove dead ones
    [...grid.children].forEach(card => {
      const id = parseInt(card.dataset.wid, 10);
      const w = s.workers.find(x => x.id === id);
      if (!w) { card.remove(); return; }
      seen.add(id);
      updateWorkerCard(card, w);
    });
    s.workers.forEach(w => {
      if (seen.has(w.id)) return;
      const card = document.createElement('div');
      card.className = 'vpw';
      card.dataset.wid = w.id;
      card.innerHTML = `
        <div class="vpw-head">
          <span class="vpw-name">Worker #${w.id}${w.closing ? ' (closing)' : ''}</span>
          <span class="vpw-gid" title="simulated goroutine">go r${w.id}</span>
        </div>
        <div class="vpw-state st-idle">IDLE</div>
        <div class="vpw-task">—</div>`;
      grid.appendChild(card);
      updateWorkerCard(card, w);
    });
  }

  function updateWorkerCard(card, w) {
    const st = card.querySelector('.vpw-state');
    const cls = { IDLE: 'st-idle', RECEIVED: 'st-recv', RUNNING: 'st-run', RETRYING: 'st-retry' }[w.state] || 'st-idle';
    st.className = 'vpw-state ' + cls;
    st.textContent = w.closing && w.state === 'IDLE' ? 'EXITING' : w.state;
    const task = card.querySelector('.vpw-task');
    if (w.task) {
      task.textContent = `T#${w.task.id}` + (w.task.attempt > 1 ? ` (attempt ${w.task.attempt})` : '') +
                         (w.remaining != null && w.state === 'RUNNING' ? ` · ${w.remaining} ticks` : '');
    } else if (w.state === 'RETRYING') {
      task.textContent = 're-queueing…';
    } else {
      task.textContent = '—';
    }
    card.dataset.state = w.state;
  }

  function flashFx(type, workerId, taskId) {
    if (state.reducedMotion) return;
    const card = document.querySelector(`.vpw[data-wid="${workerId}"]`);
    if (!card) return;
    const fx = type === 'DONE' ? 'fx-done' : type === 'FAIL' ? 'fx-fail' : '';
    if (!fx) return;
    card.classList.remove('fx-done', 'fx-fail'); void card.offsetWidth;
    card.classList.add(fx);
  }

  function renderMetrics() {
    const s = state.sched, st = s.stats;
    $('vpMQueue').textContent = s.queueLen;
    $('vpMActive').textContent = s.activeWorkers;
    $('vpMDone').textContent = st.completed;
    $('vpMFail').textContent = st.failed;
    $('vpMRetry').textContent = st.retried;
    $('vpMThr').textContent = s.throughput.toFixed(1);
    $('vpMLat').textContent = s.avgLatencyMs ? (s.avgLatencyMs / 1000).toFixed(2) + 's' : '—';
    $('vpMGoro').textContent = s.goroutines;
    $('vpMClock').textContent = (s.t * TICK_MS / 1000).toFixed(1) + 's';
  }

  function renderLog(events) {
    const log = $('vpLog');
    events.forEach(e => {
      const row = document.createElement('div');
      row.className = 'vp-log-row';
      const tag = { ENQUEUE: 'SEND', BLOCK: 'BLK!', RECEIVE: 'RECV', RUN: 'RUN ', DONE: 'DONE', FAIL: 'FAIL', RETRY: 'RTY>', SPAWN: 'SPAWN', EXIT: 'EXIT' }[e.type] || 'SYS ';
      row.innerHTML = `<span class="lg-t">${(state.sched.t * TICK_MS / 1000).toFixed(1)}s</span>` +
                      `<span class="lg-tag lg-${e.type.toLowerCase()}">${tag}</span><span class="lg-m">${esc(e.msg)}</span>`;
      log.prepend(row);
    });
    while (log.children.length > 42) log.lastChild.remove();
  }

  function renderAll(events) {
    renderProducer();
    renderChannel();
    renderWorkers();
    renderMetrics();
    renderLog(events || []);
  }

  /* ========================================================================
     ENGINE (local simulated mode)
     ======================================================================== */
  function makeScheduler() {
    return new C.Scheduler(readControls());
  }

  function runTick() {
    const evs = state.sched.tick();
    if (evs.length) highlightCode(evs[evs.length - 1].code);
    renderAll(evs);
  }

  function play() {
    if (state.playing || state.live) return;
    state.playing = true;
    $('vpPlay').textContent = '⏸ Pause';
    $('vpPlay').setAttribute('aria-pressed', 'true');
    state.timer = setInterval(runTick, TICK_MS);
  }

  function pause() {
    state.playing = false;
    clearInterval(state.timer);
    const b = $('vpPlay');
    if (b) { b.textContent = '▶ Play'; b.setAttribute('aria-pressed', 'false'); }
  }

  function step() {
    if (state.playing || state.live) return;
    runTick();
  }

  function resetSim(msg) {
    pause();
    state.sched = makeScheduler();
    $('vpLog').innerHTML = '';
    highlightCode(null);
    renderAll([{ type: 'SPAWN', msg: msg || `make(chan Task, ${state.sched.capacity}) — ${state.sched.workers.length} worker goroutine(s) spawned, sim reset` }]);
  }

  /* ========================================================================
     LIVE MODE (Go backend over WebSocket)
     ======================================================================== */
  function setModeBadge(mode) {
    const b = $('vpModeBadge');
    b.classList.toggle('live', mode === 'live');
    b.textContent = mode === 'live' ? '● LIVE (Go backend)' : '● SIMULATED';
    b.title = mode === 'live'
      ? 'Events are streaming from a real Go worker pool over WebSocket'
      : 'Discrete-event simulation in the browser — add ?backend=wss://… to connect a real Go backend';
  }

  function connectLive(url) {
    try {
      const ws = new WebSocket(url);
      state.ws = ws;
      ws.onopen = () => {
        state.live = true;
        setModeBadge('live');
        pause();
        $('vpLog').innerHTML = '';
        ws.send(JSON.stringify(Object.assign(readControls(), {
          prodIntervalMs: 500,
          burstSize: readControls().producer === 'burst' ? 4 : 1,
          procMinMs: 300, procMaxMs: 900, durationMs: 60000
        })));
        vpToast('🟢 Connected to Go backend — LIVE mode');
      };
      ws.onmessage = (m) => {
        const ev = JSON.parse(m.data);
        renderLiveEvent(ev);
      };
      ws.onclose = ws.onerror = () => {
        state.live = false;
        setModeBadge('sim');
        vpToast('⚪ Backend disconnected — back to SIMULATED mode');
      };
    } catch (e) {
      setModeBadge('sim');
    }
  }

  function renderLiveEvent(ev) {
    if (!ev.type) { renderMetricsLive(ev); return; }
    const mapped = { type: ev.type, code: { ENQUEUE: 'send', BLOCK: 'send', RECEIVE: 'recv', RUN: 'proc', DONE: 'done', FAIL: 'done', RETRY: 'retry', SPAWN: 'spawn', EXIT: 'spawn' }[ev.type] || null,
                     msg: ev.msg || ev.type };
    highlightCode(mapped.code);
    renderLog([mapped]);
    renderMetricsLive(ev);
  }

  function renderMetricsLive(ev) {
    // In live mode the Go backend is the source of truth — show its counters.
    if (ev.queue != null) $('vpMQueue').textContent = ev.queue;
    if (ev.goroutines != null) $('vpMGoro').textContent = ev.goroutines;
    if (ev.stats) {
      $('vpMDone').textContent = ev.stats.completed;
      $('vpMFail').textContent = ev.stats.failed;
      $('vpMRetry').textContent = ev.stats.retried;
    }
  }

  /* ========================================================================
     KEYBOARD (Space / S / R) — guarded
     ======================================================================== */
  function keyboardGuard(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return false;
    if (e.target.closest('input, textarea, select, [contenteditable]')) return false;
    const term = $('termModal');
    if (term && term.classList.contains('open')) return false;
    if (!state.vizVisible) return false;
    return true;
  }

  document.addEventListener('keydown', (e) => {
    if (!keyboardGuard(e)) return;
    if (e.key === ' ') { e.preventDefault(); state.playing ? pause() : play(); }
    else if (e.key === 's' || e.key === 'S') { e.preventDefault(); step(); }
    else if (e.key === 'r' || e.key === 'R') { e.preventDefault(); resetSim(); }
  });

  /* ========================================================================
     BST LAB
     ======================================================================== */
  const SVG_NS = 'http://www.w3.org/2000/svg';

  function bstRender(highlightV, newNodeV) {
    const t = state.bst;
    const svg = $('vpTreeSvg');
    const lay = t.layout(54, 58, 32);
    svg.setAttribute('viewBox', `0 0 ${Math.max(lay.width, 320)} ${Math.max(lay.height, 150)}`);
    svg.innerHTML = '';

    lay.edges.forEach(e => {
      const l = document.createElementNS(SVG_NS, 'line');
      l.setAttribute('x1', e.x1); l.setAttribute('y1', e.y1);
      l.setAttribute('x2', e.x2); l.setAttribute('y2', e.y2);
      l.setAttribute('class', 'bst-edge');
      svg.appendChild(l);
    });

    lay.nodes.forEach(n => {
      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('class', 'bst-node');
      g.setAttribute('transform', `translate(${n.x}, ${n.y})`);
      g.dataset.v = n.v;
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('r', 17);
      const tx = document.createElementNS(SVG_NS, 'text');
      tx.setAttribute('text-anchor', 'middle');
      tx.setAttribute('dy', 4);
      tx.textContent = n.v;
      g.appendChild(c); g.appendChild(tx);
      if (n.v === highlightV) g.classList.add('active');
      if (n.v === newNodeV) g.classList.add('new');
      svg.appendChild(g);
    });

    // stats
    const n = t.size(), h = t.height();
    const ideal = n ? Math.ceil(Math.log2(n + 1)) : 0;
    $('vpBstN').textContent = n;
    $('vpBstH').textContent = h;
    $('vpBstLog').textContent = n ? '⌈log₂(' + n + ')⌉ = ' + ideal : '—';
    const chip = $('vpBstShape');
    if (!n) { chip.textContent = 'EMPTY'; chip.className = 'vp-chip'; }
    else if (h > 2 * ideal + 1) { chip.textContent = 'SKEWED ⚠'; chip.className = 'vp-chip warn'; }
    else { chip.textContent = 'BALANCED ✓'; chip.className = 'vp-chip ok'; }
  }

  function bstStackPanel(labels, cls) {
    const box = $('vpBstStack');
    box.innerHTML = labels.length
      ? labels.map(v => `<span class="vp-chip ${cls || ''}">${v}</span>`).join('')
      : '<span class="vp-dim">empty</span>';
  }

  function bstOutPanel(out) {
    $('vpBstOut').innerHTML = out.length
      ? out.map(v => `<span class="vp-chip out">${v}</span>`).join('')
      : '<span class="vp-dim">[ ]</span>';
  }

  function bstStatus(msg) { $('vpBstStatus').textContent = msg; }

  function bstStopTimer() {
    clearTimeout(state.bstTimer);
    state.bstTimer = null;
    state.bstBusy = false;
  }

  function bstPlaySteps(steps, doneMsg, stepMs) {
    bstStopTimer();
    state.bstBusy = true;
    let i = 0;
    const ms = state.reducedMotion ? 1 : (stepMs || 420);
    const tickFn = () => {
      if (i >= steps.length) {
        bstStopTimer();
        bstStatus(doneMsg);
        bstStackPanel([]);
        return;
      }
      const s = steps[i++];
      document.querySelectorAll('#vpTreeSvg .bst-node.active').forEach(g => g.classList.remove('active'));
      const g = document.querySelector(`#vpTreeSvg .bst-node[data-v="${s.v}"]`);
      if (g) g.classList.add('active');
      if (s.stack) bstStackPanel([...s.stack].reverse(), 'stk');
      else if (s.queue) bstStackPanel(s.queue, 'q');
      bstOutPanel(s.out || []);
      state.bstTimer = setTimeout(tickFn, ms);
    };
    tickFn();
  }

  function bstInsert(v) {
    if (state.bstBusy) { bstStatus('⏳ animation in progress — wait a moment'); return; }
    const res = state.bst.insert(v);
    if (!res.created) { bstStatus(`${v} already in tree — BSTs hold unique keys`); return; }
    let i = 0;
    state.bstBusy = true;
    const path = res.path;
    const walkFn = () => {
      document.querySelectorAll('#vpTreeSvg .bst-node.active').forEach(g => g.classList.remove('active'));
      if (i < path.length - 1) {
        const g = document.querySelector(`#vpTreeSvg .bst-node[data-v="${path[i]}"]`);
        if (g) g.classList.add('active');
        bstStatus(`compare ${v} ${v < path[i] ? '<' : '>'} ${path[i]} → go ${v < path[i] ? 'left' : 'right'}`);
        i++;
        state.bstTimer = setTimeout(walkFn, state.reducedMotion ? 1 : 260);
      } else {
        bstRender(v, v);
        bstStatus(`inserted ${v} as ${path.length === 1 ? 'root' : `left/right child of ${path[path.length - 2]}`} — O(h) comparisons`);
        state.bstBusy = false;
      }
    };
    walkFn();
  }

  function bstDelete(v) {
    if (state.bstBusy) { bstStatus('⏳ animation in progress — wait a moment'); return; }
    const res = state.bst.delete(v);
    if (!res.found) { bstStatus(`${v} not found — search path: ${res.path.join(' → ') || '(empty tree)'}`); return; }
    let i = 0;
    state.bstBusy = true;
    const walkFn = () => {
      document.querySelectorAll('#vpTreeSvg .bst-node.active').forEach(g => g.classList.remove('active'));
      if (i < res.path.length) {
        const g = document.querySelector(`#vpTreeSvg .bst-node[data-v="${res.path[i]}"]`);
        if (g) g.classList.add('active');
        bstStatus(`searching ${v}… at ${res.path[i]}`);
        i++;
        state.bstTimer = setTimeout(walkFn, state.reducedMotion ? 1 : 260);
      } else {
        let msg = `deleted ${v} — case: ${res.case.replace('-', ' ')}`;
        if (res.case === 'two-children') msg += ` (successor ${res.succ} copied up, then removed)`;
        bstRender(undefined, res.case === 'two-children' ? res.succ : undefined);
        bstStatus(msg);
        state.bstBusy = false;
      }
    };
    walkFn();
  }

  function bstTraverse(kind) {
    if (state.bstBusy) { bstStatus('⏳ animation in progress — wait a moment'); return; }
    if (!state.bst.root) { bstStatus('tree is empty — insert some values first'); return; }
    const steps = state.bst.traverse(kind);
    const names = { in: 'In-Order', pre: 'Pre-Order', post: 'Post-Order', level: 'Level-Order (BFS)' };
    bstPlaySteps(steps, `${names[kind]} complete: [${steps.filter(s => s.t === 'visit').map(s => s.v).join(', ')}]`);
    bstStatus(`${names[kind]} traversal running…${kind === 'level' ? ' (queue-based BFS)' : ' (DFS + recursion stack)'}`);
  }

  function bstRandom() {
    if (state.bstBusy) { bstStatus('⏳ animation in progress — wait a moment'); return; }
    state.bst = new C.BST();
    for (let i = 0; i < 9; i++) state.bst.insert(Math.floor(Math.random() * 99) + 1);
    bstRender();
    bstOutPanel([]);
    bstStatus('random tree generated — try traversals or delete a node');
  }

  /* ========================================================================
     WIRING
     ======================================================================== */
  function init() {
    const root = $('visualizer');
    if (!root) return;

    // reduced motion
    if (state.reducedMotion) root.classList.add('reduce-motion');
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      state.reducedMotion = true;
      root.classList.add('reduce-motion');
    }

    // visibility guard for keyboard shortcuts
    new IntersectionObserver((entries) => {
      entries.forEach(en => { state.vizVisible = en.isIntersecting; });
    }, { threshold: 0.15 }).observe(root);

    // tabs
    const tabPool = $('vpTabPool'), tabBst = $('vpTabBST');
    const viewPool = $('vpPoolView'), viewBst = $('vpBSTView');
    function showTab(which) {
      tabPool.classList.toggle('active', which === 'pool');
      tabBst.classList.toggle('active', which === 'bst');
      viewPool.hidden = which !== 'pool';
      viewBst.hidden = which !== 'bst';
    }
    tabPool.addEventListener('click', () => showTab('pool'));
    tabBst.addEventListener('click', () => showTab('bst'));
    showTab('pool');

    // presets
    document.querySelectorAll('#vpPresets .vp-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = C.PRESETS[btn.dataset.preset];
        if (!p) return;
        writeControls(p.cfg);
        syncCodeHeader();
        resetSim(`preset "${p.label}" loaded — ${p.cfg.workers} workers, buffer ${p.cfg.buffer}, ${p.cfg.failRate}% fail rate`);
        play();
      });
    });

    // controls
    $('vpCfgWorkers').addEventListener('change', () => {
      const evs = state.sched.setWorkers(parseInt($('vpCfgWorkers').value, 10));
      syncCodeHeader();
      renderAll(evs);
      vpToast(evs.length ? 'goroutine pool resized live' : 'worker count unchanged');
    });
    $('vpCfgBuffer').addEventListener('change', () => {
      syncCodeHeader();
      resetSim(`channel re-made: make(chan Task, ${$('vpCfgBuffer').value}) — channels are fixed-size in Go, so the sim reset`);
    });
    ['vpCfgProducer', 'vpCfgProcessing', 'vpCfgFailRate', 'vpCfgMaxRetries'].forEach(id => {
      $(id).addEventListener('change', () => {
        Object.assign(state.sched.cfg, readControls());
        vpToast('config applied live (no reset needed)');
      });
    });

    // transport controls
    $('vpPlay').addEventListener('click', () => (state.playing ? pause() : play()));
    $('vpStep').addEventListener('click', step);
    $('vpReset').addEventListener('click', () => resetSim());
    $('vpPush').addEventListener('click', () => {
      if (state.live) { vpToast('manual push is simulated-mode only'); return; }
      const evs = state.sched.manualPush();
      highlightCode('send');
      renderAll(evs);
    });
    $('vpShare').addEventListener('click', () => {
      const url = buildShareUrl();
      const copy = () => {
        navigator.clipboard?.writeText(url).then(() => vpToast('🔗 scenario URL copied')).catch(() => vpToast(url));
      };
      history.replaceState(null, '', url);
      if (navigator.clipboard && window.isSecureContext) copy();
      else { vpToast('🔗 scenario URL is in the address bar'); }
    });
    $('vpMotion').addEventListener('click', () => {
      state.reducedMotion = !state.reducedMotion;
      root.classList.toggle('reduce-motion', state.reducedMotion);
      localStorage.setItem('ratul_motion', state.reducedMotion ? 'reduced' : 'full');
      $('vpMotion').textContent = state.reducedMotion ? '🌀 Motion: Reduced' : '🌀 Motion: Full';
    });

    // BST controls
    const bstInput = $('vpBstInput');
    const val = () => {
      const v = parseInt(bstInput.value, 10);
      if (Number.isNaN(v) || v < 0 || v > 999) { bstStatus('enter a number 0–999'); return null; }
      return v;
    };
    $('vpBstInsert').addEventListener('click', () => { const v = val(); if (v != null) { bstInsert(v); bstInput.value = ''; } });
    $('vpBstDelete').addEventListener('click', () => { const v = val(); if (v != null) bstDelete(v); });
    bstInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const v = val(); if (v != null) { bstInsert(v); bstInput.value = ''; } }
    });
    $('vpBstRandom').addEventListener('click', bstRandom);
    $('vpBstClear').addEventListener('click', () => { if (state.bstBusy) bstStopTimer(); state.bst = new C.BST(); bstRender(); bstOutPanel([]); bstStatus('tree cleared'); });
    document.querySelectorAll('[data-trav]').forEach(b => b.addEventListener('click', () => bstTraverse(b.dataset.trav)));

    // boot
    const url = applyUrlParams();
    state.sched = makeScheduler();
    syncCodeHeader();
    state.bst = new C.BST([50, 30, 70, 20, 40, 60, 80, 35]);
    bstRender();
    resetSim();
    $('vpMotion').textContent = state.reducedMotion ? '🌀 Motion: Reduced' : '🌀 Motion: Full';

    if (url.backend) connectLive(url.backend);
    else setModeBadge('sim');

    if (url.auto) play();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
