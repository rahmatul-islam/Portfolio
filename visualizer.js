/* ==========================================================================
   JAVA DSA & PROBLEM-SOLVING VISUALIZER — UI (section 2.4)

   A step-by-step educational simulation of a Binary Search Tree: insert,
   delete and four traversals, showing the algorithm steps, the processing
   queue / recursion stack and the data structure state as it runs.

   This is a simulated learning demo only — it is not connected to any
   running application, and it reports no real metrics.

   Requires: viz-core.js (window.VizCore.BST), markup in index.html,
             visualizer.css
   ========================================================================== */
(function () {
  'use strict';
  if (typeof document === 'undefined') return;

  const C = window.VizCore;
  const $ = (id) => document.getElementById(id);

  /* ========================================================================
     STATE
     ======================================================================== */
  const state = {
    bst: null,
    bstTimer: null,
    bstBusy: false,
    reducedMotion: false
  };

  try { state.reducedMotion = localStorage.getItem('ratul_motion') === 'reduced'; } catch (e) {}

  /* ========================================================================
     BINARY SEARCH TREE LAB
     ======================================================================== */
  const SVG_NS = 'http://www.w3.org/2000/svg';

  function bstRender(highlightV, newNodeV) {
    const t = state.bst;
    const svg = $('vpTreeSvg');
    if (!t || !svg) return;
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

    // data structure state
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
    if (!box) return;
    box.innerHTML = labels.length
      ? labels.map(v => `<span class="vp-chip ${cls || ''}">${v}</span>`).join('')
      : '<span class="vp-dim">empty</span>';
  }

  function bstOutPanel(out) {
    const box = $('vpBstOut');
    if (!box) return;
    box.innerHTML = out.length
      ? out.map(v => `<span class="vp-chip out">${v}</span>`).join('')
      : '<span class="vp-dim">[ ]</span>';
  }

  function bstStatus(msg) {
    const el = $('vpBstStatus');
    if (el) el.textContent = msg;
  }

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
    if (!res.created) { bstStatus(`${v} already in tree — a BST holds unique keys`); return; }
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
    bstStatus('random tree generated — try a traversal or delete a node');
  }

  /* ========================================================================
     WIRING
     ======================================================================== */
  function init() {
    const root = $('visualizer');
    if (!root || !C || !C.BST) return;

    // reduced motion (button + OS preference)
    if (state.reducedMotion) root.classList.add('reduce-motion');
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      state.reducedMotion = true;
      root.classList.add('reduce-motion');
    }

    const motionBtn = $('vpMotion');
    motionBtn?.addEventListener('click', () => {
      state.reducedMotion = !state.reducedMotion;
      root.classList.toggle('reduce-motion', state.reducedMotion);
      try { localStorage.setItem('ratul_motion', state.reducedMotion ? 'reduced' : 'full'); } catch (e) {}
      motionBtn.textContent = state.reducedMotion ? '🌀 Motion: Reduced' : '🌀 Motion: Full';
    });

    // BST controls
    const bstInput = $('vpBstInput');
    const val = () => {
      const v = parseInt(bstInput.value, 10);
      if (Number.isNaN(v) || v < 0 || v > 999) { bstStatus('enter a number 0–999'); return null; }
      return v;
    };
    $('vpBstInsert')?.addEventListener('click', () => { const v = val(); if (v != null) { bstInsert(v); bstInput.value = ''; } });
    $('vpBstDelete')?.addEventListener('click', () => { const v = val(); if (v != null) bstDelete(v); });
    bstInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const v = val(); if (v != null) { bstInsert(v); bstInput.value = ''; } }
    });
    $('vpBstRandom')?.addEventListener('click', bstRandom);
    $('vpBstClear')?.addEventListener('click', () => { if (state.bstBusy) bstStopTimer(); state.bst = new C.BST(); bstRender(); bstOutPanel([]); bstStatus('tree cleared'); });
    document.querySelectorAll('[data-trav]').forEach(b => b.addEventListener('click', () => bstTraverse(b.dataset.trav)));

    // boot — a small ready-made tree so the demo is never empty on load
    state.bst = new C.BST([50, 30, 70, 20, 40, 60, 80, 35]);
    bstRender();
    bstStatus('BST ready — insert a value or run a traversal.');
    if (motionBtn) motionBtn.textContent = state.reducedMotion ? '🌀 Motion: Reduced' : '🌀 Motion: Full';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
