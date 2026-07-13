---
project: build-a-green-thread-scheduler
lesson: 16
title: Timers wake in deadline order
overview: With more than one sleeper the earliest deadline must fire first, and a task that sleeps again after waking must be scheduled relative to the current time. Today you pin both - nearest-first ordering, and a re-sleep that lands later because the clock has already moved.
goal: Confirm sleepers wake nearest-first and that a second sleep is measured from the current clock.
spec:
  scenario: Nearest deadline first, and re-sleeps are relative to now
  status: failing
  lines:
    - kw: Given
      text: 'task 1 sleeps 5, and task 2 sleeps 2 then (on waking) sleeps 5 more before finishing, spawned in that order, each recording Now() at every wake'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'task 2 wakes first at Now() 2, then task 1 wakes at Now() 5, then task 2 wakes again at Now() 7 (2 + 5, not 5) and finishes; the final Now() is 7'
    - kw: And
      text: 'the run trace is exactly [1, 2, 2, 1, 2] - the re-armed timer at 7 correctly sorts after task 1''s at 5'
code:
  lang: go
  source: |
    // when the run queue is empty, scan ALL pending timers for the minimum at,
    // set s.now to it, and move every timer with that at to the run queue:
    //   earliest := min(t.at for t in timers); s.now = earliest
    // Sleep(d) always schedules at s.now + d, so a second Sleep after the clock
    // has advanced lands later. task 2: Sleep(2); [resume] Sleep(5); [resume] Done
checkpoint: Sleepers wake nearest-first and a re-sleep is measured from the current clock. Commit and stop here.
---

A timer set is only useful if the **soonest** alarm rings next. When the run queue
empties, the scheduler looks across all pending timers, finds the smallest wake time,
and jumps the clock there - skipping the dead air in between. That is why virtual
time is efficient as well as deterministic: it fast-forwards over stretches where
every task is asleep, always to the nearest deadline first.

The second, subtler half is that `Sleep(d)` is **relative to the current clock**: it
schedules a wake at `now + d`, using whatever `now` is at the moment of the call. So
when task 2 wakes at 2 and immediately sleeps 5 more, its new deadline is `2 + 5 = 7`,
not 5 - and that re-armed timer has to sort correctly against task 1's still-pending
deadline at 5. Follow the timeline: task 2 wakes at 2 (nearest), re-sleeps; the clock
advances to 5 and task 1 wakes; then to 7 and task 2 wakes again - trace `[1, 2, 2, 1,
2]`, final time 7. Getting monotonic, relative re-sleeps right is exactly what a
repeating timer or a retry-with-delay needs.
