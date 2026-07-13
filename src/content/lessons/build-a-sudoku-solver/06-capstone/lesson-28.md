---
project: build-a-sudoku-solver
lesson: 28
title: Generate and solve back
overview: The finale closes the loop - generate a puzzle from a seed, confirm it is well-formed, and solve it back to the grid it came from. Every part of the library, working together, from one seed.
goal: Generate a seeded puzzle, confirm it is unique, and solve it back to its source grid.
spec:
  scenario: A generated puzzle round-trips through the solver
  status: failing
  lines:
    - kw: Given
      text: 'the seed 7'
    - kw: When
      text: 'a puzzle is generated from it, then rated, checked for uniqueness, and solved'
    - kw: Then
      text: 'the puzzle is "...1...2...1...4.754.2.7....3....1.2..87..5..6.....8...2.5.1.9.......2.87..6...4." with 26 clues and is uniquely solvable'
    - kw: And
      text: 'solving it returns the seed-7 full grid "387194625291356487546287913435869172918732564672415839823541796164973258759628341", which is complete and valid'
code:
  lang: go
  source: |
    puz := Generate(7)
    // IsUnique(puz) == true; Difficulty(puz) is Easy or Hard
    sol, ok := Solve(puz)
    // ok == true, IsComplete(sol) && IsValid(sol)
    // sol == FullGrid(7): the generator and solver close the loop
checkpoint: A generated puzzle solves back to its source grid. The project is complete; commit and stop here.
---

The last spec ties the whole library into one story. From a single seed the
generator builds a full grid, digs holes while a unique solution survives, and hands
back a proper 26-clue puzzle; uniqueness confirms it is well-formed; difficulty rates
it; and the solver, given only the sparse puzzle, reconstructs the exact full grid it
was carved from. Generation and solving are inverses, and here you watch them close
the loop on themselves.

Look back at what runs in that one line. An 81-cell board with its 27 units and 20
peers per cell; candidate sets and a candidate grid; naked and hidden singles
propagating to a fixpoint with contradiction detection; most-constrained-cell
backtracking search; solution counting; a seeded generator and shuffle. Together they
are a genuine, complete Sudoku engine - Norvig's constraint-propagation-and-search
method, built from first principles - that solves any valid puzzle, judges it, and
makes its own. That is a real solver, and it is yours.
