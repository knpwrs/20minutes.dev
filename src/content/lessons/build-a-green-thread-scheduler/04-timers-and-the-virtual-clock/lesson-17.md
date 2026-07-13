---
project: build-a-green-thread-scheduler
lesson: 17
title: The clock waits for ready work
overview: The clock advancing "only when the run queue is empty" is a real, testable rule, not a slogan. Today you add a counter of clock advances and prove a busy ticking task drains entirely at time zero before the clock moves once to wake a sleeper.
goal: Count clock advances, and confirm ready work fully drains before the clock ticks for a sleeper.
spec:
  scenario: Ready work runs before virtual time moves
  status: failing
  lines:
    - kw: Given
      text: 'task 1 sleeps 5, and task 2 is a ticker that yields twice then finishes (three steps), each of task 2''s steps recording Now(); the scheduler counts clock advances in a Ticks() total'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'all three of task 2''s steps happen at Now() 0, then the clock advances once to 5 to wake task 1, so Ticks() is exactly 1'
    - kw: And
      text: 'the run trace is exactly [1, 2, 2, 2, 1] - the busy task drains completely before any tick'
code:
  lang: go
  source: |
    // add a ticks counter, bumped each time the clock jumps forward:
    //   s.now = earliest
    //   s.ticks++            // one advance, however many timers it releases
    // Ticks() returns s.ticks. The drain-then-advance ordering is already in Run:
    //   for s.rq.len() > 0 { step ready tasks }   // all run at the current now
    //   then advance the clock                     // only once the queue is empty
checkpoint: The clock holds still until all ready tasks have run, counted by Ticks(). Commit and stop here.
---

The scheduler must exhaust the run queue **completely** before it even looks at the
timers, because getting this wrong is the classic event-loop bug: jump virtual time
forward while a task is still ready to run, and the timeline starts depending on luck.
To make the rule checkable, add a `ticks` counter that increments every time the clock
actually advances - one increment per jump, no matter how many sleepers that jump
wakes.

Watch time stand still while there is work. Task 1 sleeps, parking immediately. Task
2 then runs all three of its steps - yield, yield, finish - and every one reads
`Now()` as 0, because the run queue was never empty during them. Only after task 2 is
gone does the clock advance, once, to 5 and wake task 1 - so `Ticks()` is exactly 1 and
the trace is `[1, 2, 2, 2, 1]`. The counter turns "the clock waits for ready work" from
a slogan into a number you can assert, and it is the same counter that proves the
tie-break in the next lesson releases equal deadlines on a single tick.
