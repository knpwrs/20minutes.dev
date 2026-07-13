---
project: build-a-rate-limiter
lesson: 15
title: Refill caps at capacity
overview: Refill must never overfill the bucket. Capping accrual at the capacity is what bounds bursts - no matter how long a client idles, it can never bank more than a full bucket, so the burst ceiling holds even after a long quiet period.
goal: Ensure a long idle period tops the bucket up to capacity, never beyond.
spec:
  scenario: An idle bucket refills to capacity and no further
  status: failing
  lines:
    - kw: Given
      text: 'a TokenBucket with capacity 3 and rate 1, starting full, with no requests until tick 100'
    - kw: When
      text: 'Allow is called four times, all at tick 100'
    - kw: Then
      text: 'the refill would add 100 * 1 = 100 tokens but is capped at capacity, so the bucket holds 3, not 103, and the first allowed request leaves 2'
    - kw: And
      text: 'exactly three requests are allowed and the fourth is denied - idling for 100 ticks still grants only a capacity-sized burst of 3'
code:
  lang: go
  source: |
    // the cap from yesterday's refill is what bounds the burst:
    b.tokens += elapsed * b.rate
    if b.tokens > b.capacity {
      b.tokens = b.capacity   // never bank more than a full bucket
    }
    // after idling to tick 100: tokens = min(3, 3 + 100) = 3
checkpoint: A long idle period tops the bucket up to capacity but no higher. Commit and stop here.
---

Yesterday's refill already clamps at capacity; this lesson pins **why that clamp
matters**. Without it, a client that stayed quiet for a hundred ticks would return
to find a hundred banked tokens and could fire a hundred requests at once - the rate
limit would mean nothing after any idle stretch. The cap is what makes the
**capacity a hard burst ceiling**: accrued tokens are `min(capacity, tokens +
elapsed * rate)`, so the bucket tops up to full and stops.

Watch it hold. A capacity-3 bucket idle until tick 100 would nominally accrue 100
tokens, but the cap pins it at 3. The first request then leaves 2 (not 102), and
after three allows the fourth is denied. So idling buys back at most a full bucket -
a burst of `capacity`, never more. This is the token bucket's whole bargain: bursts
are allowed, but bounded, and the bound is the one number you chose.
