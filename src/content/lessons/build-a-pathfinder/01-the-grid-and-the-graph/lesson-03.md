---
project: build-a-pathfinder
lesson: 3
title: Coordinates and staying in bounds
overview: Search steps constantly ask "is this cell even on the map?" Today you add an in-bounds check to the grid and fold it into walkable, so a step off any edge is rejected cleanly.
goal: Add an InBounds test and make walkable respect the edges as well as walls.
spec:
  scenario: Coordinates outside the grid are not in bounds or walkable
  status: failing
  lines:
    - kw: Given
      text: 'a 3 by 3 grid with all cells open'
    - kw: When
      text: 'InBounds is asked about several coordinates'
    - kw: Then
      text: 'InBounds of (0, 0) and (2, 2) is true, while InBounds of (3, 0), (0, 3), and (-1, 0) is false'
    - kw: And
      text: 'Walkable of (-1, 0) is false (out of bounds), and Walkable of (2, 2) is true'
code:
  lang: go
  source: |
    func (g *Grid) InBounds(c Coord) bool {
      return c.X >= 0 && c.Y >= 0 && c.X < g.W && c.Y < g.H
    }
    // Walkable now: in bounds AND not a wall
    func (g *Grid) Walkable(c Coord) bool {
      return g.InBounds(c) && !g.Wall(c)
    }
checkpoint: Walkable now rejects anything off the edges as well as walls. Commit and stop here.
---

You already have a **Coord** to name a cell and a **wall** flag. The gap is the
edge of the map: a coordinate like `(-1, 0)` or `(3, 0)` on a 3 by 3 grid names no
real cell at all, and indexing the wall slice with it would be wrong or crash.

The work today is **bounds**. A search repeatedly looks at a cell's neighbors,
and near an edge some of those neighbors fall off the grid. Rather than guard for
that everywhere, we make it part of `Walkable`: a coordinate is walkable only if it
is **in bounds** and **not a wall**. That one predicate now safely answers "can the
search step here?" for any coordinate at all, on the map or not.
