---
project: build-a-skip-list
lesson: 12
title: Reproducible towers from a seed
overview: Time to see the whole chapter pay off - build a real list from a seed and confirm the tower heights are exactly what the generator dictates. This is the fixture every later lesson leans on, so pinning it down is worth a lesson of its own.
goal: Build a list from a fixed seed and insert sequence and assert the exact towers it produces.
spec:
  scenario: A seed plus an insert order fixes the whole structure
  status: failing
  lines:
    - kw: Given
      text: 'a list from seed 1 with 3, 7, 1, 9, 5, 2, 8, 4 inserted in that order'
    - kw: When
      text: 'the towers are inspected'
    - kw: Then
      text: 'Level is 3 and the heights by key are 1 to 3, 2 to 2, 3 to 1, 4 to 3, 5 to 3, 7 to 1, 8 to 1, 9 to 1'
    - kw: And
      text: 'level 2 links 1, 4, 5; level 1 links 1, 2, 4, 5; level 0 links all eight keys 1, 2, 3, 4, 5, 7, 8, 9 - and a second list built the same way is identical'
code:
  lang: go
  source: |
    s := NewSkipList(1)
    for _, k := range []int{3, 7, 1, 9, 5, 2, 8, 4} {
      s.Insert(k, k*10)
    }
    // walk each level: for i, follow head.forward[i] collecting keys.
    // level 2 -> [1 4 5]; level 1 -> [1 2 4 5]; level 0 -> all eight.
checkpoint: You can reproduce an exact skip-list structure from a seed. This closes chapter two - insertion is real and deterministic. Commit and stop here.
---

Here is the whole point of the seeded generator, made concrete. Inserting eight keys
from seed 1, the height stream 1, 1, 3, 1, 3, 2, 1, 3 gets handed out in insertion
order - so 3 (inserted first) is height 1, 7 is height 1, 1 is height 3, and so on -
and when you read the finished list back by key you get a fixed set of towers. The
keys sort themselves to 1 through 9 on level 0; the height-3 nodes 1, 4, and 5 form
the top express lane; and 2 joins them one level down. None of this depends on the
machine, the language, or the run: the seed determines it entirely.

That reproducibility is what makes the rest of the project possible. Deletion,
range queries, and the span-based rank and select all need a known starting
structure to assert against, and this is it - seed 1 with these eight keys. When a
later lesson says "the list from seed 1," this is the exact shape it means. With
insertion solid and deterministic, chapter three takes things away again: deleting
nodes and watching the list level fall.
