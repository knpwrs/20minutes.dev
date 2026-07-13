---
project: build-a-sudoku-solver
lesson: 23
title: Shuffling with a seed
overview: Generation needs to try digits and cells in a random-but-reproducible order. Today you write a seeded Fisher-Yates shuffle on top of your generator, the reordering that makes each generated puzzle different yet exactly repeatable.
goal: Shuffle a list into a reproducible order using the seeded generator.
spec:
  scenario: A seeded shuffle gives a fixed permutation
  status: failing
  lines:
    - kw: Given
      text: 'the list [1 2 3 4 5 6 7 8 9] and a generator seeded with 1'
    - kw: When
      text: 'it is shuffled with Fisher-Yates, taking j = Intn(i+1) for i from 8 down to 1 and swapping positions i and j'
    - kw: Then
      text: 'the result is [5 6 9 8 7 2 3 4 1]'
    - kw: And
      text: 'the same seed always yields that same permutation'
code:
  lang: go
  source: |
    // Fisher-Yates: from the back, swap each element with a random earlier one
    func Shuffle(a []int, r *RNG) {
      for i := len(a) - 1; i >= 1; i-- {
        j := r.Intn(i + 1) // 0..i inclusive
        a[i], a[j] = a[j], a[i]
      }
    }
checkpoint: You can shuffle a list into a seeded, reproducible order. Commit and stop here.
---

**Fisher-Yates** is the standard unbiased shuffle: walk the list from the last
position down, and for each position `i` pick a random index `j` in `0..i` and swap.
Every ordering is equally likely, and driving the picks from your seeded generator
makes the shuffle **reproducible** - a given seed always produces the same
permutation. The direction and the inclusive range matter: `Intn(i+1)` lets an
element stay in place, which is what keeps the shuffle unbiased.

This is the last building block before generation. The generator will shuffle the
digits `1..9` to fill a grid in a fresh order each seed, and shuffle the cell
positions `0..80` to decide which clues to try removing. Because both the generator
and this shuffle are fully specified, the whole pipeline downstream is
deterministic: one seed in, one exact puzzle out, the same in any language.
