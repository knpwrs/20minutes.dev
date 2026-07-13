---
project: build-a-pathfinder
lesson: 4
title: Neighbors in a fixed order
overview: A search moves from a cell to its neighbors, so the neighbor list is the graph's edges. Today you enumerate the four orthogonal neighbors in one fixed order, skipping walls and edges, which is the single most important decision for making every path reproducible.
goal: Return a cell's walkable four-directional neighbors in a fixed, deterministic order.
spec:
  scenario: Neighbors come back in North, East, South, West order, walls and edges skipped
  status: failing
  lines:
    - kw: Given
      text: 'a 3 by 3 open grid and the direction order North (0,-1), East (1,0), South (0,1), West (-1,0)'
    - kw: When
      text: 'Neighbors of the center (1, 1) is requested'
    - kw: Then
      text: 'it returns exactly (1,0), (2,1), (1,2), (0,1) in that order'
    - kw: And
      text: 'Neighbors of the corner (0, 0) returns exactly (1,0), (0,1), because North and West are off the grid'
code:
  lang: go
  source: |
    // one fixed order, used by every search from here on
    var dir4 = []Coord{{0, -1}, {1, 0}, {0, 1}, {-1, 0}} // N, E, S, W
    func (g *Grid) Neighbors(c Coord) []Coord {
      out := []Coord{}
      for _, d := range dir4 {
        n := Coord{c.X + d.X, c.Y + d.Y}
        if g.Walkable(n) { out = append(out, n) }
      }
      return out
    }
checkpoint: A cell reports its walkable neighbors in a fixed North, East, South, West order. Commit and stop here.
---

This is where the grid becomes a **graph**. In graph terms each walkable cell is a
**node**, and an **edge** connects two cells you can step between. On a grid the
edges are implicit: a cell's neighbors are the cells one step North, East, South, or
West, as long as they are walkable. `Neighbors` is how the search reads those edges.

The order matters more than it looks. When two shortest paths tie, the one a search
returns depends entirely on the order it visited neighbors, so we fix that order
once, here, as **North, East, South, West**, and never vary it. That single
convention, together with the tie-breaking we add to the priority queue later, is
what makes every path in this project a specific, reproducible answer rather than
"some shortest path." Walls and off-grid cells simply never make it into the list,
because `Walkable` already screens them out.
