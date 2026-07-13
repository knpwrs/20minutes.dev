---
project: build-git
lesson: 16
title: 'The executable-bit mode'
overview: 'Git tracks one permission distinction: whether a file is executable. An executable file gets mode 100755 instead of 100644, and that mode is part of the tree hash. Today you detect it when staging.'
goal: 'Record mode 100755 for an executable working file and 100644 otherwise.'
spec:
  scenario: An executable file is staged with mode 100755
  status: failing
  lines:
    - kw: Given
      text: 'a working file build.sh whose owner-executable bit is set, and a non-executable file notes.txt'
    - kw: When
      text: 'each is staged with Add'
    - kw: Then
      text: 'build.sh is recorded in the index with mode 100755'
    - kw: And
      text: 'notes.txt is recorded with mode 100644, the two being the only file modes Git uses'
code:
  lang: go
  source: |
    // check the owner-execute bit of the file's permissions
    info, _ := os.Stat(full)
    mode := "100644"
    if info.Mode().Perm()&0o100 != 0 {
      mode = "100755"
    }
checkpoint: 'add records the executable bit. Commit and stop here.'
---

Git deliberately tracks almost nothing about file permissions: not the group or
world bits, not ownership, not timestamps. The single exception is whether a file
is **executable**. A regular file is mode `100644` and an executable one is
`100755`. These are the only two blob modes you will ever see in a tree (the third
mode, `40000`, is for subdirectories).

This matters because the mode is part of the tree entry, and therefore part of the
tree's hash. Flip a file's executable bit and re-commit, and the tree id changes
even though the file's content, and so its blob id, is identical. Detect the
owner-execute bit when staging and record the right mode; everything downstream,
`write-tree` included, just uses whatever the index says.
