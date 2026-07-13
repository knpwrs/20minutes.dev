---
project: build-a-green-thread-scheduler
lesson: 7
title: Three tasks and an early finisher
overview: Round-robin should stay fair even when tasks have different lifespans. Today a task that finishes early simply drops out of the rotation, and the ones still running close ranks - the trace proves nobody skips a turn and nobody lingers.
goal: Run three tasks of unequal length and assert a finished task leaves the rotation cleanly.
spec:
  scenario: A short task drops out mid-rotation
  status: failing
  lines:
    - kw: Given
      text: 'tasks 1, 2, 3 spawned in order, where task 2 finishes on its first step and tasks 1 and 3 each yield once then finish on their second step'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the run trace is exactly [1, 2, 3, 1, 3]'
    - kw: And
      text: 'task 2 appears only once because it never yielded back into the queue'
code:
  lang: go
  source: |
    // task 2 is a one-shot; tasks 1 and 3 yield once
    oneShot := func() Status { return Done }
    // reuse twoStep() from the previous lesson for tasks 1 and 3
    // spawn order: twoStep, oneShot, twoStep
checkpoint: A finished task drops out of the rotation while the rest keep taking turns. Commit and stop here.
---

Real programs mix long-lived and short-lived green threads freely, and the scheduler
must not stumble when one finishes ahead of the others. It does not, because `Done`
just means "do not re-enqueue" - the finished task quietly vanishes and the queue
carries on with whoever is left.

Follow the queue: it starts `[1, 2, 3]`. Task 1 yields, giving `[2, 3, 1]`. Task 2
finishes and is dropped, giving `[3, 1]`. Task 3 yields, giving `[1, 3]`. Task 1
finishes, giving `[3]`. Task 3 finishes. The trace is `[1, 2, 3, 1, 3]` - task 2
appears exactly once, and the survivors keep alternating without missing a beat.
This is the property that lets you spawn and retire green threads at will.
