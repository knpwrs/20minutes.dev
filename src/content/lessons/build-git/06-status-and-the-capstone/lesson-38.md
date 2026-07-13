---
project: build-git
lesson: 38
title: 'The status report'
overview: 'status runs the classification over every path, index and working tree together, and reports each in sorted order. Today you assemble the full report, the last command before the capstone.'
goal: 'Classify every path across the index and working tree into a sorted status report.'
spec:
  scenario: status reports every path with its state
  status: failing
  lines:
    - kw: Given
      text: 'an index of hello.txt, README.md, and src/main.go, a working tree where hello.txt now reads hello world and a newline, README.md and src/main.go are unchanged, and a new untracked notes.txt exists'
    - kw: When
      text: 'Status() classifies the union of index paths and working files, sorted by path'
    - kw: Then
      text: 'it reports README.md unchanged, hello.txt modified, notes.txt added, and src/main.go unchanged'
    - kw: And
      text: 'the entries are ordered by path (README.md, hello.txt, notes.txt, src/main.go) and every path appears exactly once'
code:
  lang: go
  source: |
    // union of index paths and working files; classify each; sort by path
    type StatusEntry struct{ Path, State string }
    func (r *Repo) Status(ix *Index) ([]StatusEntry, error) {
      // gather paths from the index and by walking the working tree,
      // dedupe, classify each with the rules from the last two lessons, sort
    }
checkpoint: 'You have a working status command. Commit and stop here. Compare against git status on the same edits.'
---

`status` is the classification from the last two lessons applied to **every**
path. Gather the union of the paths the index knows and the files present in the
working tree (skipping the `.mygit` directory itself), classify each as unchanged,
modified, added, or deleted, and sort by path so the report is stable. That stable
ordering is what makes the output testable and readable.

This is a deliberately simplified `status`: real Git also distinguishes staged
from unstaged changes by comparing three layers (HEAD, index, and working tree),
whereas we compare two (index and working tree). But the core idea, that
content-addressed ids make change detection a matter of comparing fingerprints, is
exactly Git's. With `status` done, every everyday command has a working core, and
the capstone can drive them all together.
