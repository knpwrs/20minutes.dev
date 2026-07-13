---
project: build-a-pathfinder
lesson: 10
title: Detours and dead ends
overview: A real map has walls that force a longer route, and sometimes no route at all. Today you pin both edges of BFS, a wall that bends the path into a detour, and a goal sealed off so the search reports no path.
goal: Confirm BFS detours around a wall and returns no path when the goal is unreachable.
spec:
  scenario: BFS bends around walls and reports unreachable goals
  status: failing
  lines:
    - kw: Given
      text: "the 3 by 3 grid '.#.' , '.#.' , '...' (a wall column at x=1 for rows 0 and 1), searching from (0, 0) to (2, 0)"
    - kw: When
      text: 'BFS(start, goal) is called'
    - kw: Then
      text: 'it returns a 7-cell detour: (0,0), (0,1), (0,2), (1,2), (2,2), (2,1), (2,0)'
    - kw: And
      text: "on the 3 by 3 grid '.#.' , '.#.' , '.#.' (a full wall column at x=1), BFS from (0, 0) to (2, 2) returns no path (nil)"
code:
  lang: go
  source: |
    // No new code needed if reconstruct returns nil for an unreachable goal.
    // Detour: the two goal cells sit across a wall, so the only route is
    //   down the left column, across the bottom, and back up the right column.
    // Sealed off: the wall column fully separates left from right, so the
    //   flood never reaches the goal and cameFrom has no entry for it.
checkpoint: BFS detours around walls and cleanly reports when no path exists. Commit and stop here.
---

Two behaviors separate a real pathfinder from a toy. The first is a **detour**: when
a wall blocks the straight route, breadth-first search still finds the shortest path
that exists, even if it is much longer. Here a wall standing between the start and
goal forces the path all the way down the left side, across the bottom, and back up
the right, seven cells instead of the three a clear row would take.

The second is the **dead end**. If walls seal the goal off entirely, no flood can
reach it, so the came-from map never records it and reconstruction returns nothing.
Reporting "no path" cleanly, rather than looping or returning a broken path, is a
correctness property worth pinning on its own: a search that cannot admit failure
cannot be trusted on success. With both edges nailed down, breadth-first search is
complete, and the next chapter generalizes it to maps where steps cost different
amounts.
