---
project: build-a-garbage-collector
lesson: 6
title: An object graph with a shared node
overview: Everything so far comes together into an object graph. Today you build a small graph where one object is referenced by two parents - a shared node - and walk a path through it, proving the model can express real sharing.
goal: Wire a graph with a shared child and read a value across two hops.
spec:
  scenario: A shared object is reachable through two different parents
  status: failing
  lines:
    - kw: Given
      text: 'objects r = New(2), a = New(1), b = New(1), s = New(0) (ids 0, 1, 2, 3), with r.field0 = a, r.field1 = b, a.field0 = s, and b.field0 = s'
    - kw: When
      text: 'the graph is walked from r down field0 twice, and from r down field1 then field0'
    - kw: Then
      text: 'GetField(GetField(r, 0), 0) returns 3 and GetField(GetField(r, 1), 0) returns 3 - both paths reach s'
    - kw: And
      text: 'AddRoot(r) makes Roots() return [0], with s reachable only through a or b, never directly'
code:
  lang: go
  source: |
    r, _ := h.New(2); a, _ := h.New(1); b, _ := h.New(1); s, _ := h.New(0)
    h.SetField(r, 0, a); h.SetField(r, 1, b)
    h.SetField(a, 0, s); h.SetField(b, 0, s) // s is shared by a and b
    h.AddRoot(r)
    // GetField(GetField(r,0),0) == GetField(GetField(r,1),0) == s
checkpoint: You can build and traverse an object graph with a shared node. Commit and stop here.
---

The whole point of reference fields is that objects form a **graph**, not a tree.
Here `s` is a **shared node**: both `a` and `b` hold its id in a field, so there are
two distinct paths from the root `r` down to `s`. Nothing about the model treats the
second reference specially - `s` is just an id, and any number of fields may hold it.

Sharing is exactly what makes garbage collection interesting. When you later free
things, you must not reclaim `s` while either `a` or `b` still points at it, and when
you copy the graph you must copy `s` **once** and update both references - not copy it
twice. Walking `r.field0.field0` and `r.field1.field0` and getting the same id `3`
both times confirms the graph is wired correctly. With the model complete, the next
chapter answers the central question: starting from the roots, which objects can you
reach?
