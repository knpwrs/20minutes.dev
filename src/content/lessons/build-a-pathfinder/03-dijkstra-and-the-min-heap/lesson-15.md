---
project: build-a-pathfinder
lesson: 15
title: Dijkstra's search
overview: With a priority queue and terrain costs in hand, you can find the cheapest path, not just the shortest. Today you assemble Dijkstra's algorithm and watch a longer route win because it crosses cheaper ground.
goal: Implement Dijkstra's search returning the minimum-cost path and its total cost.
spec:
  scenario: A longer but cheaper route beats a short but costly one
  status: failing
  lines:
    - kw: Given
      text: 'a 3 by 3 open grid where cells (1, 0) and (1, 1) each cost 9 to enter and all others cost 1, searching from (0, 0) to (2, 0)'
    - kw: When
      text: 'Dijkstra(start, goal) is called'
    - kw: Then
      text: 'it returns cost 6 and the 7-cell path (0,0), (0,1), (0,2), (1,2), (2,2), (2,1), (2,0)'
    - kw: And
      text: 'the direct 3-cell route (0,0), (1,0), (2,0) is rejected because it would cost 10'
code:
  lang: go
  source: |
    // costSoFar[n] is the best known cost from start to n
    // relax an edge cur -> n:
    //   newCost := costSoFar[cur] + g.Cost(n)   // cost to ENTER n
    //   if n unseen or newCost < costSoFar[n]:
    //       costSoFar[n] = newCost
    //       cameFrom[n] = cur
    //       heap.Push(Item{Priority: newCost, Seq: seq, Cell: n}); seq++
    // pop the lowest-priority cell each round; stop when you pop the goal.
    // reuse reconstruct(cameFrom, start, goal); total cost is costSoFar[goal].
checkpoint: Dijkstra returns the true minimum-cost path over weighted terrain. Commit and stop here.
---

Dijkstra's algorithm is breadth-first search taught to count cost. Instead of a FIFO
queue it uses the **min-heap**, always expanding the frontier cell with the lowest
cost so far, and instead of just marking cells visited it keeps a **cost-so-far** map
of the cheapest known distance to each. The heart of it is **relaxation**: for each
neighbor, if the path through the current cell is cheaper than any found before,
record the new cost, remember where it came from, and push it with that cost as its
priority.

Because the cheapest cell always comes out first, the moment the goal is popped its
cost is final, and the came-from map (reconstructed exactly as in breadth-first
search) gives the path. The payoff is visible here: crossing the two cost-9 cells
straight across would total 10, so Dijkstra instead takes the **longer** seven-cell
loop around the cheap border for a total of 6. Shortest in steps is not cheapest in
cost, and Dijkstra always finds the cheapest.
