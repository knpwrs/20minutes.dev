---
project: build-an-lsm-storage-engine
lesson: 37
title: Atomic SSTable creation
overview: A crash during a flush must not leave a half-written SSTable that looks real. Today you write every SSTable to a temp file and rename it into place, so a table only ever appears complete or not at all.
goal: Write SSTables to a temporary name and atomically rename them into place after fsync.
spec:
  scenario: An SSTable appears atomically or not at all
  status: failing
  lines:
    - kw: Given
      text: 'a flush writing an SSTable for Put("apple","red")'
    - kw: When
      text: the SSTable is written to a temp file, fsynced, and then renamed to its final "000001.sst" name
    - kw: Then
      text: 'the final "000001.sst" only ever exists as a fully-written, fsynced file'
    - kw: And
      text: if a crash interrupts the write, only a stray temp file (never a partial "000001.sst") can be left behind
code:
  lang: go
  source: |
    // write to dir/000001.sst.tmp, fsync the file, THEN
    // os.Rename(tmp, dir/000001.sst) - rename is atomic on a POSIX fs.
    // also fsync the directory so the rename itself is durable.
    // readers only ever look for the final name, never the .tmp.
checkpoint: SSTables are published atomically via a temp-file rename. Commit and stop here.
---

The flush path has a gap the WAL doesn't: writing an SSTable is many bytes, and a
crash partway through would leave a **half-written file** under its real name -
which `Open` would then try to load as if it were complete. The fix is the standard
atomic-publish trick: write the whole table to a **temporary** name, fsync it, then
**rename** it to its final name. On a POSIX filesystem a rename is atomic, so the
final filename only ever names a complete file.

A crash before the rename leaves at most a stray `.tmp` file, which `Open` simply
ignores because it only looks for final names. (Fsyncing the *directory* after the
rename makes the rename itself durable, closing the last window.) This is the same
"make the change appear all-at-once" discipline as the WAL's fsync, applied to
whole files - and it is what lets the next lesson safely assume any partial SSTable
it finds can be discarded.
