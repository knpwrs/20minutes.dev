---
project: build-a-green-thread-scheduler
lesson: 19
title: A sleep timeline
overview: The chapter closes with a printable timeline - several sleepers with different deadlines, waking in nearest-first order as the clock fast-forwards from one alarm to the next. This is the runtime scheduling work in virtual time, ready to read off.
goal: Run three sleepers with distinct deadlines and assert the wake timeline and advance count.
spec:
  scenario: Sleepers wake along a fast-forwarded timeline
  status: failing
  lines:
    - kw: Given
      text: 'task 1 sleeps 30, task 2 sleeps 10, task 3 sleeps 20, spawned in that order, each recording (id, Now()) when it wakes'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the wake timeline is exactly (2, 10), (3, 20), (1, 30), the final Now() is 30, and ticks is 3'
    - kw: And
      text: 'no clock advance is wasted - each of the three advances wakes exactly one sleeper'
code:
  lang: go
  source: |
    // spawn three sleepers, each: record wake, then Done
    // s.Sleep(30); s.Sleep(10); s.Sleep(20)
    // after Run, print the recorded (id, wakeTime) pairs as the timeline
checkpoint: Several sleepers wake along a clean, fast-forwarded virtual timeline. Commit and stop here.
---

Here is the timer machinery as something you would actually use: schedule three
pieces of work for different virtual times and let the runtime fast-forward between
them. The clock never crawls - it leaps from 10 to 20 to 30, one jump per alarm,
skipping the empty stretches entirely. Printed as `(id, time)` pairs, that is a
**timeline** of when each green thread ran.

The deadlines are deliberately out of spawn order (30, 10, 20) to show that the
timeline follows *time*, not creation order: task 2 wakes first, then task 3, then
task 1. Three distinct deadlines mean three advances, so `ticks` is 3, each doing real
work. You now have both halves of waiting - for other tasks and for time - and the
next chapter spends them, building the synchronization primitives that make green
threads genuinely cooperate.
