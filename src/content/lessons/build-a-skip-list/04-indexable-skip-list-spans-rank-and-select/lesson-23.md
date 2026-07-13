---
project: build-a-skip-list
lesson: 23
title: Select - the k-th element
overview: The complement of rank is select - jump straight to the element at a given index. Today you walk the express lanes by span, taking any hop that does not overshoot the target index, to land on the k-th key in O(log n).
goal: Return the key at 0-indexed position k by advancing along spans without overshooting.
spec:
  scenario: Select rides spans to the k-th position
  status: failing
  lines:
    - kw: Given
      text: 'the list from seed 1 holding 1, 2, 3, 4, 5, 7, 8, 9 (with spans maintained)'
    - kw: When
      text: 'Select(k) is called for various k'
    - kw: Then
      text: 'Select(0) returns 1, Select(4) returns 5, and Select(7) returns 9 - the keys at those 0-indexed positions'
    - kw: And
      text: 'Select(8) returns found false and Select(-1) returns found false (both out of range for a list of 8 keys)'
code:
  lang: go
  source: |
    // Track how far you have traveled; take a hop only if it does not pass k.
    // Start at the head, "position" -1 (just before index 0).
    func (s *SkipList) Select(k int) (int, bool) {
      if k < 0 || k >= s.length { return 0, false }
      x, pos := s.head, -1
      for i := s.level - 1; i >= 0; i-- {
        for x.forward[i] != nil && pos+x.span[i] <= k {
          pos += x.span[i]
          x = x.forward[i]
        }
      }
      return x.key, true
    }
checkpoint: The list returns the k-th element in O(log n). The indexable skip list is complete. Commit and stop here.
---

Select is rank run backwards: instead of summing spans to reach a key, you spend a
target index by taking span-sized hops. Keep a running `pos` of where you are,
starting at -1 to mean "at the head, just before position 0." At each level, take a
forward hop whenever it would **not** overshoot - that is, while `pos + span[i]` is
still at most `k` - adding the span to `pos` as you go. When no hop on the current
lane fits without passing `k`, drop a level and try smaller hops. You land exactly on
the node whose position is `k`.

Riding the express lanes this way reaches the k-th element in O(log n) steps rather
than counting `k` nodes along the bottom - the whole reason spans were worth the
bookkeeping. Guard the ends first: any `k` below 0 or at least the length has no
element, so report absence rather than walking off. Together, `Rank` and `Select`
make this an **indexable** skip list - a sorted collection you can query by position
as easily as by key, which is exactly what a database order-statistic index or a
leaderboard needs.
