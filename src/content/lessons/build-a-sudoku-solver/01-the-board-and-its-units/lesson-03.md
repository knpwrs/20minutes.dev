---
project: build-a-sudoku-solver
lesson: 3
title: Printing a grid
overview: To read a board back - and to check a solver's output - you need to turn a grid of numbers into a string. Today you write the printer, giving you a parse-print round trip and the first usable surface of the library.
goal: Render a grid back to an 81-character string, using a dot for each blank.
spec:
  scenario: A grid prints back to a canonical string
  status: failing
  lines:
    - kw: Given
      text: 'the grid parsed from "003020600900305001001806400008102900700000008006708200002609500800203009005010300"'
    - kw: When
      text: 'the grid is rendered to a string'
    - kw: Then
      text: 'it equals "..3.2.6..9..3.5..1..18.64....81.29..7.......8..67.82....26.95..8..2.3..9..5.1.3.." (every blank shown as ".")'
    - kw: And
      text: 'rendering the grid parsed from a string of 81 zeros gives a string of 81 dots'
code:
  lang: go
  source: |
    // inverse of Parse: 0 -> '.', a digit -> its character
    func GridString(g [81]int) string {
      b := make([]byte, 81)
      for i, v := range g {
        if v == 0 { b[i] = '.' } else { b[i] = byte('0' + v) }
      }
      return string(b)
    }
checkpoint: A grid round-trips to and from an 81-character string. Commit and stop here.
---

Printing is the mirror image of parsing: walk the 81 cells in order and emit one
character each, a `.` for a blank and the digit itself otherwise. Choosing `.`
(rather than `0`) for blanks gives a **canonical** form, so a puzzle written with
zeros and the same puzzle written with dots print identically once parsed. That
canonical string is what you will assert solutions against for the rest of the
project.

With parse and print in place the library already does something useful end to end:
read a puzzle, hold it as numbers, hand it back as text. Every solver you write
from here takes a grid and returns a grid, and this printer is how you will read
the answer.
