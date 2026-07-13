---
project: build-a-green-thread-scheduler
lesson: 25
title: A wait group
overview: Often one green thread must wait for several others to finish before it proceeds - fan-out, then join. A wait group counts outstanding work and releases its waiters when the count hits zero. Today you build it, the last primitive before the capstone.
goal: Build a wait group where Wait blocks until a counter of outstanding tasks reaches zero.
spec:
  scenario: A joiner waits for two workers to finish
  status: failing
  lines:
    - kw: Given
      text: 'a wait group set to 2, a joiner task 1 that waits on it, and workers 2 and 3 that each finish and call Done, all spawned in that order'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the joiner blocks until both workers have called Done; it resumes only after the second Done drops the counter to 0; the run trace is [1, 2, 3, 1]'
    - kw: And
      text: 'if the counter is already 0 when Wait is called, it does not block at all'
code:
  lang: go
  source: |
    type WaitGroup struct { n int; wq WaitQueue; s *Scheduler }
    func (wg *WaitGroup) Add(d int) { wg.n += d }
    func (wg *WaitGroup) Done() {
      wg.n--
      if wg.n == 0 { for len(wg.wq.waiters) > 0 { wg.s.Wake(&wg.wq) } } // wake all
    }
    // Wait: if wg.n > 0, block; else continue.
checkpoint: A wait group blocks a joiner until its counter reaches zero. Commit and stop here.
---

A **wait group** is a countdown latch: it holds a count of outstanding work, `Done`
decrements it, and `Wait` blocks until it reaches zero. It is the natural tool for
**fan-in** - spawn several workers, then have a coordinator wait for all of them to
report in before continuing. Unlike a channel, no value passes; the only information
is "how many are still running."

The mechanics reuse everything from this chapter. `Wait` blocks the caller on the
group's wait queue if the count is above zero; the final `Done` that drives the count
to zero wakes **all** waiters at once, since they were all waiting for the same
condition. Here the joiner blocks first, the two workers each finish and count down,
and the second `Done` (counter zero) releases the joiner - trace `[1, 2, 3, 1]`. The
already-zero shortcut matters too: waiting on nothing outstanding must fall straight
through, or a coordinator with no workers would hang. You now have every primitive the
capstone needs.
