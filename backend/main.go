// =============================================================================
// Live Worker-Pool Backend — streams real Go channel events over WebSocket.
//
//   go mod tidy
//   go run .            # listens on :8080, endpoint ws://localhost:8080/ws
//
// Frontend: open the portfolio with ?backend=ws://localhost:8080/ws
// The UI badge flips to "LIVE" while the socket is connected.
//
// Design notes:
//   - Every event is serialized through a single mutex-guarded WriteJSON, so
//     goroutines can emit freely.
//   - The "blocked on send" counter wraps every channel send with atomic
//     inc/dec — while a select is parked on `jobs <- t`, the counter is up.
//   - The channel is intentionally NOT closed at shutdown: retry goroutines
//     may still hold sendable tasks, and `send on closed channel` would panic.
//     Workers exit via ctx cancellation instead. (Production code would use a
//     lifecycle owner such as errgroup + a sync.Once-guarded close.)
// =============================================================================
package main

import (
	"context"
	"log"
	"math/rand"
	"net/http"
	"runtime"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
)

// ---- wire types -------------------------------------------------------------

type Config struct {
	Workers        int `json:"workers"`        // 1–8
	Buffer         int `json:"buffer"`         // channel capacity: 0,1,5,10
	ProdIntervalMS int `json:"prodIntervalMs"` // producer period
	BurstSize      int `json:"burstSize"`      // tasks per producer period
	ProcMinMS      int `json:"procMinMs"`      // processing time range
	ProcMaxMS      int `json:"procMaxMs"`
	FailRate       int `json:"failRate"`   // percent 0–30
	MaxRetries     int `json:"maxRetries"` // 0–3
	DurationMS     int `json:"durationMs"` // sim length before clean shutdown
}

type Task struct {
	ID         int `json:"id"`
	Attempt    int `json:"attempt"`
	MaxRetries int `json:"maxRetries"`
}

func (t Task) Retry() Task { t.Attempt++; return t }

type Event struct {
	Type       string `json:"type"` // ENQUEUE|BLOCK|RECEIVE|RUN|DONE|FAIL|RETRY|SPAWN|TICK|SUMMARY
	Task       *Task  `json:"task,omitempty"`
	Worker     int    `json:"worker,omitempty"`
	Msg        string `json:"msg,omitempty"`
	T          int64  `json:"t"` // ms since sim start
	Queue      int    `json:"queue"`
	Blocked    int64  `json:"blocked"`
	Goroutines int    `json:"goroutines"`
	Stats      Stats  `json:"stats"`
}

type Stats struct {
	Produced  int `json:"produced"`
	Completed int `json:"completed"`
	Failed    int `json:"failed"`
	Retried   int `json:"retried"`
}

// ---- sim session (one per WebSocket connection) -----------------------------

type session struct {
	cfg Config

	mu        sync.Mutex // guards conn writes + stats
	conn      *websocket.Conn
	jobs      chan Task
	stats     Stats
	start     time.Time
	blocking  int64 // goroutines currently parked on a channel send
}

// emit mutates stats (optional), stamps metrics, and writes one event.
func (s *session) emit(ev Event, mut ...func(*Stats)) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for _, f := range mut {
		f(&s.stats)
	}
	ev.Stats = s.stats
	ev.T = time.Since(s.start).Milliseconds()
	ev.Queue = len(s.jobs)
	ev.Blocked = atomic.LoadInt64(&s.blocking)
	ev.Goroutines = runtime.NumGoroutine()
	_ = s.conn.WriteJSON(ev)
}

// sendTask performs `jobs <- t`, tracking the blocked-on-send counter.
func (s *session) sendTask(ctx context.Context, t Task) bool {
	atomic.AddInt64(&s.blocking, 1)
	defer atomic.AddInt64(&s.blocking, -1)
	select {
	case s.jobs <- t:
		return true
	case <-ctx.Done():
		return false
	}
}

// ---- worker -----------------------------------------------------------------

func worker(ctx context.Context, s *session, id int, wg *sync.WaitGroup) {
	defer wg.Done()
	s.emit(Event{Type: "SPAWN", Worker: id, Msg: "go worker(id, jobs, done)"})

	for {
		select {
		case <-ctx.Done():
			return
		case t, ok := <-s.jobs:
			if !ok {
				return // channel closed and drained
			}
			s.emit(Event{Type: "RECEIVE", Worker: id, Task: &t, Msg: "task := <-jobs"})
			s.emit(Event{Type: "RUN", Worker: id, Task: &t, Msg: "process(task)"})

			if err := process(ctx, s.cfg); err != nil {
				if t.Attempt <= t.MaxRetries && ctx.Err() == nil {
					s.emit(Event{Type: "RETRY", Worker: id, Task: &t,
						Msg: "failed -> go func(){ jobs <- t.retry() }()"})
					go func(t Task) {
						select {
						case <-time.After(200 * time.Millisecond): // retry backoff
						case <-ctx.Done():
							return
						}
						if s.sendTask(ctx, t.Retry()) {
							// re-queued; backpressure applies to retries too
						}
					}(t)
					s.emit(Event{}, func(st *Stats) { st.Retried++ })
				} else {
					s.emit(Event{Type: "FAIL", Worker: id, Task: &t, Msg: "permanent failure"},
						func(st *Stats) { st.Failed++ })
				}
			} else {
				s.emit(Event{Type: "DONE", Worker: id, Task: &t, Msg: "done <- result"},
					func(st *Stats) { st.Completed++ })
			}
		}
	}
}

