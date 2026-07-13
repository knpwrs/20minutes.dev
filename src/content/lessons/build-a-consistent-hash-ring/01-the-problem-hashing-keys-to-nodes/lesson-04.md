---
project: build-a-consistent-hash-ring
lesson: 4
title: Why modulo breaks
overview: Here is the pain that consistent hashing exists to solve. Add one node to a modulo scheme and count how many keys change hands - it is almost all of them. Today you measure the damage so the rest of the project has something concrete to beat.
goal: Count how many keys change nodes when N grows from 3 to 4 under modulo hashing.
spec:
  scenario: Growing the node count remaps most keys
  status: failing
  lines:
    - kw: Given
      text: 'the 12 keys apple, banana, cherry, date, elderberry, fig, grape, kiwi, lemon, mango, orange, pear'
    - kw: When
      text: 'each key is assigned by ModuloNode with n=3 and again with n=4, and MovedCount counts keys whose node changed'
    - kw: Then
      text: 'MovedCount is 8 (two thirds of the keys move)'
    - kw: And
      text: 'only elderberry, kiwi, lemon, and mango keep the same node'
code:
  lang: go
  source: |
    // Compare each key's node before and after the count changes.
    func MovedCount(keys []string, oldN, newN int) int {
      moved := 0
      for _, k := range keys {
        if ModuloNode(k, oldN) != ModuloNode(k, newN) {
          moved++
        }
      }
      return moved
    }
checkpoint: You have measured the modulo remapping disaster - 8 of 12 keys move. Commit and stop here.
---

Adding a fourth node should, ideally, pull about a quarter of the keys onto the new node
and leave the other three quarters exactly where they were. Modulo hashing does the
opposite. Because every key's node is `hash(key) % N`, changing `N` from 3 to 4 changes
the divisor for **every** key at once, and the remainder shifts for most of them. Here
**8 of 12 keys** move - and in a real cache, a moved key is a cache miss, so this is a
stampede of misses every time the cluster changes size.

This is the entire motivation for what comes next. We want a scheme where adding or
removing a node disturbs only the keys near that node - about `1/N` of them - and leaves
everyone else untouched. That is what a hash ring delivers, and now you have the exact
number (8) that the ring will crush down to 1 by the end of chapter four.
