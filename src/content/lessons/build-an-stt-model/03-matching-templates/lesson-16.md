---
project: build-an-stt-model
lesson: 16
title: The DTW cost matrix
overview: Two recordings of the same word are almost never the same length, so comparing them frame-by-frame in lockstep fails constantly. Today you build the dynamic-programming table that finds the cheapest way to stretch one sequence onto the other.
goal: Build the DTW cost matrix for a short reference and test sequence, using lesson 15's distance and the pinned recurrence.
spec:
  scenario: Building the cost matrix for a tiny reference and test pair
  status: failing
  lines:
    - kw: Given
      text: 'a reference sequence [1, 3, 4, 5] and a test sequence [1, 2, 4, 4, 5], each frame a single scalar value compared with lesson 15''s distance'
    - kw: And
      text: 'the pinned recurrence: cost(0, 0) equals d(0, 0); each cell in row 0 or column 0 accumulates only along that edge (cost(i, 0) = cost(i-1, 0) + d(i, 0), and likewise for cost(0, j)); every other cost(i, j) equals d(i, j) plus the smallest of the diagonal, upward, and leftward neighbors'
    - kw: When
      text: 'the cost matrix is filled in for every reference row (0 through 3) against every test column (0 through 4)'
    - kw: Then
      text: 'row 0 (reference value 1) is 0, 1, 10, 19, 35'
    - kw: And
      text: 'row 1 (reference value 3) is 4, 1, 2, 3, 7'
    - kw: And
      text: 'row 2 (reference value 4) is 13, 5, 1, 1, 2'
    - kw: And
      text: 'row 3 (reference value 5) is 29, 14, 2, 2, 1 - the bottom-right cell, 1, is the total cost of aligning the whole test sequence to the whole reference'
    - kw: And
      text: 'row 1, column 2 (value 2) is reachable through two equally cheap predecessors - the diagonal cell at row 0, column 1 (cost 1) and the leftward cell at row 1, column 1 (cost 1) - a genuine tie that only matters once lesson 17 has to pick one of them to walk back through'
code:
  lang: go
  source: |
    // cost[i][j] = d(i,j) + min(diag, up, left); row 0 and column 0 instead
    // accumulate along their one edge, with no third neighbor to compare
    func DTWCost(ref, test []float64) [][]float64 {
      cost := make([][]float64, len(ref))
      for i := range cost {
        cost[i] = make([]float64, len(test))
      }
      // fill cost[0][0], then row 0, then column 0, then every other cell
      return cost
    }
checkpoint: You can build the full cost matrix behind any DTW alignment, and you have seen where a genuine tie hides inside it. Commit and stop for today.
---

Stretching one sequence onto another one frame at a time, rather than forcing a rigid one-to-one match, is exactly what **dynamic time warping** does - and the cost matrix is where that stretch gets computed. Cell `(i, j)` answers a single question: what is the cheapest way to have aligned the reference up to frame `i` with the test sequence up to frame `j`? That cheapest way is always one of three moves from a neighboring cell - stay on the same reference frame while the test sequence advances, stay on the same test frame while the reference advances, or advance both together - plus today's frame's own distance, which is why the recurrence only ever needs to look at three already-computed neighbors.

Filling in the first row and first column is a simplified version of the same idea: with nothing to compare against on one side, each of those edge cells has only one way to have gotten there, so it just accumulates the running distance along that single direction. Watch row 1, column 2 closely - it is reached just as cheaply from directly above as from directly to its left, and while that tie does not change the cell's own value, it means two different backward walks could claim to be "the" alignment through it. Lesson 17 is where that ambiguity actually has to be resolved.
