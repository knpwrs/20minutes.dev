---
project: build-a-diff-tool
lesson: 8
title: Following a snake
overview: A run of consecutive matching lines is a free ride across the edit graph - Myers calls it a snake. Today you write the helper that follows one as far as it goes, the move that makes the algorithm cheap.
goal: From a grid point, follow consecutive diagonal matches to the furthest reachable point.
spec:
  scenario: A snake slides along matching lines and stops at a mismatch
  status: failing
  lines:
    - kw: Given
      text: 'a = ["A", "B", "C"] and b = ["A", "B", "D"]'
    - kw: When
      text: 'snake(a, b, 0, 0) follows the diagonal'
    - kw: Then
      text: 'it returns (2, 2): it slides through the matching "A" and "B" and stops where "C" meets "D"'
    - kw: And
      text: 'snake(a, b, 2, 2) returns (2, 2) unchanged, because no diagonal is available there'
code:
  lang: go
  source: |
    // slide diagonally while lines keep matching
    func snake(a, b []string, x, y int) (int, int) {
      for canDiagonal(a, b, x, y) {
        x, y = x+1, y+1
      }
      return x, y
    }
checkpoint: You can slide along a run of matching lines in one step. Commit and stop here.
---

A **snake** is a maximal run of diagonal moves - a stretch of lines the two documents share consecutively. Because diagonals are free, once you arrive at a point you should always take every diagonal available before spending another edit; there is never a reason to stop a match early. `snake` does exactly that: it walks diagonally, calling the predicate from the last lesson, until the lines stop matching or it runs off the end of a document.

This is the single most important move in Myers' algorithm. Every edit (a right or a down) is immediately followed by sliding down whatever snake it opens onto, so the algorithm advances in big free jumps rather than one cell at a time. That is why it costs `O((n+m)·D)` where `D` is the number of edits, instead of the baseline's `O(nm)`: when two documents are similar, `D` is small and the snakes are long. Next you introduce the bookkeeping - the `V` array - that decides *which* edit to spend before each snake.
