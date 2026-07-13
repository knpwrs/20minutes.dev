---
project: build-a-garbage-collector
lesson: 7
title: An object's children
overview: Tracing means following references, so first we need the references leaving a single object. Today you build children - the ids an object points at through its non-nil fields - the one step every trace repeats.
goal: Return the ids an object references, skipping nil fields, in field order.
spec:
  scenario: An object reports the objects it directly references
  status: failing
  lines:
    - kw: Given
      text: 'an object a = New(3) with a.field0 = 5, a.field1 = Nil, a.field2 = 2'
    - kw: When
      text: 'Children(a) is queried'
    - kw: Then
      text: 'it returns [5, 2] - the non-nil fields in field order, with the nil field skipped'
    - kw: And
      text: 'for an object with every field nil, Children returns an empty list'
code:
  lang: go
  source: |
    // the objects reachable in one step from obj: its non-nil fields, in order
    func (h *Heap) Children(obj Ref) []Ref {
      var out []Ref
      for _, f := range h.slots[obj].fields {
        if f != Nil { out = append(out, f) } // skip the dead-end fields
      }
      return out
    }
checkpoint: An object can report the objects it directly references. Commit and stop here.
---

A trace is just this one move repeated: stand on an object, look at everything it
references, step to each of those, and keep going. `Children` is that one move - it
returns the ids in an object's fields, skipping any field that holds the **nil
reference** because nil points at nothing. Preserving field order keeps results
deterministic and easy to assert.

This tiny helper is the seam between the object model and every algorithm to come.
The reachable-set trace calls it; the mark phase greys the children it returns; the
copying collector forwards each child. Keeping "which objects does this one point at"
in one place means the rest of the collector never touches the field layout directly.
Next lesson you follow these edges from a root to compute a whole reachable set.
