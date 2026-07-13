---
project: build-a-diff-tool
lesson: 3
title: Diffing against an empty document
overview: Before the general algorithm, pin the two extreme cases every diff must get right - when one side is empty. All-delete when the new document is empty, all-insert when the old one is. These edges anchor everything.
goal: Make Diff emit all deletions when the new document is empty, and all insertions when the old document is empty.
spec:
  scenario: An empty side yields a pure-delete or pure-insert script
  status: failing
  lines:
    - kw: Given
      text: 'the old document ["a", "b"] and an empty new document []'
    - kw: When
      text: 'Diff is called'
    - kw: Then
      text: 'it returns Delete "a", Delete "b"'
    - kw: And
      text: 'diffing an empty old document [] against ["x", "y"] returns Insert "x", Insert "y"'
code:
  lang: go
  source: |
    // handle the empty-side cases before the general algorithm
    if len(b) == 0 {
      // every old line must be deleted
      ...
    }
    if len(a) == 0 {
      // every new line must be inserted
      ...
    }
checkpoint: Diff handles both empty-side extremes. Commit and stop here.
---

The two documents can differ in only so many ways, and the simplest are the extremes: the new document is **empty** (delete everything), or the old document is **empty** (insert everything). Getting these right now does two things - it makes `Diff` correct on a whole class of real inputs (clearing a file, creating a file), and it forces the `Delete` and `Insert` operations into use so they are exercised before the harder cases arrive.

Notice the asymmetry: a **Delete** carries a line from the *old* document, an **Insert** carries a line from the *new* one. A `Keep`, when we get to mixed diffs, carries a line that is in both. Keep this rule straight - it is what makes an edit script replayable: reading only the `Keep` and `Insert` lines reconstructs the new document, reading only the `Keep` and `Delete` lines reconstructs the old one.
