---
project: build-a-skip-list
lesson: 6
title: In-order iteration
overview: A skip list keeps its keys sorted for free, because level 0 is just a sorted linked list threaded through every node. Today you walk that bottom level to hand back every key in order - the first sign that this is a genuine ordered collection.
goal: Return every key in the list in ascending order by walking level 0 from the head.
spec:
  scenario: Walking level 0 yields the keys in sorted order
  status: failing
  lines:
    - kw: Given
      text: 'a list into which (10,10,1), (20,20,2), (30,30,1), (40,40,3), (50,50,1), (60,60,2), (70,70,1) were inserted (in that order)'
    - kw: When
      text: 'Keys is called'
    - kw: Then
      text: 'it returns [10, 20, 30, 40, 50, 60, 70] in ascending order regardless of insertion order'
    - kw: And
      text: 'Keys on a fresh empty list returns an empty slice'
code:
  lang: go
  source: |
    // Level 0 links every node in ascending key order. Walk it from the
    // head's forward[0] until you fall off the end.
    func (s *SkipList) Keys() []int {
      keys := []int{}
      for x := s.head.forward[0]; x != nil; x = x.forward[0] {
        keys = append(keys, x.key)
      }
      return keys
    }
checkpoint: The list iterates its keys in sorted order. Commit and stop here. This is the end of chapter one - you have a searchable, ordered structure.
---

Every node lives on level 0, and insertion always splices a node into its sorted
position there, so **level 0 is a sorted linked list** running through the whole
structure. That makes in-order iteration trivial: start at `head.forward[0]` and
follow `forward[0]` until it runs out, collecting keys as you go. The taller towers
are only there to speed up search; they play no part in iteration, which is why you
ignore them entirely and stay on the bottom lane.

This is the moment the skip list stops being a pile of pointers and becomes an
**ordered collection**: you can find a key fast, and you can list everything in
order. Chapter one built the structure with heights you chose by hand. Chapter two
brings the idea that makes skip lists special - choosing those heights at random, in
a way you can still reproduce exactly - so that the express lanes balance themselves
without any rotations or rebalancing.
