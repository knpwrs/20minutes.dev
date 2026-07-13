---
project: build-a-rate-limiter
lesson: 20
title: Retry-after for the fixed window
overview: Different algorithms answer retry-after from different clocks. For the fixed window the wait is simply the time until the current window ends and the count resets. Today you compute it and return it on every denied request.
goal: On a denied fixed-window request, report the ticks until the window resets.
spec:
  scenario: A denied fixed window reports the time to its next reset
  status: failing
  lines:
    - kw: Given
      text: 'a FixedWindow with limit 3 and window 10, filled by Allows at ticks 0, 1, 2'
    - kw: When
      text: 'a request is denied at tick 3, and another is denied at tick 9'
    - kw: Then
      text: 'the tick-3 denial reports RetryAfter 7 - the current window (index 0) ends at tick 10, so (0 + 1) * 10 - 3 = 7'
    - kw: And
      text: 'the tick-9 denial reports RetryAfter 1 - only one tick remains until the window resets at tick 10; an allowed request reports RetryAfter 0'
code:
  lang: go
  source: |
    func (f *FixedWindow) Allow(now int64) Decision {
      w := now / f.window
      if w != f.curWindow { f.curWindow, f.count = w, 0 }
      if f.count < f.limit {
        f.count++
        return Decision{Allowed: true}
      }
      wait := (f.curWindow+1)*f.window - now // ticks until this window ends
      return Decision{Allowed: false, RetryAfter: wait}
    }
checkpoint: The fixed window tells a denied caller when its window resets. Commit and stop here.
---

Retry-after depends on **why** a limiter is denying, so each algorithm computes it
differently. The token bucket denies because it is short of tokens, so its wait came
from the refill rate. The fixed window denies because the current window is full, and
that clears at a fixed moment: the **end of the window**. The wait is therefore
`(curWindow + 1) * window - now` - the next window boundary minus the current tick -
and it needs no rounding because window boundaries fall on exact ticks.

Pin it at two points in the same window. Denied at tick 3, the window (index 0) ends
at tick 10, so the client should retry in 7 ticks. Denied at tick 9, only 1 tick
remains, so the hint is 1 - and indeed tick 10 opens a fresh window, exactly as the
retry-after promised. Two limiters, two very different sources for the same piece of
advice, both now honest to the tick. This is the last piece of the individual
algorithms; next you make them interchangeable.
