---
project: build-a-sudoku-solver
lesson: 2
title: Parsing a puzzle string
overview: Puzzles travel as an 81-character string - one character per cell, a digit for a clue and a dot or zero for a blank. Today you turn that string into a grid of 81 numbers, the input every solver call starts from.
goal: Parse an 81-character puzzle string into a grid of 81 integers, 0 for a blank.
spec:
  scenario: A puzzle string becomes a grid of numbers
  status: failing
  lines:
    - kw: Given
      text: 'the 81-character string "003020600900305001001806400008102900700000008006708200002609500800203009005010300"'
    - kw: When
      text: 'it is parsed into a grid of 81 integers'
    - kw: Then
      text: 'cell 0 is 0 (a blank), cell 2 is 3, and exactly 32 cells are non-zero clues'
    - kw: And
      text: 'both "." and "0" parse to the blank value 0, so a cell is either 0 or a digit 1 through 9'
code:
  lang: go
  source: |
    // one character per cell; '1'..'9' -> that digit, '.' or '0' -> 0
    func Parse(s string) [81]int {
      var g [81]int
      for i := 0; i < 81; i++ {
        c := s[i]
        if c >= '1' && c <= '9' { g[i] = int(c - '0') }
        // anything else stays 0 (blank)
      }
      return g
    }
checkpoint: You can load an 81-character puzzle string into a grid of numbers. Commit and stop here.
---

A Sudoku puzzle is almost always written as a single line of 81 characters, read
**row by row**: the first 9 characters are the top row, the next 9 the second row,
and so on down to the bottom-right corner at position 80. A filled square is its
digit `1` to `9`; an empty square is written as either a `.` or a `0`, and both
mean the same thing - **blank**. Accepting both spellings up front means you can
paste puzzles from any source without massaging them first.

Storing the board as an array of 81 small integers, with `0` standing for empty,
keeps everything downstream simple: a clue is a value you must not contradict, a
blank is a `0` waiting to be filled. Counting the non-zero cells is a quick sanity
check that the parse worked - this classic puzzle has 32 given clues.
