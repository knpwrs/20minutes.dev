---
project: build-a-pathfinder
lesson: 17
title: The Manhattan heuristic
overview: A* is faster than Dijkstra because it has a hunch about where the goal is. Today you build that hunch, the Manhattan distance, an estimate of remaining cost that never overestimates on a four-way grid.
goal: Implement Manhattan distance as an admissible heuristic between two cells.
spec:
  scenario: Manhattan distance sums the horizontal and vertical gaps
  status: failing
  lines:
    - kw: Given
      text: 'the Manhattan heuristic, the sum of the absolute differences in x and y'
    - kw: When
      text: 'it is evaluated on some cell pairs'
    - kw: Then
      text: 'Manhattan((0,0), (3,4)) is 7 and Manhattan((2,2), (2,2)) is 0'
    - kw: And
      text: 'Manhattan((1,1), (4,1)) is 3, matching the number of four-way steps between them'
code:
  lang: go
  source: |
    func abs(x int) int { if x < 0 { return -x }; return x }
    func Manhattan(a, b Coord) int {
      return abs(a.X-b.X) + abs(a.Y-b.Y)
    }
checkpoint: You can estimate remaining distance with the Manhattan heuristic. Commit and stop here.
---

Dijkstra explores blindly, spending equal effort in every direction because it has no
idea where the goal is. A* fixes that with a **heuristic**: a cheap estimate of the
cost still remaining from a cell to the goal, used to steer the search toward it.

For four-directional movement the natural estimate is **Manhattan distance**: the
horizontal gap plus the vertical gap, the number of steps you would take with no
walls in the way. It has the one property a heuristic must have to keep A* correct:
it is **admissible**, meaning it never overestimates the true remaining cost. Since
every step costs at least 1 and you need at least `dx + dy` steps to close the gap,
Manhattan can only ever equal or undershoot the real cost, never exceed it. At the
goal it is 0, as any honest estimate of "distance remaining" must be. Next lesson
this estimate joins the cost so far to prioritize the frontier.
