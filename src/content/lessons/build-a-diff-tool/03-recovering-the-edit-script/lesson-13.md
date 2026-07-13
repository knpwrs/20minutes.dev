---
project: build-a-diff-tool
lesson: 13
title: Backtracking one step
overview: Recovering the script means walking the trace backward from the far corner, one edit at a time. Today you take a single step back - from a point, find the point it came from at the previous depth.
goal: Given the trace, compute the predecessor of a point at depth d on the shortest path.
spec:
  scenario: One step back from the corner
  status: failing
  lines:
    - kw: Given
      text: 'the trace for ["a", "b", "c"] against ["a", "x", "c"], and the end point (3, 3) at depth d = 2'
    - kw: When
      text: 'the predecessor at depth d - 1 is computed from snapshot V = trace[2] (where V[-1] = 1, V[1] = 2)'
    - kw: Then
      text: 'the diagonal k = 0 chooses the down move (V[-1] = 1 is behind V[1] = 2), so prev_k = 1, prev_x = V[1] = 2, and prev_y = prev_x - prev_k = 1'
    - kw: And
      text: 'the predecessor point is (2, 1)'
code:
  lang: go
  source: |
    // mirror of the forward choice, reading the snapshot for this depth
    func previous(V map[int]int, x, y, d int) (int, int) {
      k := x - y
      var prevK int
      if k == -d || (k != d && V[k-1] < V[k+1]) {
        prevK = k + 1 // the move into (x,y) was a down (insert)
      } else {
        prevK = k - 1 // ... a right (delete)
      }
      prevX := V[prevK]
      return prevX, prevX - prevK
    }
checkpoint: You can step one edit backward along the shortest path. Commit and stop here.
---

Backtracking reverses the forward pass. You know the path ended at `(n, m)` after `D` edits, and each snapshot `trace[d]` tells you where every diagonal stood at depth `d`. To step back from a point at depth `d`, you ask the same question the forward pass asked - was this reached by a down move from diagonal `k+1`, or a right move from `k-1`? - using the *same* comparison, so you retrace the exact choices the forward pass made. That gives you the previous diagonal `prev_k`, and reading `V[prev_k]` from the snapshot gives the predecessor's coordinates.

The predecessor `(prev_x, prev_y)` sits at depth `d - 1`, one edit closer to the origin. Between it and your current point lies exactly one edit (the down or right) followed by a snake of free diagonals - but this step only locates the predecessor; peeling off the snake and naming the operations comes next. Get this single step exactly right and the full walk is just repeating it until you reach `(0, 0)`.
