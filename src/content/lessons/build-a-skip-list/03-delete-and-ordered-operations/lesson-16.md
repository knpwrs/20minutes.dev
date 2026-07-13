---
project: build-a-skip-list
lesson: 16
title: Range queries with half-open bounds
overview: An ordered collection should return everything between two bounds. Today you build a range query that uses the express lanes to jump to the low bound, then walks level 0 collecting keys until it reaches the high bound.
goal: Return every key in the half-open range from lo (inclusive) to hi (exclusive), in order.
spec:
  scenario: Range returns keys within half-open bounds in order
  status: failing
  lines:
    - kw: Given
      text: 'the list from seed 1 holding 1, 2, 3, 4, 5, 7, 8, 9'
    - kw: When
      text: 'Range(3, 8) is called'
    - kw: Then
      text: 'it returns [3, 4, 5, 7] - 3 is included (lo is inclusive) and 8 is excluded (hi is exclusive)'
    - kw: And
      text: 'Range(4, 5) returns [4], and Range(10, 20) returns an empty slice (no keys in range)'
code:
  lang: go
  source: |
    // Descend to the last node with key < lo (the same predecessor walk),
    // then step along level 0 collecting keys while key < hi.
    func (s *SkipList) Range(lo, hi int) []int {
      out := []int{}
      x := s.head
      for i := s.level - 1; i >= 0; i-- {
        for x.forward[i] != nil && x.forward[i].key < lo { x = x.forward[i] }
      }
      // for x = x.forward[0]; x != nil && x.key < hi; x = x.forward[0] { collect }
      return out
    }
checkpoint: The list answers half-open range queries. Commit and stop here.
---

A **range query** returns every key in an interval, and a skip list answers it
efficiently by reusing the descent one more time. First you drop down the express
lanes to the last node whose key is below `lo` - the same predecessor walk search and
insert use - which lands you right at the start of the range without scanning the
keys before it. Then you switch to level 0 and walk forward, collecting keys, until
you reach one that is at or past `hi`.

The interval is **half-open**: `lo` is included and `hi` is excluded, written `[lo,
hi)`. Half-open bounds are the convention worth adopting because they compose
cleanly - `Range(a, b)` and `Range(b, c)` together give exactly `Range(a, c)` with no
overlap and nothing missed - and they make an empty range (`lo == hi`) fall out
naturally. So `Range(3, 8)` gives 3, 4, 5, 7 (7 is the largest key below 8), and
`Range(4, 5)` gives just 4. A range entirely beyond the keys returns nothing at all.
