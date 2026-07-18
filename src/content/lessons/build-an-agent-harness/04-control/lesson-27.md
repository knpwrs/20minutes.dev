---
project: build-an-agent-harness
lesson: 27
title: Cancellation
overview: A caller who hits stop is not waiting for a deadline - they want a request that is already running to abort now. Today you cancel a live, in-flight request from another goroutine and confirm it stops cleanly.
goal: Confirm that cancelling a request while it is mid-flight - blocked waiting on the server - returns a cancellation error and leaves the server's work unfinished.
spec:
  scenario: Cancelling a request that is already in flight
  status: failing
  lines:
    - kw: Given
      text: a client pointed at a server whose handler blocks until it is released, and a request sent on a cancellable signal so that the send is genuinely in progress, waiting on that handler
    - kw: When
      text: the signal is cancelled from another goroutine while the request is still waiting, before the handler is ever released
    - kw: Then
      text: the in-flight call returns promptly with an error rather than a response, and that error is rooted in the request having been cancelled, not a timeout or a server failure
    - kw: And
      text: 'the handler''s side effect - a flag it sets only when it finishes - is still false: the request was abandoned while waiting, so the work behind it never completed'
    - kw: And
      text: as a second trigger of the same behaviour, a request whose signal was already cancelled before the send even started aborts the same way - error rooted in cancellation, side effect still false
code:
  lang: go
  source: |
    // send on a cancellable signal, then cancel from another goroutine while
    // the request is still blocked waiting on the server
    ctx, cancel := context.WithCancel(context.Background())
    go func() { /* once the request is provably in flight */ cancel() }()
    _, err := client.CreateMessage(ctx, req) // returns rooted in ctx.Err()
    // the handler's side-effect flag stays false - it never finished
checkpoint: A request now aborts cleanly whether it is cancelled before it starts or midway through - and either way, nothing on the server side got to run. Commit and stop for today.
---

A deadline expiring and a caller giving up are different events - one is time running out on its own, the other is someone actively deciding to stop - but a request needs to react to both the same way: abort immediately, and leave no side effect behind. This is why the same cancellation signal that carries a deadline also lets you trigger it directly, at any moment, for any reason.

Lesson 26 aborted a request that never really started - the deadline had already passed. Cancellation is more interesting, because the request you want to stop is usually one that is genuinely running: the model is mid-response, the tool is mid-call, and the user hits stop. So prove it on a live request. Start the send against a handler that blocks, wait until the request is provably in flight, and cancel from another goroutine. The in-flight call returns promptly with a cancellation error, and the handler's flag - which it sets only on completion - never flips, because the request was abandoned while it waited.

The already-cancelled case from before still holds too, and today's spec keeps it as a second trigger of the one behaviour: whether the signal was dead before you sent or killed while you waited, the request aborts the same clean way and leaves nothing running behind it. That is the guarantee that makes a stop button trustworthy on a long agent turn - not "it will stop once it finishes," but "it stops now, and nothing it started keeps going."
