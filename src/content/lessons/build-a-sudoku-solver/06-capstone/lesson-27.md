---
project: build-a-sudoku-solver
lesson: 27
title: Solving a suite of real puzzles
overview: Time to prove the solver on real puzzles across the whole difficulty range. Today you solve a suite - an easy one, a hard one, a known hardest, and a minimal 17-clue puzzle - to their exact solved grids, each verified complete and valid.
goal: Solve a suite of real puzzles and assert each exact solution is complete and valid.
spec:
  scenario: The solver clears a range of real puzzles
  status: failing
  lines:
    - kw: Given
      text: 'the easy "003020600900305001001806400008102900700000008006708200002609500800203009005010300", the hard "800000000003600000070090200050007000000045700000100030001000068008500010090000400", and the 17-clue "000000010400000000020000000000050407008000300001090000300400200050100000000806000"'
    - kw: When
      text: 'each is solved with the full solver'
    - kw: Then
      text: 'the easy solves to "483921657967345821251876493548132976729564138136798245372689514814253769695417382" and the hard to "812753649943682175675491283154237896369845721287169534521974368438526917796318452"'
    - kw: And
      text: 'the 17-clue solves to "693784512487512936125963874932651487568247391741398625319475268856129743274836159", and every solution is complete and valid'
code:
  lang: go
  source: |
    puzzles := []string{easy, hard, clue17}
    for _, s := range puzzles {
      sol, ok := Solve(Parse(s))
      // ok == true, IsComplete(sol) && IsValid(sol),
      // and GridString(sol) equals the known answer for s
    }
checkpoint: The solver clears a suite of real puzzles to their exact solutions. Commit and stop here.
---

This is the promise the project was built to keep: a solver that handles **any**
valid Sudoku. The suite spans the range on purpose - a gentle 32-clue puzzle that
falls to pure propagation, a fiendish 21-clue puzzle that only search can crack, and
a minimal 17-clue puzzle at the theoretical edge of how few clues a proper puzzle can
have. Each one comes back with its exact solved grid, and each is checked complete
and valid, so nothing is taken on trust.

Every layer proves itself here at once. Parsing turns each string into a grid; the
candidate grid and propagation strip out the forced digits; the most-constrained-cell
search fills the rest; and completeness plus validity confirm the answer. That the
same handful of functions solves puzzles this different, to the exact character, is
the whole point - a small, correct constraint-satisfaction engine, and it is yours.
