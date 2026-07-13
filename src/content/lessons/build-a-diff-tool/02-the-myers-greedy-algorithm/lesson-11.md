---
project: build-a-diff-tool
lesson: 11
title: Recording the trace
overview: The forward pass throws away its history as it overwrites V each round, but to recover the actual edit script you need that history. Today you snapshot V before each round, building the trace you will walk backward next chapter.
goal: Record a snapshot of V at the start of each round so the path can be reconstructed later.
spec:
  scenario: The trace has one snapshot per edit budget
  status: failing
  lines:
    - kw: Given
      text: 'the forward pass, modified to append a copy of V before processing each d'
    - kw: When
      text: 'the trace is built for ["a", "b", "c"] against ["a", "x", "c"] (where D = 2)'
    - kw: Then
      text: 'the trace has 3 snapshots, one each for d = 0, 1, 2'
    - kw: And
      text: 'for two identical documents (D = 0) the trace has exactly 1 snapshot'
code:
  lang: go
  source: |
    var trace []map[int]int
    for d := 0; d <= n+m; d++ {
      trace = append(trace, copyV(V)) // snapshot BEFORE this round
      for k := -d; k <= d; k += 2 {
        // ... same as before; on reaching the corner,
        // return d together with trace
      }
    }
    // copyV clones the map so later rounds don't mutate the snapshot
checkpoint: The forward pass records the V snapshots needed for backtracking. Commit and stop here.
---

The forward pass is destructive: each round overwrites `V[k]` with a further-reaching value, so by the time it finds `D` the earlier states are gone. But reconstructing the edit script means retracing the path *backward* from the corner, and at each step back you need to know what `V` looked like at that depth. The fix is simply to **snapshot** `V` at the start of every round - clone the array and stash it - before that round mutates it.

The snapshot must be a **copy**, not a reference, or later rounds will scribble over your history and every snapshot will end up identical. With the clone in place, the trace ends up holding exactly `D + 1` snapshots: one before each of rounds `0` through `D`. That count is a useful invariant to check - three snapshots for a distance-2 diff, one for an identical pair. The trace is now everything the backtracker needs; the next chapter turns it into keeps, deletes, and inserts.
