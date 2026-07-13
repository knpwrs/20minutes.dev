---
project: build-a-pathfinder
lesson: 8
title: The came-from map
overview: A flood tells you which cells you can reach, but not how you got there. Today you record, for each cell, the neighbor you arrived from, building the came-from map that turns a flood into a path.
goal: Record each visited cell's predecessor during the flood and expose the came-from map.
spec:
  scenario: The flood remembers which cell it reached each cell from
  status: failing
  lines:
    - kw: Given
      text: 'a 3 by 3 open grid, flooding from (0, 0) with the fixed North, East, South, West neighbor order'
    - kw: When
      text: 'the came-from map is built'
    - kw: Then
      text: 'cameFrom of (1, 0) and (0, 1) is (0, 0), cameFrom of (2, 0) is (1, 0), and cameFrom of (1, 1) is (1, 0)'
    - kw: And
      text: 'cameFrom of (2, 2) is (2, 1), and cameFrom of (2, 1) is (2, 0)'
code:
  lang: go
  source: |
    func BuildCameFrom(g *Grid, start Coord) map[Coord]Coord {
      cameFrom := map[Coord]Coord{start: start} // start maps to itself
      frontier := []Coord{start}
      for len(frontier) > 0 {
        cur := frontier[0]; frontier = frontier[1:]
        for _, n := range g.Neighbors(cur) {
          if _, seen := cameFrom[n]; !seen {
            cameFrom[n] = cur          // reached n from cur
            frontier = append(frontier, n)
          }
        }
      }
      return cameFrom
    }
checkpoint: The flood records where it reached each cell from. Commit and stop here.
---

A flood knows **which** cells it reached but forgets **how**. To recover a path we
need one more fact per cell: the neighbor we first arrived from. That is the
**came-from** map, and it doubles as the visited set, because a cell is visited
exactly when it has an entry. The start maps to itself, a convenient marker for
"the beginning."

Because breadth-first search reaches every cell by a shortest route, the predecessor
it records is a step along a shortest path back to the start. The exact predecessor
is decided by the **neighbor order**: with North, East, South, West, the cell `(1,1)`
is first reached from `(1,0)` (discovered while expanding `(1,0)`, before `(0,1)`
gets its turn), not from `(0,1)`. This is the same fixed order paying off again,
pinning down a single came-from map. Next lesson we walk it backward to produce an
actual path.
