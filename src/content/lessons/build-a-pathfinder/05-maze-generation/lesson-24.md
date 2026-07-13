---
project: build-a-pathfinder
lesson: 24
title: Rendering a maze to a grid
overview: The searches speak in walkable and wall cells, but a maze speaks in rooms and passages. Today you render one into the other, expanding a maze into a grid twice its size plus one, so A* can walk it.
goal: Render a maze into a (2W+1) by (2H+1) grid where cells are open and uncarved walls are solid.
spec:
  scenario: A maze expands into a walkable grid with walls between rooms
  status: failing
  lines:
    - kw: Given
      text: 'an empty 2 by 2 maze (no passages carved) rendered with ToGrid'
    - kw: When
      text: 'the resulting 5 by 5 grid is printed'
    - kw: Then
      text: "it is the five rows '#####' , '#.#.#' , '#####' , '#.#.#' , '#####' (only the four room centers are open)"
    - kw: And
      text: "after Carve((0,0), (1,0)) the second row opens to '#...#', joining the two top rooms"
code:
  lang: go
  source: |
    // room (cx,cy) maps to grid cell (2*cx+1, 2*cy+1); everything starts a wall.
    // open each room center; open the wall BETWEEN two rooms only if linked:
    //   east passage  -> open (2*cx+2, 2*cy+1)
    //   south passage -> open (2*cx+1, 2*cy+2)
    func (m *Maze) ToGrid() *Grid {
      g := NewGrid(2*m.W+1, 2*m.H+1)
      for y := 0; y < g.H; y++ { for x := 0; x < g.W; x++ { g.SetWall(Coord{x, y}) } }
      // then clear centers and carved-open walls (see the rules above)
      return g
    }
checkpoint: A maze renders into a walkable grid the searches can solve. Commit and stop here.
---

The two halves of this project speak different languages. Searches want a grid of
**walkable and wall** cells; a maze is a set of **rooms and passages**. Rendering
bridges them. Each room becomes one open cell, and between two rooms sits a cell that
is a wall unless a passage was carved there, so a `W` by `H` maze expands to a
`(2W+1)` by `(2H+1)` grid: `W` room columns, `W-1` interior walls between them, and a
border wall on each side.

An empty maze renders as a lattice, room centers floating in solid wall, because
nothing is connected yet. Carve a passage and exactly one wall cell between two rooms
opens, stitching them together. This is the moment the maze becomes searchable: once a
generator carves a full maze, `ToGrid` hands A* a normal grid, and the path it finds
is the maze's solution. The border of walls also means a solved path never runs off
the edge.
