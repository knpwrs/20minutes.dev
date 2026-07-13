---
project: build-a-green-thread-scheduler
lesson: 10
title: The wait queue
overview: A task often cannot make progress yet - it needs data that has not arrived. Rather than spin, it should park itself and leave the run queue entirely. Today you build the wait queue and the Block status that puts a task to sleep on it.
goal: Add a wait queue and a Block that parks the current task, removing it from the run queue.
spec:
  scenario: A blocked task leaves the run queue
  status: failing
  lines:
    - kw: Given
      text: 'a single task that, when stepped, blocks itself on a wait queue'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the task is stepped once and then parked - the wait queue holds 1 task and the run queue is empty'
    - kw: And
      text: 'Run returns without re-running the parked task (it is not busy-waited)'
code:
  lang: go
  source: |
    type WaitQueue struct{ waiters []*Task }
    // Run sets s.current before each step so Block knows who is running
    func (s *Scheduler) Block(wq *WaitQueue) Status {
      wq.waiters = append(wq.waiters, s.current) // park the running task
      return Blocked
    }
    // in Run: case Blocked: // already parked in a wait queue, do nothing
checkpoint: A task can block itself onto a wait queue and leave the run queue. Commit and stop here.
---

The essence of a green thread is that **waiting is cheap**: a task that cannot
proceed does not burn CPU checking over and over - it **parks**. Parking means the
task removes itself from the run queue and joins a **wait queue**, a simple FIFO list
of tasks waiting for the same thing (a lock, an item, a signal). The scheduler then
forgets about it until someone wakes it.

For a task to park *itself*, the scheduler must know which task is currently running,
so `Run` now records `s.current` before each step. `Block` appends that task to the
wait queue and returns `Blocked`; the loop sees `Blocked` and - crucially - does
**not** re-enqueue it. Today there is no one to wake the task, so it simply stays
parked and `Run` ends with the queue empty. Giving it a way back to the run queue is
the very next lesson.
