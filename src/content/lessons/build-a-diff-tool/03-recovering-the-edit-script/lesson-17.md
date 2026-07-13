---
project: build-a-diff-tool
lesson: 17
title: 'The classic diff, replayed'
overview: The chapter closes on Myers'' own worked example. Rather than pin a fragile exact interleaving, you prove the script is valid the way a diff must be - reading it one way rebuilds the old document, the other way rebuilds the new.
goal: Show the Myers script for the classic pair is minimal and replayable in both directions.
spec:
  scenario: The edit script rebuilds both documents
  status: failing
  lines:
    - kw: Given
      text: 'the Myers edit script for "ABCABBA" against "CBABAC" (as single-character lines)'
    - kw: When
      text: 'the operations are counted and filtered'
    - kw: Then
      text: 'there are 4 Keep operations and 5 change operations (Delete plus Insert), matching D = 5'
    - kw: And
      text: 'taking the Keep and Delete lines in order rebuilds ["A","B","C","A","B","B","A"], and taking the Keep and Insert lines in order rebuilds ["C","B","A","B","A","C"]'
code:
  lang: go
  source: |
    ops := Diff(chars("ABCABBA"), chars("CBABAC"))
    var oldSide, newSide []string
    for _, op := range ops {
      if op.Kind != Insert { oldSide = append(oldSide, op.Line) } // Keep + Delete
      if op.Kind != Delete { newSide = append(newSide, op.Line) } // Keep + Insert
    }
    // oldSide == original a, newSide == original b
checkpoint: Myers produces a minimal, replayable diff of the classic example. Commit and stop here.
---

An edit script is correct when it is a faithful recipe: keep and delete the old lines and you get the original back; keep and insert the new lines and you get the target. That is the definition worth testing, and it sidesteps the trap of pinning one specific minimal script - `ABCABBA` versus `CBABAC` has several equally-short diffs, so asserting an exact operation sequence would be brittle across correct implementations. Instead you assert the two properties that *every* correct diff must satisfy: the right counts (4 keeps, 5 changes) and the two-way reconstruction.

This is the same replayability you will lean on when applying patches later: a diff is nothing more than the shared instructions for turning one document into the other. With a fast, correct engine that hands back a provably valid script, the algorithmic core of the diff tool is finished. The remaining chapters are about presentation and round-tripping - turning this script into the unified diff format the world expects, and then applying that format back onto a document.
