---
project: build-a-pathfinder
lesson: 7
title: The frontier and the visited set
overview: Breadth-first search is the walking skeleton of every search here. Today you build its engine, a FIFO frontier and a visited set, and use it to flood a grid outward from a start, reporting how many cells it reaches.
goal: Flood a grid outward from a start cell and report the set of reachable cells.
spec:
  scenario: A breadth-first flood reaches exactly the connected open cells
  status: failing
  lines:
    - kw: Given
      text: 'a 3 by 3 open grid, flooding from (0, 0)'
    - kw: When
      text: 'Reachable returns every cell the flood visits'
    - kw: Then
      text: 'it contains all 9 cells'
    - kw: And
      text: 'on a 3 by 3 grid whose entire middle column (1,0), (1,1), (1,2) is walls, flooding from (0, 0) reaches exactly 3 cells (the left column)'
code:
  lang: go
  source: |
    func Reachable(g *Grid, start Coord) map[Coord]bool {
      visited := map[Coord]bool{start: true}
      frontier := []Coord{start}          // FIFO queue
      for len(frontier) > 0 {
        cur := frontier[0]; frontier = frontier[1:]  // dequeue front
        for _, n := range g.Neighbors(cur) {
          if !visited[n] { visited[n] = true; frontier = append(frontier, n) }
        }
      }
      return visited
    }
checkpoint: A breadth-first flood reports every cell reachable from a start. Commit and stop here.
---

Every search in this project shares one engine: a **frontier** of cells to explore
next and a **visited** set of cells already seen. Breadth-first search grows the
frontier as a **FIFO queue**, taking cells in the order they were discovered, so it
expands outward in rings of equal distance from the start. That ring-by-ring order
is exactly why breadth-first search finds shortest paths, which we cash in next.

Today we run the engine with no goal, just to watch it spread: start with one cell
in the frontier, and repeatedly take the front cell, mark each unvisited neighbor,
and add it to the back. The visited set that remains is every cell **connected** to
the start through open cells. A wall the flood cannot get around simply leaves those
cells unvisited, which is why a grid split by a wall column reaches only one side.
The visited set doing double duty as "already queued" is what keeps the flood from
looping forever.
