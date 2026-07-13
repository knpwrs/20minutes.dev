---
project: build-a-pathfinder
lesson: 22
title: Bounded randoms and shuffling
overview: Raw 32-bit numbers are unwieldy. Today you turn the stream into the two tools maze generators actually use, a bounded random index and a deterministic shuffle of a list.
goal: Add a bounded IntN and a Fisher-Yates Shuffle driven by the seeded generator.
spec:
  scenario: Bounded randoms and shuffles are fixed by the seed
  status: failing
  lines:
    - kw: Given
      text: 'a generator seeded with 1, where IntN(n) returns Next() mod n'
    - kw: When
      text: 'IntN(6) is called five times'
    - kw: Then
      text: 'it returns 3, 1, 3, 5, 5 in that order'
    - kw: And
      text: 'with a fresh generator seeded with 1, Shuffle applied to the list [0, 1, 2, 3] (Fisher-Yates from the last index down to 1, swapping index i with IntN(i+1)) yields [0, 2, 3, 1]'
code:
  lang: go
  source: |
    func (r *RNG) IntN(n int) int { return int(r.Next() % uint32(n)) }
    func (r *RNG) Shuffle(s []int) {
      for i := len(s) - 1; i > 0; i-- {   // walk from the end to index 1
        j := r.IntN(i + 1)                 // pick j in [0, i]
        s[i], s[j] = s[j], s[i]            // swap into place
      }
    }
checkpoint: You can draw bounded randoms and shuffle a list reproducibly. Commit and stop here.
---

Generators speak in huge 32-bit numbers, but algorithms want small choices: "pick one
of `n` options" and "put this list in random order." **IntN(n)** gives the first,
reducing the raw output modulo `n` to land in `0` to `n-1`. (This has a slight bias
toward smaller values when `n` does not divide 2^32 evenly, which is harmless for
generating mazes and something a serious generator would correct.)

**Shuffle** gives the second, using the **Fisher-Yates** algorithm: walk from the last
index down to the second, and swap each element with a randomly chosen one at or
before it. Done this way it produces an unbiased permutation using exactly one `IntN`
call per step, and, crucially, a **fixed** permutation for a given seed. The maze
generators coming up lean on both: the recursive backtracker shuffles the four
directions at each cell, and the exact order it gets, decided right here, is what
makes a seeded maze come out the same every time.
