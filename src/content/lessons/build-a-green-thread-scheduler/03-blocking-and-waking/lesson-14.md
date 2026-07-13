---
project: build-a-green-thread-scheduler
lesson: 14
title: A rendezvous of many consumers
overview: The chapter closes with a small, real coordination - two consumers waiting on the same slot, and a producer feeding them one value at a time. It shows FIFO wake order carrying distinct payloads - the first waiter gets the first value.
goal: Run two blocked consumers and a producer that delivers two values, one per wake, in order.
spec:
  scenario: Two consumers are served their values in wake order
  status: failing
  lines:
    - kw: Given
      text: 'consumers 1 and 2 both block on an empty slot in that order, and producer 3 delivers 10 (waking one consumer, then yielding) and then 20'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'consumer 1 reads 10 and consumer 2 reads 20, and the run trace is exactly [1, 2, 3, 1, 3, 2]'
    - kw: And
      text: 'the producer yields between deliveries so the first consumer takes its value before the second is produced'
code:
  lang: go
  source: |
    // producer step (state machine): deliver 10, Wake, yield;
    //   on resume: deliver 20, Wake, Done.
    // Yielding after the first Wake lets consumer 1 read 10 before
    // consumer 2's value overwrites the slot - handoff, not a race.
    // spawn order: consumer, consumer, producer
checkpoint: Two consumers are served in FIFO wake order with distinct values. Commit and stop here.
---

This is the chapter's payoff: a tiny rendezvous where several green threads line up
for a resource and are served fairly, one at a time. The FIFO wait queue guarantees
consumer 1 (which blocked first) is woken first and so takes the first value; consumer
2 takes the second. Distinct waiters, distinct payloads, deterministic order.

The producer's **yield between deliveries** is the subtle, important part. If it
delivered both values back to back, it would overwrite the slot before consumer 1 ever
read it. By yielding right after the first wake, the producer steps aside and lets the
just-woken consumer run and consume `10`, and only then produces `20` for consumer 2.
That deliberate handoff - produce, wake, step aside - is exactly the discipline a
correct channel needs, which is where the next chapters go, once you can also make a
task wait for *time* to pass.
