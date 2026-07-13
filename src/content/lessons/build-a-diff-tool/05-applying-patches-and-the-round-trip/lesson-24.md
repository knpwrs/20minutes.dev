---
project: build-a-diff-tool
lesson: 24
title: Parsing a hunk header
overview: Applying a patch means reading the unified format back in, and the hunk header is where each hunk announces itself. Today you parse one back into its four numbers, undoing the length-one shorthand.
goal: Parse a hunk header line into old start, old length, new start, and new length.
spec:
  scenario: A hunk header parses into four numbers
  status: failing
  lines:
    - kw: Given
      text: 'the header line "@@ -1,5 +2,6 @@"'
    - kw: When
      text: 'parseHunkHeader reads it'
    - kw: Then
      text: 'it returns old start 1, old length 5, new start 2, new length 6'
    - kw: And
      text: 'the shorthand header "@@ -2 +2 @@" parses to old start 2, old length 1, new start 2, new length 1 (an omitted length means 1)'
code:
  lang: go
  source: |
    // "@@ -oldStart[,oldLen] +newStart[,newLen] @@"
    // strip the "@@ " ... " @@", split on space into "-a,b" and "+c,d".
    func parseRange(s string) (start, length int) {
      s = s[1:] // drop the leading '-' or '+'
      if i := strings.IndexByte(s, ','); i >= 0 {
        start, _ = strconv.Atoi(s[:i])
        length, _ = strconv.Atoi(s[i+1:])
      } else {
        start, _ = strconv.Atoi(s) // no comma: length defaults to 1
        length = 1
      }
      return
    }
checkpoint: You can parse a hunk header back into its ranges. Commit and stop here.
---

Reading a patch is the mirror of writing one, and it starts with the hunk header. `@@ -oldStart,oldLen +newStart,newLen @@` carries the same four numbers you formatted on the way out, so parsing splits off the `-` range and the `+` range and reads each `start,length` pair. The only subtlety is the one you introduced deliberately: a range written without a comma means a length of **1**, so `-2` parses as start 2, length 1. Undo that shorthand here and the rest of the parser can assume every hunk has an explicit length.

Being liberal in what you accept matters for a patch tool - the headers it reads were often produced by `git` or GNU `diff`, which both use the length-one shorthand freely. Getting this small parse exactly right, including the shorthand, means the applier downstream can trust the numbers. Next you parse the header together with its body lines into a full hunk your applier can consume.
