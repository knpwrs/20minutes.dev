---
project: build-a-pathfinder
lesson: 25
title: The recursive backtracker
overview: Now you generate a real maze. The recursive backtracker is a randomized depth-first walk that carves as it goes, and seeded with your generator it produces one specific, reproducible maze.
goal: Generate a maze with a randomized depth-first backtracker driven by the seeded generator.
spec:
  scenario: A seeded backtracker produces one specific maze
  status: failing
  lines:
    - kw: Given
      text: 'a 2 by 2 maze generated from a generator seeded with 1, starting at cell (0,0), shuffling the direction indices [0,1,2,3] (into the North, East, South, West order) at each cell'
    - kw: When
      text: 'the generation runs and the maze is rendered with ToGrid'
    - kw: Then
      text: "the 5 by 5 render is the rows '#####' , '#.#.#' , '#.#.#' , '#...#' , '#####'"
    - kw: And
      text: 'exactly 3 passages were carved: (0,0)-(0,1), (1,0)-(1,1), and (0,1)-(1,1)'
code:
  lang: go
  source: |
    // depth-first: mark visited, try neighbors in a shuffled direction order,
    // carve into any unvisited in-bounds neighbor and recurse.
    func (m *Maze) carve(c Coord, visited map[Coord]bool, r *RNG) {
      visited[c] = true
      order := []int{0, 1, 2, 3}; r.Shuffle(order)      // shuffle dir indices
      for _, di := range order {
        d := dir4[di]                                    // dir4 = N,E,S,W
        n := Coord{c.X + d.X, c.Y + d.Y}
        if m.inBounds(n) && !visited[n] { m.Carve(c, n); m.carve(n, visited, r) }
      }
    }
checkpoint: A seeded recursive backtracker generates one reproducible maze. Commit and stop here.
---

The **recursive backtracker** is the simplest good maze generator. It is a
depth-first walk that carves as it explores: from the current room, look at the four
directions in a **shuffled** order, and for the first neighbor that has not been
visited, carve a passage into it and recurse from there. When a room has no unvisited
neighbors the recursion unwinds, **backtracking** to the last room that still has
options, until every room has been visited exactly once.

Because the walk visits each room once and carves exactly one passage as it enters
each new room, it threads a single long, winding corridor through the whole maze. The
only randomness is the **shuffle** at each cell, so the seed fully determines the
result: seed 1 on a 2 by 2 maze always carves the same three passages into the same
picture. Every choice traces back to the reproducible stream you built, which is why
the render is a fixed value you can assert. Next you prove this maze has a special
structural property.
