---
project: build-a-green-thread-scheduler
lesson: 31
title: Assembling the runtime
overview: Before the full capstone, prove the pieces compose. A single run mixes a sleeper, a channel rendezvous, and the scheduler loop - tasks that block on time and on each other in one program - and produces one exact trace and timeline. This is the vertical slice.
goal: Run a sleeper alongside a channel producer and consumer and assert the combined trace and clock.
spec:
  scenario: Time-based and value-based waiting compose
  status: failing
  lines:
    - kw: Given
      text: 'task 1 that sleeps 5, task 2 that sends 99 over an unbuffered channel, and task 3 that receives from it, spawned in that order'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the consumer receives 99 while the clock is still 0, then the clock advances to 5 to wake the sleeper; the final Now() is 5 and the run trace is [1, 2, 3, 2, 1]'
    - kw: And
      text: 'Run returns no error - the channel work drains before any virtual time passes'
code:
  lang: go
  source: |
    // task 1: s.Sleep(5); done
    // task 2: ch.Send(99); done   (unbuffered: blocks until the receiver takes it)
    // task 3: v := ch.Recv(); record v; done
    // the sleeper parks, the send/recv rendezvous at now=0, then the clock jumps to 5
checkpoint: A sleeper and a channel rendezvous compose in one deterministic run. Commit and stop here.
---

This is the integration check: two *different kinds* of waiting happening in one
program. The sleeper waits on the virtual clock; the producer and consumer wait on
each other through an unbuffered channel. The scheduler juggles both with the rules
you already built - block-and-wake for the rendezvous, clock-advance-when-idle for the
sleep - and nothing special is needed to make them coexist.

Follow the interplay. The sleeper parks on its timer immediately. The producer sends
`99` but, on an unbuffered channel with no receiver yet, blocks. The consumer receives,
takes `99`, and wakes the producer, which finishes - all while `Now()` is still 0,
because the run queue never emptied during it. Only once every ready and woken task is
done does the clock finally advance to 5 and wake the sleeper. The trace `[1, 2, 3, 2,
1]` and final time 5 show channel work and time cleanly interleaved. The capstone next
scales this up to the full cooperating set.
