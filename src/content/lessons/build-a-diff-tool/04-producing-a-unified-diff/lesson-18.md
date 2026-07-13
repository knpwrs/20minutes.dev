---
project: build-a-diff-tool
lesson: 18
title: Grouping changes into hunks
overview: A real diff does not print every unchanged line - it shows only the changed regions with a few lines of context around each. Today you group the edit script into hunks, one per run of changes, with a bounded band of context on each side.
goal: Split an edit script into one hunk per change run, each carrying up to N lines of surrounding context.
spec:
  scenario: Two distant changes become two hunks
  status: failing
  lines:
    - kw: Given
      text: 'the diff of ["1".."15"] against the same list with "4" changed to "x" and "12" changed to "y", and a context of 3'
    - kw: When
      text: 'the script is grouped, one hunk per change run with up to 3 context lines each side'
    - kw: Then
      text: 'there are 2 hunks (the two changes are 7 unchanged lines apart, so their context bands do not overlap)'
    - kw: And
      text: 'the first hunk holds Keep "1", Keep "2", Keep "3", Delete "4", Insert "x", Keep "5", Keep "6", Keep "7"; the middle line "8" belongs to no hunk'
code:
  lang: go
  source: |
    type Hunk struct {
      OldStart, NewStart int
      Ops                []Op
    }
    // for each maximal run of Delete/Insert ops, build a hunk from:
    //   up to `context` Keep ops immediately before the run,
    //   the run itself,
    //   up to `context` Keep ops immediately after.
    // record OldStart/NewStart = 1-based line numbers of the hunk's first line.
    // (do NOT merge overlapping bands yet - that is the next-but-one lesson.)
checkpoint: You can carve an edit script into one context-bounded hunk per change. Commit and stop here.
---

Showing an entire file to point out a two-line change is wasteful, so diffs report **hunks**: each changed region plus a few unchanged **context** lines on either side (three by default), which help a reader - and a patch tool - locate the change. Today's grouping is deliberately simple: find each maximal run of `Delete`/`Insert` operations, and wrap it with up to `context` kept lines before and after. Unchanged lines beyond that band are dropped, so the lonely line `8` between two far-apart changes appears in no hunk at all.

Record each hunk's starting line numbers as you go - the 1-based position of its first line in the old and new files - because the header needs them later. When two changes are far apart, as here, their context bands are separate and this per-run grouping already gives correct, non-overlapping hunks. The interesting case is when two changes sit *close* together and their context bands overlap or touch; that needs a merge step, and it gets its own lesson shortly. For now, keep each change run in its own hunk and do not merge.
