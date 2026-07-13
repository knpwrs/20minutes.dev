---
project: build-a-green-thread-scheduler
lesson: 29
title: Cancelling a task
overview: Sometimes work should stop before it finishes - a timeout fires, a result is no longer needed. Cancellation removes a task from the runtime wherever it is - waiting in the run queue, parked on a wait queue, or asleep on a timer. Today you build it cleanly, so a cancelled task simply never runs again.
goal: Add Cancel, which removes a task from the run queue or its wait queue and marks it finished.
spec:
  scenario: A cancelled task stops running
  status: failing
  lines:
    - kw: Given
      text: 'task 1 that yields repeatedly, and task 2 that cancels task 1 on its first step then finishes, spawned in that order'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'task 1 runs once, is cancelled, and never runs again; Run ends cleanly with no deadlock and the run trace is [1, 2]'
    - kw: And
      text: 'cancelling a task that is currently blocked removes it from its wait queue so it is not left parked forever'
code:
  lang: go
  source: |
    // record where a task is parked so Cancel can find it; a task is in exactly
    // ONE place at a time (a run-queue lane, OR t.parkedIn, OR the timer set)
    func (s *Scheduler) Cancel(t *Task) {
      if t.done { return }          // already finished or cancelled: no-op
      remove t from its run-queue lane, or from t.parkedIn.waiters, or from s.timers
      t.done = true
      s.live--                      // it no longer counts as alive
    }
    // also mark t.done = true when a task's step returns Done, so Cancel on an
    // already-finished task is a safe no-op
checkpoint: A task can be cancelled from anywhere and stops running. Commit and stop here.
---

**Cancellation** is the ability to stop a green thread on demand. A task might be in
one of three places when you cancel it: sitting in the run queue waiting its turn,
parked on a wait queue, or asleep in the timer set. Cancel has to find it wherever it
is and pull it out, then mark it finished and drop the live count so the runtime does
not think work is still outstanding.

To remove a parked task efficiently, each task remembers where it blocked - set that
`parkedIn` reference when it blocks, clear it when it wakes. Here task 2 cancels task
1 after task 1 has run just once; task 1 is removed from the run queue and never
stepped again, so `Run` ends cleanly with trace `[1, 2]` and no deadlock (the live
count went back to zero). Cancelling a *blocked* task is the important edge: it must
be unlinked from its wait queue, or it would sit there forever and later trip the
deadlock detector. One thing cancellation leaves dangling, though - anyone waiting on
the cancelled task to finish. That is the next lesson.
