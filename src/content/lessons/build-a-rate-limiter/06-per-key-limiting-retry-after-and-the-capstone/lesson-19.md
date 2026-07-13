---
project: build-a-rate-limiter
lesson: 19
title: Retry-after for the token bucket
overview: A good limiter tells a denied client when to come back rather than leaving it to guess. Today you extend the decision with a retry-after hint and compute it for the token bucket - how many ticks until one whole token has refilled.
goal: On a denied request, report the ticks until a token is available.
spec:
  scenario: A denied bucket reports when a token will be ready
  status: failing
  lines:
    - kw: Given
      text: 'a TokenBucket with capacity 2 and rate 0.5, starting full, drained by two Allows at tick 0'
    - kw: When
      text: 'a third Allow is made at tick 0, and another at tick 1'
    - kw: Then
      text: 'the tick-0 call is denied with RetryAfter 2 - it needs 1 whole token at 0.5 per tick, so ceil(1 / 0.5) = 2 ticks'
    - kw: And
      text: 'the tick-1 call is denied with RetryAfter 1 - 0.5 token has accrued, so it needs 0.5 more at 0.5 per tick, ceil(0.5 / 0.5) = 1; an allowed request always reports RetryAfter 0'
code:
  lang: go
  source: |
    // Decision now carries a hint: type Decision struct { Allowed bool; RetryAfter int64 }
    func (b *TokenBucket) AllowN(now int64, cost float64) Decision {
      b.refill(now)
      if b.tokens >= cost { b.tokens -= cost; return Decision{Allowed: true} }
      need := cost - b.tokens
      wait := int64(math.Ceil(need / b.rate))
      return Decision{Allowed: false, RetryAfter: wait}
    }
checkpoint: The token bucket tells a denied caller how long to wait. Commit and stop here.
---

Denying a request is more useful when it comes with advice: *come back in N ticks*.
This is the `Retry-After` header a real API returns with a 429, and it turns a blind
retry loop into a paced one. We add a **`RetryAfter`** field to the `Decision`
(zero whenever a request is allowed). For the token bucket the wait is the time
until the bucket holds enough tokens: the shortfall `cost - tokens` divided by the
refill `rate`, **rounded up** to a whole tick, because a partial tick has not
delivered its token yet.

Rounding up is the detail to pin. A capacity-2 bucket at rate 0.5, freshly drained,
needs a full token; at 0.5 per tick that is `ceil(1 / 0.5) = 2` ticks. One tick
later it has banked 0.5, so it needs only 0.5 more - `ceil(0.5 / 0.5) = 1` tick. The
countdown is honest: at each denied call the hint reflects exactly how much longer
this bucket will make the client wait. Tomorrow you compute the same hint for the
fixed window, where the answer comes from the window boundary instead of a refill
rate.
