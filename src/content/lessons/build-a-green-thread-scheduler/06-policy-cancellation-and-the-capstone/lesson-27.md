---
project: build-a-green-thread-scheduler
lesson: 27
title: Priority scheduling
overview: Round-robin treats every task equally, but sometimes some work matters more. Today the run queue gains priority lanes - the scheduler always runs the highest-priority ready task next, falling back to FIFO within a lane, so urgent tasks jump ahead without starving fairness among equals.
goal: Give the run queue priority lanes so higher-priority ready tasks run before lower-priority ones.
spec:
  scenario: A high-priority task runs before a low-priority one
  status: failing
  lines:
    - kw: Given
      text: 'task 1 spawned at priority 0 and task 2 spawned at priority 1 (higher), in that order, each finishing on its first step'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'task 2 runs first despite being spawned second, giving the run trace [2, 1]'
    - kw: And
      text: 'two tasks at the same priority still run in FIFO order, so default-priority scheduling is unchanged round-robin'
code:
  lang: go
  source: |
    // keep the lanes inside your existing run-queue type so its len()/enqueue
    // stay valid; dequeue picks the highest-priority non-empty lane, FIFO within:
    //   for p := maxPrio; p >= 0; p-- {
    //     if len(lanes[p]) > 0 { pop lanes[p][0] and return it }
    //   }
    // SpawnPrio(step, prio) stores the priority on the Task and enqueues in that
    // lane; Spawn defaults to priority 0. Wake / timer-advance re-enqueue a task
    // into its own priority lane.
checkpoint: The scheduler runs higher-priority tasks first, FIFO within a priority. Commit and stop here.
---

A **scheduling policy** decides which ready task runs next. So far the policy has
been pure round-robin - strict FIFO, everyone equal. **Priority scheduling** adds a
second dimension: each task has a priority, and the scheduler always picks from the
highest-priority lane that has anyone ready, only dropping to lower lanes when the
higher ones are empty. Within a single priority it stays FIFO, so equals are still
treated fairly.

This is a refactor of the run queue into **lanes**, one per priority level, but the
old behavior is a special case: spawn everything at the default priority 0 and you
get exactly the round-robin from Chapter 2 back. Here task 2 outranks task 1, so it
runs first even though it was spawned second - trace `[2, 1]`. Keep the change
behavior-preserving for equal priorities, because every earlier lesson relies on that
default FIFO. Real runtimes use priority for exactly this: keep a latency-sensitive
task responsive without starving background work.
