---
project: build-a-diff-tool
lesson: 7
title: The edit graph
overview: Myers' algorithm reframes diffing as finding a path across a grid - the edit graph. Today you build the one primitive that grid is made of, a test for whether a free diagonal move (a matching line) is available at a point.
goal: Write a predicate that reports whether a diagonal move is available at grid point (x, y).
spec:
  scenario: A diagonal is available exactly where the lines match
  status: failing
  lines:
    - kw: Given
      text: 'the documents a = ["A", "B", "C"] and b = ["A", "B", "D"]'
    - kw: When
      text: 'canDiagonal(a, b, x, y) is evaluated'
    - kw: Then
      text: 'it is true at (0, 0) and (1, 1) where the lines match, and false at (2, 2) where "C" and "D" differ'
    - kw: And
      text: 'it is false at (3, 0) and (0, 3), any point where x or y is past the end of its document'
code:
  lang: go
  source: |
    // x lines of a and y lines of b already consumed;
    // a diagonal consumes one matching line from each
    func canDiagonal(a, b []string, x, y int) bool {
      return x < len(a) && y < len(b) && a[x] == b[y]
    }
checkpoint: You can tell where free diagonal moves exist on the edit graph. Commit and stop here.
---

Picture a grid with the old document `a` along the top (x axis, `0..n`) and the new document `b` down the side (y axis, `0..m`). A point `(x, y)` means "I have consumed the first `x` lines of `a` and the first `y` lines of `b`." You start at `(0, 0)` and want to reach `(n, m)`. Three moves are allowed from a point: step **right** to `(x+1, y)` consumes an old line - a **deletion**; step **down** to `(x, y+1)` consumes a new line - an **insertion**; and if `a[x] == b[y]`, step **diagonally** to `(x+1, y+1)` consuming a matching line from both - a **keep**. This grid is the **edit graph**, and any path from corner to corner is an edit script.

The trick that makes Myers fast is that diagonal moves are **free**: right and down moves each cost one edit, but a diagonal costs nothing because a kept line is not an edit. So the shortest edit script is the path with the fewest right-and-down moves, which means the path that takes as many free diagonals as it can. Today's predicate answers the only question the graph ever asks - "is a free diagonal available here?" - and the rest of the chapter uses it to walk the graph cheaply.
