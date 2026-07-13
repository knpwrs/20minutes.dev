---
project: build-a-garbage-collector
lesson: 5
title: The root set
overview: Reachability has to start somewhere. The roots are the objects the program can reach directly - the starting points of every trace. Today you build the root set so the collector knows where liveness begins.
goal: Track a set of root references and report membership.
spec:
  scenario: The heap tracks which objects are roots
  status: failing
  lines:
    - kw: Given
      text: 'a heap with objects a, b, c allocated (ids 0, 1, 2)'
    - kw: When
      text: 'AddRoot(0) and AddRoot(2) are called'
    - kw: Then
      text: 'IsRoot(0) and IsRoot(2) are true, IsRoot(1) is false, and Roots() returns [0, 2]'
    - kw: And
      text: 'after RemoveRoot(0), IsRoot(0) is false and Roots() returns [2]'
code:
  lang: go
  source: |
    // a set of the objects the program holds directly
    func (h *Heap) AddRoot(r Ref)    { h.roots[r] = true }
    func (h *Heap) RemoveRoot(r Ref) { delete(h.roots, r) }
    func (h *Heap) IsRoot(r Ref) bool { return h.roots[r] }
    func (h *Heap) Roots() []Ref { /* keys of h.roots, sorted ascending */ }
checkpoint: The heap tracks its root set and reports membership. Commit and stop here.
---

An object is **live** if the running program can still get to it. In a real runtime
the starting points are the values on the stack, in registers, and in globals - the
things the program holds **directly**. We model those directly-held references as the
**root set**: a set of Refs the collector treats as reachable by definition. Anything
reachable from a root by following fields is live; anything else is garbage.

Add a `roots` set to the heap (initialize it in `NewHeap`) with add, remove, and
membership. Have `Roots()` return the members in ascending order so traces are
deterministic. This is the other half of the reachability question: the census says
what exists, the roots say where liveness begins. Next lesson you wire objects and
roots into a real graph, and the chapter after that traces it.
