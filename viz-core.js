/* ==========================================================================
   VIZ CORE — pure simulation logic (zero DOM).
   Loaded by the browser (window.VizCore) and by Node tests (module.exports).
   1 tick == 100 ms of simulated time.
   ========================================================================== */
(function (root) {
  'use strict';

  const TICK_MS = 100;

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const PRODUCER_PATTERNS = {
    slow:   { every: 10, burst: 1, label: '1 task / 1.0s' },
    normal: { every: 5,  burst: 1, label: '1 task / 0.5s' },
    burst:  { every: 16, burst: 4, label: '4 tasks / 1.6s' }
  };

  const PROCESSING_PROFILES = {
    fast:   () => 8,
    normal: () => 18,
    slow:   () => 34,
    random: () => randInt(6, 30)
  };

  const WORKER_STATE = {
    IDLE: 'IDLE', RECEIVED: 'RECEIVED', RUNNING: 'RUNNING', RETRYING: 'RETRYING'
  };

  /* ------------------------------------------------------------------------
     Scheduler — discrete-event model of producer / channel / worker pool.

     Semantics modeled faithfully:
       - `jobs <- task` blocks when the buffer is full  -> producer BLOCKED
       - capacity 0 = unbuffered: rendezvous only (direct hand-off)
       - a retry is a NEW goroutine `go func(){ jobs <- t.retry() }()` that
         can itself block; it counts toward the goroutine total
       - workers receive via `range`-style pull; RETRYING is a 1-tick flash
     ------------------------------------------------------------------------ */
  class Scheduler {
    constructor(cfg) {
      this.cfg = Object.assign({
        workers: 3, buffer: 5, producer: 'normal', processing: 'normal',
        failRate: 0, maxRetries: 1
      }, cfg);
      this.reset();
    }

    reset() {
      const c = this.cfg;
      this.t = 0;                 // simulated time (ticks)
      this.nextTaskId = 1;
      this.nextWorkerId = c.workers + 1;
      this.channel = [];          // tasks sitting in the buffered channel
      this.blocked = [];          // goroutines blocked on send: {task, since, kind:'prod'|'retry'}
      this.workers = [];
      for (let i = 0; i < c.workers; i++) this.workers.push(this._newWorker(i + 1));
      this.stats = { produced: 0, completed: 0, failed: 0, retried: 0, latencies: [], doneAt: [] };
      this._prodPhase = 0;
    }

    _newWorker(id) {
      return { id, state: WORKER_STATE.IDLE, task: null, remaining: null, closing: false };
    }

    _newTask() { return { id: this.nextTaskId++, attempt: 1, enqAt: this.t }; }

    // ---- derived metrics ----------------------------------------------------
    get capacity()      { return this.cfg.buffer; }
    get pattern()       { return PRODUCER_PATTERNS[this.cfg.producer] || PRODUCER_PATTERNS.normal; }
    get queueLen()      { return this.channel.length; }
    get blockedCount()  { return this.blocked.length; }
    get activeWorkers() {
      return this.workers.filter(w => w.state === WORKER_STATE.RUNNING ||
                                     w.state === WORKER_STATE.RECEIVED).length;
    }
    // main + producer + live workers + every goroutine blocked on send
    get goroutines()    { return 2 + this.workers.length + this.blocked.length; }
    get throughput() { // completions over the last 5 simulated seconds
      const cutoff = this.t - 50;
      return this.stats.doneAt.filter(tt => tt > cutoff).length / 5;
    }
    get avgLatencyMs() {
      const l = this.stats.latencies;
      return l.length ? (l.reduce((a, b) => a + b, 0) / l.length) * TICK_MS : 0;
    }

    // ---- controls -------------------------------------------------------------
    /** "+ Push Task" button — produce immediately, even while paused. */
    manualPush() {
      const ev = [];
      this._produce(ev, true);
      return ev;
    }

    /** live worker resize: spawns goroutines / marks surplus workers "closing" */
    setWorkers(n) {
      const ev = [];
      n = Math.max(1, Math.min(8, n | 0));
      while (this.workers.length < n) {
        const w = this._newWorker(this.nextWorkerId++);
        this.workers.push(w);
        ev.push({ type: 'SPAWN', code: 'spawn', worker: w.id,
                  msg: `go worker(${w.id}, jobs, done) — goroutine spawned` });
      }
      const alive = () => this.workers.filter(w => !w.closing).length;
      while (alive() > n) {
        const cand = this.workers.find(w => !w.closing && w.state === WORKER_STATE.IDLE) ||
                     this.workers.find(w => !w.closing);
        if (!cand) break;
        cand.closing = true;
        ev.push({ type: 'EXIT', code: 'spawn', worker: cand.id,
                  msg: `Worker #${cand.id} received ctx.Done — closing after current task` });
      }
      this.workers = this.workers.filter(w => !(w.closing && w.state === WORKER_STATE.IDLE));
      return ev;
    }

    /** advance exactly one tick; returns the events emitted during the tick */
    tick() {
      const ev = [];
      const c = this.cfg;
      this.t++;

      // 0) RETRYING was a 1-tick flash -> back to IDLE
      for (const w of this.workers) {
        if (w.state === WORKER_STATE.RETRYING) { w.state = WORKER_STATE.IDLE; w.task = null; }
      }

      // 1) RUNNING workers advance; finished tasks resolve
      for (const w of this.workers) {
        if (w.state !== WORKER_STATE.RUNNING) continue;
        w.remaining--;
        if (w.remaining <= 0) this._resolve(w, ev);
      }
      this._dropClosed(ev);

      // 2) RECEIVED -> RUNNING
      for (const w of this.workers) {
        if (w.state !== WORKER_STATE.RECEIVED) continue;
        w.remaining = PROCESSING_PROFILES[c.processing]();
        w.state = WORKER_STATE.RUNNING;
        ev.push({ type: 'RUN', code: 'proc', worker: w.id, task: w.task,
                  msg: `process(task #${w.task.id}) on Worker #${w.id} — eta ${(w.remaining * TICK_MS) / 1000}s` });
      }

      // 3) idle workers pull: buffer first, then rendezvous with blocked senders
      for (const w of this.workers) {
        if (w.state !== WORKER_STATE.IDLE) continue;
        let task = null;
        if (this.channel.length) task = this.channel.shift();
        else if (this.blocked.length) task = this.blocked.shift().task;
        if (task) {
          w.task = task;
          w.state = WORKER_STATE.RECEIVED;
          ev.push({ type: 'RECEIVE', code: 'recv', worker: w.id, task,
                    msg: `Worker #${w.id} received Task #${task.id}` +
                         (task.attempt > 1 ? ` (attempt ${task.attempt}/${this.cfg.maxRetries + 1})` : '') });
        }
      }

      // 4) freed buffer space lets blocked senders deliver
      while (this.channel.length < this.capacity && this.blocked.length) {
        const b = this.blocked.shift();
        this.channel.push(b.task);
        ev.push({ type: 'ENQUEUE', code: 'send', task: b.task,
                  msg: `${b.kind === 'retry' ? 'Retry goroutine' : 'Producer'} delivered Task #${b.task.id}` +
                       ` into buffer after ${this.t - b.since} tick(s) blocked` });
      }

      // 5) auto producer — but a parked producer goroutine cannot send twice
      const producerParked = this.blocked.some(b => b.kind === 'prod');
      if (!producerParked) {
        const pat = this.pattern;
        if (this._prodPhase >= pat.every + pat.burst) this._prodPhase = 0;
        if (this._prodPhase >= pat.every) this._produce(ev, false);
        this._prodPhase++;
      }

      return ev;
    }

    _produce(ev, manual) {
      const task = this._newTask();
      this.stats.produced++;
      if (this.channel.length < this.capacity) {
        this.channel.push(task);
        ev.push({ type: 'ENQUEUE', code: 'send', task,
                  msg: `${manual ? 'Manual' : 'Producer'} send: Task #${task.id} into buffer (${this.channel.length}/${this.capacity})` });
      } else {
        this.blocked.push({ task, since: this.t, kind: 'prod' });
        ev.push({ type: 'BLOCK', code: 'send', task,
                  msg: this.capacity === 0
                    ? `Unbuffered channel — producer BLOCKED waiting for a receiver (rendezvous semantics)`
                    : `Channel full (${this.capacity}/${this.capacity}) — producer BLOCKED on send (backpressure)` });
      }
    }

    _resolve(w, ev) {
      const task = w.task;
      const failed = Math.random() * 100 < this.cfg.failRate;
      if (failed && task.attempt <= this.cfg.maxRetries) {
        const retryTask = { id: task.id, attempt: task.attempt + 1, enqAt: task.enqAt };
        this.stats.retried++;
        this.blocked.push({ task: retryTask, since: this.t, kind: 'retry' });
        w.state = WORKER_STATE.RETRYING;
        w.task = null;
        ev.push({ type: 'RETRY', code: 'retry', worker: w.id, task: retryTask,
                  msg: `Task #${task.id} FAILED on Worker #${w.id} — retry goroutine re-queuing ` +
                       `(attempt ${retryTask.attempt}/${this.cfg.maxRetries + 1})` });
      } else if (failed) {
        this.stats.failed++;
        w.state = WORKER_STATE.IDLE;
        w.task = null;
        ev.push({ type: 'FAIL', code: 'done', worker: w.id, task,
                  msg: `Task #${task.id} PERMANENTLY FAILED after ${task.attempt} attempt(s) ✗` });
      } else {
        this.stats.completed++;
        this.stats.latencies.push(this.t - task.enqAt);
        if (this.stats.latencies.length > 40) this.stats.latencies.shift();
        this.stats.doneAt.push(this.t);
        if (this.stats.doneAt.length > 200) this.stats.doneAt.shift();
        w.state = WORKER_STATE.IDLE;
        w.task = null;
        ev.push({ type: 'DONE', code: 'done', worker: w.id, task,
                  msg: `Task #${task.id} completed by Worker #${w.id}` +
                       (task.attempt > 1 ? ` (attempt ${task.attempt})` : '') + ' ✓' });
      }
    }

    _dropClosed(ev) {
      const before = this.workers.length;
      this.workers = this.workers.filter(w => !(w.closing && w.state === WORKER_STATE.IDLE));
      if (this.workers.length < before) {
        ev.push({ type: 'EXIT', code: 'spawn', msg: 'closed worker exited (goroutine count decremented)' });
      }
    }
  }

  /* ------------------------------------------------------------------------
     BST — insert/delete/4 traversals with recorded animation steps + layout.
     ------------------------------------------------------------------------ */
  class BSTNode {
    constructor(v) { this.v = v; this.l = null; this.r = null; }
  }

  class BST {
    constructor(seed) { this.root = null; if (seed) seed.forEach(v => this.insert(v)); }

    insert(v) {
      const path = [];
      if (!this.root) { this.root = new BSTNode(v); path.push(v); return { path, created: true }; }
      let cur = this.root;
      for (;;) {
        path.push(cur.v);
        if (v === cur.v) return { path, created: false };          // ignore duplicates
        if (v < cur.v) {
          if (!cur.l) { cur.l = new BSTNode(v); path.push(v); return { path, created: true }; }
          cur = cur.l;
        } else {
          if (!cur.r) { cur.r = new BSTNode(v); path.push(v); return { path, created: true }; }
          cur = cur.r;
        }
      }
    }

    delete(v) {
      const path = [];
      let cur = this.root, parent = null;
      while (cur && cur.v !== v) {
        path.push(cur.v);
        parent = cur;
        cur = v < cur.v ? cur.l : cur.r;
      }
      if (!cur) return { found: false, path };
      path.push(cur.v);

      const detach = (node, p, child) => {
        if (!p) this.root = child;
        else if (p.l === node) p.l = child;
        else p.r = child;
      };

      const info = { found: true, path, case: 'leaf', succ: null, succPath: [] };
      if (cur.l && cur.r) {
        // two children: swap with in-order successor (min of right subtree)
        info.case = 'two-children';
        const spath = [];
        let s = cur.r, sp = cur;
        while (s.l) { spath.push(s.v); sp = s; s = s.l; }
        spath.push(s.v);
        info.succ = s.v;
        info.succPath = spath;
        cur.v = s.v;
        detach(s, sp, s.r); // successor has no left child by construction
      } else {
        const child = cur.l || cur.r;
        info.case = child ? 'one-child' : 'leaf';
        detach(cur, parent, child);
      }
      return info;
    }

    /** step list for UI animation: {t:'enter'|'visit'|'exit', v, stack[], out[]}
        (level-order uses {t:'visit', v, queue[], out[]}) */
    traverse(kind) {
      const steps = [], out = [], stack = [];
      const dfs = (n) => {
        if (!n) return;
        stack.push(n.v);
        steps.push({ t: 'enter', v: n.v, stack: stack.slice(), out: out.slice() });
        if (kind === 'pre')  { out.push(n.v); steps.push({ t: 'visit', v: n.v, stack: stack.slice(), out: out.slice() }); }
        dfs(n.l);
        if (kind === 'in')   { out.push(n.v); steps.push({ t: 'visit', v: n.v, stack: stack.slice(), out: out.slice() }); }
        dfs(n.r);
        if (kind === 'post') { out.push(n.v); steps.push({ t: 'visit', v: n.v, stack: stack.slice(), out: out.slice() }); }
        stack.pop();
        steps.push({ t: 'exit', v: n.v, stack: stack.slice(), out: out.slice() });
      };
      if (kind === 'level') {
        if (this.root) {
          const q = [this.root];
          while (q.length) {
            const n = q.shift();
            out.push(n.v);
            steps.push({ t: 'visit', v: n.v, queue: q.map(x => x.v), out: out.slice() });
            if (n.l) q.push(n.l);
            if (n.r) q.push(n.r);
          }
        }
      } else {
        dfs(this.root);
      }
      return steps;
    }

    size(n = this.root) { return n ? 1 + this.size(n.l) + this.size(n.r) : 0; }

    height(n = this.root) { return n ? 1 + Math.max(this.height(n.l), this.height(n.r)) : 0; }

    /** SVG layout: x by in-order index, y by depth */
    layout(xStep = 52, yStep = 58, pad = 30) {
      const rows = [];
      const pos = new Map();
      let i = 0;
      const walk = (n, d, parent) => {
        if (!n) return;
        walk(n.l, d + 1, n); // left subtree first => in-order index
        const x = pad + i * xStep; i++;
        const y = pad + d * yStep;
        pos.set(n, { x, y });
        rows.push({ n, x, y, d, parent });
        walk(n.r, d + 1, n);
      };
      walk(this.root, 0, null);

      const nodes = rows.map(o => ({ v: o.n.v, x: o.x, y: o.y, d: o.d }));
      const edges = rows
        .filter(o => o.parent)
        .map(o => {
          const p = pos.get(o.parent);
          return { x1: p.x, y1: p.y, x2: o.x, y2: o.y };
        });
      const count = rows.length;
      return {
        nodes, edges,
        width: count ? pad * 2 + (count - 1) * xStep : 0,
        height: pad * 2 + Math.max(0, this.height() - 1) * yStep
      };
    }
  }

  /* ------------------------------------------------------------------------
     Presets
     ------------------------------------------------------------------------ */
  const PRESETS = {
    normal:    { label: 'Normal Load',       cfg: { workers: 3, buffer: 5, producer: 'normal', processing: 'normal', failRate: 0,  maxRetries: 1 } },
    burst:     { label: 'Burst Traffic',     cfg: { workers: 4, buffer: 5, producer: 'burst',  processing: 'fast',   failRate: 0,  maxRetries: 1 } },
    slow:      { label: 'Slow Workers',      cfg: { workers: 2, buffer: 5, producer: 'normal', processing: 'slow',   failRate: 0,  maxRetries: 1 } },
    failretry: { label: 'Failure & Retry',   cfg: { workers: 3, buffer: 5, producer: 'normal', processing: 'normal', failRate: 25, maxRetries: 3 } },
    backpres:  { label: 'Backpressure Demo', cfg: { workers: 1, buffer: 1, producer: 'normal', processing: 'slow',   failRate: 0,  maxRetries: 0 } }
  };

  const VizCore = { TICK_MS, WORKER_STATE, PRODUCER_PATTERNS, PROCESSING_PROFILES, Scheduler, BST, BSTNode, PRESETS };
  if (typeof module !== 'undefined' && module.exports) module.exports = VizCore;
  if (root) root.VizCore = VizCore;
})(typeof window !== 'undefined' ? window : globalThis);
