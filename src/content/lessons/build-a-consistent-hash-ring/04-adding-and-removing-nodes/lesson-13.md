---
project: build-a-consistent-hash-ring
lesson: 13
title: Adding a node moves only its arc
overview: This is the payoff the whole project has been building toward. Add a node to the ring and only the keys in its slice of the ring move to it - everyone else stays exactly put. Today you prove it by capturing which keys move when a node joins.
goal: Show that adding a node reassigns only the keys in the arc it now covers.
spec:
  scenario: A new node steals only the keys behind it
  status: failing
  lines:
    - kw: Given
      text: 'a ring with alpha (28075), beta (58567), gamma (5130) and the 12 fruit keys, then delta (31777) is added'
    - kw: When
      text: 'the owner of every key is compared before and after adding delta, and MovedKeys lists those that changed'
    - kw: Then
      text: 'MovedKeys is exactly [orange] - only orange (29675) moves, from beta to delta'
    - kw: And
      text: 'all 11 other keys keep their owner, for example apple stays alpha and cherry stays gamma'
code:
  lang: go
  source: |
    // Diff the assignment before and after a ring change.
    func MovedKeys(before, after map[string]string) []string {
      var moved []string
      for k, was := range before {
        if after[k] != was {
          moved = append(moved, k)
        }
      }
      return moved // sort before asserting
    }
checkpoint: Adding a node moves only the keys in its new arc. Commit and stop here.
---

Now compare this to lesson four's disaster. When `delta` joins at 31777, it drops into
the arc between `alpha` (28075) and `beta` (58567) and takes over just the piece of that
arc from 28075 up to 31777. The only key living there is `orange` at 29675, so `orange`
moves from `beta` to `delta` and **nothing else changes**. One key moved, versus eight
under modulo hashing.

This is the defining property of consistent hashing: adding a node only steals keys from
its immediate clockwise neighbor, the keys in the new node's arc. Every key outside that
arc is untouched because its first-node-clockwise answer did not change. The `MovedKeys`
helper - a plain before-and-after diff of the assignment - is worth keeping; you will use
it to measure removals next and to check the capstone. In a real cache this means adding
a server invalidates a sliver of entries, not the entire cache.
