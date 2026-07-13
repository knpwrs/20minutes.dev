---
project: build-a-green-thread-scheduler
lesson: 12
title: FIFO wake order
overview: When several tasks wait on the same thing, the order they wake matters - and it must be fair. Today you confirm that multiple waiters on one wait queue are released in the exact order they blocked, first to park is first to wake.
goal: Block three tasks on one wait queue and confirm they wake in FIFO order.
spec:
  scenario: Waiters wake in the order they blocked
  status: failing
  lines:
    - kw: Given
      text: 'tasks 1, 2, 3 each block on the same wait queue in that order, then task 4 wakes the wait queue four times and finishes'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the three tasks resume in the order 1, 2, 3 and the full run trace is [1, 2, 3, 4, 1, 2, 3]'
    - kw: And
      text: 'the fourth Wake, on the now-empty wait queue, is a harmless no-op - it enqueues nothing and does not panic, so exactly three tasks are released and the wait queue ends empty'
code:
  lang: go
  source: |
    // Wake already takes the FRONT waiter, so calling it repeatedly
    // releases waiters in the order they parked. No new code in Wake -
    // the FIFO wait queue does the work, and Wake on an empty queue
    // must return without enqueuing anything.
    // task 4 calls s.Wake(wq) four times (one extra), then returns Done
checkpoint: Multiple waiters on one queue wake in strict FIFO order. Commit and stop here.
---

Fairness among waiters is not automatic in every system - some wake the most recent
waiter, some wake at random - but for a deterministic runtime we want the same rule
as the run queue: **first in, first out**. Because `Wake` always takes the *front*
of the wait queue, releasing three waiters in a row hands them back in the exact
order they blocked.

Follow the two queues. Tasks 1, 2, 3 each block, so the run queue empties to `[4]`
and the wait queue fills to `[1, 2, 3]`. Task 4 wakes: task 1 moves to the run queue,
then task 2, then task 3, giving a run queue of `[1, 2, 3]`; task 4 finishes. The
three resume in order. The combined trace `[1, 2, 3, 4, 1, 2, 3]` shows the block
phase, the waker, and the FIFO release.

The **extra wake** is the edge worth pinning. Task 4 calls `Wake` a fourth time, but
by then the wait queue is empty - so it must do nothing and, crucially, must not
panic reaching into an empty list. A `Release` or `Unlock` that wakes when no one is
waiting is completely normal, so `Wake` has to be safe on an empty queue. Getting
both halves right - strict FIFO release *and* a harmless no-op when empty - is what
makes a semaphore or a lock built on top behave predictably.
