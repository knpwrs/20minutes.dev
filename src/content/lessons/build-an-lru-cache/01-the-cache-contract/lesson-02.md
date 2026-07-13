---
project: build-an-lru-cache
lesson: 2
title: Capacity and length
overview: A cache is a lookup table with a size limit - that limit is the whole reason eviction exists. Today you give the cache a length and make an update to an existing key stay in place, without growing that length.
goal: Report how many entries the cache holds, and update an existing key without changing the count.
spec:
  scenario: Updating a key changes its value but not the count
  status: failing
  lines:
    - kw: Given
      text: 'a new cache created with NewLRU(2)'
    - kw: When
      text: 'Put(1, 10) and Put(2, 20) are called'
    - kw: Then
      text: 'Len() returns 2 and Cap() returns 2'
    - kw: And
      text: 'after Put(1, 99), Get(1) returns 99 with found = true and Len() is still 2'
code:
  lang: go
  source: |
    // Len is just how many keys are stored; the map already knows
    func (c *LRU) Len() int { return len(c.data) }
    func (c *LRU) Cap() int { return c.cap }
    // Put already overwrites an existing key in a map, so an update
    // does not add an entry - confirm the count does not move.
checkpoint: The cache reports its length and capacity, and an update stays in place. Commit and stop here.
---

An unbounded cache is just a map. What makes a cache a cache is the **capacity**: a
ceiling on how many entries it will hold before it has to evict something. We are
not enforcing that ceiling yet - that is the next two lessons - but we need the two
numbers that eviction will compare: how full the cache is (`Len`) and how full it
is allowed to get (`Cap`).

The subtle case is an **update**. Calling `Put` with a key that is already present
must change its value in place, not add a second entry. With a map this is free -
assigning to an existing key overwrites it - but it is a rule worth pinning now,
because once eviction and recency arrive, "an update does not grow the cache" and
"an update touches the entry" become load-bearing facts. Today just confirm the
count holds steady at 2 when key 1 is rewritten.
