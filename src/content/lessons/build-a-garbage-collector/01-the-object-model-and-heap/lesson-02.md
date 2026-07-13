---
project: build-a-garbage-collector
lesson: 2
title: Allocating an object
overview: An empty heap is no use until it can hand out objects. Today you build allocation - New places an object in the lowest free slot and returns its id (a Ref) - so the heap starts filling up, one object at a time.
goal: Allocate objects into successive free slots and return each object's id.
spec:
  scenario: Successive allocations return successive ids
  status: failing
  lines:
    - kw: Given
      text: 'a fresh heap of 8 slots with nothing allocated'
    - kw: When
      text: 'New(2) is called, then New(2) again'
    - kw: Then
      text: 'the first returns id 0 and the second returns id 1, and Live reports 2'
    - kw: And
      text: 'each new object has 2 fields, and every field starts as the nil reference'
code:
  lang: go
  source: |
    type Ref = int
    const Nil Ref = -1 // the nil reference: a sentinel that is never a real object id

    type object struct { fields []Ref }

    // returns (id, error); the error is always nil for now and earns its keep
    // once the heap can fill up, later in the project
    func (h *Heap) New(nfields int) (Ref, error) {
      f := make([]Ref, nfields)
      for i := range f { f[i] = Nil } // every field starts pointing at nothing
      r := h.next          // a cursor marking the next unused slot
      h.slots[r] = &object{fields: f}
      h.next++             // advance past the slot just handed out
      return r, nil
    }
checkpoint: The heap allocates objects into successive slots and returns their ids. Commit and stop here.
---

An object is just an entry in the heap table, and its **id** is the index of the slot
it lives in. We call that id a **Ref** - a reference to an object - because that is
exactly how objects will point at each other later: a field holding another object's
id. To allocate, `New` takes the next slot marked by a **cursor**, puts a fresh object
there, advances the cursor, and returns that slot's index as the Ref.

Give `New` the number of reference **fields** the object should have; create them all
holding the **nil reference** (`Nil`, the sentinel `-1` that is never a real id). Two
allocations on a fresh 8-slot heap return ids `0` and `1` because the cursor starts at
0 and advances by one each time. That nil default matters: a brand-new object points at
nothing until you wire it up, which is the next two lessons. Reusing the slots a
collection frees comes later - for now the cursor only moves forward.