func process(ctx context.Context, cfg Config) error {
	d := time.Duration(randInt(cfg.ProcMinMS, cfg.ProcMaxMS)) * time.Millisecond
	select {
	case <-time.After(d):
	case <-ctx.Done():
		return context.Canceled
	}
	if rand.Intn(100) < cfg.FailRate {
		return errFailed
	}
	return nil
}

var errFailed = &simError{"simulated transient failure"}

type simError struct{ s string }

func (e *simError) Error() string { return e.s }

func randInt(min, max int) int {
	if max <= min {
		return min
	}
	return min + rand.Intn(max-min+1)
}

// ---- producer ---------------------------------------------------------------

func producer(ctx context.Context, s *session) {
	for id := 1; ; id++ {
		burst := s.cfg.BurstSize
		if burst < 1 {
			burst = 1
		}
		for b := 0; b < burst; b++ {
			t := Task{ID: id, Attempt: 1, MaxRetries: s.cfg.MaxRetries}
			if !s.sendTask(ctx, t) {
				return
			}
			s.emit(Event{Type: "ENQUEUE", Task: &t, Msg: "jobs <- t"},
				func(st *Stats) { st.Produced++ })
			if s.cfg.Buffer > 0 && len(s.jobs) >= s.cfg.Buffer {
				s.emit(Event{Type: "BLOCK", Task: &t, Msg: "channel full — producer parked on send (backpressure)"})
			}
		}
		select {
		case <-time.After(time.Duration(s.cfg.ProdIntervalMS) * time.Millisecond):
		case <-ctx.Done():
			return
		}
	}
}

// ---- websocket plumbing -----------------------------------------------------

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true }, // demo: allow all origins
}

func handleWS(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade:", err)
		return
	}
	defer conn.Close()

	var cfg Config
	if err := conn.ReadJSON(&cfg); err != nil {
		log.Println("config:", err)
		return
	}
	cfg.Workers = clamp(cfg.Workers, 1, 8)
	cfg.Buffer = clamp(cfg.Buffer, 0, 10)
	cfg.FailRate = clamp(cfg.FailRate, 0, 30)
	cfg.MaxRetries = clamp(cfg.MaxRetries, 0, 3)
	if cfg.ProcMinMS <= 0 {
		cfg.ProcMinMS = 300
	}
	if cfg.ProcMaxMS < cfg.ProcMinMS {
		cfg.ProcMaxMS = cfg.ProcMinMS + 400
	}
	if cfg.ProdIntervalMS <= 0 {
		cfg.ProdIntervalMS = 500
	}
	if cfg.DurationMS <= 0 || cfg.DurationMS > 120_000 {
		cfg.DurationMS = 30_000
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(cfg.DurationMS)*time.Millisecond)
	defer cancel()

	s := &session{cfg: cfg, conn: conn, jobs: make(chan Task, cfg.Buffer), start: time.Now()}
	s.emit(Event{Type: "TICK", Msg: "make(chan Task, buffer)"})

	var wg sync.WaitGroup
	for i := 1; i <= cfg.Workers; i++ {
		wg.Add(1)
		go worker(ctx, s, i, &wg)
	}
	go producer(ctx, s)

	go func() {
		tk := time.NewTicker(500 * time.Millisecond)
		defer tk.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-tk.C:
				s.emit(Event{Type: "TICK", Msg: "runtime.NumGoroutine()"})
			}
		}
	}()

	<-ctx.Done()
	cancel()
	wg.Wait() // workers drain in-flight tasks, then exit via ctx
	s.emit(Event{Type: "SUMMARY", Msg: "context done — workers drained, session over"})
}

func clamp(v, lo, hi int) int {
	if v < lo {
		return lo
	}
	if v > hi {
		return hi
	}
	return v
}

func main() {
	http.HandleFunc("/ws", handleWS)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"service":"go-worker-pool-visualizer","ws":"ws://` + r.Host + `/ws"}`))
	})
	log.Println("listening on :8080 (ws://localhost:8080/ws)")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
