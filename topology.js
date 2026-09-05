/* ==========================================================================
   SYSTEM TOPOLOGY SIMULATOR v2 — interaction engine
   Tooltip · Inspector · live metric ticker · request trace · ping surge
   Requires: #topoSvg markup in index.html. No dependencies.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Node knowledge base (technical strings intentionally English —
     like a real observability tool; UI chrome is bilingual via i18n)
     ------------------------------------------------------------------ */
  const NODES = {
    client: {
      name: 'CLIENT', role: 'Traffic Source',
      desc: 'Browsers & mobile clients issuing HTTPS requests against the public edge.',
      tech: ['HTTPS', 'WSS', 'GLOBAL'],
      m: { p50: 42, p99: 118, rps: 1240, conn: 'global' },
      deps: []
    },
    lb: {
      name: 'LOAD BALANCER', role: 'L7 Reverse Proxy',
      desc: 'Nginx terminates TLS, health-checks upstreams and spreads load round-robin.',
      tech: ['NGINX', 'TLS 1.3'],
      m: { p50: 1.2, p99: 4.8, rps: 1240, conn: '4.2k' },
      deps: ['api']
    },
    api: {
      name: 'API SERVICE', role: 'Go Microservice',
      desc: 'Stateless REST/gRPC handlers — auth, validation, orchestration. Scales horizontally.',
      tech: ['GO', ':8080', 'GRPC'],
      m: { p50: 6.4, p99: 28, rps: 1240, conn: '512' },
      deps: ['redis', 'postgres', 'queue']
    },
    redis: {
      name: 'REDIS', role: 'Cache · Pub/Sub',
      desc: 'In-memory cache for hot reads (94% hit rate) and ephemeral pub/sub fan-out.',
      tech: ['RESP', 'TTL 300S'],
      m: { p50: 0.4, p99: 1.6, rps: 3900, conn: '256' },
      deps: []
    },
    queue: {
      name: 'TASK QUEUE', role: 'Buffered Channel',
      desc: 'Bounded task buffer (cap 5) applying backpressure to the async pipeline.',
      tech: ['CAP 5', 'FIFO'],
      m: { p50: 0.2, p99: 2.1, rps: 180, conn: 'chan' },
      deps: ['worker']
    },
    worker: {
      name: 'WORKER', role: 'Goroutine Pool',
      desc: 'Async task processors with exponential-backoff retries and dead-letter handling.',
      tech: ['GO', 'xN POOL'],
      m: { p50: 14, p99: 62, rps: 180, conn: '32' },
      deps: ['postgres', 'storage']
    },
    postgres: {
      name: 'POSTGRES', role: 'Primary Cluster',
      desc: 'System of record — full-text search, JSONB, PITR backups every 5 minutes.',
      tech: ['SQL', 'PITR'],
      m: { p50: 2.8, p99: 15, rps: 940, conn: '128' },
      deps: []
    },
    storage: {
      name: 'OBJECT STORAGE', role: 'S3-Compatible Blobs',
      desc: 'Durable artifact storage with presigned URLs and lifecycle policies.',
      tech: ['MINIO', 'S3 API'],
      m: { p50: 8.1, p99: 44, rps: 95, conn: '—' },
      deps: []
    }
  };

  const EDGES = [
    { id: 'client-lb',     a: 'client',  b: 'lb' },
    { id: 'lb-api',        a: 'lb',      b: 'api' },
    { id: 'api-redis',     a: 'api',     b: 'redis' },
    { id: 'api-queue',     a: 'api',     b: 'queue' },
    { id: 'queue-worker',  a: 'queue',   b: 'worker' },
    { id: 'worker-pg',     a: 'worker',  b: 'postgres' },
    { id: 'worker-storage',a: 'worker',  b: 'storage' },
    { id: 'api-pg',        a: 'api',     b: 'postgres' }
  ];

  const FLOWS = [
    {
      label: 'GET /api/tasks · cache HIT @ REDIS',
      fwd: ['client-lb', 'lb-api', 'api-redis'],
      back: ['api-redis', 'lb-api', 'client-lb']
    },
    {
      label: 'POST /api/tasks · 202 Accepted (async)',
      fwd: ['client-lb', 'lb-api', 'api-queue', 'queue-worker', 'worker-pg', 'worker-storage'],
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

    /* ---------------- live state ---------------- */
    const state = {
      selected: null,
      reqs: 4812 + Math.floor(Math.random() * 400),
      startedAt: Date.now(),
      live: {},       // per-node jittered metrics
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
      $('tiThr').textContent = Math.round(thr).toLocaleString('en-US') + ' rps';
      $('tiErr').textContent = (Math.random() < 0.12 ? 0.01 : 0.00).toFixed(2) + '%';
    }

    function metricRows(m) {
      return [
        { k: 'P50 latency', v: fmtMs(m.p50) },
        { k: 'P99 latency', v: fmtMs(m.p99) },
        { k: 'Throughput', v: Math.round(m.rps).toLocaleString('en-US') + ' rps' },
        { k: 'Connections', v: String(m.conn) }
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
        : '<span class="ti-none">none — edge of the graph</span>';
      depsEl.querySelectorAll('.ti-dep').forEach(b =>
        b.addEventListener('click', () => select(b.dataset.dep)));
      state.spark = Array.from({ length: 14 }, () => jitter(info.m.rps, 0.18));
      renderSpark();
      setSysPanel();
      announce(`INSPECT · ${info.name} — ${info.role.toLowerCase()}`);
    }

    /* ---------------- node interactions ---------------- */
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

    /* ---------------- metric ticker ---------------- */
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
      if (clock) clock.textContent = `UP ${hh}:${mm}:${ss}`;
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
      announce(`▲ REQ #${state.reqs.toLocaleString('en-US')} — ${flow.label} — ${Math.round(jitter(24, 0.3))}ms`);
      Object.values(edgeEls).forEach(g => setTimeout(() => g.classList.remove('hot'), 600));
      btn && btn.classList.remove('busy');
      state.tracing = false;
    }

    /* ---------------- ping mesh ---------------- */
    function pingMesh() {
      svg.classList.add('surge');
      announce('◎ PING MESH · 8/8 nodes responded 200 OK · avg 2.1ms');
      Object.keys(nodeEls).forEach((n, i) =>
        setTimeout(() => flashNode(n), i * 90));
      setTimeout(() => svg.classList.remove('surge'), 1400);
    }

    const sendBtn = $('topoSendBtn');
    sendBtn && sendBtn.addEventListener('click', sendRequest);
    const pingBtn = $('topoPingBtn');
    pingBtn && pingBtn.addEventListener('click', pingMesh);

    announce('SYSTEM ONLINE — all 8 components operational · click any node to inspect', 5200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
