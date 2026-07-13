---
project: build-a-rate-limiter
lesson: 3
title: A fixed quota
overview: The simplest limiter that actually says no is a fixed quota - allow the first N requests, then deny the rest. It has no notion of time yet, but it introduces the counting-against-a-limit logic every windowed algorithm is built on.
goal: Allow requests while a running count is below the limit, then deny.
spec:
  scenario: A quota allows exactly the limit, then denies
  status: failing
  lines:
    - kw: Given
      text: 'a Counter limiter created with limit 3'
    - kw: When
      text: 'Allow is called five times (the value of now does not matter)'
    - kw: Then
      text: 'the first three return Allowed = true and the fourth and fifth return Allowed = false'
    - kw: And
      text: 'the internal count stops at 3 - denied requests do not increment it past the limit'
code:
  lang: go
  source: |
    // allow only while we are still under the limit
    type Counter struct {
      limit int
      count int
    }
    func (c *Counter) Allow(now int64) Decision {
      if c.count < c.limit {
        c.count++
        return Decision{Allowed: true}
      }
      return Decision{Allowed: false}
    }
checkpoint: A quota allows exactly the limit and then denies. Commit and stop here.
---

Before adding time, get the core comparison right: a limiter permits a request
only while a running **count** is still **below the limit**. Allow the request and
increment; once the count reaches the limit, deny. This `Counter` is a lifetime
quota - it never resets - so after three allows it says no forever. That is not a
useful limiter on its own, but the `count < limit` test at its heart is exactly
what every windowed algorithm reuses.

Note the boundary precisely: with a limit of 3, the third request is the *last*
allowed (count goes 0, 1, 2, then hits 3), and every request after is denied. A
denied request must **not** advance the count - it did not consume any quota - so
the count settles at the limit and stays there. Tomorrow you give this counter a
sense of time so the quota refreshes each window.
