---
project: build-a-diff-tool
lesson: 22
title: Merging nearby hunks
overview: When two changes sit close together, their context bands overlap and would print the same lines twice. Today you merge such hunks into one, so nearby edits read as a single continuous block.
goal: Merge hunks whose context bands overlap or touch, leaving distant changes as separate hunks.
spec:
  scenario: Close changes merge, distant changes do not
  status: failing
  lines:
    - kw: Given
      text: 'the diff of ["1".."9"] against the same list with "3" changed to "x" and "7" changed to "y", context 3'
    - kw: When
      text: 'the hunks are grouped and merged'
    - kw: Then
      text: 'there is 1 hunk, because only 3 unchanged lines separate the changes (within 2 times the context), and its header is "@@ -1,9 +1,9 @@"'
    - kw: And
      text: 'the two-changes-7-apart case from the grouping lesson still yields 2 separate hunks'
code:
  lang: go
  source: |
    // after building per-run hunks, fold overlapping neighbours together
    merged := hunks[:1]
    for _, h := range hunks[1:] {
      last := &merged[len(merged)-1]
      if h.startIndex <= last.endIndex { // context bands touch or overlap
        // extend last to cover h, dropping the duplicated context lines
      } else {
        merged = append(merged, h)
      }
    }
checkpoint: Nearby changes collapse into one hunk; distant ones stay separate. Commit and stop here.
---

The per-run grouping from before can produce hunks that **overlap**: if two changes are within `2·context` lines of each other, the trailing context of the first hunk and the leading context of the second cover some of the same lines. Printing both would duplicate those lines and produce a malformed diff, so the fix is to **merge** any two hunks whose bands touch or overlap into a single hunk spanning both changes and the unchanged lines between them. Here the two changes are only three lines apart with context three, so they collapse into one hunk covering the whole file.

This is the rule real diff tools use, stated as a threshold: changes closer than twice the context share a hunk; changes farther apart get their own. It reads better - a reader sees one coherent block instead of two fragments with a sliver of context between - and it keeps the output valid for patch tools, which assume hunks are disjoint and in order. With merging in place, `UnifiedDiff` handles any arrangement of changes; wire the merge step into it so its output is always well-formed. Only the awkward file-boundary edges remain.
