---
project: build-a-diff-tool
lesson: 21
title: The full unified diff
overview: Wrap the hunks with the file header and you have produced a complete, standard unified diff - the exact text git diff and patch speak. This is the chapter's headline deliverable.
goal: Render a complete unified diff, from raw old and new text to the ---/+++ header and all hunks.
spec:
  scenario: Two documents produce a complete unified diff
  status: failing
  lines:
    - kw: Given
      text: 'old text "line1\nline2\nline3\nline4\nline5\n" and new text with "line3" replaced by "CHANGED", names "old.txt" and "new.txt", context 3'
    - kw: When
      text: 'UnifiedDiff is called'
    - kw: Then
      text: 'it returns the header "--- a/old.txt" and "+++ b/new.txt", then "@@ -1,5 +1,5 @@", then the six body lines " line1", " line2", "-line3", "+CHANGED", " line4", " line5" (all newline-terminated)'
    - kw: And
      text: 'when the two texts are identical, UnifiedDiff returns the empty string (no header, no hunks)'
code:
  lang: go
  source: |
    func UnifiedDiff(oldName, newName, oldText, newText string, context int) string {
      ops := Diff(Lines(oldText), Lines(newText))
      hunks := group(ops, context)
      if len(hunks) == 0 {
        return "" // nothing changed
      }
      out := "--- a/" + oldName + "\n" + "+++ b/" + newName + "\n"
      for _, h := range hunks {
        out += renderHunk(h)
      }
      return out
    }
checkpoint: You can produce a complete, standard unified diff from two documents. Commit and stop here.
---

The **file header** names the two sides so a reader (and a patch tool) knows what is being compared: a `---` line for the old file and a `+++` line for the new, here written git-style with `a/` and `b/` prefixes on the names. Below it come the hunks, in order, each with its `@@` header and prefixed body. That is the whole format - two header lines and a sequence of hunks - and you have now built every piece of it.

Two conventions make the output well-behaved. When nothing changed there are no hunks, and a unified diff of identical files is simply **empty** - no header at all - which is exactly what tools expect and what lets a script test "are these the same?" by checking for empty output. And because `UnifiedDiff` takes the raw document text rather than pre-split lines, it holds onto information the line list threw away - most importantly whether each file ended in a newline - which the next lesson needs to mark the no-final-newline case correctly.
