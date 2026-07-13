---
project: build-a-garbage-collector
lesson: 27
title: A full copying collect
overview: Every piece of the copying collector comes together into one Collect call. Today you run it on a graph with a doubly-referenced node and watch the survivors compact, references update, and garbage vanish.
goal: Assemble forward-roots, scan, and flip into Collect, and assert the compacted result.
spec:
  scenario: A copying collection compacts survivors and copies shared nodes once
  status: failing
  lines:
    - kw: Given
      text: 'a capacity-6 copying heap with r = 0 (root, r.field0 = a), g1 = 1 (garbage), a = 2 (a.field0 = s and a.field1 = s), g2 = 3 (garbage), s = 4 - so r, a, s are reachable at scattered slots 0, 2, 4 and s is referenced twice by a'
    - kw: When
      text: 'Collect() runs (forward the roots, scan, flip)'
    - kw: Then
      text: 'the survivors are compacted to contiguous ids r = 0, a = 1, s = 2, with Live() == 3 and Free() == 3; the root now refers to 0 and the garbage g1 and g2 are gone'
    - kw: And
      text: 'the doubly-referenced s is copied exactly once - a''s field0 and field1 both equal 2, the single copy'
code:
  lang: go
  source: |
    func (h *CopyingHeap) Collect() {
      h.toNext = 0
      newRoots := map[Ref]bool{}
      for _, r := range h.Roots() { // sorted, so copy order is deterministic
        newRoots[h.forward(r)] = true
      }
      h.scan()          // copy the rest, rewrite every field
      h.flip()          // swap spaces, reset cursors
      h.roots = newRoots // roots now name the copies
    }
checkpoint: Your copying collector reclaims garbage and compacts the survivors. Commit and stop here.
---

`Collect` is the copying collector in four steps: reset the to-space cursor, **forward
the roots** (copying each rooted object and recording its new id), **scan** to-space to
copy the rest and rewrite every field, **flip** the spaces, and repoint the roots at the
copies. Forwarding the roots in sorted order keeps the compacted ids deterministic -
the roots land first, then their children in scan order.

The result is everything Chapter 4 promised. The survivors that were scattered at slots
`0`, `2`, `4` come out packed at `0`, `1`, `2`, with all the free space in one block -
**compaction for free**. The doubly-referenced `s` is copied once and both of `a`'s
fields point at that single copy, because forwarding pointers guarantee copy-once. The
garbage is not swept or freed one object at a time; it is simply **left behind** in the
abandoned space, so collection time is proportional to the live data, not the garbage.
You now have two complete collectors - mark-sweep and copying - built on the same object
model. The final chapter adds the refinements real collectors need and proves both on
one graph.
