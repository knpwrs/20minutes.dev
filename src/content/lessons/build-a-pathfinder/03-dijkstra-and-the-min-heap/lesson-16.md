---
project: build-a-pathfinder
lesson: 16
title: No path over weighted terrain
overview: A weighted search must fail as cleanly as it succeeds. Today you confirm Dijkstra reports no path when the goal is walled off, and returns a sentinel cost, closing out the chapter with a search that never hangs.
goal: Confirm Dijkstra returns no path and a sentinel cost when the goal is unreachable.
spec:
  scenario: An unreachable goal yields no path and a sentinel cost
  status: failing
  lines:
    - kw: Given
      text: "the 3 by 3 grid '.#.' , '.#.' , '.#.' (a full wall column at x=1), searching from (0, 0) to (2, 2)"
    - kw: When
      text: 'Dijkstra(start, goal) is called'
    - kw: Then
      text: 'it returns a nil path and cost -1'
    - kw: And
      text: 'the search terminates (the heap drains) rather than looping, even though the goal is never reached'
code:
  lang: go
  source: |
    // when the heap empties without ever popping the goal:
    //   costSoFar has no entry for goal, so reconstruct returns nil
    //   return that nil path with cost -1 as the "no path" sentinel
    // the done/visited guard means each cell is finalized once, so the
    // loop always ends: a finite grid can enqueue only finitely many cells.
checkpoint: Dijkstra reports no path with a -1 cost sentinel and always terminates. Commit and stop here.
---

Success and failure deserve equal care. When walls seal the goal off, Dijkstra's heap
eventually empties without ever popping the goal, and the cost-so-far map simply has
no entry for it. Reconstruction returns nothing, and we pair that with a **sentinel
cost** of `-1` so a caller can tell "no path" from "a path that happens to cost 0."

The subtler property is **termination**. A search that could loop forever on an
impossible map is a bug waiting to happen, so it matters that a cell is finalized
only once (the visited guard as it pops) and the grid is finite: at most every cell
is enqueued a bounded number of times, so the heap must drain. With that, Dijkstra is
complete, correct, and safe, the strongest general shortest-path search there is when
you know nothing about where the goal lies. The next chapter adds that knowledge and
makes the search faster.
