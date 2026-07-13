---
project: build-a-green-thread-scheduler
lesson: 13
title: A producer wakes a consumer
overview: Block and wake become a real pattern today - a consumer that needs data blocks when there is none, and a producer that makes data wakes it and hands the value across. This producer/consumer handoff is the seed of every channel you build later.
goal: Have a consumer block on an empty slot and a producer fill it, wake the consumer, and pass a value.
spec:
  scenario: A consumer receives a value produced after it blocked
  status: failing
  lines:
    - kw: Given
      text: 'a shared one-value slot (empty), a consumer task 1 that blocks while the slot is empty, and a producer task 2 that stores 42, marks the slot full, and wakes the consumer'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the run trace is [1, 2, 1] and the consumer reads the value 42 on its resume'
    - kw: And
      text: 'if the slot had already been full when the consumer ran, it would read 42 without blocking at all'
code:
  lang: go
  source: |
    type slot struct { val int; full bool; wq WaitQueue }
    // consumer step (state machine):
    //   if !slot.full { return s.Block(&slot.wq) } // park until produced
    //   got = slot.val                             // resumed: read it
    //   return Done
    // producer step: slot.val = 42; slot.full = true; s.Wake(&slot.wq); return Done
checkpoint: A producer and a blocked consumer hand a value across via block and wake. Commit and stop here.
---

The **producer/consumer** relationship is the canonical use of blocking: one task
needs something another task will make. Without blocking, the consumer would have to
poll the slot in a busy loop, wasting every turn until the producer got scheduled.
With blocking, the consumer parks the instant it finds the slot empty and costs
nothing until the producer wakes it - the moment there is actually something to do.

The value handoff is the new idea. The producer writes into the shared slot *before*
it wakes the consumer, so when the consumer resumes the data is already there for it
to read - it comes back to `42`. Notice the symmetry with tomorrow's channels: a slot
plus a wait queue is very nearly a one-item channel. The `[1, 2, 1]` trace is the
same block-wake-resume shape as before, now carrying a payload.
