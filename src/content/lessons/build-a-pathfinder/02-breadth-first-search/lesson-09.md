---
project: build-a-pathfinder
lesson: 9
title: Reconstructing the path
overview: The came-from map holds a path in reverse. Today you walk it backward from the goal to the start, flip it, and ship the first real deliverable, BFS(start, goal) returning the actual shortest path.
goal: Walk the came-from map from goal to start and return the shortest path as a list of cells.
spec:
  scenario: BFS returns the exact shortest path on an open grid
  status: failing
  lines:
    - kw: Given
      text: 'a 5 by 5 open grid, searching from (0, 0) to (4, 4)'
    - kw: When
      text: 'BFS(start, goal) is called'
    - kw: Then
      text: 'it returns a path of 9 cells: (0,0), (1,0), (2,0), (3,0), (4,0), (4,1), (4,2), (4,3), (4,4)'
    - kw: And
      text: 'the path starts at the start, ends at the goal, and each step moves to a neighbor'
code:
  lang: go
  source: |
    func reconstruct(cameFrom map[Coord]Coord, start, goal Coord) []Coord {
      if _, ok := cameFrom[goal]; !ok { return nil } // goal unreachable
      path := []Coord{}
      for cur := goal; cur != start; cur = cameFrom[cur] {
        path = append([]Coord{cur}, path...)  // prepend, so it comes out forward
      }
      return append([]Coord{start}, path...)
    }
    // BFS: build the came-from map, then reconstruct from goal back to start.
    // You can stop the flood early once goal is dequeued.
checkpoint: BFS returns the exact shortest path between two cells. Commit and stop here.
---

The came-from map already contains the path, stored backward: the goal points to the
cell before it, which points to the cell before that, all the way to the start. To
turn that into a usable path we start at the **goal** and follow the predecessors
until we hit the start, collecting cells as we go, then reverse so the path reads
start to goal.

That is the whole payoff of the chapter. `BFS(start, goal)` floods until it reaches
the goal, then reconstructs. On an open grid the path hugs one route out of the many
shortest ones, and which route is fixed by the neighbor order: North, East, South,
West sends it East along the top row first, then South down the last column. Nine
cells means eight steps, the true grid distance from one corner to the other. A path
length of nine here is not "a" shortest path, it is **the** shortest path this
library returns, every time.
