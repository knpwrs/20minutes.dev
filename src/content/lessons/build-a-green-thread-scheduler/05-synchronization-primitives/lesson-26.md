---
project: build-a-green-thread-scheduler
lesson: 26
title: Producer, consumer, and a join
overview: The chapter closes by wiring the primitives together into the pattern they exist for - a producer streaming values over a channel to a consumer, with a coordinator that waits for both to finish. It is a small, real concurrent program on your runtime.
goal: Combine a buffered channel and a wait group so a coordinator joins a producer and consumer.
spec:
  scenario: A coordinator joins a streaming producer and consumer
  status: failing
  lines:
    - kw: Given
      text: 'a wait group of 2, a coordinator task 1 that waits, a producer task 2 that sends 1, 2, 3 over a buffered channel (capacity 3) then closes and calls Done, and a consumer task 3 that receives until closed then calls Done, all spawned in that order'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the consumer collects exactly [1, 2, 3], the coordinator resumes only after both call Done, and the run trace is [1, 2, 3, 1]'
    - kw: And
      text: 'the coordinator observes the work finished (no deadlock) and the channel ends closed and drained'
code:
  lang: go
  source: |
    // coordinator: wg.Wait(); record done
    // producer:    for v in {1,2,3}: ch.Send(v); ch.Close(); wg.Done()
    // consumer:    for { v, ok := ch.Recv(); if !ok { break }; collect(v) }; wg.Done()
    // capacity 3 means the producer never blocks, so it runs in one step
checkpoint: A producer, consumer, and coordinator cooperate over a channel and a wait group. Commit and stop here.
---

This is the chapter's demonstration and a genuine concurrent program: three green
threads playing distinct roles, coordinated entirely by the primitives you built.
The producer streams values into a buffered channel and closes it; the consumer
drains the channel until it reads closed; the coordinator waits on a wait group until
both have reported done. No shared mutable state, no races - just channels and a latch
over a single deterministic driver.

Because the channel's capacity (3) covers every value the producer sends, the
producer never blocks and finishes in one step, closing behind itself. The consumer
then receives all three values and the closed signal, collecting `[1, 2, 3]`. The
coordinator, having blocked first, is released by the second `Done` - trace `[1, 2, 3,
1]`. This is the shape of almost every real concurrent design: fan work out over
channels, join it back with a group. The final chapter adds policy and safety - and
then the capstone runs a richer version of exactly this.
