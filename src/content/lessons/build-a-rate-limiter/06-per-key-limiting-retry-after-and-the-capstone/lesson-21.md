---
project: build-a-rate-limiter
lesson: 21
title: Purging idle keys
overview: A keyed limiter that never forgets a client leaks memory - every id ever seen stays in the map forever. Today you add housekeeping that drops keys idle beyond a time-to-live, so a client that goes quiet is forgotten and starts fresh if it returns.
goal: Remove keys not seen within a time-to-live, freeing their state.
spec:
  scenario: An idle key is purged and resets, an active one is kept
  status: failing
  lines:
    - kw: Given
      text: 'a KeyedLimiter over TokenBuckets with capacity 1 and rate 1, where key "a" is used at tick 0 (exhausting its bucket) and key "b" is used at tick 5'
    - kw: When
      text: 'PurgeIdle(now = 10, ttl = 6) runs, removing every key last seen at or before now - ttl = 4'
    - kw: Then
      text: 'key "a" (last seen at tick 0) is purged and key "b" (last seen at tick 5) is kept, leaving 1 tracked key'
    - kw: And
      text: 'a later Allow for key "a" at tick 10 gets a fresh full bucket and is allowed, even though "a" had been exhausted before the purge'
code:
  lang: go
  source: |
    // track the last tick each key was seen (update it inside Allow),
    // then drop the ones that have gone quiet:
    func (k *KeyedLimiter) PurgeIdle(now, ttl int64) {
      cutoff := now - ttl
      for key, seen := range k.lastSeen {
        if seen <= cutoff {
          delete(k.limiters, key)
          delete(k.lastSeen, key)
        }
      }
    }
checkpoint: Idle keys are purged so the limiter does not grow without bound. Commit and stop here.
---

A long-running keyed limiter accumulates one map entry per distinct client forever,
which is a slow memory leak - most of those clients will never come back. **Purging**
idle keys fixes it: record the last tick each key was seen (update it inside `Allow`,
whether the request was allowed or denied), and periodically drop every key whose
last-seen tick has aged past a **time-to-live**. We reuse the same half-open cutoff
convention as the windows: purge a key when `lastSeen <= now - ttl`.

Forgetting a key has a deliberate side effect - if that client returns, it is a new
key again and gets a **fresh** limiter. Pin both halves: with a ttl of 6 at tick 10,
the cutoff is 4, so key `"a"` (last seen at 0) is purged while key `"b"` (last seen
at 5) survives. And because `"a"` was forgotten, a new request from it at tick 10
finds a full bucket and is allowed, even though its old bucket had been drained. For
a single-process limiter this ttl sweep is the memory-management story; a
distributed limiter would lean on its shared store's key expiry instead.
