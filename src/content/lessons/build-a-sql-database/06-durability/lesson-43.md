---
project: build-a-sql-database
lesson: 43
title: Replay on open
overview: A log full of records only helps if startup reads it back. Today you make opening the store load the latest snapshot and then replay the log tail on top, recovering every mutation committed since that snapshot.
goal: On open, load the newest atomic snapshot, then replay each WAL record in order so no committed mutation is lost.
spec:
  scenario: Recovering by snapshot plus log replay
  status: failing
  lines:
    - kw: Given
      text: 'a snapshot "db.txt" holding [1, "alice"] and a log "db.wal" holding two records: an INSERT of [2, "bob"] then a DELETE of the row where id = 1'
    - kw: When
      text: 'the store is opened (load the snapshot, then replay the log in order)'
    - kw: Then
      text: 'the store holds exactly one row [2, "bob"] - alice came from the snapshot, bob was added by the log, and alice was removed by the log''s delete'
    - kw: And
      text: 'opening with an absent or empty "db.wal" yields exactly the snapshot ([1, "alice"]) with nothing replayed'
code:
  lang: go
  source: |
    // Open(dir):
    //   load db.txt if it exists (lesson 40's loader)
    //   then read db.wal line by line and re-run each record's statement
    //   in order, applying it to the just-loaded state
    // missing/empty wal -> just the snapshot
checkpoint: The store now recovers its full committed state on open - snapshot first, then the log tail replayed on top. Commit and stop here.
---

The snapshot and the log are two halves of one recovery story. The snapshot is a
**complete** picture of the database as of the last time you saved it; the log is
the list of every mutation committed **since** then. So opening the store is a
two-step **replay**: load the snapshot to get the baseline, then apply each log
record in commit order to bring it fully up to date.

Order is everything here - the same records applied in a different order could
give a different answer, so replay walks the log front to back exactly as the
mutations committed. Because each record redoes a real statement against the
state built so far, replay reconstructs precisely the database that existed the
instant before the crash. Nothing acknowledged is lost, even though no snapshot
captured it. An absent or empty log simply means "nothing happened since the
snapshot," so you are left with the snapshot alone.
