---
project: build-an-lru-cache
lesson: 10
title: An update is a use too
overview: A Put that overwrites an existing key is also a use of that key, so it should promote the entry just as a Get does - while still not growing the cache. Today you make update-in-place move the node to the front.
goal: On a Put to an existing key, update the value and promote the node without changing the count.
spec:
  scenario: Overwriting a key promotes it and keeps the size steady
  status: failing
  lines:
    - kw: Given
      text: 'a cache NewLRU(2) holding Put(1, 10) then Put(2, 20), so key 1 is least-recently-used'
    - kw: When
      text: 'Put(1, 11) is called'
    - kw: Then
      text: 'Get(1) returns 11, true, Len() is still 2, and Order() is [2, 1] - key 1 is now most-recently-used'
    - kw: And
      text: 'a following Put(3, 30) evicts key 2, not key 1: Get(2) is 0, false while Get(1) is 11, true'
code:
  lang: go
  source: |
    func (c *LRU) Put(key, val int) {
      if n, ok := c.data[key]; ok {
        n.val = val          // overwrite the value
        c.moveToFront(n)     // ...and count it as a use
        return               // no insert, so the count does not grow
      }
      if len(c.data) >= c.cap { c.removeTail() }
      n := &node{key: key, val: val}
      c.addFront(n); c.data[key] = n
    }
checkpoint: Overwriting a key promotes it to most-recently-used without growing the cache. Commit and stop here.
---

A read is a use, and so is a write. When `Put` lands on a key that is already
present, the caller is touching that entry - so it should move to the front exactly
like a `Get` hit, not sit wherever it was. In the FIFO cache an update left the key
in place; now that recency is the whole game, an update **promotes**. The one-line
change is to call `moveToFront` on the update branch.

The invariant that must survive is the count: an update overwrites, it does not
insert, so `Len` does not move and no eviction is triggered. Get both halves right
and the update branch behaves like "a `Get` that also changes the value." The
concrete tell is the follow-up `Put(3, 30)`: because the update to key 1 promoted
it, key 2 is now the least-recently-used and the one evicted - the same victim-flip
you saw from a `Get`, now driven by a write. Your LRU cache is complete.
