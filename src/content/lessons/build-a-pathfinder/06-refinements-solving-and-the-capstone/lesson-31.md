---
project: build-a-pathfinder
lesson: 31
title: Solving a generated maze
overview: The two halves of the library finally meet. Today you generate a maze from a seed, render it to a grid, and solve it with A*, producing the maze's one true path from entrance to exit.
goal: Generate a seeded maze, render it, and solve it end to end with A*.
spec:
  scenario: A* solves a generated maze from entrance to exit
  status: failing
  lines:
    - kw: Given
      text: 'a 4 by 4 maze from the recursive backtracker seeded with 7, rendered to a 9 by 9 grid, solving from the top-left room center (1, 1) to the bottom-right room center (7, 7)'
    - kw: When
      text: 'AStar(start, goal) is run on the rendered grid'
    - kw: Then
      text: 'the maze has 15 passages (perfect for 16 rooms) and A* returns a path of 13 cells at cost 12'
    - kw: And
      text: 'because the maze is perfect, that path is the one and only route between the two rooms'
code:
  lang: go
  source: |
    m := NewMaze(4, 4)
    m.GenerateBacktracker(NewRNG(7)) // wraps the recursive carve from lesson 25
    g := m.ToGrid()                  // 9 by 9 walkable/wall grid
    path, cost := AStar(g, Coord{1, 1}, Coord{7, 7})
    // path has 13 cells, cost 12; room (cx,cy) sits at grid (2cx+1, 2cy+1)
checkpoint: A* solves a generated maze from entrance to exit. Commit and stop here.
---

This is the moment the whole library comes together. A maze generator produces rooms
and passages; `ToGrid` renders them into the walkable/wall grid the searches
understand; and A*, built back in chapter four, walks that grid to find the way
through. Nothing new is invented here, the pieces just click: generation, rendering,
and search were each designed to meet at exactly this seam.

Because the maze is **perfect**, this is a uniquely clean search problem: there is
exactly one path between any two rooms, so A* is not choosing the best of several
routes, it is finding the **only** one. That means the 13-cell, cost-12 path it
returns for seed 7 is not merely optimal, it is the sole solution, which is why we can
pin it precisely. The capstone next asserts that solution to the cell and draws it on
the maze.
