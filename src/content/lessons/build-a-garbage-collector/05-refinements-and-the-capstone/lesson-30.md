---
project: build-a-garbage-collector
lesson: 30
title: The capstone graph
overview: The finale needs a graph that exercises every hard case at once. Today you build it - a shared node, a root-reachable cycle, an unreachable cycle, and a dead subgraph - and confirm exactly which objects are reachable before any collection runs.
goal: Construct the capstone object graph and assert its reachable and garbage sets.
spec:
  scenario: The capstone graph has exactly the intended reachability
  status: failing
  lines:
    - kw: Given
      text: 'a mark-sweep heap of capacity 8 built as R = 0 (the only root) with R.field0 = A; A = 2 and B = 4 forming a reachable cycle (A.field0 = B, B.field0 = A) that both reference the shared node S = 6 (A.field1 = S, B.field1 = S); X = 1 and Y = 3 forming an unreachable cycle (X.field0 = Y, Y.field0 = X); and a dead subgraph D = 5 with D.field0 = E = 7'
    - kw: When
      text: 'Reachable() and Garbage() are computed before any collection'
    - kw: Then
      text: 'Reachable() is {0, 2, 4, 6} - the reachable cycle A, B and the shared S - and Garbage() is [1, 3, 5, 7] - the unreachable cycle X, Y and the dead subgraph D, E'
    - kw: And
      text: 'S (id 6) is referenced by both A and B, so Children(2) includes 6 and Children(4) includes 6'
code:
  lang: go
  source: |
    R, X, A, Y := h.New(2), h.New(1), h.New(2), h.New(1)   // 0,1,2,3
    B, D, S, E := h.New(2), h.New(1), h.New(0), h.New(0)   // 4,5,6,7
    h.SetField(R,0,A)                                       // root -> A
    h.SetField(A,0,B); h.SetField(A,1,S)                    // A <-> B, both -> S
    h.SetField(B,0,A); h.SetField(B,1,S)
    h.SetField(X,0,Y); h.SetField(Y,0,X)                    // unreachable cycle
    h.SetField(D,0,E)                                       // dead subgraph
    h.AddRoot(R)
checkpoint: The capstone graph is built and its reachability confirmed. Commit and stop here.
---

The capstone graph is deliberately built to break a lesser collector. It contains
every case the project taught: a **shared node** `S` referenced by two parents, a
**root-reachable cycle** `A` to `B` to `A` that must **survive**, an **unreachable
cycle** `X` to `Y` to `X` that must be **reclaimed** despite each object having an
incoming reference, and a **dead subgraph** `D` to `E` reachable from nothing. The
survivors and the garbage are deliberately interleaved across the slots - `0, 2, 4, 6`
live, `1, 3, 5, 7` dead - so a compacting collector has visible work to do.

Before collecting anything, confirm the graph is wired exactly right by checking
reachability directly: `{0, 2, 4, 6}` reachable, `[1, 3, 5, 7]` garbage. This is the
setup both capstone collections run against, so pinning it now means any surprise in
the next two lessons is the collector's doing, not a mistake in the graph. The next
lesson turns the mark-sweep collector loose on it; the last runs the copying collector
on the same shape.
