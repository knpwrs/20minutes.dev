---
project: build-an-agent-harness
lesson: 25
title: Backoff and the retry-after header
overview: A retryable failure should not be retried instantly, and the API can tell you exactly how long to wait. Today you compute an exponential backoff, then let a retry-after header override it outright.
goal: Compute an exponential backoff delay per attempt, and confirm a retry-after header on the error replaces that computed delay entirely rather than adding to it.
spec:
  scenario: Computed backoff, and a header that overrides it
  status: failing
  lines:
    - kw: Given
      text: 'a retry policy with base delay 1 second and factor 2, so attempt 0''s computed delay is 1s and attempt 1''s is 2s, and a server that fails twice with a plain 500 - no retry-after header on either failure - then succeeds on the third call'
    - kw: When
      text: the request is retried with a clock that records every requested delay instead of actually sleeping
    - kw: Then
      text: 'the recorded delay sequence is exactly [1s, 2s] - the computed backoff for attempts 0 and 1'
    - kw: When
      text: 'the same retry policy instead runs against a server that fails once with a 429 carrying a retry-after header of 5 seconds, then succeeds'
    - kw: Then
      text: 'the recorded delay sequence is exactly [5s] - the header value replaced the computed 1s backoff for that attempt outright, it did not add to it'
code:
  lang: go
  source: |
    // delay for attempt N (0-based): base * factor^N
    func ComputeBackoff(attempt int, base time.Duration, factor float64) time.Duration {
        return time.Duration(float64(base) * math.Pow(factor, float64(attempt)))
    }
    // if the failed attempt's error carries a retry-after value, use THAT
    // instead of the computed delay - never both
checkpoint: Retries now wait a sensible, growing amount of time by default, and immediately defer to the API's own instruction whenever it gives one. Commit and stop for today.
---

A computed backoff - wait longer after each successive failure - is a reasonable default when the API has not told you anything more specific. But a `429` very often does tell you more: a `retry-after` header giving the exact number of seconds to wait. When that header is present, it is not a hint to blend with your own guess; it replaces the computed delay for that attempt completely, because the server is telling you something a formula cannot know.

Assert this by the **computed delay sequence** a retry loop actually asks its clock to sleep for, never by measuring how long a test took to run. A spec that waits on the wall clock is a spec that is occasionally, mysteriously slow or flaky under load - and there is no need for that here, because the clock the retry loop sleeps on is a parameter, not a hardcoded call to the real one. A test clock just records what it was asked to sleep for and returns immediately, which is what makes today's two cases - the computed sequence, and the header overriding it - checkable in an instant.
