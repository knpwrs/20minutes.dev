---
project: build-a-diff-tool
lesson: 26
title: Applying a patch
overview: Now close the loop - take a parsed patch and an original document and produce the target. Applying walks the hunk against the original, copying context, dropping deletions, and splicing in insertions.
goal: Apply parsed hunks to the original document to reconstruct the target.
spec:
  scenario: Applying a diff reconstructs the target
  status: failing
  lines:
    - kw: Given
      text: 'the original ["line1","line2","line3","line4","line5"] and the patch parsed from its unified diff against the same list with "line3" changed to "CHANGED"'
    - kw: When
      text: 'Apply runs the patch on the original'
    - kw: Then
      text: 'it returns ["line1","line2","CHANGED","line4","line5"], the target'
    - kw: And
      text: 'more generally, for any documents a and b, Apply(a, Parse(UnifiedDiff("a","b", aText, bText, 3))) equals the lines of b'
code:
  lang: go
  source: |
    result := []string{}
    oldPos := 0 // 0-based cursor into a
    for _, h := range hunks {
      for oldPos < h.OldStart-1 { // copy lines before the hunk
        result = append(result, a[oldPos]); oldPos++
      }
      for _, op := range h.Ops {
        switch op.Kind {
        case Keep:   result = append(result, a[oldPos]); oldPos++
        case Delete: oldPos++            // skip the deleted line
        case Insert: result = append(result, op.Line)
        }
      }
    }
    result = append(result, a[oldPos:]...) // trailing unchanged lines
checkpoint: Applying your own diff reproduces the target. Commit and stop here.
---

Applying a patch replays the edit script against the original document. Walk each hunk in order: first copy the untouched lines before it (up to the hunk's `OldStart`), then process its operations - a `Keep` copies the current old line and advances, a `Delete` skips the current old line without emitting it, and an `Insert` emits the new line without touching the old cursor. After the last hunk, copy whatever unchanged lines remain. The result is the target document, rebuilt from the original plus the patch.

This is the property the whole library has been building toward: `apply(a, diff(a, b)) == b`. A diff is a faithful, replayable recipe, and applying it is deterministic - no searching, no guessing, because your own diff's line numbers line up exactly with the original. The only thing that could go wrong is applying a patch to the *wrong* original, where the context no longer matches - and detecting exactly that is the next lesson, the difference between a toy and a real patch tool.
