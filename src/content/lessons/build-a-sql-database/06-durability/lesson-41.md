---
project: build-a-sql-database
lesson: 41
title: Atomic snapshots
overview: The naive save from lesson 39 overwrites the live file in place, so a crash mid-write leaves a torn, unreadable database. Today you make a save all-or-nothing - write to a temp file, flush it, then rename it into place.
goal: Replace the in-place overwrite with a write-to-temp, fsync, then atomic-rename save so a crash never corrupts the live database file.
spec:
  scenario: Swapping in a new snapshot atomically
  status: failing
  lines:
    - kw: Given
      text: 'a database saved atomically to "db.txt" holding one row [1, "alice"]'
    - kw: When
      text: 'a second save writes rows [1, "alice"] and [2, "bob"], but a crash is simulated after the temp file is written and flushed and before the rename'
    - kw: Then
      text: '"db.txt" still holds exactly the first snapshot (just [1, "alice"]) - never a half-written mix of the two'
    - kw: And
      text: 'a save that completes leaves no "db.txt.tmp" behind, and "db.txt" then holds both rows'
code:
  lang: go
  source: |
    // write the whole snapshot to db.txt.tmp, flush it to disk,
    // then rename db.txt.tmp -> db.txt in one step:
    //   os.WriteFile(tmp, bytes) ; f.Sync() ; os.Rename(tmp, path)
    // rename is atomic, so a reader sees only the old file or the new one
checkpoint: Saving is now crash-atomic - a failure mid-save leaves the previous good file untouched, never a torn one. Commit and stop here.
---

Lesson 39 wrote the database straight over `db.txt`. If the process dies partway
through that write, the file is left half-old and half-new - **torn** - and often
will not even load. The fix is the same trick every durable system uses: never
mutate the live file in place. Write the full new snapshot to a **temporary**
file, force its bytes to disk, and then **rename** the temp over the real path.

A `rename` within one directory is **atomic**: at every instant the live path
names either the complete old file or the complete new file, so a crash can only
leave one whole snapshot or the other, never a mix. The flush before the rename
matters too - it guarantees the new file's bytes are actually on disk before it
becomes the official copy. This is the foundation the rest of the chapter builds
on: a snapshot you can always trust to be whole.
