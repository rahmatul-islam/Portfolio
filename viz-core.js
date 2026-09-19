/* ==========================================================================
   VIZ CORE — pure data-structure logic (zero DOM).
   Binary Search Tree used by the Java DSA & Problem-Solving Visualizer
   (section 2.4). Loaded by the browser as window.VizCore.

   The tree records every comparison as an animation step so the UI can show
   the algorithm one step at a time — the same structure I practise in Java.
   ========================================================================== */
(function (root) {
  'use strict';

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

  const VizCore = { BST, BSTNode };
  if (typeof module !== 'undefined' && module.exports) module.exports = VizCore;
  if (root) root.VizCore = VizCore;
})(typeof window !== 'undefined' ? window : globalThis);
