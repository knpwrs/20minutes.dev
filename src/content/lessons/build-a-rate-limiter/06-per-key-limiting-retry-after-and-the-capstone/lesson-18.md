---
project: build-a-rate-limiter
lesson: 18
title: A limiter per key
overview: A real service limits each client independently, not the whole world against one counter. Today you build a keyed limiter that lazily creates a fresh limiter per client id, so one client exhausting its allowance cannot starve another.
goal: Give each key its own limiter so their allowances are independent.
spec:
  scenario: One key's exhaustion does not affect another
  status: failing
  lines:
    - kw: Given
      text: 'a KeyedLimiter whose factory makes a fresh TokenBucket with capacity 2 and rate 1 per key, all calls at tick 0'
    - kw: When
      text: 'Allow is called for key "a" three times, then for key "b" once'
    - kw: Then
      text: 'key "a" is allowed twice (draining its bucket) then denied on the third call'
    - kw: And
      text: 'key "b" is allowed, because it has its own full bucket untouched by key "a" - the two keys are fully independent'
code:
  lang: go
  source: |
    type KeyedLimiter struct {
      factory  func() *TokenBucket
      limiters map[string]*TokenBucket
    }
    func (k *KeyedLimiter) Allow(key string, now int64) Decision {
      b, ok := k.limiters[key]
      if !ok {
        b = k.factory()        // first time we see this key
        k.limiters[key] = b
      }
      return b.Allow(now)
    }
checkpoint: Each key gets its own independent limiter. Commit and stop here.
---

Limiting every client against a single shared counter would let one noisy client
use up everyone's allowance. The fix is a **keyed limiter**: a map from client id to
that client's own limiter, created lazily the first time a key appears. Each key
carries its own state - its own bucket, its own count - so the limits are
**per-client** and completely **independent**. A **factory** function supplies a
fresh limiter for each new key, which keeps the keyed wrapper agnostic about *which*
algorithm it distributes (here a token bucket, but any of them would do).

The isolation is the whole point, so pin it directly: with capacity-2 buckets, key
`"a"` is allowed twice and then denied once its own bucket empties - but key `"b"`,
seen for the first time, gets a brand-new full bucket and is allowed regardless of
what `"a"` did. One client hitting its limit has zero effect on another. This map of
per-key limiters is exactly how an API gates thousands of customers with one shared
limiter object.
