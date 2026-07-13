---
project: build-an-lsm-storage-engine
lesson: 24
title: Honoring tombstones on read
overview: A tombstone only means something if reads obey it. Today you make Get treat a tombstone as not-found, so a deleted key stays deleted even when an older SSTable still holds its old value.
goal: Make Get return not-found when the newest entry for a key is a tombstone.
spec:
  scenario: A deleted key stays deleted despite an older value
  status: failing
  lines:
    - kw: Given
      text: 'a store where Put("apple","red") was flushed to an SSTable, then Delete("apple") wrote a tombstone into the memtable'
    - kw: When
      text: 'Get("apple") is called'
    - kw: Then
      text: 'it returns not-found - the tombstone is the newest entry and it means "gone"'
    - kw: And
      text: 'the older "apple" -> "red" in the SSTable does not resurface'
code:
  lang: go
  source: |
    func (d *DB) Get(key string) ([]byte, bool) {
      // walk sources newest-first as before, but stop at the FIRST
      // entry for the key whichever kind it is:
      //   Put    -> return its value, found
      //   Delete -> return not-found  (do NOT keep looking in older tables)
    }
checkpoint: A deleted key reads as not-found, shadowing older values. Commit and stop here.
---

A tombstone is only a delete if the read path **stops** at it. Walking sources
newest-first, the first entry you find for a key is authoritative regardless of its
kind: a `Put` means "here is the current value," a `Delete` means "this key is
gone, stop." The critical bug to avoid is treating a tombstone as a miss and
*continuing* into older tables - that would resurrect the deleted value from the
SSTable underneath.

Today this only has to hold for point lookups; the same rule extends to range scans
- the merged scan must **drop** a key whose newest entry is a tombstone - but that
lands once the whole-store scan exists, a couple of lessons from now. With
point-read deletes working, the store already behaves as a user expects, even though
nothing was ever physically removed - the removal happens later, during compaction.
