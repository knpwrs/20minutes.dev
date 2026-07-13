---
project: build-a-pathfinder
lesson: 19
title: Expanding fewer nodes
overview: A* and Dijkstra return the same path, so the payoff is in the work saved. Today you count how many cells each search expands and pin the exact numbers that prove A* explores strictly less of the grid.
goal: Count expanded cells in each search and show A* expands strictly fewer than Dijkstra.
spec:
  scenario: A* expands fewer nodes than Dijkstra for the same path
  status: failing
  lines:
    - kw: Given
      text: 'a 5 by 5 open grid, searching from (0, 0) to (2, 2), counting each cell finalized (popped and expanded, not counting the goal)'
    - kw: When
      text: 'both searches run and report their expanded count'
    - kw: Then
      text: 'Dijkstra expands 12 cells and A* expands 8 cells'
    - kw: And
      text: 'both still return the identical cost-4 path, so A* does strictly less work for the same result'
code:
  lang: go
  source: |
    // add a counter to the shared search loop:
    //   when a popped cell is finalized (passes the visited guard) and is
    //   NOT the goal, increment expanded.
    // expose it, e.g. return (path, cost, expanded) or a small Stats value.
    // run both Dijkstra (h = 0) and A* (h = Manhattan) on the same grid.
checkpoint: You can measure expansions and see A* beat Dijkstra on work done. Commit and stop here.
---

Same path, same cost, so where is A*'s advantage? In the **number of cells it
touches**. Count every cell each search **finalizes**, pops off the heap and expands
its neighbors, and the difference is stark: on this grid Dijkstra finalizes 12 cells,
while A* finalizes only 8. The heuristic steered A* along the corridor toward the
goal and kept it from wandering into the far corners Dijkstra dutifully explored.

That gap is the entire reason A* exists, and it widens as maps grow. The instrument
is simple, a counter that ticks each time a cell is finalized, but pinning the exact
numbers turns a vague "A* is faster" into a checkable fact: **strictly fewer**
expansions for an identical optimal path. This only holds because the heuristic is
admissible and the search is otherwise Dijkstra. The next lesson shows what breaks
when the heuristic cheats and claims the goal is farther than it really is.
