---
project: build-a-pathfinder
lesson: 27
title: Randomized Prim's algorithm
overview: A second generator proves the perfect-maze property is about structure, not one algorithm. Today you build randomized Prim's, which grows a maze outward from a seed cell through a frontier of candidate walls.
goal: Generate a perfect maze with randomized Prim's, growing outward through a frontier of walls.
spec:
  scenario: Randomized Prim's grows a different but still perfect maze
  status: failing
  lines:
    - kw: Given
      text: 'a 3 by 3 maze from a generator seeded with 1, starting at (0,0), with a frontier of edges (visited cell to unvisited neighbor) added in North, East, South, West order and a random frontier edge chosen with IntN each step'
    - kw: When
      text: 'the generation runs and the maze is rendered'
    - kw: Then
      text: "the 7 by 7 render is the rows '#######' , '#.....#' , '#.#####' , '#.....#' , '#.#####' , '#.....#' , '#######'"
    - kw: And
      text: 'it is still perfect: 8 passages for 9 cells, fully connected'
code:
  lang: go
  source: |
    // frontier: edges from a visited cell to an unvisited neighbor.
    // start: mark (0,0) visited, add its edges (dir4 order) to the frontier.
    // loop while frontier not empty:
    //   j := r.IntN(len(frontier)); e := frontier[j]
    //   frontier = append(frontier[:j], frontier[j+1:]...)   // order-preserving remove
    //   if e.to still unvisited: Carve(e.from, e.to); mark visited; add e.to's edges
    // stops when every cell is visited; still exactly W*H-1 passages.
checkpoint: A second generator produces a different maze that is still perfect. Commit and stop here.
---

**Randomized Prim's** grows a maze outward instead of drilling inward. It keeps a
**frontier** of candidate passages: walls between a room already in the maze and a
room not yet in it. Each step picks a **random** frontier wall, and if the room on the
far side is still outside the maze, carves through, brings that room in, and adds
**its** new frontier walls. When the frontier empties every room has been absorbed.

The maze it grows has a different **texture** from the backtracker's, shorter
passages and more frequent branching rather than one long snake, because it always
expands from a random point on the whole boundary rather than from the tip of a single
path. Yet it is still **perfect**: it carves exactly one passage per room it admits,
so `W*H-1` passages join `W*H` connected rooms, a spanning tree once again. Two very
different procedures, the same structural guarantee, which is the point. You can now
generate mazes; the final chapter refines the search and solves one.
