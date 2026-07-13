---
project: build-a-skip-list
lesson: 4
title: The drop-down search
overview: Now that the list holds nodes with real towers, you build the search that makes a skip list fast - start high, move right along the express lanes, and drop down a level whenever the next step would overshoot. Today it returns a value for a present key and reports absence otherwise.
goal: Search the list from the top level down, returning the value for a found key and reporting not-found for anything absent, including on an empty list.
spec:
  scenario: Search descends the towers to find or reject a key
  status: failing
  lines:
    - kw: Given
      text: 'the list from the previous lesson holding keys 10, 20, 30, 40, 50, 60, 70'
    - kw: When
      text: 'Search(40) is called'
    - kw: Then
      text: 'it returns value 40 with found true, and Search(50) returns 50 with found true'
    - kw: And
      text: 'Search(35) returns found false, and Search on a brand-new empty list also returns found false'
code:
  lang: go
  source: |
    // Same descent as insert, but read-only. After dropping to level 0,
    // the candidate is the very next node; check whether it is the key.
    func (s *SkipList) Search(key int) (int, bool) {
      x := s.head
      for i := s.level - 1; i >= 0; i-- {
        for x.forward[i] != nil && x.forward[i].key < key { x = x.forward[i] }
      }
      x = x.forward[0]
      // if x != nil && x.key == key -> found
      return 0, false
    }
checkpoint: The list can find any key by dropping down its express lanes. Commit and stop here.
---

Searching is the payoff for building towers. You start at the head on the list's
current top level and walk **right** as long as the next node's key is still less
than your target. When the next node would overshoot (its key is greater than or
equal to the target, or there is no next node), you **drop down** one level and keep
going. Each drop lands you on a denser lane that makes smaller hops, so you close in
on the target quickly instead of scanning every node. When you finally drop off the
bottom level, the node immediately after where you stopped is the only possible
match: if it exists and its key equals the target, you found it.

The loop condition is strictly `<`, never `<=`, which matters: you want to stop
*at* the predecessor of the target so the candidate sits just ahead of you. The same
descent works on an empty list too - the head's forward pointers are all empty, so
you fall straight through every level and find nothing. This one read-only walk is
the shape that insert already used and that delete, range, and rank will all reuse.
