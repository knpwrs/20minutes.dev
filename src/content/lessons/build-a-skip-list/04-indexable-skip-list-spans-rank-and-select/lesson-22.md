---
project: build-a-skip-list
lesson: 22
title: Rank - the position of a key
overview: With spans in place, position queries become fast. Today you build Rank, which returns how many keys come before a given one by summing the spans the search path steps over - the position of a key in O(log n) instead of a linear count.
goal: Return the number of keys strictly less than a target by accumulating spans along the descent.
spec:
  scenario: Rank sums the spans of the steps the descent takes
  status: failing
  lines:
    - kw: Given
      text: 'the list from seed 1 holding 1, 2, 3, 4, 5, 7, 8, 9 (with spans maintained)'
    - kw: When
      text: 'Rank(5) is called'
    - kw: Then
      text: 'it returns 4 with found true - four keys (1, 2, 3, 4) come before 5, so 5 sits at index 4'
    - kw: And
      text: 'Rank(6) returns 5 with found false (5 keys are below 6, but 6 is absent), and Rank(1) returns 0 with found true'
code:
  lang: go
  source: |
    // Same descent, but add each pointer's span every time you step right.
    func (s *SkipList) Rank(key int) (int, bool) {
      x, r := s.head, 0
      for i := s.level - 1; i >= 0; i-- {
        for x.forward[i] != nil && x.forward[i].key < key {
          r += x.span[i]
          x = x.forward[i]
        }
      }
      // successor := x.forward[0]; found = successor != nil && successor.key == key
      return r, false
    }
checkpoint: The list reports a key's rank in O(log n). Commit and stop here.
---

Rank turns the position invariant into a query. As the descent moves right, each
pointer it follows skips exactly `span[i]` level-0 nodes, so if you **add up** the
spans of every step you take, the total is the number of keys you have passed - which
is precisely how many keys are strictly less than your target. Because the descent
takes O(log n) steps rather than walking the whole bottom lane, you get the position
in logarithmic time.

The result doubles as a membership answer. After the descent, the node just ahead on
level 0 is the successor; if its key equals the target, the target is present and `r`
is its 0-indexed position, so `Rank(5)` is 4. If the target is absent, `r` is still
the count of smaller keys - `Rank(6)` is 5 - but found is false, telling you 6 would
*belong* at index 5. This is the read side of the indexable skip list; its twin,
finding the key at a given index, is the final piece.
