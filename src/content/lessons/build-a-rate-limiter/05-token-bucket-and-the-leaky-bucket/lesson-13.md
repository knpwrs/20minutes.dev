---
project: build-a-rate-limiter
lesson: 13
title: The token bucket starts full
overview: The token bucket is the limiter most people mean by rate limiting. A bucket holds up to a capacity of tokens, each request spends one, and an empty bucket denies. Today you build the bucket and its spend, starting it full so it admits an initial burst.
goal: Consume one token per request and deny when the bucket is empty.
spec:
  scenario: A full bucket admits a burst up to its capacity
  status: failing
  lines:
    - kw: Given
      text: 'a TokenBucket with capacity 3 and rate 1, starting full with 3 tokens (no time passes during this test)'
    - kw: When
      text: 'Allow is called four times, all at tick 0'
    - kw: Then
      text: 'the first three are allowed, each spending one token so the bucket holds 2, then 1, then 0'
    - kw: And
      text: 'the fourth is denied because the bucket is empty, and a denied request spends nothing'
code:
  lang: go
  source: |
    type TokenBucket struct {
      capacity, rate float64
      tokens         float64
      lastRefill     int64
    }
    func NewTokenBucket(capacity, rate float64) *TokenBucket {
      return &TokenBucket{capacity: capacity, rate: rate, tokens: capacity}
    }
    func (b *TokenBucket) Allow(now int64) Decision {
      if b.tokens >= 1 { b.tokens--; return Decision{Allowed: true} }
      return Decision{Allowed: false}
      // refilling with elapsed time is tomorrow
    }
checkpoint: A full token bucket spends one token per request and denies when empty. Commit and stop here.
---

A **token bucket** models an allowance as a bucket of **tokens** with a maximum
**capacity**. Each request must spend one token: if the bucket has at least one,
take it and allow; if it is empty, deny (and spend nothing). Starting the bucket
**full** is the deliberate, defining choice - it means a client that has been idle
can fire off an immediate **burst** of up to `capacity` requests, which is often
exactly what you want (a UI that batches calls, a client catching up). The capacity
is the burst ceiling.

Today the bucket only spends; the token count only goes down, because no time
passes in this test. With capacity 3 the first three requests drain the bucket to 0
and the fourth is denied. That is the same burst-of-capacity you saw the leaky-empty
approaches build up to, except the token bucket grants it immediately. Tomorrow you
add the other half - **refilling** the bucket over time at the configured rate - so
the bucket recovers and grants requests continuously rather than only until it
first empties.
