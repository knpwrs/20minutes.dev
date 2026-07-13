---
project: build-a-skip-list
lesson: 11
title: A duplicate key updates in place
overview: Inserting a key that is already present should replace its value, not add a second node with the same key. Today you make Insert detect the duplicate during its descent and update in place, before it ever draws a random height.
goal: Make Insert overwrite an existing key's value without adding a node or changing any tower.
spec:
  scenario: Re-inserting a present key updates its value only
  status: failing
  lines:
    - kw: Given
      text: 'a list built from seed 1 by inserting 3, 7, 1, 9, 5, 2, 8, 4 (eight keys, so Len is 8)'
    - kw: When
      text: 'Insert(5, 999) is called - 5 is already present'
    - kw: Then
      text: 'Len is still 8, Search(5) returns 999, and the ordered keys are unchanged: 1, 2, 3, 4, 5, 7, 8, 9'
    - kw: And
      text: 'every tower height is unchanged - no new node was created and no level was drawn for the update'
code:
  lang: go
  source: |
    // Descend to build update[], then peek at the successor on level 0.
    // If it is the same key, overwrite and return BEFORE drawing a height.
    func (s *SkipList) Insert(key, val int) {
      update := make([]*node, MaxLevel)
      x := s.head
      for i := s.level - 1; i >= 0; i-- {
        for x.forward[i] != nil && x.forward[i].key < key { x = x.forward[i] }
        update[i] = x
      }
      if n := x.forward[0]; n != nil && n.key == key { n.val = val; return }
      // otherwise: h := s.randomLevel(); splice a new node using update[]
    }
checkpoint: Inserting an existing key updates it in place. Commit and stop here.
---

A skip list backs an ordered **map**, so a key appears at most once. When you insert
a key that is already there, the right behavior is to overwrite its value and leave
the structure completely untouched - same node, same tower, same length. The descent
already walks to exactly the right spot: after building the `update` array, the node
just ahead on level 0 is either the match or the place a new node would go. If its
key equals the one you are inserting, you set its value and return immediately.

The ordering here matters. You check for the duplicate **before** calling
`randomLevel`, because an update creates no node and so should consume no randomness -
drawing and discarding a height would quietly desynchronize the seeded stream and
change every tower that comes after. This lesson folds the descent, the duplicate
check, and the splice into the one real `Insert`; the explicit-height helper from
chapter one stays available for tests that want to pin a height by hand.
