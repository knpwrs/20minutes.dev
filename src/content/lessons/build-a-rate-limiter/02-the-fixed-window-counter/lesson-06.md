---
project: build-a-rate-limiter
lesson: 6
title: The boundary-burst flaw
overview: The fixed-window counter has a famous weakness worth pinning down before moving on - a client can send up to twice the limit in a tiny span by straddling a window boundary. Today you demonstrate that burst exactly, which motivates every algorithm that follows.
goal: Show that a fixed window admits up to 2x the limit across two adjacent windows.
spec:
  scenario: Requests straddling a boundary admit twice the limit
  status: failing
  lines:
    - kw: Given
      text: 'a FixedWindow with limit 3 and window 10'
    - kw: When
      text: 'three requests arrive at tick 9 and three more at tick 10'
    - kw: Then
      text: 'all three at tick 9 are allowed (they fill window 0) and all three at tick 10 are allowed (window 1 has just reset)'
    - kw: And
      text: 'that is 6 allowed requests within a span of a single tick, twice the intended limit of 3'
code:
  lang: go
  source: |
    // no new code - this lesson is a test that exposes the flaw.
    fw := &FixedWindow{limit: 3, window: 10}
    for i := 0; i < 3; i++ { fw.Allow(9) }   // all allowed: window 0
    for i := 0; i < 3; i++ { fw.Allow(10) }  // all allowed: window 1 reset
    // 6 allows across ticks 9..10 - the boundary burst
checkpoint: You have demonstrated the fixed window's 2x boundary burst. Commit and stop here.
---

The fixed-window counter is cheap, but it has a real weakness: because the window
resets on a hard **boundary**, a client can line its requests up around that
boundary and slip through **twice the limit** in a near-instant. Fill window 0
right at its end (tick 9), then fire again the moment window 1 opens (tick 10) - the
reset hands out a fresh full allowance even though almost no time has passed. At
limit 3 that is 6 requests in the span of one tick.

This lesson adds no production code - it is a test that pins the flaw, and pinning
it is the point. The burst is exactly why the rest of the project exists: the
**sliding-window log** (next chapter) counts requests over a rolling trailing
window instead of a fixed one, so the boundary vanishes; the **sliding-window
counter** approximates that cheaply; and the **token bucket** bounds bursts by a
capacity. Every one of them is a different answer to the burst you just measured.
