---
project: build-an-lsm-storage-engine
lesson: 31
title: Triggering compaction
overview: Compaction should happen on its own, not on request. Today you make the store compact L0 into L1 automatically once L0 holds too many tables, and confirm reads stay correct across the reorganization.
goal: Automatically compact L0 into L1 when L0's table count reaches a threshold, preserving all read results.
spec:
  scenario: L0 auto-compacts and reads are unaffected
  status: failing
  lines:
    - kw: Given
      text: 'a store with an L0 compaction threshold of 2, holding ("apple","green") and ("banana","yellow") as live values across writes and flushes'
    - kw: When
      text: a flush pushes L0's table count to 2 and triggers compaction into L1
    - kw: Then
      text: 'Get("apple") still returns "green" and Get("banana") still returns "yellow" afterward'
    - kw: And
      text: 'L0 is empty, L1 holds the merged table, and a Scan still yields "apple" then "banana"'
code:
  lang: go
  source: |
    // after each flush: if len(L0) >= threshold, compact all of L0
    // (plus the existing L1 table, so its data merges in) into a new
    // L1 table with dropTombstones = true, then swap it in.
    // reads must be identical before and after - compaction is invisible.
checkpoint: The store compacts itself when L0 fills, with reads unchanged. Commit and stop here.
---

The final piece of the write path is making compaction **automatic**. After each
flush the store checks L0's table count; once it hits the threshold, it compacts L0
(merged together with the current L1 table, so nothing is stranded) into a fresh L1
and swaps it in. The file count stops growing without bound, and lookups stop
having to probe an ever-longer list of L0 tables.

The invariant to hold onto is **read invisibility**: compaction only ever
rearranges *how* data is stored, never *what* the store returns. A `Get` or `Scan`
must give the same answer the instant before and after a compaction. This is easy
to verify and easy to get subtly wrong - forgetting to fold the old L1 in, or
swapping the table list non-atomically. With this, the engine's storage is
self-maintaining; the last chapter turns it into a clean, crash-safe public API.
