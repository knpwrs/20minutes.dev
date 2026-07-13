---
project: build-a-garbage-collector
lesson: 21
title: Why mark-sweep fragments
overview: Mark-sweep reclaims garbage in place, which leaves survivors scattered with holes between them. Today you measure that fragmentation directly, motivating the compacting collector the rest of the chapter builds.
goal: Show that after a mark-sweep collection the survivors do not form a contiguous block.
spec:
  scenario: Survivors are left scattered across the heap
  status: failing
  lines:
    - kw: Given
      text: 'a heap of capacity 6 with objects 0..5 allocated, where 0, 2, 4 are roots and 1, 3, 5 are unrooted garbage'
    - kw: When
      text: 'Collect() runs and IsCompact() checks whether the live objects occupy a contiguous prefix'
    - kw: Then
      text: 'Collect reclaims [1, 3, 5], LiveRefs() is [0, 2, 4], and IsCompact() is false - the survivors sit at scattered slots with free holes at 1, 3, 5 between them'
    - kw: And
      text: 'on a freshly allocated heap whose live objects are [0, 1, 2] with no holes, IsCompact() is true'
code:
  lang: go
  source: |
    // the live objects are compact when they fill slots 0..Live-1 with no gaps
    func (h *Heap) IsCompact() bool {
      live := h.LiveRefs()
      for i, r := range live {
        if r != i { return false } // a hole: object should be at slot i but isn't
      }
      return true
    }
checkpoint: You can see the fragmentation mark-sweep leaves behind. Commit and stop here.
---

Mark-sweep has a cost that the exact-id specs make easy to see: it reclaims garbage
**in place**, so the survivors stay exactly where they were, and the freed slots become
**holes** scattered among them. After collecting a heap whose live objects were `0`,
`2`, `4`, the survivors are still at `0`, `2`, `4`, with gaps at `1`, `3`, `5`. Over
many cycles a heap fragments into a patchwork of live objects and holes - `IsCompact`
reports exactly that by checking whether the live objects fill a contiguous prefix.

Fragmentation hurts in two ways. It scatters related objects across the heap so they
no longer sit near each other in memory, wrecking cache locality; and in a real
allocator with variable-size objects it can leave enough total free space for a request
that still cannot be satisfied because no single gap is big enough. The fix is
**compaction**: move the survivors so they sit together with all the free space in one
run. You cannot compact by nudging objects in place without breaking every reference to
them, so the rest of this chapter builds a different kind of collector - one that
compacts as a natural side effect of how it collects.
