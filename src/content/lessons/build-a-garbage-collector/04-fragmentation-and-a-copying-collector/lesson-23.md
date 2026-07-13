---
project: build-a-garbage-collector
lesson: 23
title: Copying a reachable object
overview: Collection in a copying collector means moving the survivors into the empty space. Today you build the single-object copy - duplicate a reachable object into the next to-space slot - the primitive the whole collection is made of.
goal: Copy one object from from-space into the next free to-space slot and return its new id.
spec:
  scenario: A reachable object is copied into to-space
  status: failing
  lines:
    - kw: Given
      text: 'a from-space with a = New(1) at 0 and c = New(0) at 1, with a.field0 = c (so a.field0 = 1)'
    - kw: When
      text: 'copy(a) is called with the to-space cursor at 0'
    - kw: Then
      text: 'it copies a into to-space slot 0, returns 0, and the copy''s field0 is still 1 - the fields are duplicated verbatim, not yet updated'
    - kw: And
      text: 'a following copy(c) lands in to-space slot 1, so copies are packed contiguously from 0'
code:
  lang: go
  source: |
    // toNext bumps through to-space as objects are copied in
    func (h *CopyingHeap) copy(r Ref) Ref {
      dst := h.toNext
      src := h.from[r]
      h.to[dst] = &object{fields: append([]Ref(nil), src.fields...)} // duplicate fields as-is
      h.toNext++
      return dst
    }
checkpoint: You can copy a single reachable object into to-space. Commit and stop here.
---

A copying collector does not free objects one at a time; it **evacuates** the live
ones out of from-space into the fresh to-space and abandons everything left behind. The
atom of that process is copying a single object: allocate the next to-space slot, put a
duplicate of the object there, and hand back its new id. Because to-space fills by a
bump cursor, the copies land **contiguously from slot 0** - compaction falls out for
free, with no holes.

There is a deliberate loose end today. The copy's fields are duplicated **verbatim**,
so they still hold the object's old **from-space** ids - `a`'s copy still says
`field0 = 1`, pointing into the space you are about to abandon. Those references are
stale and must be rewritten to point at the copies. Fixing them is the Cheney scan two
lessons from now. First, the next lesson handles the trap that makes naive copying go
wrong: an object reachable by two paths must be copied only **once**.
