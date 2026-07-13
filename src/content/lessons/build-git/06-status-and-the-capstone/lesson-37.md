---
project: build-git
lesson: 37
title: 'status: added and deleted'
overview: 'The remaining two states are the mismatches: a file present in the working tree but not the index is added, and one in the index but gone from disk is deleted. Today you pin both edges.'
goal: 'Classify a path present on only one side as added or deleted.'
spec:
  scenario: A path on only one side is added or deleted
  status: failing
  lines:
    - kw: Given
      text: 'an index recording only hello.txt, plus a working file notes.txt that was never staged, and hello.txt itself deleted from disk'
    - kw: When
      text: 'each path is classified'
    - kw: Then
      text: 'notes.txt is in the working tree but not the index, so it is added (untracked)'
    - kw: And
      text: 'hello.txt is in the index but not on disk, so it is deleted'
code:
  lang: go
  source: |
    // present in working but not index  -> "added"
    // present in index but not working  -> "deleted"
    _, inIndex := ix.Get(path)
    _, statErr := os.Stat(filepath.Join(r.Root, path))
    onDisk := statErr == nil
    // added: onDisk && !inIndex ; deleted: inIndex && !onDisk
checkpoint: 'You can classify added and deleted paths. Commit and stop here.'
---

The unchanged/modified test assumed a path was on **both** sides. The two edge
states are the mismatches. A file that exists in the working tree but has no index
entry is **added** (Git calls it untracked until you stage it). A path recorded in
the index but missing from disk has been **deleted**. Both are found by set
membership, comparing the presence of a path in the index against its presence on
disk, and neither needs the content hash at all.

These are two facets of one idea: a path that lives on only one side. Together with
unchanged and modified, they cover every case a path can be in relative to the
staging area. The final piece is to run this classification over the union of all
paths at once and produce a tidy report, which is the next lesson.
