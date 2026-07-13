---
project: build-a-garbage-collector
lesson: 3
title: Reading and writing reference fields
overview: Objects become a graph only when they can point at each other. Today you build the field accessors - SetField writes another object's id into a field, GetField reads it back - which is how every edge in the object graph is stored.
goal: Store one object's id in another object's field and read it back.
spec:
  scenario: A field holds a reference to another object
  status: failing
  lines:
    - kw: Given
      text: 'a heap where a = New(2) and b = New(0), so a is id 0 and b is id 1'
    - kw: When
      text: 'SetField(a, 0, b) is called'
    - kw: Then
      text: 'GetField(a, 0) returns 1 (the id of b)'
    - kw: And
      text: 'the untouched field GetField(a, 1) still returns the nil reference'
code:
  lang: go
  source: |
    func (h *Heap) SetField(obj Ref, i int, val Ref) {
      h.slots[obj].fields[i] = val // store the referenced object's id in field i
    }
    func (h *Heap) GetField(obj Ref, i int) Ref {
      return h.slots[obj].fields[i]
    }
checkpoint: Objects can reference each other through their fields. Commit and stop here.
---

An object's **fields** are references: each field either holds the **nil reference**
or the **id of another object**. Writing `b` into field 0 of `a` records an edge in
the object graph "a points at b" as a plain integer, the same way a real object would
hold a pointer to another. `SetField` stores the id; `GetField` reads it back.

This is the whole vocabulary the collector needs. Reachability, marking, and copying
will all be phrased in terms of "follow object `a`'s fields to the objects it
references." Note that a field you never set stays `Nil` - an object referencing
nothing through that slot - which the collector will treat as a dead end when it
traces. Next you will list the live objects, then gather the roots.
