---
project: build-a-sudoku-solver
lesson: 20
title: The full solver
overview: The fast solver interleaves deduction and search - propagate as far as logic allows, then guess only at the most-constrained cell and propagate again. Today you assemble Norvig's full solver, which cracks even the hardest puzzles instantly.
goal: Solve by propagating, then branching on the most-constrained cell and propagating each guess.
spec:
  scenario: Propagation plus search solves any puzzle
  status: failing
  lines:
    - kw: Given
      text: 'the hard puzzle "800000000003600000070090200050007000000045700000100030001000068008500010090000400"'
    - kw: When
      text: 'the full solver runs (propagate, then guess the fewest-candidate cell and recurse)'
    - kw: Then
      text: 'it returns "812753649943682175675491283154237896369845721287169534521974368438526917796318452"'
    - kw: And
      text: 'an already-solved grid returns itself, and the unsolvable ".123456789" followed by 71 dots returns no solution'
code:
  lang: go
  source: |
    // propagate; if solved, done; if stuck, guess the tightest cell and recurse
    func Solve(g [81]int) ([81]int, bool) {
      var search func(cg [81]Set) ([81]Set, bool)
      search = func(cg [81]Set) ([81]Set, bool) {
        cg, ok := Propagate(cg)
        if !ok { return cg, false }
        if allSingles(cg) { return cg, true }
        cell := mrv(cg) // fewest candidates among Size()>1
        for _, d := range cg[cell].Members() {
          if sol, ok := search(AssignCG(cg, cell, d)); ok { return sol, true }
        }
        return cg, false
      }
      // build the candidate grid, search, read singles back to a grid
    }
checkpoint: The full solver - propagation interleaved with search - solves the hardest puzzles instantly. Commit and stop here.
---

This is Norvig's complete method, and the climax of the solver. At every node,
first **propagate** to squeeze out every forced digit; if that solves the grid, you
are done, and if it hits a contradiction, fail. Only when deduction stalls do you
**search**: pick the most-constrained cell, try each of its candidates by assigning
into a copy and recursing - and because each guess is immediately followed by a full
propagation, most wrong guesses are refuted almost at once. Deduction shrinks the
tree; search only handles what deduction cannot.

The result is a solver that dispatches the 21-clue "hardest" puzzle in a heartbeat,
where plain backtracking would have struggled. The base cases are the same as
before - an already-solved grid returns itself, an impossible grid returns no
solution - but now every valid puzzle, gentle or fiendish, is solved fast and
exactly. With a solver this strong, the final chapter can afford to *call it many
times*: to count solutions, test uniqueness, and generate puzzles of your own.
