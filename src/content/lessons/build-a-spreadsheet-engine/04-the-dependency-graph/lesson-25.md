---
project: build-a-spreadsheet-engine
lesson: 25
title: Building the dependency graph
overview: Per-formula precedents become a graph once you connect them. Today you build the dependency graph - a directed edge from each precedent to the formula that reads it - plus the in-degree counts the recalculation order will consume.
goal: Build a directed graph of precedent-to-dependent edges over the sheet's cells, with each node's in-degree.
spec:
  scenario: The graph records edges and in-degrees
  status: failing
  lines:
    - kw: Given
      text: 'a sheet with A1 set to 1, B1 set to the formula ''=A1+1'', and C1 set to ''=B1+1'''
    - kw: When
      text: 'the dependency graph is built'
    - kw: Then
      text: 'the dependents of A1 are B1, the dependents of B1 are C1, and C1 has no dependents'
    - kw: And
      text: 'the in-degree of A1 is 0, of B1 is 1, and of C1 is 1'
code:
  lang: go
  source: |
    // register EVERY formula cell as a node first (indeg 0 by default),
    // so a formula with no precedents is still a node.
    // then for each precedent P of formula F: add edge P -> F
    //   dependents[P] = append(dependents[P], F)
    //   indeg[F]++
    // literal precedents (like A1) are nodes too, with in-degree 0.
    type Graph struct {
      dependents map[Ref][]Ref
      indeg      map[Ref]int
    }
checkpoint: The dependency graph records who depends on whom, with in-degrees. Commit and stop here.
---

A **directed graph** turns the scattered precedent sets into one structure the
recalculation can walk. For every formula cell, and every precedent it reads, add an
edge **from the precedent to the formula**: the edge points in the direction data
flows, "`A1` feeds `B1`". Store it two ways that the next lesson needs - a list of
each cell's **dependents** (the cells it feeds), and each cell's **in-degree** (how
many precedents point at it).

The direction is the subtle part. We draw the edge precedent-to-dependent because
recalculation flows that way: when `A1` changes, the update flows forward to `B1`,
then to `C1`. A plain literal like `A1` is a node too, but with in-degree `0` - it
depends on nothing, so it is a natural starting point. One case is easy to miss:
register **every** formula cell as a node up front (in-degree `0` by default), even
one that reads no other cells - a formula like `=1/0` or `=5+5` has no precedents but
is still a node, or it would silently vanish from the order the next lesson computes. In the chain `A1` feeds `B1`
feeds `C1`, the in-degrees are `0, 1, 1`, and the dependent lists thread straight
through. That in-degree count is precisely what Kahn's algorithm consumes next to
produce a safe evaluation order.
