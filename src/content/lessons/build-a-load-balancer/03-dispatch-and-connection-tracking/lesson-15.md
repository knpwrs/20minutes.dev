---
project: build-a-load-balancer
lesson: 15
title: Releasing on failure
overview: A backend can fail mid-request, and the transport returns an error. The active count must still come back down, or a flaky backend slowly looks permanently overloaded. Today you pin that the lease is released even on error.
goal: Ensure Dispatch releases the lease and returns the error when the transport fails, leaving the active count at zero.
spec:
  scenario: A failed dispatch still frees the connection
  status: failing
  lines:
    - kw: Given
      text: 'a Balancer over a single-backend pool holding A, and a transport that always returns an error'
    - kw: When
      text: 'Dispatch is called once'
    - kw: Then
      text: 'it returns that error (and an empty response)'
    - kw: And
      text: 'A.Active() is back to 0 - the lease was released despite the failure'
code:
  lang: go
  source: |
    // No new code should be needed if Dispatch already uses `defer release()`:
    // the defer runs whether the transport returns a response or an error.
    // This lesson adds the failing-transport test and pins Active() == 0.
    // If your Dispatch released only on success, move the release into a defer now.
checkpoint: A connection is released even when the request fails, keeping active counts honest. Commit and stop here.
---

Connections do not only end cleanly - a backend can time out, reset, or return an
error partway through. When that happens the balancer still has to **release** the
lease, because the request is no longer in flight. Forget this and every failed
request permanently inflates the backend's active count; least-connections would
then steer traffic away from a backend that has actually recovered, and the counts
drift further from reality with each failure.

If you wrote `Dispatch` with a `defer release()` last lesson, this behavior is
already correct - the deferred call runs on every return path, success or error - so
today is a **payoff**: add the failing-transport test and watch the active count
return to 0 even though the request failed. If instead you released only on the
success path, this is the lesson to move the release into a `defer`. Either way, the
error itself is propagated to the caller; releasing the lease and reporting the
failure are two separate obligations, and Dispatch owes both.
