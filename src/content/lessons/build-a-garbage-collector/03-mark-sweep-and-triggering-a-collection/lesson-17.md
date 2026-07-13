---
project: build-a-garbage-collector
lesson: 17
title: A full collect cycle
overview: Mark then sweep is a collection. Today you wire them into one Collect call and run it on a graph with a shared node and both kinds of cycle, asserting the exact survivors and reclaimed ids - your first real garbage collection.
goal: Run mark then sweep as a single Collect and assert the exact reclaimed and surviving sets.
spec:
  scenario: A full collection keeps the reachable graph and reclaims the rest
  status: failing
  lines:
    - kw: Given
      text: 'a rooted graph with ids r = 0, a = 1, b = 2 where r.field0 = a, a.field0 = b, and b.field0 = a - a reachable cycle between a and b - plus an unrooted cycle x = 3, y = 4 (x.field0 = y, y.field0 = x)'
    - kw: When
      text: 'Collect() runs (Mark then Sweep)'
    - kw: Then
      text: 'it reclaims [3, 4] - the unreachable cycle is gone - and the survivors are exactly {0, 1, 2}, with Live() == 3'
    - kw: And
      text: 'after Collect every surviving object is White, and running Collect again reclaims nothing'
code:
  lang: go
  source: |
    func (h *Heap) Collect() []Ref {
      h.Mark()
      return h.Sweep()
    }
    // reachable cycle {0,1,2} survives; unreachable cycle {3,4} reclaimed
checkpoint: Your collector runs a full mark-sweep cycle. Commit and stop here.
---

`Collect` is the whole point of the chapter in two lines: **mark** to blacken the
reachable set, **sweep** to reclaim the white and reset the survivors. Run it and the
promises from the tracing chapter become actions - the reachable cycle `a to b to a`
survives because a root reaches it, while the isolated cycle `x to y to x` is reclaimed
in full despite each object having an incoming reference. That is a working tracing
garbage collector.

Two properties are worth pinning because they guard against subtle bugs. First,
survivors are **white** after `Collect`, so a second `Collect` on an unchanged graph
correctly reclaims nothing rather than misfiring on stale marks. Second, `Collect` is
**idempotent** on a stable graph: collecting twice equals collecting once. This is the
chapter's demoable milestone - a collection you can point at real cyclic data and
trust. The remaining lessons connect it to allocation, so collection happens
automatically when the heap fills instead of only when you ask.
