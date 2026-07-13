---
project: build-a-rate-limiter
lesson: 17
title: The leaky bucket
overview: The leaky bucket is the token bucket's mirror image and the other classic traffic shaper. Instead of tokens accruing to spend, a level fills with each request and drains at a constant rate, so it smooths a bursty input into a steady output rather than admitting bursts.
goal: Fill a level on each request and leak it down at a constant rate, denying on overflow.
spec:
  scenario: The level fills on requests and leaks down over time
  status: failing
  lines:
    - kw: Given
      text: 'a LeakyBucket with capacity 3 and leak rate 1, starting empty (level 0)'
    - kw: When
      text: 'Allow is called three times at tick 0, once more at tick 0, then once at tick 1'
    - kw: Then
      text: 'the three tick-0 requests are allowed, raising the level to 1, 2, then 3, and the fourth is denied because level + 1 = 4 would exceed the capacity of 3'
    - kw: And
      text: 'at tick 1 the level first leaks down by 1 * 1 = 1 to 2, so the request is allowed and the level rises back to 3'
code:
  lang: go
  source: |
    type LeakyBucket struct {
      capacity, leakRate float64
      level              float64
      lastLeak           int64
    }
    func (b *LeakyBucket) Allow(now int64) Decision {
      elapsed := float64(now - b.lastLeak)
      b.level -= elapsed * b.leakRate
      if b.level < 0 { b.level = 0 }
      b.lastLeak = now
      if b.level+1 <= b.capacity { b.level++; return Decision{Allowed: true} }
      return Decision{Allowed: false}
    }
checkpoint: The leaky bucket smooths bursts by leaking at a constant rate. Commit and stop here.
---

The **leaky bucket** is the token bucket seen from the other side, and the second
classic traffic-shaping algorithm. Picture a bucket with a hole in the bottom: each
admitted request pours in one unit, and the bucket **leaks** at a constant rate. A
request is admitted only if it would not **overflow** the capacity; otherwise it is
dropped. The level is clamped at 0 so idle time never leaks it negative. Where the
token bucket starts full and hands out an immediate burst, the leaky bucket starts
**empty** and fills up, so its emphasis is on **smoothing** - it enforces a steady
drain rate and only tolerates a burst up to the headroom the capacity provides.

The two are close cousins - both cap sustained throughput at their rate and both
allow a bounded burst - but the framing differs. The token bucket asks "do I have
tokens to spend?" and favors letting saved-up capacity through at once; the leaky
bucket asks "is there room before I overflow?" and favors a constant output. Pin its
motion: three requests fill a capacity-3 bucket, the fourth overflows and is denied,
then after one tick of leaking (dropping the level from 3 to 2) there is room for one
more. That constant leak is what turns spiky input into an even output stream.
