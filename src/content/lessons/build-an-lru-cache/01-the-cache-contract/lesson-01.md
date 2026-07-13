---
project: build-an-lru-cache
lesson: 1
title: Store and retrieve
overview: A cache is, at its heart, a lookup table you can put things into and get things back out of. Today you build that bare contract over a plain map, so the rest of the project has something concrete to make fast and to bound.
goal: Build a cache that stores a value under a key and returns it, reporting whether the key was present.
spec:
  scenario: A value put under a key comes back; a missing key does not
  status: failing
  lines:
    - kw: Given
      text: 'a new cache created with NewLRU(2)'
    - kw: When
      text: 'Put(1, 10) is called and then Get(1)'
    - kw: Then
      text: 'Get(1) returns the value 10 and found = true'
    - kw: And
      text: 'Get(2) on a key never stored returns 0 and found = false'
code:
  lang: go
  source: |
    // one map is the whole cache for now; capacity comes next lesson
    type LRU struct {
      cap  int
      data map[int]int
    }
    func NewLRU(cap int) *LRU { return &LRU{cap: cap, data: map[int]int{}} }
    func (c *LRU) Put(key, val int) { c.data[key] = val }
    func (c *LRU) Get(key int) (int, bool) { v, ok := c.data[key]; return v, ok }
checkpoint: You have a cache that stores and retrieves values and reports hits and misses. Commit and stop here.
---

Every cache is a lookup table with a story about what to throw away. Before any of
the throwing-away, it has to do the plain thing: **store** a value under a key and
**give it back** when asked. We will call the type `LRU` because that is where it
is heading, but today it is just a map with two methods.

The one detail worth pinning now is the shape of `Get`: it returns the value **and
a boolean** saying whether the key was there. A cache miss (`found = false`) is a
first-class outcome, not an error and not a zero value pretending to be data - the
caller needs to know the difference between "the value is 0" and "there is no
value." Keys and values are `int` here so every result is a number you can assert;
making the cache generic over any key and value type is a later refinement.
