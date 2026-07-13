---
project: build-a-green-thread-scheduler
lesson: 28
title: Deadlock detection
overview: A cooperative scheduler can wedge - if every task is blocked and no timer will ever fire, nothing can wake anyone and the program would hang. A good runtime notices this and reports it instead. Today Run learns to detect deadlock and return an error rather than spin or stall.
goal: Make Run report a deadlock when the run queue is empty, no timers remain, but tasks are still blocked.
spec:
  scenario: An all-blocked run is reported as deadlock
  status: failing
  lines:
    - kw: Given
      text: 'a single task that blocks on a wait queue that no one will ever wake'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'Run returns a deadlock error rather than hanging, because the run queue is empty, no timers are pending, and a task is still alive'
    - kw: And
      text: 'a task that is merely sleeping is not a deadlock - the clock advances and wakes it, and Run returns no error'
code:
  lang: go
  source: |
    // track live tasks: Spawn increments s.live, a Done step decrements it.
    // Run loop, when the run queue is empty:
    //   if len(s.timers) > 0 { advanceClock(); continue }
    //   if s.live > 0 { return ErrDeadlock } // blocked with no way forward
    //   return nil                            // all tasks finished cleanly
checkpoint: Run detects an all-blocked, no-timer state and reports deadlock. Commit and stop here.
---

**Deadlock** is the failure mode of blocking: a task parks waiting for a signal that
will never come, because whoever would send it is also parked. In a cooperative
runtime this shows up as a very specific, detectable state - the run queue is empty
(no task can run), there are no pending timers (time will never advance to wake
anyone), yet tasks are still alive (parked in wait queues). Nothing can ever change,
so the honest thing is to stop and say so.

The detection needs one new number: a count of **live** tasks, bumped up on spawn and
down when a task finishes. When the run queue drains, the scheduler checks the timers
first - a pending sleep means the clock can still advance and rescue someone, so that
is *not* deadlock. Only if there are no timers and live tasks remain does `Run` return
a deadlock error. A lone sleeper always resolves; a lone blocked-forever task is a
deadlock. Reporting it beats the alternative every real scheduler dreads: hanging
silently.
