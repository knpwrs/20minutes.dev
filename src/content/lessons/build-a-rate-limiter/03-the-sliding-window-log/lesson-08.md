---
project: build-a-rate-limiter
lesson: 8
title: Where the log beats the fixed window
overview: Now prove the sliding log earns its cost. Today you pin a request sequence the fixed-window counter would wrongly allow because of its boundary reset, and show the log correctly denying it - the exact scenario that motivated the whole chapter.
goal: Show the log denying a request a fixed window would allow at a boundary.
spec:
  scenario: The log rejects the boundary burst the fixed window permits
  status: failing
  lines:
    - kw: Given
      text: 'a SlidingLog with limit 3 and window 10'
    - kw: When
      text: 'requests arrive at ticks 8, 9, 9 (all allowed, filling the log with [8, 9, 9]) and then one more at tick 10'
    - kw: Then
      text: 'the tick-10 request is denied - its trailing window keeps all three of [8, 9, 9] (each is greater than 10 - 10 = 0), so the limit is already met'
    - kw: And
      text: 'a fixed window would instead allow that tick-10 request, since 10 / 10 = 1 opens a fresh window; a later request at tick 18 is allowed by the log because entry 8 has now aged out'
code:
  lang: go
  source: |
    // same SlidingLog.Allow from yesterday - this lesson is a test.
    s := &SlidingLog{limit: 3, window: 10}
    s.Allow(8); s.Allow(9); s.Allow(9) // log = [8, 9, 9], all allowed
    d := s.Allow(10)                   // cutoff 0; all 3 kept -> denied
    // at tick 18, cutoff 8, entry 8 drops -> allowed again
checkpoint: You have shown the log denying a boundary burst the fixed window admits. Commit and stop here.
---

This is the payoff for the log's memory cost. Take the exact pattern that broke the
fixed window: three requests bunched at the end of a window (ticks 8, 9, 9), then
one just after the fixed window's boundary (tick 10). The fixed window resets at
tick 10 and waves the fourth request through - the burst. The sliding log does not:
at tick 10 its trailing window is `(0, 10]`, and all three stored timestamps (8, 9,
9) are still inside it, so the count is already 3 and the request is **denied**.

The log has no privileged boundary - the window is always measured backward from
*now*, so the same three-in-a-row pattern is limited no matter where it lands on the
clock. Only once real time passes and an entry ages out does room open up: at tick
18 the cutoff is 8, so the timestamp `8` finally drops (it is not greater than 8),
the count falls to 2, and a new request is allowed. Precise counting, at the price
of remembering every request.
