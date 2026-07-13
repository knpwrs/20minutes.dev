---
project: build-a-spreadsheet-engine
lesson: 26
title: Topological order with Kahn's algorithm
overview: The recalculation order is a topological sort of the dependency graph. Today you implement Kahn's algorithm - repeatedly take a cell with no remaining precedents - to order a dependency chain.
goal: Produce a topological order of the graph by repeatedly removing in-degree-zero nodes, breaking ties in reading order.
spec:
  scenario: A chain sorts into dependency order
  status: failing
  lines:
    - kw: Given
      text: 'the sheet with A1 set to 1, B1 set to ''=A1+1'', and C1 set to ''=B1+1'''
    - kw: When
      text: 'a topological order is computed with Kahn''s algorithm'
    - kw: Then
      text: 'the order is A1, B1, C1 - every cell appearing after the cells it depends on'
    - kw: And
      text: 'when several cells are ready at once, ties are broken in reading order so the result is deterministic'
code:
  lang: go
  source: |
    // Kahn: start with all in-degree-0 nodes (sorted, reading order).
    // pop one, append to order, decrement each dependent's in-degree;
    // when a dependent hits 0, add it to the ready set (keep it sorted).
    ready := indegZeroNodes(g)      // sorted
    for len(ready) > 0 {
      r := ready[0]; ready = ready[1:]
      order = append(order, r)
      for _, d := range g.dependents[r] {
        g.indeg[d]--
        if g.indeg[d] == 0 { ready = insertSorted(ready, d) }
      }
    }
checkpoint: The graph sorts into a valid recalculation order. Commit and stop here.
---

A **topological order** lists the graph's nodes so that every cell comes after all
the cells it depends on - exactly the order recalculation must follow. **Kahn's
algorithm** builds it directly from the in-degrees: start with every node that has
in-degree `0` (depends on nothing), and repeatedly take one, append it to the order,
and "remove" it by decrementing the in-degree of each of its dependents. A dependent
whose in-degree drops to `0` has had all its precedents placed, so it becomes ready.
For the chain, that yields `A1, B1, C1`.

A chain has only one valid order, but in general several cells can be ready at the
same time, and then the algorithm is free to pick any of them. To make our results
**deterministic and assertable**, we break that tie in a fixed way: take ready cells
in **reading order** (row by row, left to right). This choice does not affect
correctness - any topological order is valid - but it means the same sheet always
produces the same order, which the diamond in the next lesson relies on. It also
quietly sets up cycle detection: if a cell is caught in a cycle, its in-degree never
reaches `0`, so Kahn's algorithm simply never places it.
