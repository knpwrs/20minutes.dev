---
project: build-a-garbage-collector
lesson: 12
title: The uncollectable cycle
overview: This is the payoff of tracing over reference counting - an unreachable cycle. Today you confirm that a cycle reachable from no root is garbage, even though every object in it has an incoming reference, the exact case reference counting leaks.
goal: Show that an unreachable cycle is collected even though each object is referenced.
spec:
  scenario: A cycle with no root is garbage despite every object having a referrer
  status: failing
  lines:
    - kw: Given
      text: 'a rooted object r = 0 (referencing nothing else) and an unrooted cycle x = 1, y = 2 with x.field0 = y and y.field0 = x'
    - kw: When
      text: 'Reachable() and Garbage() are computed'
    - kw: Then
      text: 'Reachable is {0}, and Garbage() is [1, 2] - the whole cycle is reclaimed even though x and y each have one incoming reference'
    - kw: And
      text: 'a reference count would keep both (each is referenced once), so this is the case only tracing collects'
code:
  lang: go
  source: |
    r, _ := h.New(0); h.AddRoot(r)
    x, _ := h.New(1); y, _ := h.New(1)
    h.SetField(x, 0, y); h.SetField(y, 0, x) // x <-> y, referenced only by each other
    // Reachable() == {0}; Garbage() == [1,2] - no root reaches the cycle
checkpoint: An unreachable cycle is collected. The tracing chapter is complete; commit and stop here.
---

Here is why tracing wins. A simpler scheme, **reference counting**, tags each object
with how many references point at it and frees it when that count hits zero. It is
appealing, but it has a fatal blind spot: a **cycle**. Objects `x` and `y` point at
each other, so each has a reference count of one forever, even after the program drops
every way of reaching them. Reference counting would never free `x` and `y` - a leak.

Tracing does not count references; it asks the only question that matters - is there a
path from a **root**? For the isolated cycle there is none, so both objects are
garbage and get reclaimed, incoming references notwithstanding. This is not a corner
case; cyclic data (doubly linked lists, parent-child back-pointers, graphs) is
everywhere, which is why serious collectors trace. You now have the complete liveness
model: roots, reachability, and garbage. The next chapter turns "compute the garbage"
into "reclaim it" with the classic tri-color mark-sweep collector.
