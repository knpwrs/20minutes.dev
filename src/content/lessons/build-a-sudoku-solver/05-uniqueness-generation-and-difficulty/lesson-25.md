---
project: build-a-sudoku-solver
lesson: 25
title: Digging holes for a puzzle
overview: A puzzle is a full grid with clues removed - but only as many as can go while a single solution remains. Today you write the generator, removing cells in a seeded order and keeping each removal only if the puzzle stays uniquely solvable.
goal: Generate a uniquely-solvable puzzle by removing clues from a full grid while uniqueness holds.
spec:
  scenario: A seed produces a unique puzzle that solves back
  status: failing
  lines:
    - kw: Given
      text: 'the full grid from seed 7 and the same generator continued to shuffle the cell order 0..80'
    - kw: When
      text: 'each cell in that order is blanked, kept blank only if the puzzle still counts exactly one solution'
    - kw: Then
      text: 'the generated puzzle is "...1...2...1...4.754.2.7....3....1.2..87..5..6.....8...2.5.1.9.......2.87..6...4." with 26 clues'
    - kw: And
      text: 'it is uniquely solvable, and solving it returns the original seed-7 full grid'
code:
  lang: go
  source: |
    // dig holes in a shuffled order, restoring any removal that breaks uniqueness
    func Generate(seed uint32) [81]int {
      r := &RNG{state: seed}
      full := fillEmpty(r)             // same generator, continues advancing
      order := shuffledPositions(r)    // shuffle 0..80 with the same r
      puz := full
      for _, cell := range order {
        saved := puz[cell]; puz[cell] = 0
        if !IsUnique(puz) { puz[cell] = saved } // undo if now ambiguous
      }
      return puz
    }
checkpoint: You can generate a uniquely-solvable puzzle from a seed. Commit and stop here.
---

Making a puzzle is **digging holes**: start from a full solution and remove clues,
but never so many that the answer stops being unique. So you visit the cells in a
seeded shuffled order and, for each, tentatively blank it and count solutions - if
the count is still exactly 1 the hole stays, otherwise you put the clue back. What
remains is a puzzle that is as sparse as this greedy order allows while still having
one and only one solution.

The whole run is deterministic because every random choice - the fill, the removal
order - comes from the one seeded generator, advanced in a fixed sequence. Seed 7
yields a specific 26-clue puzzle, and the proof it is well-formed is that solving it
returns the very full grid you started from. This is generation and solving closing
a loop: you can now make puzzles and immediately solve them back, all from a single
reproducible seed.
