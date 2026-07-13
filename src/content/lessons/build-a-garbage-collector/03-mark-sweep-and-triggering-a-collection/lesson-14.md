---
project: build-a-garbage-collector
lesson: 14
title: The mark phase
overview: The mark phase is the trace, colored. Today you build it - grey the roots, then repeatedly take a gray object, grey its white children, and blacken it - until every reachable object is black.
goal: Blacken exactly the reachable objects by draining a gray worklist from the roots.
spec:
  scenario: Marking blackens the reachable set and leaves garbage white
  status: failing
  lines:
    - kw: Given
      text: 'r = 0 rooted with r.field0 = a (a = 1), a.field0 = b (b = 2), and an unreachable object u = 3'
    - kw: When
      text: 'Mark() runs from a fully white heap'
    - kw: Then
      text: 'objects 0, 1, 2 are Black and object 3 is still White'
    - kw: And
      text: 'the set of black objects equals the reachable set - no reachable object is left gray or white'
code:
  lang: go
  source: |
    func (h *Heap) Mark() {
      var gray []Ref
      for _, r := range h.Roots() { h.SetColor(r, Gray); gray = append(gray, r) }
      for len(gray) > 0 {
        r := gray[len(gray)-1]; gray = gray[:len(gray)-1] // pop
        for _, c := range h.Children(r) {
          if h.Color(c) == White { h.SetColor(c, Gray); gray = append(gray, c) }
        }
        h.SetColor(r, Black)
      }
    }
checkpoint: The mark phase blackens exactly the reachable objects. Commit and stop here.
---

The **mark phase** is the reachable-set trace from the last chapter, expressed in
colors. Start by greying every root - they are reachable by definition and their
children are not yet scanned. Then drain a **worklist** of gray objects: pop one,
look at each child, and grey any child that is still **white** (newly discovered);
once its children are all greyed, paint the object **black**. Repeat until no gray
remains.

Greying a child only if it is white is what makes this terminate and handle sharing
and cycles for free - an object already gray or black is not re-added, exactly like
the `seen` guard before. When the worklist empties, **black is the reachable set** and
**white is the garbage**: every live object the roots can reach is black, and
everything the trace never touched is still white. That white-versus-black split is
the entire decision the sweep will act on next. The gray color is transient - it only
exists while the phase runs.
