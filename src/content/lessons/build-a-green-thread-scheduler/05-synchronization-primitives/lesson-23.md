---
project: build-a-green-thread-scheduler
lesson: 23
title: A buffered channel
overview: A buffered channel gives a sender some slack - it can send without a receiver present, up to the buffer's capacity, and only blocks when the buffer is full. Today you add capacity, and pin the exact boundary where a send starts to block.
goal: Add a buffer so sends block only when full and receives return values in FIFO order.
spec:
  scenario: A send blocks only once the buffer is full
  status: failing
  lines:
    - kw: Given
      text: 'a buffered channel of capacity 2, a producer task 1 that sends 1, 2, then 3, and a consumer task 2 that receives once, spawned in that order'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'the sends of 1 and 2 do not block, the send of 3 blocks because the buffer is full, and the consumer receives 1 (FIFO)'
    - kw: And
      text: 'the receive frees a slot so the pending 3 enters the buffer, which then holds [2, 3]; on a capacity-0 channel the very first send would block instead'
code:
  lang: go
  source: |
    // Send(v): if a receiver waits, hand off; else if len(buf) < cap, append and
    //   continue; else block (park with the pending value).
    // Recv: take buf[0]; if a sender is parked, move its pending value into buf and
    //   wake it; return the taken value. (buffer is FIFO)
    // capacity 0 has no room, so it reduces to the unbuffered rendezvous.
checkpoint: A buffered channel blocks a send only when full and receives FIFO. Commit and stop here.
---

**Buffering** decouples sender and receiver in time. A buffered channel of capacity
`k` holds up to `k` values in a FIFO queue, so a producer can send `k` times before a
consumer takes anything - useful when work arrives in bursts. A send blocks only when
the buffer is **full**; a receive blocks only when it is **empty**. Capacity 0 is the
degenerate case with no room at all, which is exactly the unbuffered rendezvous from
the previous lesson.

The boundary is the whole lesson. With capacity 2, the producer sends `1` and `2`
into the buffer without blocking, but the third send finds the buffer full and parks,
carrying its pending value `3`. When the consumer receives, it takes `1` from the
front and, seeing a parked sender, moves that sender's `3` into the freed slot and
wakes it - so the buffer transitions `[1, 2]` to `[2, 3]` and the producer completes.
Pinning "blocks exactly when full, not before" is what keeps a buffered channel from
silently behaving like an unbuffered one.
