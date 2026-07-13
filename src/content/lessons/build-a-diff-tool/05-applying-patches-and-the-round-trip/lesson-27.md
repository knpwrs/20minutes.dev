---
project: build-a-diff-tool
lesson: 27
title: Rejecting a bad patch
overview: A patch built for one document must not silently corrupt a different one. Today Apply verifies that context and deleted lines actually match the original, and refuses - with an error - when they do not.
goal: Make Apply check that each context and deleted line matches the original, returning an error on any mismatch.
spec:
  scenario: A patch whose context does not match is rejected
  status: failing
  lines:
    - kw: Given
      text: 'the patch parsed from the diff of ["line1","line2","line3","line4","line5"] against that list with "line3" changed to "CHANGED"'
    - kw: When
      text: 'Apply is run against a different original ["line1","XXXX","line3","line4","line5"], where the context line "line2" is now "XXXX"'
    - kw: Then
      text: 'Apply returns an error reporting the mismatch, and does not return a patched document'
    - kw: And
      text: 'applying the same patch to the correct original still succeeds and reproduces the target'
code:
  lang: go
  source: |
    case Keep, Delete:
      if oldPos >= len(a) || a[oldPos] != op.Line {
        return nil, fmt.Errorf("patch does not apply: expected %q at line %d, got %q",
          op.Line, oldPos+1, safeAt(a, oldPos))
      }
      // matched: copy (Keep) or skip (Delete), then advance oldPos
checkpoint: Apply rejects a patch whose context does not match. Commit and stop here.
---

A patch encodes not just what to change but the **context** around the change - the unchanged lines in each hunk - precisely so a tool can confirm it is editing the document the diff was made from. When you apply a patch, every `Keep` and `Delete` line names a line that must already be present in the original at that position; if the actual line differs, the patch does not apply, and forcing it would corrupt the file. So `Apply` compares each context and deleted line against the original and returns an error the moment one disagrees, rather than producing a wrong result.

This is the guard that separates a real patch applier from a naive one. Notice it only checks `Keep` and `Delete` against the original - an `Insert` adds a brand-new line, so there is nothing in the original to match. Returning an **error** rather than a half-applied document is the safe default: the caller learns the patch is stale or was meant for a different file, and the original is left untouched. Real tools add fuzzy matching and offset search to tolerate small shifts, but strict context checking is the correct and honest baseline, and it is what makes the final round-trip trustworthy.
