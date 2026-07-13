---
project: build-a-skip-list
lesson: 17
title: Successor - the smallest key at least as large
overview: Beyond exact lookup, an ordered map answers "what is the next key from here?" Today you build Successor, which returns the smallest key greater than or equal to a target - the natural query for range starts, ceilings, and iteration cursors.
goal: Return the smallest key that is greater than or equal to a given target.
spec:
  scenario: Successor returns the ceiling key
  status: failing
  lines:
    - kw: Given
      text: 'the list from seed 1 holding 1, 2, 3, 4, 5, 7, 8, 9'
    - kw: When
      text: 'Successor(6) is called - 6 is absent'
    - kw: Then
      text: 'it returns 7 with found true (the smallest key at least 6)'
    - kw: And
      text: 'Successor(5) returns 5 (a present key is its own successor), and Successor(100) returns found false (nothing that large)'
code:
  lang: go
  source: |
    // Descend to the predecessor of `key`, then the very next node on level 0
    // is the ceiling: the smallest key >= target, if one exists.
    func (s *SkipList) Successor(key int) (int, bool) {
      x := s.head
      for i := s.level - 1; i >= 0; i-- {
        for x.forward[i] != nil && x.forward[i].key < key { x = x.forward[i] }
      }
      x = x.forward[0]
      // if x != nil -> (x.key, true) else (0, false)
      return 0, false
    }
checkpoint: The list answers successor (ceiling) queries. Commit and stop here.
---

The descent that finds a key's predecessor is quietly powerful: after it, the node
just ahead on level 0 is the smallest key that is **greater than or equal to** the
target, whether or not the target itself is present. That is the **successor** (or
ceiling) query, and it needs no new machinery - just return that next node's key. If
the target exists, the next node *is* the target, so a present key is its own
successor. If the descent walks off the end, there is no key that large and the query
reports absence.

This is the same strict-`<` walk once more, which is why the predecessor descent is
the real workhorse of the whole structure - search, insert, delete, range, and now
successor all begin with it. Successor is what a range scan uses to find its first
element, what a "round up to the next valid key" lookup needs, and how you would
advance a cursor to the next distinct key. One short method, built entirely from
parts you already have.
