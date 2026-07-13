---
project: build-a-green-thread-scheduler
lesson: 32
title: 'Capstone: cooperating green threads'
overview: The finale runs a full set of cooperating green threads at once - a producer streaming over a channel to a consumer, two sleepers on the virtual clock, and a coordinator that joins the consumer - and asserts the exact step order, the virtual time each task wakes, and the final results. Every layer you built proves itself together.
goal: Run producer, consumer, two sleepers, and a joiner, and assert the exact trace, wake times, and results.
spec:
  scenario: A full cooperating workload runs deterministically
  status: failing
  lines:
    - kw: Given
      text: 'a buffered channel (capacity 3) and, spawned in order: producer 1 (sends 10, 20, 30 then closes), consumer 2 (receives until closed, yielding after each, summing), sleeper 3 (sleeps 10), sleeper 4 (sleeps 5), and joiner 5 (joins the consumer)'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the consumer receives [10, 20, 30] and sums to 60, the joiner resumes when the consumer finishes, sleeper 4 wakes at Now() 5 and sleeper 3 at Now() 10, the final Now() is 10, and Run returns no error'
    - kw: And
      text: 'the full run trace is exactly [1, 2, 3, 4, 5, 2, 2, 2, 5, 4, 3]'
code:
  lang: go
  source: |
    ch := NewChan(3)
    s.Spawn(producer(ch, []int{10, 20, 30})) // sends then Close
    s.Spawn(consumer(ch))                     // recv-yield loop, sums to 60
    s.Spawn(sleeper(10)); s.Spawn(sleeper(5)) // wake at 10 and 5
    s.Spawn(joiner(consumerTask))             // joins the consumer
    err := s.Run()                            // trace [1,2,3,4,5,2,2,2,5,4,3], now=10
checkpoint: Your runtime runs cooperating green threads with an exact trace and timeline. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a real **cooperative
runtime** running several green threads that block on each other and on time, all
woven into one exact, reproducible schedule. Five tasks with distinct roles - a
producer, a consumer that yields between values, two sleepers with different
deadlines, and a coordinator joining the consumer - and yet the entire interleaving is
a single deterministic trace you can assert to the element.

Read the timeline it produces. At virtual time 0 the producer streams `10, 20, 30`
and closes; the consumer receives and yields after each, summing to `60`; the joiner
blocks until the consumer's final receive completes and wakes it; the two sleepers
park. Only when nothing is left to run does the clock move - jumping to 5 to wake the
nearer sleeper, then to 10 for the farther one, ending at `Now()` 10. The trace `[1,
2, 3, 4, 5, 2, 2, 2, 5, 4, 3]` is the run queue, the wait queues, the channel, the
join, and the virtual clock all agreeing. From a single cursor bumping through a byte
of work, you have built the honest core of a green-thread scheduler - tasks, yielding,
blocking and waking, timers, semaphores, mutexes, channels, wait groups, priority,
deadlock detection, and cancellation - the same cooperative design at the heart of
asyncio and every async runtime, minus the real-time I/O and multi-core parallelism
they layer on top. That is a real scheduler, and it is yours.
