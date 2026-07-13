---
project: build-an-lsm-storage-engine
lesson: 11
title: Surviving a torn write
overview: A crash rarely happens between records - it happens in the middle of one. Today you make replay tolerate a half-written final record, keeping every complete record before it, so a crash mid-append costs at most the one unfinished write.
goal: Replay all complete records from a log whose final record is truncated, and stop cleanly at the torn tail.
spec:
  scenario: Replaying a log with a truncated last record
  status: failing
  lines:
    - kw: Given
      text: 'a log holding complete records (Put,"apple","red") and (Put,"banana","yellow"), followed by a third record that is cut off partway through (a partial append)'
    - kw: When
      text: the log is replayed
    - kw: Then
      text: 'the memtable contains "apple" and "banana" and no third key'
    - kw: And
      text: replay completes without error - the torn tail is discarded, not treated as failure
code:
  lang: go
  source: |
    // walk records until fewer bytes remain than a header needs, OR
    // decodeRecord returns a corruption/short error on the tail.
    // A torn TAIL is expected after a crash: stop and keep everything
    // decoded so far. (Corruption in the MIDDLE is a real fault - your
    // choice to surface, but the tail case must be graceful.)
checkpoint: Replay recovers every complete record and gracefully drops a torn final one. Commit and stop here.
---

An append is not atomic: a crash can strike after some of a record's bytes reach
the disk but before the rest do, leaving a **torn write** at the end of the log.
This is the normal, expected shape of a crash - not an exotic failure - so replay
must handle it gracefully. The records *before* the tear are complete and fsynced,
so they are safe; only the interrupted final write is lost, and it was never
acknowledged.

Two things flag the torn tail: the remaining bytes are too few to hold even a
record header, or the checksum from the previous lesson fails on the partial data.
Either way replay's job is to **stop at the tear and keep everything before it** -
finishing successfully, not erroring out. This is the exact boundary that makes
the crash-safety claim honest: a crash mid-write loses only the unfinished write,
and the store still opens.
