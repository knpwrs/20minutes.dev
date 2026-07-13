---
project: build-a-diff-tool
lesson: 14
title: Walking the whole path
overview: One step back becomes the whole project - repeat the backtrack from corner to origin, unfolding each snake into its individual diagonal moves, and you have the complete path as a list of unit steps.
goal: Backtrack the full trace into an ordered list of unit moves from the origin to the corner.
spec:
  scenario: The full path as unit steps
  status: failing
  lines:
    - kw: Given
      text: 'the trace for ["a", "b", "c"] against ["a", "x", "c"]'
    - kw: When
      text: 'the backtrack walks from (3, 3) to (0, 0), emitting each diagonal and each edit as a unit step, then reverses into forward order'
    - kw: Then
      text: 'the four steps are (0,0)->(1,1) diagonal, (1,1)->(2,1) right, (2,1)->(2,2) down, (2,2)->(3,3) diagonal'
    - kw: And
      text: 'each step moves exactly one unit: a diagonal advances both coordinates, a right advances x only, a down advances y only'
code:
  lang: go
  source: |
    x, y := n, m
    var steps [][4]int // {prevX, prevY, x, y}
    for d := len(trace) - 1; d >= 0; d-- {
      V := trace[d]
      px, py := previous(V, x, y, d)
      for x > px && y > py { // unfold the snake, one diagonal at a time
        steps = append(steps, [4]int{x - 1, y - 1, x, y})
        x, y = x-1, y-1
      }
      if d > 0 {
        steps = append(steps, [4]int{px, py, x, y}) // the single edit
      }
      x, y = px, py
    }
    // steps is corner-to-origin; reverse for forward order
checkpoint: You can reconstruct the full shortest path as ordered unit moves. Commit and stop here.
---

The single backtrack step from the last lesson locates a predecessor; doing it repeatedly, from `(n, m)` all the way to `(0, 0)`, traces the entire shortest path. Two kinds of unit move come out. Inside each depth you first **unfold the snake** - emit one diagonal step per matching line, walking down toward the predecessor's diagonal - and then emit the **single edit** (a right or a down) that got you onto that snake. Because you are moving backward, everything comes out corner-first, so reverse the list to read it origin-first.

Each entry is a tiny, unambiguous fact: a step that advanced both `x` and `y` was a **diagonal** (a kept line), one that advanced only `x` was a **right** (a deleted line), and one that advanced only `y` was a **down** (an inserted line). The path is now fully explicit and language-neutral - just coordinates. Turning those coordinate steps into the `Keep`, `Delete`, and `Insert` operations of an edit script is the next, short lesson.
