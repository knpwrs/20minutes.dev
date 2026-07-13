---
project: build-a-garbage-collector
lesson: 31
title: 'Capstone: mark-sweep collection'
overview: Turn the mark-sweep collector loose on the capstone graph. Today you assert the exact survivors and reclaimed ids - the reachable cycle lives, the unreachable cycle and dead subgraph are reclaimed - proving the collector on the hardest case.
goal: Collect the capstone graph with mark-sweep and assert the exact final heap state.
spec:
  scenario: Mark-sweep collects the capstone graph correctly
  status: failing
  lines:
    - kw: Given
      text: 'the capstone graph on a mark-sweep heap - reachable {0, 2, 4, 6}, garbage {1, 3, 5, 7}, with a reachable cycle A-B, a shared node S, an unreachable cycle X-Y, and a dead subgraph D-E'
    - kw: When
      text: 'Collect() runs'
    - kw: Then
      text: 'it reclaims exactly [1, 3, 5, 7] - the unreachable cycle X, Y and the dead subgraph D, E - and the survivors are exactly [0, 2, 4, 6] with Live() == 4'
    - kw: And
      text: 'after Collect the free list holds slots [1, 3, 5, 7], every surviving object is White, and NoBlackToWhite() is true (the shared S was reached once and survived; the reachable cycle survived)'
code:
  lang: go
  source: |
    reclaimed := h.Collect()
    // reclaimed == [1,3,5,7]; LiveRefs() == [0,2,4,6]; Live() == 4
    // every surviving color is White; NoBlackToWhite() is true
    // the survivors keep their ids - mark-sweep reclaims in place, it does not move
checkpoint: Mark-sweep collects the capstone graph exactly. Commit and stop here.
---

This is the mark-sweep collector's final exam, and it passes on every case at once. The
**reachable cycle** `A` to `B` survives because a root reaches it, so tracing marks both
black; the **shared node** `S` is greyed once through `A` and survives, its second
referrer `B` finding it already marked. The **unreachable cycle** `X` to `Y` is reclaimed
in full - the case reference counting could never collect - and the **dead subgraph**
`D` to `E`, reachable from nothing, goes with it. The reclaimed set is exactly
`[1, 3, 5, 7]`.

Notice what mark-sweep does **not** do: it reclaims in place, so the survivors keep
their original ids `0, 2, 4, 6` and the freed slots become the scattered free list
`[1, 3, 5, 7]` - the fragmentation Chapter 4 warned about, on display. Every survivor is
white again, ready for the next cycle, and the invariant held throughout. That is a
complete, correct tracing collector. The last lesson runs the *other* collector on the
same graph and shows the survivors come back compacted instead.
