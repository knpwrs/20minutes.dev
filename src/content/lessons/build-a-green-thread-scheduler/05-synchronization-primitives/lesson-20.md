---
project: build-a-green-thread-scheduler
lesson: 20
title: A counting semaphore
overview: Now you spend block and wake on real primitives. A counting semaphore hands out a fixed number of permits - the first N takers pass, the rest block until someone releases. It is the smallest primitive that regulates access, and everything else this chapter builds on it.
goal: Build a semaphore that permits exactly N holders and wakes a waiter on release.
spec:
  scenario: A semaphore of 2 permits blocks the third taker
  status: failing
  lines:
    - kw: Given
      text: 'a semaphore with 2 permits and tasks 1, 2, 3 that each acquire and record entry, plus task 4 that releases once, all spawned in that order'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'tasks 1 and 2 enter immediately but task 3 blocks; only after task 4 releases does task 3 enter, giving entry order [1, 2, 3]'
    - kw: And
      text: 'exactly 2 tasks had entered before the release, and the run trace is [1, 2, 3, 4, 3]'
code:
  lang: go
  source: |
    type Sem struct { count int; wq WaitQueue; s *Scheduler }
    // Acquire: if count > 0 take a permit; else park (resume as a holder).
    // Release: if anyone waits, HAND the permit off (wake, do NOT bump count);
    //          otherwise count++.
    func (sm *Sem) Release() {
      if len(sm.wq.waiters) > 0 { sm.s.Wake(&sm.wq) } else { sm.count++ }
    }
checkpoint: A counting semaphore permits exactly N holders and hands off on release. Commit and stop here.
---

A **counting semaphore** is a permit dispenser holding `count` permits. `Acquire`
takes one if any remain, otherwise the calling task blocks on the semaphore's wait
queue. `Release` gives a permit back. This is the primitive Dijkstra introduced for
exactly this problem - letting at most N tasks into a region at once - and it is the
foundation the mutex, and much of the rest of the chapter, is built from.

The subtle, essential rule is **hand-off on release**. When a task releases and
others are waiting, it does *not* increment the count and let the woken task re-run
`Acquire` (which could lose the permit to a newcomer). Instead it wakes the front
waiter and lets that task resume as the new permit holder directly - the permit
passes from releaser to waiter without ever being free. That is why a woken task
resumes *past* its `Acquire` rather than retrying it. Here two tasks hold the two
permits, the third blocks, and the release passes a permit straight to it.
