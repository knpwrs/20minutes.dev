---
project: build-a-pathfinder
lesson: 20
title: When the heuristic lies
overview: Admissibility is not a technicality, it is what keeps A* optimal. Today you feed A* an overestimating heuristic and watch it return a worse path, proving why the estimate must never exceed the true remaining cost.
goal: Show that an inadmissible (overestimating) heuristic makes A* return a suboptimal path.
spec:
  scenario: An overestimating heuristic breaks optimality
  status: failing
  lines:
    - kw: Given
      text: 'the weighted 3 by 3 grid where (1, 0) and (1, 1) cost 9, searching from (0, 0) to (2, 0), where the admissible answer is cost 6'
    - kw: When
      text: 'A* runs with an inadmissible heuristic of 5 times Manhattan distance'
    - kw: Then
      text: 'it returns the suboptimal 3-cell direct path (0,0), (1,0), (2,0) at cost 10'
    - kw: And
      text: 'A* with the plain admissible Manhattan heuristic still returns the optimal cost-6 detour'
code:
  lang: go
  source: |
    // inadmissible: it claims far more remaining cost than really exists
    inadmissible := func(a, b Coord) int { return 5 * Manhattan(a, b) }
    // with h grossly inflated, f is dominated by h, so A* rushes toward the
    // goal through the expensive cells and pops the goal before it ever
    // explores the cheaper detour. Same search, same heap, wrong answer.
checkpoint: You have seen an inadmissible heuristic yield a non-optimal path, and why admissibility matters. Commit and stop here.
---

The optimality guarantee had a condition: the heuristic must never **overestimate**.
Break that and A* still returns a path, but no longer the best one. Multiply Manhattan
by five and the estimate towers over the real remaining cost, so `f = g + h` is
dominated by `h`. A* becomes greedy, chasing whatever cell looks closest to the goal,
and it charges straight through the two expensive cells because that route is short in
**steps** even though it is dear in **cost**.

The moment it pops the goal (with cost 10) it stops, never having explored the cheap
seven-cell detour that Dijkstra and admissible A* both find at cost 6. The lesson is
sharp: a heuristic is a promise not to overstate the distance ahead, and A*'s
correctness rests entirely on keeping it. Manhattan, Euclidean, and the diagonal
heuristics coming up are all chosen precisely because they never overestimate. With
that, four-directional A* is complete, and the next chapter builds maps worth
searching.
