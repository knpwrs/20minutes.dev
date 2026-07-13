---
project: build-a-skip-list
lesson: 10
title: Insert with a random level
overview: Everything is in place to insert the real way. Today the public Insert picks a tower height from the seeded generator instead of taking one by hand, so the list balances itself while staying perfectly reproducible.
goal: Add a public Insert that draws a random height from the list's generator, then splices the node in.
spec:
  scenario: Insert draws its tower height from the seeded generator
  status: failing
  lines:
    - kw: Given
      text: 'a list created with NewSkipList(1), whose height stream is 1, 1, 3, ...'
    - kw: When
      text: 'Insert(5, 50), Insert(3, 30), then Insert(8, 80) are called'
    - kw: Then
      text: 'the keys in order are 3, 5, 8; nodes 5 and 3 get height 1 and node 8 gets height 3, raising Level to 3'
    - kw: And
      text: 'Search(8) returns 80 with found true'
code:
  lang: go
  source: |
    // The public entry point: pick a height, then reuse the splice from before.
    func (s *SkipList) Insert(key, val int) {
      h := s.randomLevel()
      s.insert(key, val, h)
    }
checkpoint: The list inserts with self-balancing random heights. Commit and stop here.
---

This is where the pieces meet. The `insert` helper from chapter one already knows how
to splice a node of a given height into its sorted place and raise the list level;
all `Insert` adds is drawing that height from the list's own `randomLevel` instead of
receiving it as an argument. The result is a list that assigns heights the way a real
skip list does - mostly short towers, occasionally a tall one - so its express lanes
stay balanced no matter what order the keys arrive in.

Because the generator is seeded, the "random" heights are still exactly
predictable. Starting from seed 1, the first two inserts draw height 1 and the third
draws height 3, so inserting 5, 3, then 8 makes node 8 a height-3 tower that lifts
the list to level 3. Same seed, same insertions, same structure, every single time -
which is what makes the coming lessons on duplicates, deletion, and rank testable to
the exact pointer.
