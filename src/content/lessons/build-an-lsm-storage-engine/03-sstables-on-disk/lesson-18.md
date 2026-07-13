---
project: build-an-lsm-storage-engine
lesson: 18
title: Flushing the memtable
overview: 'This is the heartbeat of an LSM engine: when the memtable fills, freeze it, write it out as an SSTable, and start fresh. Today you wire that flush and reset the WAL, because the data is now safe in the SSTable instead.'
goal: When the memtable exceeds its size limit, write it to a new SSTable and reset the memtable and WAL.
spec:
  scenario: Flushing a full memtable to disk
  status: failing
  lines:
    - kw: Given
      text: 'a store with a small flush threshold, after enough Puts that the memtable size crosses it'
    - kw: When
      text: a flush is triggered
    - kw: Then
      text: a new SSTable file is written holding all the memtable's entries in sorted order
    - kw: And
      text: the memtable is emptied (size back to 0) and the WAL is reset to empty, since those writes are now durable in the SSTable
code:
  lang: go
  source: |
    func (d *DB) flush() error {
      // 1. WriteSSTable(nextPath, memtable entries in sorted order)
      // 2. fsync the SSTable
      // 3. replace memtable with a fresh empty one
      // 4. truncate/replace the WAL - its writes now live in the SSTable
      // ORDER MATTERS: the SSTable must be durable BEFORE the WAL is reset
    }
checkpoint: A full memtable flushes to an SSTable and the WAL resets. Commit and stop here.
---

**Flush** is what moves data from volatile memory to durable disk. When the
memtable's tracked size (lesson 5) crosses the threshold, the engine writes its
sorted entries out as a new SSTable and starts a fresh, empty memtable. Because the
memtable is already sorted, the SSTable it produces is sorted for free.

The delicate part is the **WAL reset**. The log existed to protect the memtable's
writes against a crash; once those writes are safely in a fsynced SSTable, the log
has done its job and can be cleared, so it doesn't replay data that already lives
on disk. The ordering is a durability invariant: **fsync the SSTable first, reset
the WAL second**. Reverse it and a crash in between would drop the log while the
SSTable is still half-written - losing committed data. Get the order right and the
flush is crash-safe like everything else.
