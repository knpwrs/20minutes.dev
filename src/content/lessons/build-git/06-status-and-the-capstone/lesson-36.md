---
project: build-git
lesson: 36
title: 'status: unchanged versus modified'
overview: 'The core of status compares each staged file''s current content against what the index recorded. Equal ids mean unchanged; different ids mean modified. Today you classify a tracked file.'
goal: 'Classify a tracked file as unchanged or modified by comparing its working id to its index id.'
spec:
  scenario: A tracked file is unchanged or modified
  status: failing
  lines:
    - kw: Given
      text: 'an index recording hello.txt at ce013625030ba8dba906f756967f9e9ca394464a and a working hello.txt'
    - kw: When
      text: 'statusOf(hello.txt) compares WorkingId(hello.txt) to the indexed id'
    - kw: Then
      text: 'if the file still contains hello and a newline the ids match and it is unchanged'
    - kw: And
      text: 'if the file now contains hello world and a newline its working id is 3b18e512dba79e4c8300dd08aeb37f8e728b8dad, which differs from the indexed id, so it is modified'
code:
  lang: go
  source: |
    // compare the file's current id to what the index recorded
    wid, _ := r.WorkingId(path)
    if wid == ix.entries[path].Id {
      return "unchanged"
    }
    return "modified"
checkpoint: 'You can tell a modified file from an unchanged one. Commit and stop here.'
---

For any path that is both on disk and in the index, the question is simple: does
its current content still match what was staged? Compute the working id and compare
it to the index id. Same id, **unchanged**; different id, **modified**. There is no
special content comparison because content equality is id equality.

This is the everyday heart of `git status`: it tells you which tracked files you
have edited since staging them. Right after `add`, a file is unchanged; edit it and
it becomes modified until you stage it again (which updates the index id to match).
Two more cases complete the picture, a file that is in the working tree but not the
index, and one in the index but no longer on disk, which are next.
