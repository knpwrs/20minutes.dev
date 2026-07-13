---
project: build-a-green-thread-scheduler
lesson: 30
title: Cancellation wakes joiners
overview: A task can wait for another to finish - a join. But if the awaited task is cancelled rather than completing, its joiners must still be released, or they block forever. Today Done and Cancel both wake a task's joiners, so a join always resolves.
goal: Let a task join another, and have both completion and cancellation wake the joiners.
spec:
  scenario: Cancelling a joined task releases its joiner
  status: failing
  lines:
    - kw: Given
      text: 'task 1 that joins task 2, task 2 that yields repeatedly, and task 3 that cancels task 2, spawned in that order'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'task 1 blocks on the join, task 2 is cancelled mid-work (it never completes its own steps), and cancelling wakes task 1, which resumes and finishes; the run trace is [1, 2, 3, 1]'
    - kw: And
      text: 'the join resolves the same way whether task 2 is cancelled or finishes normally - either exit wakes the joiner, so task 1 never blocks forever'
code:
  lang: go
  source: |
    // each task has its own joiners wait queue
    // Join(t): if t.done, continue; else block on t.joiners.
    // On a task finishing (Done) OR being cancelled, wake all its joiners:
    func (s *Scheduler) finish(t *Task) {
      t.done = true
      for len(t.joiners.waiters) > 0 { s.Wake(&t.joiners) }
    }
checkpoint: A join is released whether the awaited task finishes or is cancelled. Commit and stop here.
---

**Joining** lets one green thread wait for another to complete - the fan-in half of
fan-out. A joiner blocks on the target task's own **joiners** wait queue and is woken
when that task is done. The trap is that "done" has two causes: the task finished
normally, or it was **cancelled**. Both must release the joiners, because from the
joiner's point of view the awaited work is over either way - and a joiner left parked
on a cancelled task would hang or, worse, trip the deadlock detector.

So completion and cancellation funnel through one path that marks the task done and
wakes every joiner. Here task 1 joins task 2 and blocks; task 3 cancels task 2; that
cancellation wakes task 1, which resumes and finishes even though task 2 never
completed its own work - trace `[1, 2, 3, 1]`. What the join guarantees is
*resolution*, not a verdict: the joiner is released either way and stops waiting;
whether the target completed or was cancelled is the same "done" to it. Unifying the two exit routes is what
makes joins reliable in the presence of cancellation, which is exactly the situation a
timeout creates. With policy, deadlock, and cancellation in hand, the runtime is
complete - time to assemble it.
