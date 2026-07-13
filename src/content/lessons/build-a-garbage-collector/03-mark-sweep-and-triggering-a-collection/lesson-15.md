---
project: build-a-garbage-collector
lesson: 15
title: The tri-color invariant
overview: The correctness of mark-sweep rests on one property - after marking, no black object points directly at a white one. Today you assert that invariant and add a checker, confirming the mark phase never strands a reachable object.
goal: Verify that after marking, no black object references a white object.
spec:
  scenario: Marking establishes the tri-color invariant
  status: failing
  lines:
    - kw: Given
      text: 'a graph with a shared node - r = 0 rooted, r.field0 = a (1), r.field1 = b (2), a.field0 = s (3), b.field0 = s (3) - after Mark() has run'
    - kw: When
      text: 'NoBlackToWhite() checks every black object against its children'
    - kw: Then
      text: 'it returns true - objects 0, 1, 2, 3 are all black (s reached once), so no black object points at a white one'
    - kw: And
      text: 'if object s is forced back to White after marking, NoBlackToWhite() returns false, catching the broken invariant'
code:
  lang: go
  source: |
    // the tri-color invariant: no black object references a white object
    func (h *Heap) NoBlackToWhite() bool {
      for _, r := range h.LiveRefs() {
        if h.Color(r) != Black { continue }
        for _, c := range h.Children(r) {
          if h.Color(c) == White { return false } // a black->white edge: broken
        }
      }
      return true
    }
checkpoint: You can verify the tri-color invariant holds after marking. Commit and stop here.
---

The **tri-color invariant** is the promise that makes the sweep safe: once marking is
done, **no black object references a white object**. Read it the other way and its
importance is obvious - if a black (finished) object pointed at a white
(presumed-dead) object, the sweep would free something still reachable. A correct mark
phase never leaves such an edge, because it only blackens an object *after* greying
all of its white children, so every child of a black object is at least gray, and by
the end gray has drained to black.

The shared node `s` is the case worth pinning: reached first through `a`, greyed once,
and never re-greyed when `b`'s field is scanned, yet it still ends up black - so both
its black referrers satisfy the invariant. This lesson adds no collection logic; it
adds a **checker** that proves the phase did its job, and the capstone will reuse it.
There is one situation the invariant can be broken *after* marking - when the program
mutates a black object to point at a white one - and closing that hole is exactly what
the write barrier does later.
