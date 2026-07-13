---
project: build-an-lru-cache
lesson: 9
title: A hit changes the victim
overview: Promotion only matters because it changes who gets evicted. Today you pin that down end to end, where a Get in the middle of a sequence reaches back and saves one key by dooming another, so a later Put evicts a different entry than it would have.
goal: Show that a well-placed Get changes which key a later Put evicts.
spec:
  scenario: Using a key before an insert reroutes the eviction
  status: failing
  lines:
    - kw: Given
      text: 'a cache NewLRU(2) holding Put(1, 10) then Put(2, 20), so key 1 is the least-recently-used'
    - kw: When
      text: 'Get(1) is called and then Put(3, 30)'
    - kw: Then
      text: 'key 2 is evicted, not key 1: Get(2) is 0, false; Get(1) is 10, true; Get(3) is 30, true'
    - kw: And
      text: 'without the Get(1) - Put(1, 10), Put(2, 20), Put(3, 30) - key 1 is evicted instead, confirming the Get changed the victim'
code:
  lang: go
  source: |
    // no new code today: this is the promotion from the last lesson,
    // observed through eviction.
    // Get(1) makes 1 most-recently-used, so 2 becomes the tail and
    // the next Put evicts 2. Trace the list:
    //   Put1,Put2 -> [2,1]   (front..back)
    //   Get1      -> [1,2]
    //   Put3      -> [3,1] and 2 (the tail) is evicted
checkpoint: A hit reroutes eviction - the least-recently-used key is the one that goes. Commit and stop here.
---

The promotion you wrote is easy to state and easy to under-appreciate, so this
lesson makes its consequence concrete. Two keys, capacity two: whichever one you
**used** most recently survives the next insert, and the other is evicted. The
`Get(1)` is not decoration - it reaches into the recency order and swaps which key
sits at the tail, so the `Put(3)` that follows evicts key 2 instead of key 1.

There is likely **no new production code** today; the behaviour already falls out of
the last lesson. That is exactly the point - a good abstraction makes the
interesting case free. Run it both ways, with and without the `Get(1)`, and watch
the victim flip from 2 to 1. This is the defining property of an LRU cache, the one
a whiteboard interview is really asking about: recency of *use*, not recency of
insertion, decides what stays.
