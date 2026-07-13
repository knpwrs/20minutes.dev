---
project: build-a-green-thread-scheduler
lesson: 11
title: Waking one task
overview: A parked task needs a way back. Today you build Wake - it takes the front waiter off a wait queue and returns it to the back of the run queue, so a blocked task resumes right where it left off. One task blocks, another wakes it, and it finishes.
goal: Add Wake, which moves the front waiter of a wait queue to the back of the run queue.
spec:
  scenario: A woken task resumes and finishes
  status: failing
  lines:
    - kw: Given
      text: 'task 1 blocks itself on a wait queue on its first step and finishes on its next; task 2, spawned after it, wakes that wait queue then finishes'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the run trace is exactly [1, 2, 1] - task 1 parks, task 2 wakes it, task 1 resumes'
    - kw: And
      text: 'both tasks finish and the wait queue ends empty'
code:
  lang: go
  source: |
    func (s *Scheduler) Wake(wq *WaitQueue) {
      if len(wq.waiters) == 0 { return }
      t := wq.waiters[0]              // front waiter (FIFO)
      wq.waiters = wq.waiters[1:]
      s.rq.enqueue(t)                 // back of the run queue
    }
    // a woken task's step must resume PAST the point it blocked (a state machine)
checkpoint: Wake returns a parked task to the run queue so it can resume. Commit and stop here.
---

**Waking** is the mirror of blocking: it takes a task off a wait queue and puts it
back on the run queue, where the scheduler will step it again in turn. The task
resumes exactly where it parked - because its step function is a state machine that
remembers it already blocked once, the next step continues *past* the block rather
than repeating it. This is the hand-off that makes blocking useful instead of fatal.

Trace it: the queue starts `[1, 2]`. Task 1 blocks, parking itself, so the queue is
`[2]` and the wait queue holds task 1. Task 2 runs, wakes the wait queue (task 1
moves to the back of the run queue), and finishes, leaving `[1]`. Task 1 resumes and
finishes. The trace `[1, 2, 1]` is the signature of a successful block-and-wake. Note
the woken task goes to the **back** of the run queue, not the front - waking is fair,
too.
