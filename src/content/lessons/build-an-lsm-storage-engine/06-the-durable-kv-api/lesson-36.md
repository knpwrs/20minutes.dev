---
project: build-an-lsm-storage-engine
lesson: 36
title: A clean close
overview: Closing a store should leave it tidy. Today you make Close flush the memtable and fsync, so a cleanly-closed store has all its data in SSTables and an empty log - and reopening it needs no replay.
goal: Make Close flush the memtable to an SSTable and reset the WAL so a clean shutdown leaves no pending writes.
spec:
  scenario: A clean close persists everything and empties the log
  status: failing
  lines:
    - kw: Given
      text: 'a store with Put("apple","red") sitting in the memtable and WAL'
    - kw: When
      text: Close is called
    - kw: Then
      text: 'the memtable is flushed to an SSTable and the WAL is left empty'
    - kw: And
      text: 'reopening the directory returns "red" for Get("apple") with nothing left to replay from the log'
code:
  lang: go
  source: |
    func (d *DB) Close() error {
      // if the memtable holds anything, flush it to an SSTable (skip the flush
      // when it's empty - don't write a useless empty table), then close/reset
      // the WAL, fsync. after Close the on-disk state is complete and reopening
      // needs no replay.
    }
    // Close is now a CLEAN shutdown. To *simulate a crash* in a test (the next
    // lessons do this), do NOT call Close - close only the WAL file handle so the
    // memtable's un-flushed writes survive only in the WAL, to be replayed on reopen.
checkpoint: A clean Close persists the memtable and empties the log. Commit and stop here.
---

A graceful shutdown should leave the store in its **tidiest** durable state: all
data in SSTables, the WAL empty. `Close` does that by flushing the memtable
unconditionally - even below the size threshold - so nothing is left living only in
the log, then fsyncing. After a clean close, reopening finds everything in SSTables
and an empty WAL, so recovery has no replay work to do.

This is the deliberate contrast that makes the capstone meaningful. A **clean**
close is the tidy path: flush, empty log, done. A **crash** is the messy path: the
memtable's writes are *only* in the fsynced WAL, and recovery leans on replay to
rebuild them. The engine has to handle both, and the difference between them is
exactly the difference the WAL was built to cover. Next you harden the crash path
against a flush that was itself interrupted.
