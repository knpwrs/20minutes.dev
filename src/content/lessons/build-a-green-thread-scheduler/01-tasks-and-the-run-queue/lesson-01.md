---
project: build-a-green-thread-scheduler
lesson: 1
title: The task status
overview: A green thread in our world is not an OS thread - it is a resumable task, a small step function the scheduler runs a little at a time. Today you define the one type everything else depends on - the status a task hands back each time it is stepped.
goal: Define a Status with the values Ready, Blocked, and Done, and a task whose step reports one of them.
spec:
  scenario: A stepped task reports its status
  status: failing
  lines:
    - kw: Given
      text: 'a task whose step does nothing and immediately finishes'
    - kw: When
      text: 'the task is stepped once'
    - kw: Then
      text: 'it returns the status Done'
    - kw: And
      text: 'a task whose step has more work to do returns Ready instead, and the three status values Ready, Blocked, and Done are all distinct'
code:
  lang: go
  source: |
    // the whole runtime is driven by this one return value
    type Status int
    const (
      Ready Status = iota // did a unit of work; run me again
      Blocked             // parked on a resource; do not run me
      Done                // finished
    )
    // a task is just a step function that returns where it stands
    type Task struct{ step func() Status }
checkpoint: You have a Status type and a task that reports one when stepped. Commit and stop here.
---

A real green-thread runtime saves and restores machine stacks so a paused thread
can resume exactly where it left off. That is impossible to test with exact values
and different in every language, so we do the honest teaching version: a green
thread is a **resumable task**, and a task is just a **step function**. Each time
the scheduler runs it, the function does a little work and returns a **Status**
saying what to do next - `Ready` (I yielded, run me again), `Blocked` (I am parked,
leave me alone), or `Done` (I finished).

That one return value is the entire contract between a task and the scheduler, so
it is where the project starts. Today is deliberately tiny: define the three
statuses and a task that returns one when stepped. Every later lesson - yielding,
blocking, sleeping, channels - is a task returning one of these three values at the
right moment.
