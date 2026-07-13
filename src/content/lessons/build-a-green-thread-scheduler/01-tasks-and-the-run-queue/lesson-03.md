---
project: build-a-green-thread-scheduler
lesson: 3
title: Spawn and task ids
overview: To talk about "task 1 ran, then task 2" you need tasks to have stable identities. Today the scheduler gains Spawn - it wraps a step function into a task, stamps it with the next id, and drops it on the run queue.
goal: Give the scheduler a Spawn that assigns increasing ids and enqueues the new task.
spec:
  scenario: Spawning stamps ids and enqueues
  status: failing
  lines:
    - kw: Given
      text: 'a fresh scheduler'
    - kw: When
      text: 'two step functions are spawned'
    - kw: Then
      text: 'the first task gets id 1 and the second gets id 2'
    - kw: And
      text: 'the run queue length is 2 after both spawns'
code:
  lang: go
  source: |
    type Scheduler struct {
      rq     runq
      nextID int
    }
    func (s *Scheduler) Spawn(step func() Status) *Task {
      s.nextID++                       // ids start at 1
      t := &Task{id: s.nextID, step: step}
      s.rq.enqueue(t)
      return t
    }
    // add an id field to Task
checkpoint: The scheduler can spawn tasks with stable, increasing ids. Commit and stop here.
---

A green thread needs a name so the scheduler - and every test - can refer to it.
We use a simple **monotonic id**: the first task spawned is 1, the next is 2, and
so on. Ids never repeat, so a trace like `[1, 2, 1]` reads unambiguously as "task 1
ran, task 2 ran, task 1 ran again."

**Spawn** is the public door into the scheduler: hand it a step function and it
becomes a live task at the back of the run queue, ready to run when its turn comes.
Add the `id` field to `Task` now. That is all spawning does today - it does not run
anything. Running is the scheduler loop, and that is next.
