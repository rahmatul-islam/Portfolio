# Live Go Concurrency & DSA Execution Visualizer — Architecture Plan

> Companion doc for section 2.4 of the portfolio. The frontend implementation lives in
> `viz-core.js` (pure logic) + `visualizer.js` (UI) + `visualizer.css`.
> The optional real backend lives in `backend/main.go`.

---

## 1. Architecture Plan — Frontend-only vs Frontend + Go Backend

| | Frontend-only (shipped default) | Frontend + Go backend (optional) |
|---|---|---|
| Deploy target | Static (Vercel, current setup) | Backend needs a host (Fly.io / Railway / VPS); or Vercel Go function |
| Event source | Discrete-event simulator in JS (`Scheduler.tick()` at 100 ms logical ticks) | Real goroutines + real channels; events streamed over WebSocket |
| Fidelity | Pedagogically exact (same semantics: blocking sends, rendezvous for cap 0, retry requeue goroutines that can themselves block) | Literally real — metrics are measured, not simulated |
| Latency/recruiter appeal | Instant load, shareable URLs, works offline | "Live backend" badge, real `goroutine` count from `runtime.NumGoroutine()` |
| Failure mode | None | WS disconnect → auto-fallback to SIMULATED mode |

**Decision:** ship frontend-only as the default (the portfolio must never break), and wire a
`?backend=wss://…` escape hatch. The UI shows an honest `● SIMULATED` vs `● LIVE` badge.
When a backend URL is present the frontend opens one WebSocket, sends the config, and
consumes the *same event schema* the local simulator emits — so the entire rendering layer
is shared.

```
┌──────────────────────────── Browser ────────────────────────────┐
│  Controls ──► Config                                            │
│                 │                                               │
│     ┌───────────▼───────────┐                                   │
│     │ EventSource (pluggable)│                                   │
│     │  • Scheduler (local)   │  ← default                        │
│     │  • WebSocket (Go)      │  ← ?backend=wss://…               │
│     └───────────┬───────────┘                                   │
│      events: ENQUEUE|BLOCK|RECEIVE|RUN|DONE|FAIL|RETRY|SPAWN    │
│      ┌──────────┼──────────────┬──────────────┐                 │
│      ▼          ▼              ▼              ▼                 │
│  Pipeline    MetricsPanel   CodePanel      EventLog             │
│  (workers,   (queue, thruput,(line          (lifecycle trace)   │
│   channel)    latency, goro) highlight)                          │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Breakdown

| Component | File | Responsibility |
|---|---|---|
| `Scheduler` | `viz-core.js` | Discrete-event sim of producer/channel/workers/retries. Pure logic, zero DOM, unit-testable in Node. |
| `BST` | `viz-core.js` | Insert/delete (3 cases)/4 traversals, step recording, layout (in-order x, depth y), height/complexity stats. |
| `Controls` | `visualizer.js` | Play/Pause/Step/Reset, config selects, presets, keyboard (Space/S/R), share-link. |
| `WorkerPool` (pipeline view) | `visualizer.js` | Producer box (incl. **blocked-on-send** state), channel slot strip, worker cards with state chips. |
| `MetricsPanel` | `visualizer.js` | Queue length, active workers, completed/failed/retried, throughput (5 s window), avg latency, simulated goroutine count. |
| `CodePanel` | `visualizer.js` | Go snippet with per-line ids; highlights the line matching the current event; channel size / worker count in code update live. |
| `EventLog` | `visualizer.js` | Capped ring of `Task #7 queued → Worker #2 picked → …` traces. |
| `DSAVisualizer` | `visualizer.js` | SVG BST with animated insert path / delete cases / inorder-pre-post-level traversals, recursion stack, output array, complexity chips. |

---

## 3. Go Worker Pool (real, backend/main.go)

Core pattern — retries as requeue-through-the-channel (so backpressure applies to retries too):

```go
func worker(ctx context.Context, id int, jobs chan Task, results chan Result, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			return
		case t, ok := <-jobs:
			if !ok {
				return // channel closed
			}
			res := process(t) // simulated failure if rand < failRate

			if res.Err != nil && t.Attempt <= t.MaxRetries {
				go func(t Task) {
					time.Sleep(200 * time.Millisecond) // retry backoff
					jobs <- t.Retry()                  // blocks if buffer full!
				}(t)
			}
			results <- res
		}
	}
}
```

