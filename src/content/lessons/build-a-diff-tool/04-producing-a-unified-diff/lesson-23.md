---
project: build-a-diff-tool
lesson: 23
title: Newlines and empty files
overview: Two edges finish the format - a file whose last line has no trailing newline, marked with a special line, and a file that is empty, whose range starts at zero. Handle these and your unified diff matches the real tools byte for byte.
goal: Emit the no-final-newline marker after an affected last line, and confirm empty-file ranges start at 0.
spec:
  scenario: A missing trailing newline is marked
  status: failing
  lines:
    - kw: Given
      text: 'old text "a\nb\nc\n" and new text "a\nb\nZ" (the new file has no trailing newline), names "old.txt" and "new.txt", context 3'
    - kw: When
      text: 'UnifiedDiff is called'
    - kw: Then
      text: 'the hunk ends with "-c", then "+Z", then the marker line "\ No newline at end of file"'
    - kw: And
      text: 'diffing empty old text "" against "x\ny\n" produces the header "@@ -0,0 +1,2 @@" followed by "+x" and "+y"'
code:
  lang: go
  source: |
    // detect once, from the raw text UnifiedDiff already receives:
    oldNoNL := oldText != "" && !strings.HasSuffix(oldText, "\n")
    newNoNL := newText != "" && !strings.HasSuffix(newText, "\n")
    // when rendering the body, after emitting the op that carries a file's
    // final line, if that side lacks a trailing newline, emit:
    //   "\ No newline at end of file\n"
    // a Delete of the old last line uses oldNoNL; an Insert of the new
    // last line (and a Keep of a shared last line) uses newNoNL.
checkpoint: Your unified diff handles missing newlines and empty files. Commit and stop here.
---

Unix text files conventionally end in a newline, and when one does not, diff tools flag it so the distinction is not silently lost - otherwise applying the patch could add or drop a newline no one intended. The convention is a line beginning with a backslash and a space: `\ No newline at end of file`, emitted immediately after the body line carrying that file's final line. Because `UnifiedDiff` was given the raw text, it can check each side with a simple suffix test and place the marker precisely - here the new file's last line `Z` lacks a newline, so the marker follows `+Z`.

The empty-file case needs no new machinery, just correct range math: a side with no lines has length `0` and start `0`, so inserting two lines into an empty file yields `@@ -0,0 +1,2 @@` - the `-0,0` says "the old file is empty," and the `+1,2` says "two new lines starting at line 1." That your existing header code already produces this is a good confirmation the range logic is right. With these edges handled, the output side is complete and standards-matching; the final chapter reads a unified diff back in and applies it, closing the loop.
