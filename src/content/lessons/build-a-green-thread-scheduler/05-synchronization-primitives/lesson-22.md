---
project: build-a-green-thread-scheduler
lesson: 22
title: An unbuffered channel
overview: Channels are how green threads pass values, not just signals. An unbuffered channel is a pure rendezvous - a send does not complete until a receiver is there to take the value, and vice versa. Today you build that hand-to-hand exchange.
goal: Build an unbuffered channel where send and receive block until the other side arrives.
spec:
  scenario: An unbuffered send rendezvous with a receiver
  status: failing
  lines:
    - kw: Given
      text: 'an unbuffered channel, a receiver task 1 that receives, and a sender task 2 that sends 7, spawned in that order'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'task 1 blocks first (no sender yet), then task 2 hands 7 across and both finish, task 1 having received 7; the run trace is [1, 2, 1]'
    - kw: And
      text: 'in the reverse case a sender with no ready receiver blocks until a receiver arrives to take the value'
code:
  lang: go
  source: |
    type Chan struct { buf []int; cap int; sendq, recvq WaitQueue; s *Scheduler }
    // Recv: if a sender is parked, take its value and wake it; else block.
    // Send(v): if a receiver is parked, hand v to it and wake it; else block
    //   (parking with the pending value; the send completes when a receiver takes it).
    // A woken receiver resumes holding the delivered value.
checkpoint: An unbuffered channel rendezvous a sender and receiver, passing a value. Commit and stop here.
---

An **unbuffered channel** has no room to store anything - it is a **rendezvous**
point where a sender and a receiver meet and exchange a value directly. If one side
arrives first, it must wait for the other: a lone receiver blocks until a sender
shows up, and a lone sender blocks until a receiver does. The value only moves when
both are present, hand to hand.

The `buf` and `cap` fields in the struct stay unused today - `cap` is 0 and nothing
is buffered - because they are seeded for the buffered channel next lesson; leave them
be for now. This builds straight on block-and-wake with a payload. Here the receiver arrives
first and finds no sender, so it parks. The sender arrives, sees the waiting receiver,
hands over `7`, and wakes it; the receiver resumes already holding the value. The
`[1, 2, 1]` trace is the familiar block-wake-resume shape. The symmetry matters:
whichever side is late does the delivering, so the reverse ordering - sender first -
blocks the sender until the receiver arrives. Buffering, which lets a sender run ahead
without a receiver, is next.
