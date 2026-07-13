---
project: build-a-green-thread-scheduler
lesson: 6
title: Two tasks interleave
overview: This is the moment cooperative scheduling comes alive. Two tasks that each yield once will hand the CPU back and forth, and the scheduler weaves them into a single exact interleaving. Pinning that A,B,A,B trace is the heart of the whole project.
goal: Run two tasks that each yield once, and assert the exact interleaved trace.
spec:
  scenario: Two yielding tasks alternate
  status: failing
  lines:
    - kw: Given
      text: 'tasks 1 and 2 spawned in that order, each returning Ready on its first step and Done on its second'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the run trace is exactly [1, 2, 1, 2]'
    - kw: And
      text: 'both tasks finish and the run queue ends empty'
code:
  lang: go
  source: |
    // a task that yields once then finishes
    func twoStep() func() Status {
      done := false
      return func() Status {
        if !done { done = true; return Ready } // step 1: yield
        return Done                             // step 2: finish
      }
    }
    // spawn two of these; the scheduler already does the rest
checkpoint: Two yielding tasks interleave in an exact A,B,A,B trace. Commit and stop here.
---

**Yielding** is a task voluntarily giving up the CPU: it returns `Ready` instead of
running to the end, trusting the scheduler to come back to it. Because a yielded task
goes to the **back** of the run queue, two tasks that both yield naturally take
turns. Task 1 runs and yields, task 2 runs and yields, task 1 resumes and finishes,
task 2 resumes and finishes - the interleaving `[1, 2, 1, 2]` falls straight out of
the FIFO rule with no extra machinery.

Trace it by hand once: the queue starts `[1, 2]`; step 1 yields so it goes to the
back, leaving `[2, 1]`; step 2 yields, leaving `[1, 2]`; step 1 finishes, leaving
`[2]`; step 2 finishes. That exact alternation is what people mean by "green threads
running concurrently" on a single driver - not two things at once, but two things
taking precise, fair turns. Everything else in this project is a variation on this
one trace.
