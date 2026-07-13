---
project: build-a-skip-list
lesson: 3
title: Splicing in a node of a given height
overview: Insertion is the heart of a skip list. Today you build it for a node whose height you pass in yourself (the random heights come later) - finding each level's predecessor with the classic update array, splicing the tower in, and raising the list's level when the new tower is the tallest yet.
goal: Insert a node of a given height at its sorted position, wiring it into every level of its tower and raising the list level when needed.
spec:
  scenario: Nodes splice into every level of their tower in sorted order
  status: failing
  lines:
    - kw: Given
      text: 'a fresh list, into which you insert (key, value, height) triples in this order: (10,10,1), (20,20,2), (30,30,1), (40,40,3), (50,50,1), (60,60,2), (70,70,1)'
    - kw: When
      text: 'all seven are inserted'
    - kw: Then
      text: 'the level-0 order of keys is 10, 20, 30, 40, 50, 60, 70, and Level is 3 (raised by the height-3 node 40)'
    - kw: And
      text: 'on level 2 the only node is 40 (head.forward[2] is 40, then nothing); on level 1 the chain from head is 20, then 40, then 60'
code:
  lang: go
  source: |
    // update[i] = the last node on level i whose key is < the new key.
    // Descend from the current top level, moving right while you can, and
    // record the predecessor at every level. Then splice levels 0..height-1.
    func (s *SkipList) insert(key, val, height int) {
      update := make([]*node, MaxLevel)
      x := s.head
      for i := s.level - 1; i >= 0; i-- {
        for x.forward[i] != nil && x.forward[i].key < key { x = x.forward[i] }
        update[i] = x
      }
      // if height > s.level: the extra predecessors are the head; raise s.level
      // n := newNode(...); for i in 0..height-1: link n after update[i]
    }
checkpoint: You can splice a node of any height into its sorted place, raising the list level as needed. Commit and stop here.
---

Inserting into a skip list is the same descent a search makes, but it remembers
where it turned. Starting at the head on the list's current top level, you move
right while the next key is smaller than the one you are inserting, and drop down a
level when you cannot. At each level you record the node you stopped on in an
**update** array: `update[i]` is the node whose `forward[i]` pointer will need to
point at the newcomer. Once you reach the bottom you have every predecessor, and
splicing the new tower in is just relinking `forward[i]` for each level of its
height, exactly like inserting into a linked list at each level at once.

Two details finish it. If the new node is **taller** than the list's current level,
the levels above have no real predecessor yet, so their predecessor is the head
sentinel, and the list's `level` rises to the new height. That is why node 40, with
height 3, lifts the whole list from level 1 to level 3. For now assume the keys you
insert are distinct; a repeated key is its own lesson later. This one method,
`insert`, is the machine every later mutation is built on.
