---
project: build-an-lsm-storage-engine
lesson: 30
title: Levels
overview: To decide what to compact, the engine needs structure. Today you split SSTables into two levels - L0 for fresh flushes and L1 for compacted output - the smallest version of the leveled layout real LSM engines use.
goal: Organize SSTables into level 0 (flushed) and level 1 (compacted), and track which table is where.
spec:
  scenario: Flushes land in L0, compaction output in L1
  status: failing
  lines:
    - kw: Given
      text: a store that flushes the memtable twice, producing two L0 SSTables
    - kw: When
      text: those two L0 tables are compacted
    - kw: Then
      text: the resulting SSTable is recorded at level 1 and the two L0 tables are removed
    - kw: And
      text: the store reports one table at L1 and none at L0 after the compaction
code:
  lang: go
  source: |
    // track SSTables per level: L0 = flushed, L1 = compacted.
    // flush() appends to L0; compacting L0 writes the merged output to
    // L1 and drops the consumed L0 tables. L1 is the bottom level, so
    // its compactions pass dropTombstones = true.
checkpoint: SSTables are organized into L0 and L1, with compaction moving data down. Commit and stop here.
---

Compaction needs to know *what* to merge, and **levels** give that structure. The
minimal version has two: **L0** holds tables straight from flushes, which can
overlap in key range (each is a full memtable snapshot); **L1** holds the compacted
result. Data flows downward - flush into L0, compact L0 into L1 - which is the
shape every LSM engine uses, just with more levels.

The two levels also answer the tombstone question from last lesson cleanly: L1 is
the **bottom**, so compactions producing L1 set `dropTombstones = true` and reclaim
deletes, while there is nothing below to resurrect. Tracking which SSTables sit at
which level is bookkeeping now, but it is the hook the next lesson uses to *trigger*
compaction automatically when L0 grows too crowded.
