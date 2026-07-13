---
project: build-an-lsm-storage-engine
lesson: 20
title: A stack of SSTables
overview: One flush makes one SSTable, but a long-running store makes many - and a key may sit in several at once. Today you keep a newest-first list of SSTables and make Get walk it, returning the newest copy of a key.
goal: Track multiple SSTables newest-first and have Get return the newest value across the whole stack.
spec:
  scenario: The newest copy of a key wins across SSTables
  status: failing
  lines:
    - kw: Given
      text: 'a store where Put("apple","red") was flushed (older SSTable), then Put("apple","green") was flushed (newer SSTable)'
    - kw: When
      text: 'Get("apple") is called'
    - kw: Then
      text: 'it returns "green" from the newer SSTable, having searched the memtable then the SSTables newest-first and stopped at the first match'
    - kw: And
      text: 'a key that lives only in the oldest SSTable is still found after passing the newer ones, and each flush prepends its SSTable (with the next file number) to the list'
code:
  lang: go
  source: |
    // DB keeps: memtable, then []*SSTable newest-first.
    // flush() writes the next file number (000001, 000002, ...) and
    // PREPENDS the new SSTable to the slice.
    func (d *DB) Get(key string) ([]byte, bool) {
      // 1. memtable (newest of all)
      // 2. each SSTable in newest-first order
      // return the FIRST hit - later tables are older, so ignore them
    }
checkpoint: The store accumulates SSTables newest-first and reads the current value from the whole stack. Commit and stop here.
---

A real store flushes over and over, so it accumulates a **stack of SSTables**, each
a frozen snapshot of the memtable at flush time. The key property is **recency
order**: the most recently flushed table holds the newest data, so the store keeps
them newest-first, and a monotonic file number (`000001`, `000002`, ...) records
that age on disk. This is why SSTables are immutable and simply pile up: an update
to an already-flushed key doesn't rewrite the old file, it lands in a newer table
that *shadows* it.

Reading then falls out of the ordering. A key can exist in several SSTables at once
- each `Put` that was later flushed left a copy - and only the **newest** is
current. So `Get` walks sources in age order (memtable, then SSTables newest-first)
and returns the **first** match, because anything after it is strictly older. This
generalizes lesson 19's two-tier read to any number of tables - just a loop in the
right order. It is correct but wasteful (a lookup may probe several tables); that is
the cost compaction and bloom filters later exist to cut.
