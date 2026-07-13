---
project: build-a-pathfinder
lesson: 32
title: 'Capstone: generate, solve, and draw'
overview: The finale ties every piece into one deterministic pipeline, generate a maze from a fixed seed, solve it with A*, assert the exact optimal path and that none is shorter, and draw the solution overlaid on the maze.
goal: Generate a seeded maze, solve it with A*, assert the exact path and its uniqueness, and render it.
spec:
  scenario: A full pipeline yields one exact, drawable solution
  status: failing
  lines:
    - kw: Given
      text: 'the 4 by 4 recursive-backtracker maze seeded with 7, rendered to a 9 by 9 grid, solved from (1, 1) to (7, 7)'
    - kw: When
      text: 'A* solves it and BFS solves the same grid, then the path is drawn with * over the maze'
    - kw: Then
      text: 'A* returns the 13-cell path (1,1),(1,2),(1,3),(1,4),(1,5),(2,5),(3,5),(4,5),(5,5),(5,6),(5,7),(6,7),(7,7) at cost 12, and BFS returns a path of the same length 13, confirming no shorter path exists'
    - kw: And
      text: "the overlay renders as the rows '#########' , '#*#.#...#' , '#*#.#.#.#' , '#*#...#.#' , '#*#####.#' , '#*****#.#' , '#####*#.#' , '#....***#' , '#########'"
code:
  lang: go
  source: |
    m := NewMaze(4, 4); m.GenerateBacktracker(NewRNG(7))
    g := m.ToGrid()
    path, cost := AStar(g, Coord{1, 1}, Coord{7, 7}) // 13 cells, cost 12
    bfs := BFS(g, Coord{1, 1}, Coord{7, 7})          // same length: it is THE path
    // Overlay: print the grid, but draw '*' for any cell in path.
    //   set := make(map[Coord]bool); for _, c := range path { set[c] = true }
    //   per cell: '*' if in set, else '#' for wall, else '.'
checkpoint: The pipeline generates, solves, verifies, and draws a maze end to end. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a **deterministic
pathfinder**. One fixed seed generates one specific perfect maze; `ToGrid` renders it;
A* finds the way through; and because the maze is perfect, that 13-cell path is the
**only** route, which BFS confirms by returning a path of the identical length. Every
number here, the seed, the passages, the path, the cost, the drawing, is pinned down,
reproducible in any language, exactly as designed.

The overlay is the satisfying finish: the maze printed with the solution traced in
`*`, a picture you can read at a glance. Look back at what makes it possible. The
fixed **neighbor order** and the heap's **tie-break** pin the path; the self-seeded
**generator** pins the maze; the **admissible heuristic** keeps A* optimal while it
expands fewer nodes than Dijkstra. From a grid of cells you have built a real
pathfinding and maze library, the honest core of the navigation systems inside games,
robots, and route planners, and it is yours.
