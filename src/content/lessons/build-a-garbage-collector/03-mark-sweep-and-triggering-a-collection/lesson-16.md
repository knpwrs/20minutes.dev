---
project: build-a-garbage-collector
lesson: 16
title: The sweep phase
overview: Marking found the survivors; the sweep reclaims the rest. Today you build it - free every still-white object and repaint the survivors white for next time - in a single pass over the heap.
goal: Reclaim every white object and reset the survivors to white, returning the reclaimed ids.
spec:
  scenario: Sweep frees the white objects and resets the black ones
  status: failing
  lines:
    - kw: Given
      text: 'after Mark(), objects 0, 1, 2 are Black (reachable) and object 3 is White (garbage), with 4 live objects'
    - kw: When
      text: 'Sweep() runs'
    - kw: Then
      text: 'it reclaims [3] (freeing that slot, so Live() drops to 3) and returns [3]'
    - kw: And
      text: 'the survivors 0, 1, 2 are all White again, ready for the next collection'
code:
  lang: go
  source: |
    func (h *Heap) Sweep() []Ref {
      var freed []Ref
      for _, r := range h.LiveRefs() { // ascending
        if h.Color(r) == White {
          freed = append(freed, r)
          h.slots[r] = nil          // reclaim the slot
          // add r to the free list for reuse later
        } else {
          h.SetColor(r, White)      // reset survivor for the next cycle
        }
      }
      return freed
    }
checkpoint: The sweep reclaims white objects and resets survivors. Commit and stop here.
---

The **sweep phase** walks every live object once and acts on its color. **White**
objects were never reached by marking, so they are garbage: free the slot (set it to
nil, and remember it for reuse). **Black** objects survived, so keep them - but repaint
them **white**, because the next collection must start from a clean slate where nothing
is presumed reachable until the next mark proves it. Doing both in one pass is the
elegant part: the same walk that reclaims the dead resets the living.

That reset is easy to forget and quietly fatal - skip it, and the second collection
sees last cycle's survivors already black, greys nothing, and marks incorrectly. Pin
that the survivors are white afterward, not just that the garbage is gone. With mark
and sweep both in hand, the next lesson ties them into a single `Collect` call and
watches an unreachable cycle vanish.
