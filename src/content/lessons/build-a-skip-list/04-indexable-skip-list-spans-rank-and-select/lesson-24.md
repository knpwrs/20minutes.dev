---
project: build-a-skip-list
lesson: 24
title: 'Capstone: a sorted set from a seed'
overview: The finale ties every piece together - build a set from a fixed seed, delete a couple of keys, and assert the exact ordered contents, a search path, a range, and a select-by-rank all at once. Insert, delete, search, iterate, and index all prove themselves in one scenario.
goal: Build a list from a seed and a known insert-then-delete sequence and assert its exact contents, path, range, and indexed queries.
spec:
  scenario: The whole structure behaves exactly, end to end
  status: failing
  lines:
    - kw: Given
      text: 'a list from seed 1 with 3, 7, 1, 9, 5, 2, 8, 4 inserted, then Delete(7) and Delete(2)'
    - kw: When
      text: 'the list is queried every way it knows how'
    - kw: Then
      text: 'Keys is 1, 3, 4, 5, 8, 9 with Level 3; Range(3, 9) is [3, 4, 5, 8]; and Path(8) is [1, 4, 5] (the search hops through the height-3 towers)'
    - kw: And
      text: 'Search(8) returns 80; Rank(8) is 4; Select(0) is 1 and Select(3) is 5 - every operation agrees on the same six-key set'
code:
  lang: go
  source: |
    s := NewSkipList(1)
    for _, k := range []int{3, 7, 1, 9, 5, 2, 8, 4} { s.Insert(k, k*10) }
    s.Delete(7); s.Delete(2)
    // Keys()==[1 3 4 5 8 9]; Range(3,9)==[3 4 5 8]; Path(8)==[1 4 5]
    // Search(8)==(80,true); Rank(8)==(4,true); Select(3)==(5,true)
checkpoint: Your indexable skip list runs a full workload and every query agrees. The project is complete; commit and stop here.
---

This is the promise the project was built to keep: a genuine **ordered map backed by
a skip list**, and every layer proving itself in one scenario. From seed 1 the eight
inserts build a known structure with height-3 towers at 1, 4, and 5; deleting 7 and 2
unlinks two nodes and fixes every span behind them; and then the whole public surface
agrees on the result. `Keys` reads the six survivors in order off level 0, `Range`
jumps to 3 and walks to just before 9, and `Path` shows search hopping through the
express lanes 1, 4, 5 to reach 8 in three steps instead of scanning.

The indexed queries close the loop: `Rank(8)` is 4 because four keys precede it, and
`Select(3)` returns 5 because it sits at index 3 - answers only correct if insert and
delete kept every span exact through all ten mutations. From a node with a tower of
pointers, you have built a deterministic ordered set that searches, inserts, deletes,
iterates, ranges, and indexes by position in expected O(log n) - the same
probabilistic, rotation-free design that powers Redis sorted sets and countless
ordered indexes, minus the production trimmings. That is a real skip list, and it is
yours.
