/* ==========================================================================
   SYSTEM ARCHITECTURE LEARNING VISUALIZER — interaction engine
   Tooltip · Inspector · simulated metric ticker · request trace · highlight
   Educational concept diagram: every value it shows is simulated for
   learning. It does not describe a system that is built, deployed,
   operated or maintained by the portfolio owner.
   Requires: #topoSvg markup in index.html. No dependencies.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Component knowledge base — general, textbook-level explanations of
     what each part of a typical backend request pipeline does. Technical
     strings are intentionally English; UI chrome is bilingual via i18n.
     ------------------------------------------------------------------ */
  const NODES = {
    client: {
      name: 'CLIENT', role: 'Request Source',
      desc: 'Where a request starts — a browser or mobile app sends an HTTPS request to the public entry point of the system.',
      tech: ['HTTPS', 'ENTRY POINT'],
      m: { p50: 42, p99: 118, rps: 1240, conn: 'many' },
      deps: []
    },
    lb: {
      name: 'LOAD BALANCER', role: 'Traffic Distributor',
      desc: 'Accepts incoming requests and spreads them across the available application instances, so no single instance carries all of the load.',
      tech: ['ROUTING', 'TLS'],
      m: { p50: 1.2, p99: 4.8, rps: 1240, conn: 'shared' },
      deps: ['api']
    },
    api: {
      name: 'API SERVICE', role: 'Request Handler',
      desc: 'The part that handles a request: it validates the input, applies the business logic, reads or writes data, and returns a structured response.',
      tech: ['REST', 'HTTP', 'JSON'],
      m: { p50: 6.4, p99: 28, rps: 1240, conn: 'pooled' },
      deps: ['cache', 'db', 'queue']
    },
    cache: {
      name: 'CACHE', role: 'Fast Temporary Storage',
      desc: 'Keeps frequently requested data in memory so repeated reads can be answered quickly instead of querying the database every time. Cached data is temporary and can expire.',
      tech: ['IN-MEMORY', 'SHORT-LIVED'],
      m: { p50: 0.4, p99: 1.6, rps: 3900, conn: 'pooled' },
      deps: []
    },
    queue: {
      name: 'TASK QUEUE', role: 'Work Buffer',
      desc: 'Holds work that does not need an instant response, so it can be processed later, in order, without keeping the user waiting.',
      tech: ['FIFO', 'BOUNDED', 'ASYNC'],
      m: { p50: 0.2, p99: 2.1, rps: 180, conn: 'fifo' },
      deps: ['worker']
    },
    worker: {
      name: 'WORKER', role: 'Background Processor',
      desc: 'Takes tasks out of the queue and processes them one step at a time — the usual place for slow jobs such as sending mail or generating a report.',
      tech: ['BACKGROUND', 'ASYNC'],
      m: { p50: 14, p99: 62, rps: 180, conn: 'limited' },
      deps: ['db', 'storage']
    },
    db: {
      name: 'DATABASE', role: 'Permanent Storage',
      desc: 'The system of record. Structured data lives here, and SQL queries are used to read, update and relate it.',
      tech: ['SQL', 'PERSISTENT'],
      m: { p50: 2.8, p99: 15, rps: 940, conn: 'pooled' },
      deps: []
    },
    storage: {
      name: 'OBJECT STORAGE', role: 'File Storage',
      desc: 'Stores files and media — images, documents, exports — as objects. The database usually keeps only the reference or path to each object.',
      tech: ['FILES', 'OBJECTS'],
      m: { p50: 8.1, p99: 44, rps: 95, conn: '—' },
      deps: []
    }
  };

  const EDGES = [
    { id: 'client-lb',     a: 'client',  b: 'lb' },
    { id: 'lb-api',        a: 'lb',      b: 'api' },
    { id: 'api-cache',     a: 'api',     b: 'cache' },
    { id: 'api-queue',     a: 'api',     b: 'queue' },
    { id: 'queue-worker',  a: 'queue',   b: 'worker' },
    { id: 'worker-db',     a: 'worker',  b: 'db' },
    { id: 'worker-storage',a: 'worker',  b: 'storage' },
    { id: 'api-db',        a: 'api',     b: 'db' }
  ];

  const FLOWS = [
    {
      label: 'Read path · GET /api/items · answered from cache',
      fwd: ['client-lb', 'lb-api', 'api-cache'],
      back: ['api-cache', 'lb-api', 'client-lb']
    },
    {
      label: 'Write path · POST /api/items · queued for background work',
      fwd: ['client-lb', 'lb-api', 'api-queue', 'queue-worker', 'worker-db', 'worker-storage'],
      back: ['lb-api', 'client-lb']
    }
  ];

  /* ------------------------------------------------------------------ */
  function init() {
    const svg = document.getElementById('topoSvg');
    if (!svg) return;

    const $ = (id) => document.getElementById(id);
    const stage = $('topoStage');
    const tooltip = $('topoTooltip');
    const eventChip = $('topoEvent');
    const reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const nodeEls = {};
    svg.querySelectorAll('.topo-node').forEach(g => { nodeEls[g.dataset.node] = g; });
    const edgeEls = {};
    svg.querySelectorAll('.te-g').forEach(g => { edgeEls[g.dataset.edge] = g; });

    // incident edge index: nodeId -> [edgeIds]
    const incident = {};
    Object.keys(NODES).forEach(n => { incident[n] = []; });
    EDGES.forEach(e => { incident[e.a].push(e.id); incident[e.b].push(e.id); });

    /* ---------------- simulated state ---------------- */
    const state = {
      selected: null,
      reqs: 4812 + Math.floor(Math.random() * 400),
      startedAt: Date.now(),
      live: {},       // per-component jittered (simulated) metrics
      spark: [],      // rps history for selected node
      tracing: false
    };
    Object.keys(NODES).forEach(n => { state.live[n] = Object.assign({}, NODES[n].m); });

    const jitter = (v, pct) => v * (1 + (Math.random() - 0.5) * 2 * pct);
    const fmtMs = (v) => v >= 10 ? Math.round(v) + 'ms' : v.toFixed(1) + 'ms';

    /* ---------------- event chip ---------------- */
    let chipTimer = null;
    function announce(msg, hold) {
      if (!eventChip) return;
      eventChip.textContent = msg;
      eventChip.classList.add('show');
      clearTimeout(chipTimer);
      chipTimer = setTimeout(() => eventChip.classList.remove('show'), hold || 3800);
    }

    /* ---------------- tooltip ---------------- */
    function hideTooltip() { tooltip && tooltip.classList.remove('show'); }

    function showTooltip(nodeId, target) {
      if (!tooltip) return;
      const info = NODES[nodeId];
      const pad = target.querySelector('.tn-box');
      if (!pad) return;
      const sr = svg.getBoundingClientRect();
      const r = pad.getBoundingClientRect();
      tooltip.innerHTML = `<div class="tt-name">${info.name}</div>` +
        `<div class="tt-role">${info.role} — ${info.desc.split('—')[0].split('.')[0]}.</div>` +
        `<div class="tt-hint">click to inspect →</div>`;
      const x = r.left - sr.left + r.width / 2;
      const y = r.top - sr.top;
      tooltip.style.left = Math.max(90, Math.min(x, sr.width - 90)) + 'px';
      tooltip.style.top = Math.max(46, y) + 'px';
      tooltip.classList.add('show');
    }

    /* ---------------- inspector ---------------- */
    function setSysPanel() {
      $('tiReqs').textContent = state.reqs.toLocaleString('en-US');
      const p99 = Math.max(...Object.keys(NODES).map(n => state.live[n].p99));
      $('tiP99').textContent = fmtMs(p99);
      const thr = Object.keys(NODES)
        .filter(n => ['client', 'lb', 'api'].includes(n))
        .reduce((s, n) => s + state.live[n].rps, 0) / 3;
      $('tiThr').textContent = Math.round(thr).toLocaleString('en-US') + '/s';
      $('tiErr').textContent = (Math.random() < 0.12 ? 0.01 : 0.00).toFixed(2) + '%';
    }

    function metricRows(m) {
      // Simulated teaching values — not measurements from a running system.
      return [
        { k: 'Response p50 (sim)', v: fmtMs(m.p50) },
        { k: 'Response p99 (sim)', v: fmtMs(m.p99) },
        { k: 'Flow rate (sim)', v: Math.round(m.rps).toLocaleString('en-US') + '/s' },
        { k: 'Connections (sim)', v: String(m.conn) }
      ];
    }

    function renderSpark() {
      const line = $('tiSparkLine');
      if (!line) return;
      const pts = state.spark.map((v, i) => {
        const x = (i / Math.max(1, state.spark.length - 1)) * 120;
        const mn = Math.min(...state.spark), mx = Math.max(...state.spark);
        const y = 28 - ((v - mn) / Math.max(0.001, mx - mn)) * 24;
        return x.toFixed(1) + ',' + y.toFixed(1);
      }).join(' ');
      line.setAttribute('points', pts);
    }

    function select(nodeId) {
      state.selected = nodeId;
      Object.values(nodeEls).forEach(g => g.classList.remove('selected'));
      nodeEls[nodeId].classList.add('selected');

      Object.values(edgeEls).forEach(g => g.classList.remove('hot'));
      incident[nodeId].forEach(id => edgeEls[id] && edgeEls[id].classList.add('hot'));

      const info = NODES[nodeId];
      $('tiEmpty').hidden = true;
      $('tiDetail').hidden = false;
      $('tiName').textContent = info.name;
      $('tiRole').textContent = info.desc;
      $('tiTech').innerHTML = info.tech.map(t => `<span class="ti-chip">${t}</span>`).join('');
      $('tiMetrics').innerHTML = metricRows(state.live[nodeId]).map(r =>
        `<div class="ti-metric"><span class="v">${r.v}</span><span class="k">${r.k}</span></div>`).join('');
      const depsEl = $('tiDeps');
      depsEl.innerHTML = info.deps.length
        ? info.deps.map(d => `<button class="ti-dep" data-dep="${d}">${NODES[d].name}</button>`).join('')
        : '<span class="ti-none">none — edge of the diagram</span>';
      depsEl.querySelectorAll('.ti-dep').forEach(b =>
        b.addEventListener('click', () => select(b.dataset.dep)));
      state.spark = Array.from({ length: 14 }, () => jitter(info.m.rps, 0.18));
      renderSpark();
      setSysPanel();
      announce(`CONCEPT · ${info.name} — ${info.role.toLowerCase()}`);
    }

    /* ---------------- component interactions ---------------- */
    Object.entries(nodeEls).forEach(([id, g]) => {
      g.addEventListener('click', () => select(id));
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(id); }
      });
      if (window.matchMedia && window.matchMedia('(hover: hover)').matches) {
        g.addEventListener('mouseenter', () => showTooltip(id, g));
        g.addEventListener('mouseleave', hideTooltip);
        g.addEventListener('focus', () => showTooltip(id, g));
        g.addEventListener('blur', hideTooltip);
      }
    });
    stage && stage.addEventListener('mouseleave', hideTooltip);

    /* ---------------- simulated metric ticker ---------------- */
    function tick() {
      Object.keys(NODES).forEach(n => {
        const base = NODES[n].m;
        state.live[n].p50 = jitter(base.p50, 0.1);
        state.live[n].p99 = jitter(base.p99, 0.12);
        state.live[n].rps = jitter(base.rps, 0.08);
      });
      state.reqs += 6 + Math.floor(Math.random() * 26);

      if (state.selected) {
        const m = state.live[state.selected];
        $('tiMetrics').innerHTML = metricRows(m).map(r =>
          `<div class="ti-metric"><span class="v">${r.v}</span><span class="k">${r.k}</span></div>`).join('');
        state.spark.push(m.rps);
        if (state.spark.length > 24) state.spark.shift();
        renderSpark();
      }
      setSysPanel();

      const up = Math.floor((Date.now() - state.startedAt) / 1000);
      const hh = String(Math.floor(up / 3600)).padStart(2, '0');
      const mm = String(Math.floor((up % 3600) / 60)).padStart(2, '0');
      const ss = String(up % 60).padStart(2, '0');
      const clock = $('topoClock');
      if (clock) clock.textContent = `SESSION ${hh}:${mm}:${ss}`;
    }
    setInterval(tick, 1600);
    tick();

    /* ---------------- request trace ---------------- */
    const traceDot = $('topoTrace');

    function flashNode(id, cls) {
      const g = nodeEls[id];
      if (!g) return;
      g.classList.add(cls || 'flash');
      setTimeout(() => g.classList.remove(cls || 'flash'), 480);
    }

    function moveDot(edgeId, reverse, ms) {
      return new Promise((resolve) => {
        const path = edgeEls[edgeId] && edgeEls[edgeId].querySelector('.te');
        if (!traceDot || !path || typeof path.getTotalLength !== 'function' ||
            typeof path.getPointAtLength !== 'function') {
          // fallback (and reduced-motion path): flash both endpoints
          const e = EDGES.find(x => x.id === edgeId);
          flashNode(e.a); setTimeout(() => flashNode(e.b), ms * 0.5);
          setTimeout(resolve, ms);
          return;
        }
        if (reducedMotion) { setTimeout(resolve, 90); return; }
        const L = path.getTotalLength();
        const t0 = performance.now();
        traceDot.hidden = false;
        const step = (now) => {
          const p = Math.min(1, (now - t0) / ms);
          const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          const pt = path.getPointAtLength((reverse ? 1 - ease : ease) * L);
          traceDot.setAttribute('transform', `translate(${pt.x}, ${pt.y})`);
          if (p < 1) requestAnimationFrame(step);
          else { traceDot.hidden = true; resolve(); }
        };
        requestAnimationFrame(step);
      });
    }

    async function edgePulse(edgeId) {
      const g = edgeEls[edgeId];
      if (g) { g.classList.add('hot'); }
    }

    async function sendRequest() {
      if (state.tracing) return;
      state.tracing = true;
      const btn = $('topoSendBtn');
      btn && btn.classList.add('busy');
      hideTooltip();

      const flow = FLOWS[Math.floor(Math.random() * FLOWS.length)];
      state.reqs += 1;
      const hop = reducedMotion ? 90 : 460;

      for (const id of flow.fwd) { edgePulse(id); await moveDot(id, false, hop); }
      await new Promise(r => setTimeout(r, reducedMotion ? 40 : 260));
      for (const id of flow.back) { await moveDot(id, true, hop * 0.8); }

      const e = EDGES.find(x => x.id === flow.fwd[flow.fwd.length - 1]);
      flashNode(e.b);
      announce(`▲ SIMULATED TRACE #${state.reqs.toLocaleString('en-US')} — ${flow.label} — ~${Math.round(jitter(24, 0.3))}ms (simulated)`);
      Object.values(edgeEls).forEach(g => setTimeout(() => g.classList.remove('hot'), 600));
      btn && btn.classList.remove('busy');
      state.tracing = false;
    }

    /* ---------------- highlight all ---------------- */
    function pingMesh() {
      svg.classList.add('surge');
      announce('◎ HIGHLIGHT ALL · 8/8 components of the concept diagram · values are simulated');
      Object.keys(nodeEls).forEach((n, i) =>
        setTimeout(() => flashNode(n), i * 90));
      setTimeout(() => svg.classList.remove('surge'), 1400);
    }

    const sendBtn = $('topoSendBtn');
    sendBtn && sendBtn.addEventListener('click', sendRequest);
    const pingBtn = $('topoPingBtn');
    pingBtn && pingBtn.addEventListener('click', pingMesh);

    announce('LEARNING MODE — 8 common backend components · every value is simulated · click a component to explore its role', 5600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
