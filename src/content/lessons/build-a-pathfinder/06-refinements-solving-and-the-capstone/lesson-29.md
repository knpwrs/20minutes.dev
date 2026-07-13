---
project: build-a-pathfinder
lesson: 29
title: Diagonal cost and the octile heuristic
overview: A diagonal step covers more ground than a straight one, so it should cost more. Today you price orthogonal moves at 10 and diagonal moves at 14, and pair them with the octile heuristic that matches this cost exactly.
goal: Run A* over eight-directional movement with 10 and 14 step costs and the octile heuristic.
spec:
  scenario: Eight-way A* takes the diagonal and prices it correctly
  status: failing
  lines:
    - kw: Given
      text: 'a 3 by 3 open grid with eight-directional movement, orthogonal steps costing 10 and diagonal steps costing 14, searching from (0, 0) to (2, 2)'
    - kw: When
      text: 'A* runs with the octile heuristic, 10*max(dx,dy) + 4*min(dx,dy)'
    - kw: Then
      text: 'it returns the 3-cell diagonal path (0,0), (1,1), (2,2) at cost 28 (two diagonal steps)'
    - kw: And
      text: 'the octile estimate Octile((0,0),(2,2)) is 28, exactly the true cost, so it never overestimates'
code:
  lang: go
  source: |
    // step cost in the 8-way search: 14 if the move is diagonal, else 10
    //   if n.X != cur.X && n.Y != cur.Y { step = 14 } else { step = 10 }
    func Octile(a, b Coord) int {
      dx, dy := abs(a.X-b.X), abs(a.Y-b.Y)
      return 10*max(dx, dy) + 4*min(dx, dy) // 4 = 14 - 10, the diagonal premium
    }
checkpoint: Eight-way A* routes over diagonals with matching costs and heuristic. Commit and stop here.
---

If a diagonal step and a straight step cost the same, A* would zigzag pointlessly. A
diagonal actually covers about 1.41 times the distance, so we use the standard integer
approximation: an orthogonal move costs **10** and a diagonal move costs **14** (close
to `10 * sqrt(2)`). Working in tens keeps everything integer and exact while still
preferring straight moves when a diagonal would not save real distance.

The heuristic has to match this cost model to stay admissible. Manhattan would badly
**overestimate** now, since a diagonal covers two units of Manhattan gap for the price
of one move. The right estimate is the **octile distance**: take as many diagonal
steps as possible (the smaller of the two gaps) and straight steps for the rest, which
is `10*max(dx,dy) + 4*min(dx,dy)`. On a clear diagonal it equals the true cost
exactly, so A* is perfectly guided and still optimal. Chebyshev and Euclidean distance
are the other classic eight-way heuristics; octile is the one that fits a 10-and-14
cost grid precisely.
