---
project: build-a-diff-tool
lesson: 10
title: The shortest edit distance
overview: Now the pieces combine into the heart of Myers - a loop over increasing edit budgets that stops the instant a path reaches the far corner. The budget it stops at is D, the minimum number of insertions and deletions between the two documents.
goal: Run the forward pass to find D, the shortest edit distance between two documents.
spec:
  scenario: The minimal edit distance for several document pairs
  status: failing
  lines:
    - kw: Given
      text: 'the forward pass that increases d until a path reaches (n, m)'
    - kw: When
      text: 'EditDistance is computed for various pairs'
    - kw: Then
      text: 'identical documents give D = 0; ["a", "b", "c"] against ["a", "x", "c"] gives D = 2; ["a"] against [] gives D = 1 and [] against ["a"] gives D = 1'
    - kw: And
      text: 'the classic pair "ABCABBA" against "CBABAC" (as single-character lines) gives D = 5'
code:
  lang: go
  source: |
    func EditDistance(a, b []string) int {
      n, m := len(a), len(b)
      V := map[int]int{1: 0}
      for d := 0; d <= n+m; d++ {
        for k := -d; k <= d; k += 2 {
          x := furthestX(V, k, d)
          y := x - k
          x, y = snake(a, b, x, y) // slide the free diagonal
          V[k] = x
          if x >= n && y >= m {
            return d
          }
        }
      }
      return n + m
    }
checkpoint: You can compute the exact minimum number of edits between two documents. Commit and stop here.
---

The forward pass is a loop over the edit budget `d`, from 0 upward. For each `d` it visits every reachable diagonal `k`, extends `V[k]` with the greedy down-or-right choice from the previous lesson, immediately slides down the snake that opens up, and checks whether that landed on the far corner `(n, m)`. The **first** `d` at which any diagonal reaches the corner is the answer: `D`, the shortest edit distance. Because `d` only ever increases and each `d` costs one more edit, the first arrival is provably minimal - that is the whole proof, and it is why the greedy choice is safe.

`D` counts only insertions and deletions; every kept line is free. So identical documents have `D = 0` (one long snake straight to the corner), deleting a single line or inserting one costs `D = 1`, and the famous worked example from Myers' paper, `ABCABBA` versus `CBABAC`, costs `D = 5`. Sanity-check that last one against the previous chapter: its LCS length is 4, and `D = n + m - 2·LCS = 7 + 6 - 8 = 5`. The two engines agree on the numbers - next you record the path so Myers can hand back the actual script, not just its length.
