---
project: build-a-green-thread-scheduler
lesson: 24
title: Closing a channel
overview: A producer needs a way to say "no more values are coming." Closing a channel does that - it wakes every blocked receiver at once and makes further receives return a closed signal, so consumers can finish cleanly instead of blocking forever.
goal: Add Close, which wakes all blocked receivers and makes receives report closed.
spec:
  scenario: Close releases all blocked receivers
  status: failing
  lines:
    - kw: Given
      text: 'an unbuffered channel with receivers 1 and 2 both blocked on it (in that order), and task 3 that closes the channel, all spawned in that order'
    - kw: When
      text: 'Run is called'
    - kw: Then
      text: 'closing wakes both receivers in FIFO order, each receive returning ok = false (closed), and the run trace is [1, 2, 3, 1, 2]'
    - kw: And
      text: 'a receive on a closed channel that still holds a buffered value returns that value with ok = true first, and only reports closed once the buffer is drained'
code:
  lang: go
  source: |
    func (ch *Chan) Close() {
      ch.closed = true
      for len(ch.recvq.waiters) > 0 { ch.s.Wake(&ch.recvq) } // wake ALL, FIFO
    }
    // Recv now yields a value AND an ok flag, e.g. Recv(dst *int) (Status, bool):
    //   buf non-empty -> deliver buf[0], ok=true; else if closed -> (0, false);
    //   else block. A receiver woken by a SEND resumes holding the delivered value
    //   (ok=true); a receiver woken by CLOSE finds no value delivered and the channel
    //   closed, so it reports (0, false) on resume - it does NOT re-call Recv.
checkpoint: Closing a channel wakes all receivers and reports closed. Commit and stop here.
---

**Closing** is the channel's end-of-stream marker. A consumer looping "receive until
closed" needs the channel to eventually tell it to stop; without close, a receiver
waiting on a channel no one will send to again would block forever. `Close` sets a
flag and, importantly, wakes **every** blocked receiver - not just one - because they
all need to learn the stream is over. `Recv` now returns a value **and** an `ok` flag;
a receiver woken by a normal send resumes holding its delivered value (`ok = true`),
while a receiver woken by `Close` finds nothing was delivered and reports the zero
value with `ok = false` - without re-running `Recv`, following the same resume-past-
the-block rule as every other primitive.

Two rules keep close well-behaved. First, waking is still FIFO, so the receivers
resume in the order they blocked - trace `[1, 2, 3, 1, 2]`. Second, closing does not
throw away buffered data: a receive on a closed channel that still holds values
returns them normally (`ok = true`) and only signals closed (`ok = false`) once the
buffer is empty. That "drain then close" order is what lets a consumer receive every
last value a producer sent before closing.
