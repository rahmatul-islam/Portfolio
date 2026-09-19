# Java DSA & Problem-Solving Visualizer — Architecture Notes

> Companion doc for section 2.4 of the portfolio. The implementation lives in
> `viz-core.js` (pure data-structure logic) + `visualizer.js` (UI rendering) +
> `visualizer.css` (styling).

---

## 1. What this component is

An **educational, step-by-step simulation** of a Binary Search Tree (BST) — the kind of
data structure practised in Java while learning Data Structures and Algorithms.

It is a **simulated learning demo**:

- it runs entirely in the browser,
- it is **not** connected to any backend, service or real dataset,
- it reports **no** real metrics, traffic, uptime or deployment status.

## 2. Component breakdown

| Component | File | Responsibility |
|---|---|---|
| `BST` | `viz-core.js` | Insert / delete (leaf, one-child, two-children cases) / four traversals (in, pre, post, level), step recording, SVG layout (in-order x, depth y), size & height stats. Pure logic, zero DOM. |
| `BSTNode` | `viz-core.js` | Single tree node (value, left, right). |
| Tree renderer | `visualizer.js` | Draws the tree into `#vpTreeSvg`, highlights the node the algorithm is currently visiting, updates the *Data Structure State* panel (`n`, height, balanced ≈ ⌈log₂ n⌉, shape chip). |
| Step player | `visualizer.js` | Plays recorded steps on a timer so the visitor sees *Algorithm Steps* one at a time; honours the Motion toggle and the OS `prefers-reduced-motion` setting. |
| Panels | `visualizer.js` | *Processing Queue / Recursion Stack*, *Completed Solution · Traversal Output*, *Step-by-Step Execution* status line. |
| Controls | `index.html` | Problem Input (0–999), Insert, Delete, Random, Clear, and the four traversal buttons. |

## 3. UI labels

| Label in the UI | Meaning |
|---|---|
| Problem Input | The value inserted into / deleted from the tree |
| Algorithm Steps | The traversal buttons that run an algorithm step by step |
| Data Structure State | Node count, height, balance estimate and tree shape |
| Processing Queue / Recursion Stack | The queue (level-order) or stack (depth-first) used while the algorithm runs |
| Completed Solution · Traversal Output | The output produced by the traversal |
| Step-by-Step Execution | Live status line describing the current comparison or operation |
| Simulated Learning Demo | Reminder that nothing here is a running application |
| Java DSA Practice | The tree is the structure practised in Java |

## 4. Design constraints respected

- The visual design of section 2.4 is unchanged: same card, panels, chips, tree SVG,
  badges and Motion toggle.
- No concurrency, worker-pool, goroutine, channel or Go source code is shown or claimed.
- No performance, uptime, user-count or deployment claim is made anywhere in the section.
