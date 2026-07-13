---
project: build-a-btree-index
lesson: 45
title: 'Capstone: a durable on-disk B+Tree'
overview: The final lesson puts the whole index on trial. You build a real on-disk tree, exercise inserts, deletes, and range scans, simulate a crash mid-write with no clean close, reopen from the file, and prove every committed key survived and every invariant holds.
goal: Exercise the full index on a file, crash it mid-write, reopen, and prove all committed keys are present and every B+Tree invariant holds.
spec:
  scenario: Full crash-recovery of a real index
  status: failing
  lines:
    - kw: Given
      text: 'an on-disk tree committed with keys 1 through 50, then some deleted (forcing merges and a height change), then a further copy-on-write write staged and interrupted with NO clean close (the crash)'
    - kw: When
      text: the file is reopened
    - kw: Then
      text: 'every committed key is present with its value and the interrupted write left no torn or partial-split state - Open resumes cleanly at the last published root'
    - kw: And
      text: 'the invariants hold: keys are sorted, all leaves are at equal depth, the leaf next-links thread every leaf in order, and Scan over the full range returns exactly the surviving keys ascending'
code:
  lang: go
  source: |
    // 1. Open(path); Put 1..50; Delete a handful; (commits publish roots)
    // 2. stage one more COW write, fsync data, then DROP the handle - no Close
    // 3. Open(path) again -> resumes at the last published commit
    // 4. assert: every committed key present; Scan ascending == surviving set;
    //    every leaf at equal depth; next-links in order; no dangling child.
checkpoint: Your B+Tree index lives on disk and loses nothing committed across a crash. The project is complete - commit and stop here.
---

This is the promise the project was built to keep. The test does what a real crash
does: drive the index through its whole surface - inserts that split and grow the
tree, deletes that borrow, merge, and shrink it, range scans across the leaf chain -
then leave a copy-on-write write half-done and **walk away with no clean close**.
Reopening is the moment of truth, and it leans on everything you built: fixed pages,
serialized nodes, an atomic double-meta flip, and the copy-on-write rule that never
overwrote a live page.

The result is an index where **every committed key survives** and an interrupted
write costs nothing - the defining property of a crash-safe on-disk structure. From
a single 4096-byte page you have built a real B+Tree: leaf and internal nodes on
disk, balanced through splits and merges, ordered range scans over linked leaves, a
file-backed pager with a free list, and copy-on-write commits published through a
checksummed double meta page. That is the honest core every on-disk database index -
from SQLite to LMDB - is built around.
