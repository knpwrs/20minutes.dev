---
project: build-a-green-thread-scheduler
lesson: 18
title: Same-deadline tie-break
overview: What if two sleepers are due at the same instant? They must both wake on a single clock advance, in the order they went to sleep, even with a nearer sleeper firing first. Today you pin that tie-break using the tick counter to prove one jump releases both.
goal: Wake two equal-deadline sleepers together in insertion order on a single clock advance.
spec:
  scenario: Equal deadlines fire together on one tick, oldest first
  status: failing
  lines:
    - kw: Given
      text: 'task 1 sleeps 5, task 2 sleeps 3, and task 3 sleeps 5, spawned in that order, each recording Now() at its wake, with the scheduler counting clock advances in Ticks()'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'task 2 wakes alone at Now() 3, then tasks 1 and 3 both wake at Now() 5 in insertion order (1 before 3), and Ticks() is exactly 2'
    - kw: And
      text: 'the run trace is exactly [1, 2, 3, 2, 1, 3] - the single advance to 5 released both tied sleepers together'
code:
  lang: go
  source: |
    // when advancing, release EVERY timer at the earliest time in one jump,
    // in insertion order, counting a single tick:
    s.now = earliest
    s.ticks++                              // one advance...
    for _, tm := range s.timers {          // ...releases all timers at `earliest`
      if tm.at == earliest { s.rq.enqueue(tm.task) } // insertion order
    }
    // then keep only the timers with at > earliest
checkpoint: Equal deadlines wake together in insertion order on one clock tick. Commit and stop here.
---

Ties are where an under-specified scheduler goes non-deterministic. Two tasks due at
the same virtual instant must both become ready at once - it would be wrong to advance
the clock, wake one, advance again to the *same* time, and wake the other. So when the
scheduler jumps to a deadline, it releases **every** timer at that exact time in one
go, in **insertion order** so the tie-break is stable and predictable.

The `Ticks()` counter from the previous lesson is what makes this provable. Task 2's
deadline at 3 is nearest, so the first advance wakes it alone (`Ticks()` becomes 1).
Then tasks 1 and 3, both due at 5, are released together by a **single** second advance
- task 1 before task 3 because it slept first - so `Ticks()` ends at 2, not 3. The
trace `[1, 2, 3, 2, 1, 3]` shows the two tied sleepers waking back to back on that one
jump. If a tie instead cost two advances, `Ticks()` would read 3 and any program timing
equal-deadline events would drift - which is exactly the bug this pins shut.
