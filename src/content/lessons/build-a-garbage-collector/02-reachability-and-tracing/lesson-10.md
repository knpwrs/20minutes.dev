---
project: build-a-garbage-collector
lesson: 10
title: Reachable cycles
overview: References can form loops, and a naive trace would spin forever. Today you confirm the seen set makes tracing terminate on a cycle, and that a cycle reachable from a root is entirely live.
goal: Trace a graph containing a cycle, terminate, and keep every object in the cycle.
spec:
  scenario: A cycle reachable from a root survives and does not loop the trace
  status: failing
  lines:
    - kw: Given
      text: 'objects r = 0, a = 1, b = 2 with r.field0 = a, a.field0 = b, and b.field0 = a (a and b point at each other), with only r as a root'
    - kw: When
      text: 'Reachable() traces from the roots'
    - kw: Then
      text: 'the trace terminates and returns {0, 1, 2} - the whole cycle is reachable'
    - kw: And
      text: 'a self-loop where a.field0 = a still terminates, and a is reachable exactly once'
code:
  lang: go
  source: |
    // the 'seen' guard is what makes cycles safe: revisiting a is a no-op
    h.SetField(a, 0, b); h.SetField(b, 0, a) // a <-> b, a cycle
    h.AddRoot(r)
    got := h.Reachable() // {0,1,2}, and the trace returns rather than looping
checkpoint: Tracing terminates on cycles and keeps reachable ones alive. Commit and stop here.
---

A **cycle** is a set of objects that reference each other in a loop - `a` points at
`b`, `b` points back at `a`. Following references blindly around such a loop would run
forever, but the trace already prevents that: the **seen** set makes revisiting an
object a no-op, so the second time the trace reaches `a` it simply stops. The exact
same guard that counts a shared object once also makes cycles terminate.

Just as important is what the trace *keeps*: because `r` reaches `a`, and `a` reaches
`b`, the entire cycle is reachable and therefore **live**. A reachable cycle is not
garbage - the program can still get to every object in it. This is the first half of
why tracing is more powerful than counting references; the next lesson gathers the
garbage, and the one after shows the case that only tracing can get right: a cycle
reachable from nothing.
