---
project: build-a-sudoku-solver
lesson: 4
title: Rows, columns, and boxes
overview: A Sudoku's rules are exactly 27 constraints - every row, every column, and every 3x3 box must hold each digit once. Today you build that list of 27 units, the single structure the whole solver reasons over.
goal: Build the list of 27 units, each the 9 cell indices of one row, column, or box.
spec:
  scenario: The 27 units list every row, column, and box
  status: failing
  lines:
    - kw: Given
      text: 'the board as cells 0 through 80'
    - kw: When
      text: 'the list of all units is built'
    - kw: Then
      text: 'there are 27 units, the first row is [0 1 2 3 4 5 6 7 8] and the first column is [0 9 18 27 36 45 54 63 72]'
    - kw: And
      text: 'the 3x3 box containing the centre cell 40 is exactly [30 31 32 39 40 41 48 49 50]'
code:
  lang: go
  source: |
    // 9 rows, then 9 columns, then 9 boxes = 27 units of 9 cells each
    func Units() [][]int {
      var u [][]int
      for r := 0; r < 9; r++ { /* cells Index(r,0..8) */ }
      for c := 0; c < 9; c++ { /* cells Index(0..8,c) */ }
      for br := 0; br < 3; br++ {
        for bc := 0; bc < 3; bc++ { /* the 9 cells of box (br,bc) */ }
      }
      return u
    }
checkpoint: You have all 27 units - 9 rows, 9 columns, 9 boxes. Commit and stop here.
---

The entire rulebook of Sudoku fits in one sentence: in each **unit** - a row, a
column, or a 3x3 box - the digits 1 through 9 appear exactly once. There are 9 of
each kind, so **27 units** in all, and every one is just a list of the 9 cell
indices it covers. Building them once, up front, means every later question ("is
this legal?", "what can go here?") is a loop over these 27 lists rather than a
tangle of special cases.

Rows and columns are straightforward from the indexing you already have. The boxes
are the fiddly ones: box `(br, bc)` starts at row `br*3`, column `bc*3` and spans a
3x3 block, so the centre box gathers rows 3 to 5 and columns 3 to 5 - cells 30, 31,
32, then 39, 40, 41, then 48, 49, 50. Get the box arithmetic right here and the
rest of the solver inherits it for free.
