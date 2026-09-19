# Section 2.4 — Concurrency & DSA Learning Labs — Architecture Notes

> Companion doc for section 2.4 of the portfolio. The implementation lives in
> `viz-core.js` (pure simulation / data-structure logic, zero DOM) +
> `visualizer.js` (UI rendering) + `visualizer.css` (styling).

---

## 1. What this component is

Section 2.4 contains **two browser-based educational simulations**, switched with the
*Concurrency Lab* / *BST Lab* tabs in the section header:

1. **Go Concurrency Lab** — a discrete-event model of the producer → buffered channel →
   worker-pool pattern, including blocking sends (backpressure), failures and retries.
2. **BST Lab** — a step-by-step simulation of a Binary Search Tree, the kind of data
   structure practised in Java while learning Data Structures and Algorithms.

Both labs are **simulated learning demos**:

- they run entirely in the browser as plain JavaScript,
- they are **not** connected to any backend, service, WebSocket or real dataset,
- **no Go code is compiled or executed** — the Go snippet in the Concurrency Lab is a
  read-only reference that is highlighted to match the simulated phase,
- **no real goroutines, channels or workers are running**; the "Goroutines" counter and
  every other metric is output of the JavaScript model, not a measurement,
- they report **no** real traffic, throughput, uptime or deployment status.

The Concurrency Lab shows this disclaimer directly above its controls:

> This is a browser-based educational simulation. It visualizes Go concurrency concepts
> but does not execute Go code or run a live backend.

## 2. Component breakdown

### 2.1 Go Concurrency Lab

| Component | File | Responsibility |
|---|---|---|
| `Scheduler` | `viz-core.js` | Discrete-event model (1 tick = 100 ms of simulated time): producer patterns (slow / normal / burst), buffered channel with capacity 0–10 (capacity 0 = unbuffered rendezvous), worker pool with IDLE / RECEIVED / RUNNING / RETRYING states, failure rate, retry limit, blocked senders, live worker resize, per-tick event list, derived metrics (queue length, active workers, throughput over a 5 s window, average latency, simulated goroutine count). Pure logic, zero DOM. |
| `PRESETS` | `viz-core.js` | Five scenarios: Normal Load, Burst Traffic, Slow Workers, Failure & Retry, Backpressure Demo. |
| Pipeline renderer | `visualizer.js` | Draws the producer card, the channel slot strip (`#vpSlots`), the "parked on send" badge and one card per simulated worker (`#vpWorkers`). |
| Metrics + log | `visualizer.js` | Updates the metric tiles (`Queue`, `Active`, `Done`, `Failed`, `Retried`, `Tasks/s`, `Avg latency`, `Goroutines`, simulated clock) and the lifecycle event log (`#vpLog`, newest first, capped at 42 rows). |
| Code panel | `visualizer.js` | Highlights the line of the reference snippet that matches the last simulated event (`spawn`, `send`, `recv`, `proc`, `retry`, `done`). The snippet is never executed. |
| Transport | `visualizer.js` | Play / Pause (`Space`), Step (`S`), Reset (`R`), manual `+ Push Task`, and `Share`, which encodes the scenario into URL query parameters (`w`, `buf`, `prod`, `proc`, `fail`, `retry`, optional `auto=1`). Keyboard shortcuts only fire while the section is in view and no input / terminal is focused. |
| Controls | `index.html` | Workers (1–8, applied live), Channel Buffer (resets the simulation because channels are fixed-size), Producer, Processing, Fail %, Retries, and the preset buttons. |

### 2.2 BST Lab

| Component | File | Responsibility |
|---|---|---|
| `BST` | `viz-core.js` | Insert / delete (leaf, one-child, two-children cases) / four traversals (in, pre, post, level), step recording, SVG layout (in-order x, depth y), size & height stats. Pure logic, zero DOM. |
| `BSTNode` | `viz-core.js` | Single tree node (value, left, right). |
| Tree renderer | `visualizer.js` | Draws the tree into `#vpTreeSvg`, highlights the node the algorithm is currently visiting, updates the *Data Structure State* panel (`n`, height, balanced ≈ ⌈log₂ n⌉, shape chip). |
| Step player | `visualizer.js` | Plays recorded steps on a timer so the visitor sees *Algorithm Steps* one at a time; honours the Motion toggle and the OS `prefers-reduced-motion` setting. |
| Panels | `visualizer.js` | *Processing Queue / Recursion Stack*, *Completed Solution · Traversal Output*, *Step-by-Step Execution* status line. |
| Controls | `index.html` | Problem Input (0–999), Insert, Delete, Random, Clear, and the four traversal buttons. |

### 2.3 Shared

| Component | File | Responsibility |
|---|---|---|
| Tabs | `visualizer.js` | `#vpTabPool` / `#vpTabBST` toggle the `hidden` attribute on `#vpPoolView` / `#vpBSTView`. Concurrency Lab is shown first. |
| Motion toggle | `visualizer.js` | `#vpMotion` toggles the `reduce-motion` class on the section and persists the choice in `localStorage` (`ratul_motion`); the OS reduced-motion preference is also respected. |
| Badges | `index.html` | `● SIMULATED LEARNING DEMO` and `GO CONCEPTS · JAVA DSA` in the section header. |

## 3. UI labels

| Label in the UI | Meaning |
|---|---|
| Concurrency Lab / BST Lab | Tab switch between the two simulations |
| Normal Load … Backpressure Demo | Preset scenarios for the worker-pool model |
| PRODUCER / `chan Task [cap n]` / Worker #k | Simulated producer, channel buffer slots and simulated workers |
| Queue, Active, Done, Failed, Retried, Tasks/s, Avg latency, Goroutines | Metrics computed by the JavaScript model (simulated, not measured) |
| Reference snippet (not executed) | Read-only Go worker-pool snippet used to explain the pattern |
| Problem Input | The value inserted into / deleted from the tree |
| Algorithm Steps | The traversal buttons that run an algorithm step by step |
| Data Structure State | Node count, height, balance estimate and tree shape |
| Processing Queue / Recursion Stack | The queue (level-order) or stack (depth-first) used while the algorithm runs |
| Completed Solution · Traversal Output | The output produced by the traversal |
| Step-by-Step Execution | Status line describing the current comparison or operation |
| Simulated Learning Demo | Reminder that nothing here is a running application |

## 4. Design constraints respected

- The visual design of section 2.4 is unchanged: same card, panels, chips, tree SVG,
  badges, tab buttons and Motion toggle as the rest of the Skills section.
- The Concurrency Lab is framed everywhere (badge, disclaimer paragraph, code-panel
  caption, clock caption, source-file headers) as a browser-based simulation of Go
  concurrency *concepts*. It does not claim that Go code executes, that a live Go
  backend exists, or that real production workers / channels / goroutines are running.
- No performance, uptime, user-count or deployment claim is made anywhere in the section.
- `viz-core.js` has no DOM dependency and also loads under Node (`module.exports`), so
  both models can be exercised headlessly.
