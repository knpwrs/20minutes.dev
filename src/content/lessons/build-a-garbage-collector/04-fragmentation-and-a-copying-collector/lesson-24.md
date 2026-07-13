---
project: build-a-garbage-collector
lesson: 24
title: Forwarding pointers
overview: An object reached by two paths must be copied once, not twice. Today you build the forwarding pointer - a marker left in the old object recording where its copy went - so the second visit follows it instead of copying again.
goal: Copy an object at most once, leaving a forwarding pointer so repeat visits reuse the copy.
spec:
  scenario: A doubly-visited object is copied exactly once
  status: failing
  lines:
    - kw: Given
      text: 'a from-space with s = New(0) at 0, not yet copied (its forwarding pointer is the nil reference), and the to-space cursor at 0'
    - kw: When
      text: 'forward(s) is called, and then forward(s) is called a second time'
    - kw: Then
      text: 'the first call copies s to to-space slot 0, records the forwarding pointer 0 in the old object, and returns 0; the second call returns 0 without copying again - the to-space cursor is still at 1'
    - kw: And
      text: 'forward(Nil) returns Nil, so a nil field is never copied'
code:
  lang: go
  source: |
    // add a forwarding field to object; it MUST start as Nil, not the zero value 0
    // (0 is a valid id) - set forward = Nil wherever an object is created
    func (h *CopyingHeap) forward(r Ref) Ref {
      if r == Nil { return Nil }
      src := h.from[r]
      if src.forward != Nil { return src.forward } // already copied: follow it
      dst := h.copy(r)   // copies fields verbatim into the next to-space slot
      src.forward = dst  // leave the forwarding pointer behind
      return dst
    }
checkpoint: Objects are copied at most once, tracked by forwarding pointers. Commit and stop here.
---

Naive copying has a fatal bug on any graph with sharing: copy `a`, which copies the
shared node `s`; later copy `b`, which copies `s` **again** - now there are two copies
of `s`, and the graph is broken. The fix is a **forwarding pointer**. The first time an
object is copied, you overwrite its old (from-space) slot with a note saying "I have
moved to to-space slot N." Every later visit checks for that note first, and if it is
there, returns N instead of copying.

`forward` is the guarded copy that every reference will go through: nil stays nil,
an already-forwarded object returns its recorded destination, and only a genuinely new
object is copied and marked. One subtlety worth pinning: the forwarding field must
start as the **nil reference**, not its numeric zero value, because slot `0` is a real
id - an object whose forwarding field defaulted to `0` would look like it had already
moved to slot 0. With copy-once in hand, the next lesson walks the copied objects and
rewrites their stale fields to point at the copies.
