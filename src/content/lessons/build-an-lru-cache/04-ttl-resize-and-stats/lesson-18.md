---
project: build-an-lru-cache
lesson: 18
title: Resize at runtime
overview: A cache's capacity is not always fixed for life. Today you let the LRU cache change capacity on the fly, evicting the least-recently-used entries when it shrinks below its current size and simply raising the ceiling when it grows.
goal: Change the cache's capacity, evicting down to the new size when shrinking.
spec:
  scenario: Shrinking evicts the least-recently-used down to the new capacity
  status: failing
  lines:
    - kw: Given
      text: 'a cache NewLRU(3) with Put(1, 10), Put(2, 20), Put(3, 30), so key 1 is least-recently-used'
    - kw: When
      text: 'Resize(2) is called'
    - kw: Then
      text: 'the cache evicts down to 2 entries, dropping key 1: Get(1) is 0, false; Get(2) and Get(3) hit; Len() is 2 and Cap() is 2'
    - kw: And
      text: 'Resize(4) raises Cap() to 4 with no eviction, so Put(8, 80) and Put(9, 90) both fit and Len() becomes 4'
code:
  lang: go
  source: |
    func (c *LRU) Resize(newCap int) {
      for len(c.data) > newCap { c.removeTail() } // shed the LRU end first
      c.cap = newCap
    }
checkpoint: The cache resizes at runtime, evicting the least-recently-used when it shrinks. Commit and stop here.
---

Capacity is not sacred - a running system may want to give a hot cache more room or
claw memory back under pressure. **Resizing down** is the interesting direction:
if the cache currently holds more entries than the new capacity allows, it must
evict the excess, and it does so the same way every other eviction works - from the
**least-recently-used** end, calling `removeTail` until it fits. Shrinking a cache of
three to a capacity of two drops exactly one entry, the coldest.

**Resizing up** is trivial: nothing needs evicting, so you just raise the ceiling and
let future `Put`s fill the new space. The one detail to get right is order - evict
first, then set the new `cap` - and to reuse `removeTail` rather than inventing a
second eviction path, so the recency rule stays in one place. With resize in hand,
the cache adapts to a changing memory budget without ever violating its own
invariant that `Len` never exceeds `Cap`.
