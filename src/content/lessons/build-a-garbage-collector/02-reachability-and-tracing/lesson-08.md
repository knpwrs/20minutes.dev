---
project: build-a-garbage-collector
lesson: 8
title: Tracing from one root
overview: This is the heart of tracing collection - starting from a root, you follow references to find every object you can reach. Today you build that traversal and return the exact reachable set.
goal: Compute the set of all objects reachable from a single root by following references.
spec:
  scenario: A trace collects every transitively reachable object
  status: failing
  lines:
    - kw: Given
      text: 'a chain r.field0 = c, c.field0 = g where r = 0, c = 1, g = 2, plus an unreferenced object u = 3, with only r as a root'
    - kw: When
      text: 'Reachable() traces from the roots'
    - kw: Then
      text: 'it returns the set {0, 1, 2} - r, c, and g are all reachable'
    - kw: And
      text: 'u (id 3) is absent from the reachable set, because no path from a root leads to it'
code:
  lang: go
  source: |
    // depth-first (or breadth-first) trace from the roots, following Children
    func (h *Heap) Reachable() map[Ref]bool {
      seen := map[Ref]bool{}
      var visit func(Ref)
      visit = func(r Ref) {
        if seen[r] { return } // already counted; avoids revisiting
        seen[r] = true
        for _, c := range h.Children(r) { visit(c) }
      }
      for _, root := range h.Roots() { visit(root) }
      return seen
    }
checkpoint: You can compute every object reachable from the roots. Commit and stop here.
---

**Reachability** is the definition of liveness a tracing collector uses: an object is
live if and only if there is a path to it from some root by following references.
`Reachable` computes that set directly - start at each root, follow `Children`, and
keep going, marking each object **seen** the first time you arrive so you never
process it twice. The `seen` set is both the answer and the guard against revisiting.

Depth-first or breadth-first does not matter for the *set* you end up with; both reach
exactly the same objects. What matters is that you follow every edge and stop at
objects already seen. The chain `r to c to g` pulls all three into the set, while `u`
- allocated but referenced by nothing reachable - never gets visited and so is
garbage. Everything the collector reclaims is simply what this trace does not reach.
