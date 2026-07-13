---
project: build-a-pathfinder
lesson: 18
title: f = g + h, the A* loop
overview: A* is Dijkstra with one change to the priority. Today you prioritize each frontier cell by f = g + h, the cost so far plus the heuristic, and confirm A* finds the very same optimal path Dijkstra did.
goal: Implement A* by prioritizing the frontier on f = g + h, and match Dijkstra's optimal path.
spec:
  scenario: A* finds the same optimal path as Dijkstra
  status: failing
  lines:
    - kw: Given
      text: 'a 5 by 5 open grid (all cells cost 1), searching from (0, 0) to (2, 2)'
    - kw: When
      text: 'AStar(start, goal) is called with the Manhattan heuristic'
    - kw: Then
      text: 'it returns cost 4 and the 5-cell path (0,0), (1,0), (2,0), (2,1), (2,2)'
    - kw: And
      text: 'Dijkstra on the same grid returns the identical path and cost'
code:
  lang: go
  source: |
    // A* is Dijkstra with one line changed: the heap priority.
    //   g := costSoFar[cur] + g.Cost(n)     // real cost so far (unchanged)
    //   f := g + Manhattan(n, goal)          // add the estimate to prioritize
    //   heap.Push(Item{Priority: f, Seq: seq, Cell: n})
    // costSoFar still stores g (the true cost), NOT f.
    // cost returned is still costSoFar[goal]; reconstruct is unchanged.
checkpoint: A* returns the same optimal path as Dijkstra, guided by the heuristic. Commit and stop here.
---

Here is the whole trick. Dijkstra prioritizes a frontier cell by `g`, the cost so far
to reach it. A* prioritizes by **f = g + h**, the cost so far **plus** the heuristic
estimate of the cost remaining. That single addition makes the search prefer cells
that are both cheap to reach and close to the goal, so it drives toward the goal
instead of fanning out evenly.

Everything else is unchanged: `costSoFar` still records the **true** cost `g` (never
`f`), relaxation is the same, and reconstruction is the same. The critical guarantee
is that with an **admissible** heuristic like Manhattan, A* still returns an
**optimal** path, identical in cost to Dijkstra's. This lesson proves exactly that:
on an open grid A* and Dijkstra return the same five-cell, cost-4 path. A* is not
finding a different or worse answer, it is finding the same best answer with less
work, and the next lesson measures just how much less.
