---
project: build-an-lsm-storage-engine
lesson: 19
title: Reading across memory and disk
overview: After a flush, a key's value might be in the memtable or in the SSTable. Today you make Get check the memtable first, so a fresh write always shadows an older flushed value for the same key.
goal: Make the store's Get consult the memtable before the SSTable, with the memtable winning ties.
spec:
  scenario: The memtable shadows a stale SSTable value
  status: failing
  lines:
    - kw: Given
      text: 'a store where Put("apple","red") was flushed to an SSTable, then Put("apple","green") was written into the new memtable'
    - kw: When
      text: 'Get("apple") is called'
    - kw: Then
      text: 'it returns "green" - the memtable value, because it is newer than the flushed one'
    - kw: And
      text: 'Get for a key only in the SSTable still returns the SSTable value, and a key in neither is not-found'
code:
  lang: go
  source: |
    func (d *DB) Get(key string) ([]byte, bool) {
      // 1. memtable.Get - if found, return it (it is the newest)
      // 2. else the SSTable's Get
      // newest source first is the rule; more sources come next chapter
    }
checkpoint: Reads span memory and disk, with the newer memtable value always winning. Commit and stop here.
---

Once data lives in two places, a read has to decide **which copy is current**. The
memtable holds the most recent writes; the SSTable holds older, flushed ones. So
`Get` checks the **memtable first** - if the key is there, that value is the
newest and wins - and only falls through to the SSTable when the memtable misses.

This "newest source first" rule is the seed of the whole LSM read model. Right now
there are just two tiers, but the same principle scales directly: next chapter adds
*many* SSTables, and reads will walk them newest-to-oldest, taking the first hit.
The memtable simply sits at the top of that ordering as the newest source of all.
Establishing the precedence now, with one SSTable, means adding more is a loop, not
a redesign.
