---
project: build-a-pathfinder
lesson: 30
title: A stable path via tie-breaking
overview: An open grid has many equally short paths, yet your search returns exactly one, every time. Today you cash in the determinism you built, confirming the fixed neighbor order and heap tie-break pin down a single stable path.
goal: Confirm the search returns one specific stable path among many equal-length options.
spec:
  scenario: Equal-length paths resolve to one deterministic route
  status: failing
  lines:
    - kw: Given
      text: 'a 4 by 4 open grid (all cells cost 1) searching from (0, 0) to (3, 3), where many 7-cell shortest paths exist'
    - kw: When
      text: 'AStar(start, goal) is run repeatedly'
    - kw: Then
      text: 'it always returns the same 7-cell path (0,0), (1,0), (2,0), (3,0), (3,1), (3,2), (3,3)'
    - kw: And
      text: 'the route is fixed by the North, East, South, West neighbor order and the insertion-order heap tie-break, not by chance, so re-running never changes it'
code:
  lang: go
  source: |
    // No new production code: this asserts the determinism already built.
    // With cost-1 cells, dozens of 6-step routes tie in length. The chosen
    // one is decided by (a) neighbor order N,E,S,W (East is tried before South)
    // and (b) the heap breaking equal f-values by insertion order.
    // Run the search a few times; assert the path is byte-for-byte identical.
checkpoint: The search returns one stable, reproducible path among many ties. Commit and stop here.
---

On a wide-open grid the number of shortest paths between two corners is enormous, all
the same length. A search that returned "some" shortest path would give a different
one on a whim, and no test could pin it. Everything in this project has been building
toward the opposite: a **single, stable** path, the same on every run and in every
language.

Two decisions make it so. The **neighbor order**, fixed as North, East, South, West
back in chapter one, means East is always tried before South, so the path hugs the top
edge before turning down the last column. The **heap tie-break**, breaking equal
priorities by insertion order, resolves every remaining coin-flip the same way. This
lesson writes no new logic; it is the payoff, confirming that determinism is a
property you can rely on. That reliability is exactly what lets the capstone assert an
exact solved-maze path down to the cell.
