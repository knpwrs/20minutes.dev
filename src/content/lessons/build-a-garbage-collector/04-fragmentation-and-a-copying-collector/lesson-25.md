---
project: build-a-garbage-collector
lesson: 25
title: Updating references with a Cheney scan
overview: Copied objects still point at from-space; a Cheney scan fixes that. Today you build the breadth-first scan that forwards every field, updating references to the copies and pulling in the objects they reach.
goal: Scan the copied objects and rewrite each field to point at the copy, copying new objects as you go.
spec:
  scenario: The scan rewrites fields and copies the objects they reach
  status: failing
  lines:
    - kw: Given
      text: 'from-space with g = 0 (garbage), a = 1, c = 2 where a.field0 = c (= 2); a has already been copied to to-space slot 0 (still with field0 = 2) and c is not yet copied; the to-space cursor is at 1'
    - kw: When
      text: 'scan() runs over to-space'
    - kw: Then
      text: 'forwarding a''s field copies c to to-space slot 1 and updates a''s copy so field0 becomes 1; the scan then reaches c (no fields) and stops with the cursor at 2'
    - kw: And
      text: 'after the scan every field in to-space refers to a to-space id - no field still points into from-space, and g is never copied'
code:
  lang: go
  source: |
    // Cheney's scan: a second cursor chases the copy cursor through to-space
    func (h *CopyingHeap) scan() {
      s := 0
      for s < h.toNext { // toNext grows as forward() copies more objects in
        obj := h.to[s]
        for i, f := range obj.fields {
          obj.fields[i] = h.forward(f) // rewrite to the copy (copying it if new)
        }
        s++
      }
    }
checkpoint: The scan updates every reference to point at the copies. Commit and stop here.
---

This is the elegant heart of **Cheney's algorithm**. Two cursors move through to-space:
the **copy** cursor (`toNext`), where new objects are appended, and the **scan** cursor,
which trails behind processing objects already copied. For each scanned object, forward
every field: `forward` returns the field target's copy, creating it if this is the
first visit. Rewrite the field to that new id. Forwarding a field may append a new
object ahead of the copy cursor, and the scan simply walks into it later. The scan
finishes when it catches up to the copy cursor - everything reachable has been copied
and every field rewritten.

The beauty is that to-space **is** the worklist: no separate stack or recursion, just
the gap between the two cursors, which is exactly why Cheney's 1970 paper called it
"nonrecursive." It naturally handles sharing and cycles through the same forwarding
pointers - a field pointing at an already-copied object just gets the recorded id.
After the scan, from-space is dead weight: every live object has a copy in to-space and
every reference points there. The next lesson makes it official by flipping the two
spaces.
