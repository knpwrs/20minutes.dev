---
project: build-a-pathfinder
lesson: 1
title: The grid, a field of cells
overview: Every pathfinder needs a map to search. Ours is a grid, a rectangle of cells laid out in rows and columns, and today you build it and have it report its own size. Everything later carves paths and mazes through this one structure.
goal: Create a grid of a fixed width and height and report both dimensions.
spec:
  scenario: A newly created grid knows its dimensions
  status: failing
  lines:
    - kw: Given
      text: 'a new grid created with NewGrid(5, 3)'
    - kw: When
      text: 'its Width and Height are queried'
    - kw: Then
      text: 'Width reports 5 and Height reports 3'
    - kw: And
      text: 'a separate grid created with NewGrid(8, 8) reports Width 8 and Height 8, independent of the first'
code:
  lang: go
  source: |
    // the whole pathfinder searches inside this one grid
    type Grid struct {
      W, H int
    }
    func NewGrid(w, h int) *Grid { return &Grid{W: w, H: h} }
    func (g *Grid) Width() int  { return g.W }
    func (g *Grid) Height() int { return g.H }
checkpoint: You have a fixed-size grid that reports its width and height. Commit and stop here.
---

A pathfinder works over a **map**, and the simplest useful map is a **grid**: a
rectangle of cells addressed by column `x` and row `y`. Keeping the map an explicit
grid, rather than real-world geometry, is what makes every later result an exact
value you can check: a path is a list of cell coordinates, a cost is an integer, a
maze is a specific pattern of walls.

Today is deliberately tiny. A grid needs to know how wide and how tall it is,
because those dimensions bound every coordinate the search will ever touch. That
`width` by `height` rectangle is the entire world our pathfinder lives in, so
pinning it down precisely is where everything starts.
