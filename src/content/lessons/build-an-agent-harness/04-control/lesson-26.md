---
project: build-an-agent-harness
lesson: 26
title: A request timeout
overview: A request should never wait forever for a reply that may never come. Today you confirm what happens when the deadline is already gone before the request is even sent - no real waiting required to prove it.
goal: Confirm that sending a request with an already-expired deadline returns a deadline error immediately, and that the server-side work it would have triggered never happens.
spec:
  scenario: An already-expired deadline aborts the request before it can finish
  status: failing
  lines:
    - kw: Given
      text: a client pointed at a server whose handler blocks until it is released, and a request deadline created already in the past
    - kw: When
      text: the request is sent using that already-expired deadline
    - kw: Then
      text: the call returns an error rather than a response, and that error is rooted in the deadline having been exceeded, not some other failure
    - kw: And
      text: 'the handler''s side effect - a flag it sets only once it finishes running - is still false: the deadline was already gone, so the handler''s work was never allowed to complete'
code:
  lang: go
  source: |
    // deadline already in the past before the request is even sent
    ctx, cancel := context.WithTimeout(context.Background(), -1*time.Second)
    defer cancel()
    _, err := client.CreateMessage(ctx, req)
    // err is rooted in ctx.Err(); the handler's side-effect flag stays false
checkpoint: A request now respects a deadline instead of waiting on a reply that might never arrive, and you have proven it without a single real sleep. Commit and stop for today.
---

A request with no deadline at all can hang forever against a server that never answers - a dropped connection, an overloaded backend, anything. Giving every request a deadline is the fix, but proving it works does not require actually waiting one out: a deadline set to a moment already in the past fires the instant the request is sent, with no real time passing at all.

What is worth checking is not just that an error comes back, but that nothing the server would have done actually happened. Point the client at a handler that blocks until released and only sets a flag once it finishes, never release it, and send the request with that already-expired deadline. The call returns immediately with a deadline error, and the flag stays false - the request was abandoned before the handler's work could ever complete, which is exactly the guarantee a timeout is supposed to give you.
