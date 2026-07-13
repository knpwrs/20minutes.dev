---
project: build-an-lsm-storage-engine
lesson: 29
title: Dropping tombstones at the bottom
overview: Tombstones cannot live forever, but dropping one too early resurrects a deleted key. Today you let compaction discard a tombstone only when it is compacting the oldest data, where nothing older can survive it.
goal: Drop tombstones during a bottom-level compaction, but keep them otherwise.
spec:
  scenario: A tombstone is discarded only when nothing older remains
  status: failing
  lines:
    - kw: Given
      text: 'a compaction whose inputs are the oldest SSTables in the store, including a tombstone for "apple" and an older ("apple","red")'
    - kw: When
      text: they are compacted with the drop-tombstones flag set (this is the bottom level)
    - kw: Then
      text: 'neither "apple" record appears in the output - the value is gone and the now-unneeded tombstone is dropped too'
    - kw: And
      text: 'with the flag NOT set, the tombstone is kept in the output so it can still shadow older tables elsewhere'
code:
  lang: go
  source: |
    func Compact(inputs []*SSTable, outPath string, dropTombstones bool) error {
      // after newest-wins collapse: if the surviving record is a
      // tombstone AND dropTombstones is true, skip writing it.
      // only safe when NO older table (outside this compaction) could
      // still hold that key - i.e. the bottom level.
    }
checkpoint: Compaction reclaims tombstones safely, only at the bottom level. Commit and stop here.
---

A tombstone's job is to hide older values, so it must outlive every value it
hides. If compaction drops a tombstone while some *older* SSTable it didn't include
still holds that key, the old value **resurrects** - a deleted key comes back from
the dead, one of the classic LSM bugs. So a tombstone can only be discarded when
the compaction is processing the **oldest** data in the store, where no older table
survives to leak the value.

That is why compaction takes a **drop-tombstones** flag: set it only for a
bottom-level compaction that includes the oldest tables. There, once newest-wins
has collapsed a key to a tombstone, both the tombstone and the value beneath it can
be thrown away - the key is genuinely, permanently gone and its space reclaimed.
Everywhere else the tombstone is preserved so it keeps doing its shadowing job.
This flag is the safety valve the leveling in the next lesson will set correctly.
