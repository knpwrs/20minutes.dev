---
project: build-a-rate-limiter
lesson: 1
title: A virtual clock
overview: Every rate limiter is about time - how many requests in how long - so the first thing we build is time we fully control. A virtual clock starts at zero and only moves when you advance it, which makes every later allow/deny decision exact and reproducible.
goal: Build a clock that starts at 0 and moves forward only when you advance it.
spec:
  scenario: Time moves only when advanced
  status: failing
  lines:
    - kw: Given
      text: 'a new clock from NewClock()'
    - kw: When
      text: 'Now() is queried'
    - kw: Then
      text: 'it reports 0'
    - kw: And
      text: 'after Advance(5) it reports 5, then after Advance(3) it reports 8, and Advance(0) leaves it at 8'
code:
  lang: go
  source: |
    // time is a plain int64 count of "ticks" - no real wall clock
    type Clock struct {
      now int64
    }
    func NewClock() *Clock { return &Clock{} }
    func (c *Clock) Now() int64      { return c.now }
    func (c *Clock) Advance(d int64) { c.now += d }
checkpoint: You have a deterministic clock that only moves when told. Commit and stop here.
---

A rate limiter's whole job is measuring requests against time, so if time is the
real wall clock every test becomes a race with sleeps and slop. We dodge that
entirely with a **virtual clock**: time is a plain integer count of **ticks** that
starts at 0 and moves *only* when you call `Advance`. Nothing happens in the
background. A tick has no fixed real-world duration - it is whatever unit a given
limiter treats as its window or refill rate.

Because the clock is injected and hand-advanced, every decision the limiters make
later is pinned to an exact moment you chose, so an allow or a deny is never
"probably" - it is a value you assert. `Advance(0)` is a no-op by design: advancing
by nothing must not move time. Build this tiny clock now; every limiter in the
project reads the current tick from it.
