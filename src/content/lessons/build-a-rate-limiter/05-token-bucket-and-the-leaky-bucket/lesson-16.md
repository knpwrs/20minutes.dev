---
project: build-a-rate-limiter
lesson: 16
title: Requests that cost more than one
overview: Not every request is equal - a bulk call might be worth several ordinary ones. Today you generalize spending to a cost, so a single request can consume several tokens at once and is allowed only if the bucket holds enough.
goal: Spend a caller-supplied cost of tokens, allowing only if the bucket has enough.
spec:
  scenario: A costly request needs enough tokens or is denied whole
  status: failing
  lines:
    - kw: Given
      text: 'a TokenBucket with capacity 5 and rate 1, starting full, with all calls at tick 0'
    - kw: When
      text: 'AllowN(now, 3) is called, then AllowN(now, 3) again, then AllowN(now, 2)'
    - kw: Then
      text: 'the first is allowed, spending 3 tokens to leave 2, and the second is denied because 2 tokens is not enough for a cost of 3 (and it spends nothing)'
    - kw: And
      text: 'the third, a cost of 2, is allowed against the remaining 2 tokens, leaving 0; plain Allow(now) is exactly AllowN(now, 1)'
code:
  lang: go
  source: |
    func (b *TokenBucket) AllowN(now int64, cost float64) Decision {
      b.refill(now)
      if b.tokens >= cost {
        b.tokens -= cost
        return Decision{Allowed: true}
      }
      return Decision{Allowed: false}
    }
    func (b *TokenBucket) Allow(now int64) Decision { return b.AllowN(now, 1) }
checkpoint: The bucket spends a variable cost per request, all or nothing. Commit and stop here.
---

Real systems weight requests differently - a search that scans a thousand records
should draw down more allowance than a cheap key lookup. The token bucket handles
this naturally: instead of always spending one token, spend a caller-supplied
**cost**. A request is allowed only if the bucket holds at least `cost` tokens, and
it is **all or nothing** - if there are not enough, the request is denied and spends
none, rather than partially draining the bucket.

Generalizing spend to a cost also tidies the earlier method: plain `Allow(now)` is
just `AllowN(now, 1)`. Pin the all-or-nothing rule precisely: a capacity-5 bucket
allows a cost-3 request (leaving 2), then **denies** the next cost-3 request because
2 is short of 3, leaving those 2 tokens untouched for a later cost-2 request that
fits exactly. This variable cost is how a single limiter fairly meters a mix of
cheap and expensive operations.
