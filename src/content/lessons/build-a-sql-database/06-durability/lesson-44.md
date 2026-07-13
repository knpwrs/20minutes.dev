---
project: build-a-sql-database
lesson: 44
title: Checkpointing
overview: A log that only ever grows makes every open slower and every crash take longer to recover. Today you add a checkpoint - fold the log into a fresh atomic snapshot and truncate it - so recovery time stays bounded.
goal: Checkpoint by writing a fresh atomic snapshot of the current state and truncating the WAL to empty, without changing what a later open recovers.
spec:
  scenario: Folding the log into a new snapshot
  status: failing
  lines:
    - kw: Given
      text: 'an open store whose snapshot "db.txt" holds [1, "alice"] and whose log "db.wal" holds an INSERT of [2, "bob"]'
    - kw: When
      text: 'a checkpoint runs'
    - kw: Then
      text: '"db.txt" is atomically rewritten to hold both rows [1, "alice"] and [2, "bob"], and "db.wal" is truncated to zero length'
    - kw: And
      text: 'reopening after the checkpoint yields exactly those two rows with an empty log - bob is applied once (from the new snapshot), never twice'
code:
  lang: go
  source: |
    // Checkpoint():
    //   save the current in-memory state via the atomic snapshot (lesson 41)
    //   only after the rename succeeds, truncate db.wal to 0 bytes
    // ordering matters: snapshot first, THEN clear the log
checkpoint: The store can fold its log into a fresh snapshot and reset the log, bounding both file size and recovery time. Commit and stop here.
---

Replay works, but the log grows without limit - a store that runs for a month
would replay a month of mutations on every open. A **checkpoint** collapses that
history: write a fresh atomic snapshot that already includes every logged
mutation, then **truncate** the log back to empty. Recovery after a checkpoint
starts from a snapshot that is fully up to date, so there is nothing left to
replay until the next mutation.

The ordering is a small but critical durability rule: take the new snapshot
**first**, and only truncate the log **after** the atomic rename has succeeded.
Do it the other way and a crash between truncate and snapshot would lose the
logged mutations forever. Done in the right order, a crash at any point leaves
either the old snapshot plus the full log, or the new snapshot plus an empty log
- both of which recover to the identical state, with each mutation applied
exactly once.