Key teaching points encoded in both the Go code and the JS sim:

- `jobs <- t` **blocks when the buffer is full** → the producer goroutine shows `BLOCKED`,
  and with `cap 0` every send is a rendezvous (hand-off only when a worker is already waiting).
- A retry is `go func() { jobs <- t.retry() }()` — a *new goroutine* that can itself block.
  The goroutine counter includes blocked requeue goroutines.
- `close(jobs)` + `range` = clean drain; workers exit via `ctx.Done()` on reset.

Full runnable server (WS config in, events out) → [`backend/main.go`](../backend/main.go).

Run it:

```bash
cd backend
go mod tidy        # pulls gorilla/websocket
go run .           # :8080  →  ws://localhost:8080/ws
# frontend:  index.html?backend=ws://localhost:8080/ws
```

---

## 4. Frontend Structure (vanilla JS, no build step)

```
viz-core.js        ← pure: Scheduler, BST, presets (module.exports for Node tests)
visualizer.js      ← DOM: renders events → pipeline/metrics/log/code; BST SVG player
visualizer.css     ← section styles, states, reduced-motion
index.html         ← section 2.4 shell: tabs (Concurrency Lab / BST Lab), controls, panels
```

Deliberately no React/framework: the portfolio is zero-build static hosting; the sim core is
framework-agnostic anyway (it emits plain event objects — could feed a React/Canvas/SVG layer).

Event schema (shared by sim and Go backend):

```json
{ "type": "ENQUEUE|BLOCK|RECEIVE|RUN|DONE|FAIL|RETRY|SPAWN|EXIT",
  "task": {"id": 7, "attempt": 2},
  "worker": 2,
  "state": {"queue": 3, "blocked": 1, "goroutines": 6, "t": 4200} }
```

---

## 5. Implementation Roadmap

- **Phase 1 — Sim core (done):** `Scheduler` with logical clock, blocking semantics, retries; Node-runnable.
- **Phase 2 — Pipeline UI (done):** producer/channel/workers rendering, lifecycle chips, event log, metrics.
- **Phase 3 — Code link + controls (done):** line-highlighted Go panel, Play/Pause/Step/Reset, keyboard, presets, URL sharing, reduced motion.
- **Phase 4 — DSA lab (done):** BST insert/delete/traversal animation, recursion stack, output array, complexity readout.
- **Phase 5 — Live backend (optional):** deploy `backend/` to Fly.io, add `wss://` URL, flip badge to LIVE; add p99 latency + `runtime.NumGoroutine()` real readings; later gRPC variant of the same stream.

---

## 6. Scenario Presets & Expected Behavior

| Preset | Config | Expected behavior |
|---|---|---|
| **Normal Load** | w=3, buf=5, producer=normal, proc=normal, fail=0% | Queue hovers near 0–2; workers cycle IDLE→RUNNING; zero FAILs. |
| **Burst Traffic** | w=4, buf=5, producer=burst, proc=fast, fail=0% | 4 rapid ENQUEUEs fill slots, then drain; queue sawtooth 0→5→0. |
| **Slow Workers** | w=2, buf=5, producer=normal, proc=slow, fail=0% | Buffer saturates → producer BLOCKED; throughput ≈ 2/proc-time; queue pinned at 5. |
| **Failure & Retry** | w=3, buf=5, fail=25%, retry=3 | FAIL flashes → RETRYING → re-queued with `attempt+1`; a task only dies after 4 consecutive failures (rare). |
| **Backpressure Demo** | w=1, buf=1, producer=normal, proc=slow, fail=0%, retry=0 | Producer blocked most of the time; retry goroutines (if enabled) pile up blocked on send; goroutine count grows. |

URL sharing: `?w=4&buf=5&prod=burst&proc=fast&fail=25&retry=3&auto=1`
(fields also round-trip through the **Share** button which copies a ready URL).

### Keyboard

| Key | Action | Guard |
|---|---|---|
| `Space` | Play / Pause | only when the visualizer section is on-screen and no input is focused |
| `S` | Step one 100 ms tick | same guard |
| `R` | Reset | same guard |

Accessibility: `prefers-reduced-motion` respected + manual motion toggle (persisted),
aria-labels on all controls, tooltips on every metric, focus-visible styles.
