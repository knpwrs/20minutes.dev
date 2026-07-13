---
project: build-a-green-thread-scheduler
lesson: 8
title: Spawning from inside a task
overview: Green threads are most useful when a running task can start new ones - a server accepting a connection, a worker forking a helper. Today a task spawns another mid-run, and the newcomer joins the back of the rotation exactly like any other ready task.
goal: Let a running task call Spawn, and confirm the new task joins at the back of the queue.
spec:
  scenario: A task spawned mid-run joins the rotation
  status: failing
  lines:
    - kw: Given
      text: 'task 1 which, on its first step, spawns a new task and then yields, finishing on its second step; the spawned task finishes on its first step'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the spawned task gets id 2 and the run trace is exactly [1, 2, 1]'
    - kw: And
      text: 'the spawned task runs after task 1 yields, not before'
code:
  lang: go
  source: |
    // Spawn is already a scheduler method; a task closes over s to call it
    step := func() Status {
      if first {
        first = false
        s.Spawn(func() Status { return Done }) // enqueued at the back
        return Ready                            // task 1 yields
      }
      return Done
    }
checkpoint: A running task can spawn another, which joins the back of the queue. Commit and stop here.
---

Dynamic spawning is what turns a scheduler into a runtime: work discovers more work.
Because `Spawn` just enqueues at the **back**, a task created mid-run gets no special
treatment - it waits its turn behind everything already ready, which keeps the whole
system fair and predictable.

Watch the ids and the queue together. Task 1 runs first, spawns the new task (which
becomes id 2 at the back) and yields, so the queue goes from `[]` (task 1 is out
being stepped) to `[2, 1]`. Task 2 runs next and finishes; task 1 resumes and
finishes. The trace `[1, 2, 1]` shows the newcomer slotting in *after* the task that
created it yielded - never cutting ahead. That ordering guarantee is what makes
concurrent green threads reason-about-able.
