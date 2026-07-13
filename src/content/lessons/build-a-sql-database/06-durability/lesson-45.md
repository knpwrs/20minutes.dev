---
project: build-a-sql-database
lesson: 45
title: 'Capstone: crash-safety on trial'
overview: The whole point of the chapter was to survive a crash with no clean save. Today you prove it - commit mutations, simulate a hard crash mid-snapshot, reopen, and show every committed row is still there and the torn temp file is ignored.
goal: Simulate a crash with no clean shutdown - committed mutations in the log plus a leftover torn temp snapshot - then reopen and prove every committed row survived and the torn file was ignored.
spec:
  scenario: Recovering from a hard crash
  status: failing
  lines:
    - kw: Given
      text: 'a store whose snapshot "db.txt" holds [1, "alice"], with an INSERT of [2, "bob"] and an INSERT of [3, "carol"] committed to the log afterward'
    - kw: When
      text: 'a crash is simulated with no clean save or checkpoint - a torn, partial "db.txt.tmp" is left on disk and the process is dropped without flushing anything further - and then the store is reopened'
    - kw: Then
      text: 'the reopened store holds all three rows [1, "alice"], [2, "bob"], [3, "carol"] - every committed mutation recovered from the log'
    - kw: And
      text: 'the leftover "db.txt.tmp" is never loaded (open reads only "db.txt" and "db.wal"), and the live "db.txt" still holds just the pre-crash snapshot [1, "alice"]'
code:
  lang: go
  source: |
    // write a torn db.txt.tmp by hand (garbage bytes) to mimic a crash
    // do NOT call save/checkpoint/close - just reopen the directory
    // assert: 3 rows recovered, tmp ignored, db.txt still the old snapshot
    // Open must load db.txt (+ replay db.wal) and never touch *.tmp
checkpoint: The store recovers every committed row after a crash with no clean save, ignoring the torn temp file - the persistence is genuinely crash-safe. Commit and stop here.
---

This is the exam the chapter has been studying for. A real crash does not politely
call your save routine - it stops the process wherever it happens to be, maybe
right in the middle of writing a snapshot. So the test **refuses** the clean path:
it leaves a half-written `db.txt.tmp` on disk, never calls checkpoint or a
graceful close, and just reopens the directory as if the machine had rebooted.

Everything you built pays off at once. The committed inserts are safe because each
was appended and flushed to the **log** the instant it returned (lesson 42), and
**replay on open** (lesson 43) folds them back on top of the snapshot, so all
three rows return. The torn `db.txt.tmp` is harmless because the atomic-rename
design (lesson 41) means the temp file was never the live database - `Open` reads
only `db.txt` and `db.wal` and ignores anything still wearing the `.tmp` suffix.
Nothing committed was lost, and nothing torn was ever trusted. You have built a
SQL engine whose data genuinely survives a crash - the honest core of every real
database.
