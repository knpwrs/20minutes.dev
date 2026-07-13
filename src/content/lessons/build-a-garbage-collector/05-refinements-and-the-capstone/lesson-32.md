---
project: build-a-garbage-collector
lesson: 32
title: 'Capstone: copying collection'
overview: The finale runs the copying collector on the same capstone graph and shows the survivors come back compacted, the shared node copied once, and the garbage simply left behind. Both collectors, one graph, proven exactly.
goal: Collect the capstone graph with the copying collector and assert the compacted result.
spec:
  scenario: The copying collector compacts the capstone graph
  status: failing
  lines:
    - kw: Given
      text: 'the capstone graph rebuilt on a capacity-8 copying heap - the same shape, with reachable R, A, B, S at scattered slots 0, 2, 4, 6 and garbage X, Y, D, E at 1, 3, 5, 7'
    - kw: When
      text: 'Collect() runs'
    - kw: Then
      text: 'the survivors are compacted to contiguous ids R = 0, A = 1, B = 2, S = 3, with Live() == 4 and Free() == 4; the garbage is gone and the single root now refers to 0'
    - kw: And
      text: 'the shared S is copied exactly once (A''s field1 and B''s field1 both equal 3), and the reachable cycle is preserved (A''s field0 is 2 and B''s field0 is 1, so A points at B and B points back at A)'
code:
  lang: go
  source: |
    h.Collect()
    // survivors compacted: R=0, A=1, B=2, S=3; Live()==4, Free()==4
    // S copied once: GetField(1,1)==3 and GetField(2,1)==3
    // cycle preserved: GetField(1,0)==2 (A->B), GetField(2,0)==1 (B->A)
checkpoint: Both collectors reclaim the capstone graph exactly. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a real **tracing garbage
collector**, twice over. The copying collector faces the exact graph the mark-sweep
collector just handled and gets every hard case right - the shared `S` is copied once
with both referrers updated to its single new id `3`, the reachable cycle `A` to `B` to
`A` is preserved with its references rewritten to the copies, the unreachable cycle and
the dead subgraph are reclaimed simply by being **left behind** in the abandoned space,
and the survivors come back **compacted** to `0, 1, 2, 3` with all the free space in one
block. The same graph that fragmented under mark-sweep is defragmented under copying.

Step back and look at what you built. From an object model of ids and reference fields
you derived reachability, then two complete collectors on one shared foundation: a
tri-color mark-sweep collector with a free list, automatic collection on allocation, and
graceful out-of-memory handling; and a copying semispace collector using Cheney's
algorithm with forwarding pointers and compaction - plus a write barrier and a
remembered set pointing toward incremental and generational collection. That is the
honest core of the collectors inside real language runtimes, minus the concurrency and
generational machinery they layer on top. You wrote a garbage collector, and every id it
keeps and reclaims is one you can name exactly. That is a real collector, and it is
yours.
