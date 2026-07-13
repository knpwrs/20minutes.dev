---
project: build-a-sudoku-solver
lesson: 24
title: A random complete grid
overview: Generating a puzzle starts from a full, valid solution. Today you make one by running the backtracking solver on an empty grid with digits tried in a seeded random order, so each seed yields a different complete grid - reproducibly.
goal: Fill an empty grid to a random but seeded complete solution.
spec:
  scenario: A seed produces a fixed complete grid
  status: failing
  lines:
    - kw: Given
      text: 'an empty grid and a generator seeded with 7'
    - kw: When
      text: 'the first blank is filled by trying its candidates in ascending order shuffled by the generator, recursing and backtracking as usual'
    - kw: Then
      text: 'the completed grid is "387194625291356487546287913435869172918732564672415839823541796164973258759628341"'
    - kw: And
      text: 'the grid is complete and valid, and the same seed always produces it'
code:
  lang: go
  source: |
    // backtracking fill: same search, but shuffle each cell's candidate order
    func FullGrid(seed uint32) [81]int {
      r := &RNG{state: seed}
      var fill func(g [81]int) ([81]int, bool)
      fill = func(g [81]int) ([81]int, bool) {
        cell := FirstEmpty(g)
        if cell == -1 { return g, true }
        ds := Candidates(g, cell).Members() // ascending
        Shuffle(ds, r)
        for _, d := range ds {
          if sol, ok := fill(Assign(g, cell, d)); ok { return sol, true }
        }
        return g, false
      }
      // fill an all-zero grid
    }
checkpoint: A seed produces a random, valid, complete grid, reproducibly. Commit and stop here.
---

Every generated puzzle is a full solution with clues removed, so the first job is to
build a **random complete grid**. The trick is to reuse the backtracking solver
almost unchanged: fill the first blank, but instead of trying candidates in a fixed
order, **shuffle** each cell's candidate list with the seeded generator before
trying them. The search still guarantees a valid, complete grid; the shuffle just
steers *which* valid grid you land on.

Because the generator and shuffle are fully specified, this is deterministic:
seed 7 always produces the exact same solved grid, so it is a value you can pin and
reproduce anywhere. The order matters precisely - first blank, candidates ascending,
then shuffled from the back - so the sequence of random draws is identical for
everyone. This complete grid is the raw material the next lesson carves a puzzle out
of.
