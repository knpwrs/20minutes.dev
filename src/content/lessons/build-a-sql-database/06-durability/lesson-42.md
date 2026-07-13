---
project: build-a-sql-database
lesson: 42
title: A write-ahead log
overview: Atomic snapshots are only taken now and then, so every mutation since the last snapshot is still lost on a crash. Today you add a write-ahead log - append each committed INSERT, UPDATE, and DELETE to a file and flush it on commit - so a mutation is durable the instant it returns.
goal: Append every committed mutation as a record to a write-ahead log and flush it to disk before the statement returns.
spec:
  scenario: Logging committed mutations
  status: failing
  lines:
    - kw: Given
      text: 'an open store with an empty log file "db.wal"'
    - kw: When
      text: 'an INSERT of [1, "alice"], then an INSERT of [2, "bob"], then a DELETE of the row where id = 1 are each committed'
    - kw: Then
      text: '"db.wal" holds exactly three records in commit order - the two INSERTs then the DELETE - each one replayable to reproduce that mutation'
    - kw: And
      text: 'reading "db.wal" from a fresh handle immediately after a statement returns already shows that statement''s record (it is flushed on commit, not buffered in memory)'
code:
  lang: go
  source: |
    // on each committed mutation, append one record then flush:
    //   append the statement (e.g. its SQL text) as a line to db.wal
    //   f.Sync()  // force it to disk before the call returns
    // a read-only statement (SELECT) logs nothing
checkpoint: Every committed mutation is on disk in the log the moment it returns, not just at the next snapshot. Commit and stop here.
---

A snapshot captures the whole database at one moment, but between snapshots the
engine is back to living in memory. If a mutation commits and then the process
crashes before the next snapshot, that change is gone. The classic fix is a
**write-ahead log** (WAL): a file you **append** a record to for every mutation,
and **flush to disk** before the statement returns. Now "the statement returned"
means "the change is durable," not "the change is in RAM."

Each record just has to capture enough to **redo** the mutation later - logging
the statement's SQL text is the simplest faithful choice, since re-running it
reproduces the exact change. Only mutations are logged; a `SELECT` reads nothing
into the log. Records are appended in commit order and never rewritten, so the
log is a precise history of everything committed since the last snapshot - which
is exactly what tomorrow's startup will replay.
