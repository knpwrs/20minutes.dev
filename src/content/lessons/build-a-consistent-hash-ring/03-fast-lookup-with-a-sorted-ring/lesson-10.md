---
project: build-a-consistent-hash-ring
lesson: 10
title: Binary search for the successor
overview: With positions sorted, the clockwise walk becomes a binary search - find the successor position in logarithmic time instead of scanning. Today you rewrite Get to binary-search for the owning node, wrapping to the first node when the key falls off the top.
goal: Find a key's owner with a binary search for the successor position.
spec:
  scenario: Get finds the owner by binary search, with wraparound
  status: failing
  lines:
    - kw: Given
      text: 'a ring with alpha (28075), beta (58567), gamma (5130) and sorted positions [5130, 28075, 58567]'
    - kw: When
      text: 'Get binary-searches for the first position at or after the key position'
    - kw: Then
      text: 'Get("apple") (10943) finds index 1 (alpha) and returns alpha'
    - kw: And
      text: 'Get("cherry") (59512) searches past the end, wraps to index 0, and returns gamma'
code:
  lang: go
  source: |
    func (r *Ring) Get(key string) (string, bool) {
      if len(r.positions) == 0 {
        return "", false
      }
      kp := Pos(key)
      i := sort.Search(len(r.positions), func(i int) bool { return r.positions[i] >= kp })
      if i == len(r.positions) {
        i = 0 // fell off the top: wrap to the first node
      }
      return r.owner[r.positions[i]], true
    }
checkpoint: Lookups now use binary search with correct wraparound. Commit and stop here.
---

A sorted slice turns the clockwise walk into a **successor search**: the owner is the
first node position at or after the key's position, and binary search finds it in
logarithmic time. For `apple` at 10943, the search returns index 1, where `alpha`
(28075) sits - the first position that is not less than 10943. This is the same answer
as the linear scan, arrived at faster, which is why real rings backed by thousands of
virtual nodes stay quick.

The wraparound falls out of one check. When the search runs off the end of the slice -
no position is at or after the key - the returned index equals the slice length, meaning
the key sits past the top of the ring. Snap that index back to `0`, the lowest node, and
you have wrapped around the circle. `cherry` at 59512 is past `beta`, so the search
returns index 3 (the length), which wraps to index 0 and `gamma`. The empty-ring guard
stays exactly as before.
