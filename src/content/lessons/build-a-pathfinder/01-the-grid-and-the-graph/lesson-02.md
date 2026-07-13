---
project: build-a-pathfinder
lesson: 2
title: Walls and walkable cells
overview: A map is only interesting once some cells are blocked. Today you let a cell be marked as a wall and ask whether a cell is walkable, which is the single distinction every search in this project will branch on.
goal: Mark a cell as a wall and report whether a given cell is walkable.
spec:
  scenario: A cell can be a wall, and walkability reflects it
  status: failing
  lines:
    - kw: Given
      text: 'a new 3 by 3 grid where every cell starts open'
    - kw: When
      text: 'the cell at (1, 1) is marked a wall with SetWall'
    - kw: Then
      text: 'Wall(1, 1) is true and Walkable(1, 1) is false'
    - kw: And
      text: 'an untouched cell (0, 0) reports Wall false and Walkable true'
code:
  lang: go
  source: |
    // name the (x,y) pair now; it will be a map key and path element later
    type Coord struct{ X, Y int }
    // store one bool per cell; index it as Y*W + X
    type Grid struct {
      W, H  int
      walls []bool
    }
    func NewGrid(w, h int) *Grid { return &Grid{W: w, H: h, walls: make([]bool, w*h)} }
    func (g *Grid) SetWall(c Coord)    { g.walls[c.Y*g.W+c.X] = true }
    func (g *Grid) Wall(c Coord) bool  { return g.walls[c.Y*g.W+c.X] }
    // Walkable is just: not a wall (bounds come next lesson)
checkpoint: Cells can be walls, and you can ask whether a cell is walkable. Commit and stop here.
---

A grid of open cells is just an empty field. What turns it into a map worth
searching is **obstacles**: cells you cannot enter. We represent that with a single
bit per cell, a **wall** flag, stored in a flat slice indexed by `y*W + x`. Every
cell starts open, and marking a wall sets its bit.

The one question every search asks about a cell is **walkable**: can I stand here?
For now that is simply the opposite of being a wall. Next lesson we fold in bounds
checking so that stepping off the edge of the grid counts as not walkable too, but
the shape is already here: walls carve the searchable space, and `Walkable` is the
gate every neighbor step will pass through.
