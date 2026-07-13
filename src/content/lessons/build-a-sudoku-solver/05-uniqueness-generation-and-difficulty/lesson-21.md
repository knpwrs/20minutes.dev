---
project: build-a-sudoku-solver
lesson: 21
title: Counting solutions
overview: A proper Sudoku has exactly one solution. Today you turn the solver into a solution counter that stops at two, giving you a uniqueness test - the tool the generator depends on.
goal: Count a puzzle's solutions up to a limit, and report whether it is uniquely solvable.
spec:
  scenario: Solutions are counted up to a cap
  status: failing
  lines:
    - kw: Given
      text: 'a proper puzzle, an under-constrained puzzle, and an impossible one'
    - kw: When
      text: 'solutions are counted with a cap of 2'
    - kw: Then
      text: 'the proper puzzle "003020600900305001001806400008102900700000008006708200002609500800203009005010300" counts 1, so it is unique'
    - kw: And
      text: 'the two-solution puzzle "812.7.596365129748974856132193765824287.1.965546298317759632481421987653638541279" counts 2, and the impossible ".123456789" followed by 71 dots counts 0'
code:
  lang: go
  source: |
    // like Solve, but keep searching and tally leaves; stop once you reach limit
    func CountSolutions(g [81]int, limit int) int {
      count := 0
      // search(cg): propagate; on solved, count++; else branch every candidate,
      // returning early once count == limit
      return count
    }
    func IsUnique(g [81]int) bool { return CountSolutions(g, 2) == 1 }
checkpoint: You can count solutions up to a cap and test a puzzle for uniqueness. Commit and stop here.
---

A well-formed Sudoku is defined by having **exactly one** solution. To check that,
you do not need to enumerate every solution - you only need to know whether there is
one, none, or more than one. So the counter reuses the full solver's search but,
instead of returning the first solution, it keeps going and tallies each complete
grid it reaches, and it **stops the moment it hits two**. Counting past two would be
wasted work; two already proves non-uniqueness.

That capped count is exactly the **uniqueness** test: a count of 1 means a proper
puzzle, 0 means impossible, and 2 means ambiguous. The crafted example here has just
four blanks arranged so two digits can swap, giving precisely two solutions - the
smallest kind of ambiguity. This test is the backbone of the next lessons: the
generator will remove clues only as long as the puzzle stays at a count of 1.
