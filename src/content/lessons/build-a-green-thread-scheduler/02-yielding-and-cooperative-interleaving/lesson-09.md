---
project: build-a-green-thread-scheduler
lesson: 9
title: A round-robin timeline
overview: Time to see the chapter pay off as a usable thing. Several ticking tasks, each yielding a few times, produce a clean round-robin timeline you can print and read - the first real demonstration of the runtime doing cooperative work.
goal: Run three equal-length ticking tasks and assert the full round-robin trace.
spec:
  scenario: Three ticking tasks share the CPU evenly
  status: failing
  lines:
    - kw: Given
      text: 'three tasks (ids 1, 2, 3), each yielding twice and finishing on its third step'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the run trace is exactly [1, 2, 3, 1, 2, 3, 1, 2, 3]'
    - kw: And
      text: 'each task appears exactly three times, in strict rotation'
code:
  lang: go
  source: |
    // a ticking task that yields (n-1) times then finishes
    func ticker(n int) func() Status {
      i := 0
      return func() Status {
        i++
        if i < n { return Ready }
        return Done
      }
    }
    // spawn ticker(3) three times, Run, print s.trace
checkpoint: Several ticking tasks share the CPU in an even round-robin you can print. Commit and stop here.
---

This is the chapter's demonstration: give three tasks the same amount of work and the
scheduler slices the CPU between them perfectly evenly. Each task runs, yields, and
waits one full rotation before running again, so the trace is three clean sweeps of
`[1, 2, 3]`. Printed line by line, that is a **timeline** of cooperative execution -
the thing this project is ultimately about.

The `ticker(n)` helper is worth keeping: it is a task that yields `n - 1` times and
finishes on step `n`, a handy stand-in for "a green thread with some work to do."
You now have a genuinely useful cooperative core - tasks that spawn, yield, take fair
turns, and retire. What is missing is the ability to *wait*: for a resource, a
signal, or a moment in time. That is the next three chapters.
