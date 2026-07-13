---
project: build-a-green-thread-scheduler
lesson: 5
title: Fairness and the run trace
overview: With several tasks in the queue, which runs when? Today the scheduler records a run trace - the id of each task as it is stepped - and you confirm that independent tasks are serviced in strict arrival order. That trace is how every later lesson asserts an exact interleaving.
goal: Record a trace of stepped task ids and confirm several one-step tasks run in FIFO order.
spec:
  scenario: Independent tasks run in arrival order
  status: failing
  lines:
    - kw: Given
      text: 'three tasks spawned in order (ids 1, 2, 3), each finishing on its first step'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the run trace is [1, 2, 3]'
    - kw: And
      text: 'the run queue ends empty and every task ran exactly once'
code:
  lang: go
  source: |
    // add a trace to the scheduler, record the id at each step
    func (s *Scheduler) Run() {
      for s.rq.len() > 0 {
        t := s.rq.dequeue()
        s.trace = append(s.trace, t.id) // <- record who runs
        switch t.step() {
        case Ready:
          s.rq.enqueue(t)
        case Done:
        }
      }
    }
checkpoint: The scheduler records a run trace and services tasks fairly in FIFO order. Commit and stop here.
---

The **run trace** is the single most useful thing in this project: a list of task
ids in the exact order the scheduler stepped them. Because the scheduler is the only
thing running - no real threads, no operating system deciding for us - that trace is
completely deterministic, so a test can assert it to the element. Every "the
interleaving is exactly this" claim from here on is a check against the trace.

Today's tasks each finish in one step, so no task ever goes back in the queue and
the trace is simply the spawn order: `[1, 2, 3]`. That is fairness in its simplest
form. Next chapter the tasks start yielding, they go back in the queue, and the same
FIFO rule produces the interleaved traces that make cooperative scheduling feel
alive.
