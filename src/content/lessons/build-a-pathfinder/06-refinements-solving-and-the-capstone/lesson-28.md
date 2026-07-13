---
project: build-a-pathfinder
lesson: 28
title: Eight-directional movement
overview: Real agents move diagonally, not just along the axes. Today you add the four diagonal neighbors in a fixed order, with a corner rule that forbids squeezing diagonally between two walls.
goal: Enumerate eight-directional neighbors in a fixed order, forbidding diagonal moves through wall corners.
spec:
  scenario: Diagonal neighbors are added in order, blocked at wall corners
  status: failing
  lines:
    - kw: Given
      text: 'a 3 by 3 open grid and the eight-direction order N, E, S, W, NE, SE, SW, NW'
    - kw: When
      text: 'Neighbors8 of the center (1, 1) is requested'
    - kw: Then
      text: 'it returns (1,0), (2,1), (1,2), (0,1), (2,0), (2,2), (0,2), (0,0) in that order'
    - kw: And
      text: 'on a grid with a wall at (1, 0), Neighbors8 of (0, 0) returns only (0, 1): the diagonal to (1, 1) is forbidden because the corner cell (1, 0) is a wall'
code:
  lang: go
  source: |
    // the four orthogonals first (same as dir4), then the four diagonals
    var dir8 = []Coord{{0,-1},{1,0},{0,1},{-1,0}, {1,-1},{1,1},{-1,1},{-1,-1}}
    func (g *Grid) Neighbors8(c Coord) []Coord {
      out := []Coord{}
      for _, d := range dir8 {
        n := Coord{c.X + d.X, c.Y + d.Y}
        if !g.Walkable(n) { continue }
        if d.X != 0 && d.Y != 0 { // diagonal: both shared orthogonal cells must be open
          if !g.Walkable(Coord{c.X + d.X, c.Y}) || !g.Walkable(Coord{c.X, c.Y + d.Y}) { continue }
        }
        out = append(out, n)
      }
      return out
    }
checkpoint: Cells report eight-directional neighbors with a corner rule. Commit and stop here.
---

Restricting movement to four directions makes paths blocky. Allowing the four
**diagonals** too lets an agent cut across open space, which is how movement works in
most games and robotics. We list the diagonals **after** the orthogonals so the fixed
order still determines tie-broken paths, extending the same determinism to eight-way
movement.

Diagonals bring one new rule. Sliding diagonally between two walls that meet at a
corner would clip through solid geometry, so the **corner rule** forbids a diagonal
step unless **both** orthogonal cells it passes beside are open. Moving from `(0,0)`
to `(1,1)` requires `(1,0)` and `(0,1)` to both be walkable; wall off either and the
diagonal is blocked even though the destination itself is open. Without this rule a
path could ooze through a wall corner, which no physical agent can do. Next these
diagonal steps get a cost, and a heuristic to match.
