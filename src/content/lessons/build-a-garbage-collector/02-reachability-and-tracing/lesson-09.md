---
project: build-a-garbage-collector
lesson: 9
title: Multiple roots and shared objects
overview: Real programs hold many things at once, and different roots often reach the same object. Today you confirm the trace handles multiple roots and counts a shared object once, not twice.
goal: Trace from several roots into a shared object and get each reachable id exactly once.
spec:
  scenario: The reachable set is the union over all roots, with shared objects counted once
  status: failing
  lines:
    - kw: Given
      text: 'objects a = 0, b = 1, s = 2 with a.field0 = s and b.field0 = s, and both a and b added as roots'
    - kw: When
      text: 'Reachable() traces from the roots'
    - kw: Then
      text: 'it returns {0, 1, 2} - s appears exactly once even though both roots reach it'
    - kw: And
      text: 'if b is removed as a root (but a still reaches s through its field), the reachable set is still {0, 2}, and s survives'
code:
  lang: go
  source: |
    // no new code should be needed if the trace already marks 'seen' before
    // recursing - visiting s from a marks it, so reaching it again from b is a no-op
    h.AddRoot(a); h.AddRoot(b)
    got := h.Reachable() // {0,1,2}: s counted once
checkpoint: The trace handles multiple roots and shared objects correctly. Commit and stop here.
---

Programs have many roots at once, and the reachable set is the **union** of what each
root can reach. Because the trace marks an object **seen** before following its
children, a **shared object** like `s` - reachable from both `a` and `b` - is visited
exactly once: the first root to arrive claims it, and the second finds it already
seen. This is why the answer is a *set*, not a count of paths.

Sharing also draws the line between a *reference* and a *root*. Removing `b` from the
root set does not free `s`, because `a` still references it - `s` is reachable, just
by one fewer path. An object dies only when it becomes reachable from **no** root at
all. If the trace you wrote last lesson already marks before recursing, this lesson
adds no production code - the shared-node case just works, which is exactly the
property the mark phase will rely on. Next: what happens when references form a loop.
