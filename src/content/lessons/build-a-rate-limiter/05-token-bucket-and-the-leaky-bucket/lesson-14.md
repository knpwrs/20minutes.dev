---
project: build-a-rate-limiter
lesson: 14
title: Refilling with elapsed time
overview: A bucket that never refills is just a quota. Today you add the refill - tokens accrue in proportion to the virtual time elapsed since the last check, fractionally, so the bucket recovers smoothly and a drained bucket re-allows the exact tick a whole token has built back up.
goal: Add tokens equal to elapsed time times the rate, then decide.
spec:
  scenario: A drained bucket refills fractionally over time
  status: failing
  lines:
    - kw: Given
      text: 'a TokenBucket with capacity 1 and rate 0.5 (half a token per tick), starting full'
    - kw: When
      text: 'Allow is called at tick 0, again at tick 0, then at tick 1, then at tick 2'
    - kw: Then
      text: 'tick 0 is allowed (draining to 0), the second tick-0 call is denied (zero time elapsed adds no tokens), and tick 1 is denied because only 1 * 0.5 = 0.5 token has accrued'
    - kw: And
      text: 'tick 2 is allowed because another 0.5 accrues to reach exactly 1.0 token - the drained bucket re-allows precisely at tick 2, not before'
code:
  lang: go
  source: |
    func (b *TokenBucket) refill(now int64) {
      elapsed := float64(now - b.lastRefill)
      b.tokens += elapsed * b.rate
      if b.tokens > b.capacity { b.tokens = b.capacity }
      b.lastRefill = now
    }
    func (b *TokenBucket) Allow(now int64) Decision {
      b.refill(now)
      if b.tokens >= 1 { b.tokens--; return Decision{Allowed: true} }
      return Decision{Allowed: false}
    }
checkpoint: The token bucket refills fractionally with elapsed virtual time. Commit and stop here.
---

Refilling is what turns the bucket from a one-shot quota into a continuous rate
limiter. On each request, before deciding, compute how much virtual time has passed
since the last refill and add `elapsed * rate` tokens. Crucially the accrual is
**fractional** - at rate 0.5 a single tick adds half a token - so the bucket refills
smoothly rather than in whole-token jumps, and the long-run admission rate settles
at exactly `rate` requests per tick.

The edges are what to pin. **Zero elapsed time adds nothing**: two requests at the
same tick see no refill between them, so a bucket drained by the first denies the
second. And a drained bucket re-allows only when a **whole** token has accrued: at
rate 0.5, one tick after draining leaves 0.5 tokens (still denied), and it takes a
second tick to reach 1.0 and allow again. So the drained bucket re-opens at exactly
tick 2, not tick 1 - the kind of precise, fractional boundary the virtual clock lets
you assert to the token.
