---
project: build-a-pathfinder
lesson: 11
title: Terrain weights
overview: Not every step costs the same, crossing mud is slower than crossing road. Today you give each cell a movement cost, completing the weighted-graph view where an edge's cost is the cost to enter the cell it leads to.
goal: Give each cell a movement cost that defaults to 1, with a getter and setter.
spec:
  scenario: Cells carry a movement cost, defaulting to 1
  status: failing
  lines:
    - kw: Given
      text: 'a freshly created 3 by 3 grid'
    - kw: When
      text: 'Cost is queried before any cost is set'
    - kw: Then
      text: 'every cell reports Cost 1'
    - kw: And
      text: 'after SetCost((1, 1), 5), Cost(1, 1) is 5 while Cost(0, 0) is still 1'
code:
  lang: go
  source: |
    // add a per-cell cost slice; DEFAULT MUST BE 1, not the zero value 0
    type Grid struct {
      W, H  int
      walls []bool
      cost  []int
    }
    // in NewGrid, after making the slice:
    //   for i := range g.cost { g.cost[i] = 1 }
    func (g *Grid) SetCost(c Coord, w int) { g.cost[c.Y*g.W+c.X] = w }
    func (g *Grid) Cost(c Coord) int       { return g.cost[c.Y*g.W+c.X] }
checkpoint: Cells carry a movement cost that defaults to 1. Commit and stop here.
---

Breadth-first search assumed every step was equal, but real maps have **terrain**:
open ground, mud, water, each slower to cross than the last. We model that by giving
each cell a **movement cost**, the price of stepping onto it. In the graph view from
chapter one, this is the missing piece: cells are nodes, neighbors are edges, and an
edge's cost is the cost to **enter** the cell it points at.

The one trap is the **default**. A brand-new cost slice is all zeros, but a zero-cost
cell would let a search pass through it for free and break every later distance, so
`NewGrid` must fill the costs with **1**, not lean on the zero value. With that in
place a plain open grid behaves exactly like the unweighted one breadth-first search
searched (every step costs 1), and setting a higher cost marks slow terrain the next
algorithm will learn to route around.
