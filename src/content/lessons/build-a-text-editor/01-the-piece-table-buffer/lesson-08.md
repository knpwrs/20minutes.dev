---
project: build-a-text-editor
lesson: 8
title: Reading a line back
overview: With line starts known, you can hand back the text of any single line - the unit the screen draws and the cursor lives on. Today you round out the buffer so it can be read line by line.
goal: Return the text of a given line (without its newline) and that line's length.
spec:
  scenario: The contents of a single line
  status: failing
  lines:
    - kw: Given
      text: 'a buffer created from "ab\ncd"'
    - kw: When
      text: Line and LineLen are queried
    - kw: Then
      text: 'Line(0) is "ab", Line(1) is "cd", and LineLen(0) is 2'
    - kw: And
      text: 'for "ab\n", Line(1) is "" and LineLen(1) is 0'
code:
  lang: go
  source: |
    // a line runs from LineStart(n) up to the next '\n' (or end of text).
    //   start := b.LineStart(n)
    //   end := start; for end < len(text) && text[end] != '\n' { end++ }
    //   return text[start:end]
    // LineLen(n) == len(Line(n))
checkpoint: The buffer can be read line by line - chapter one is complete. Commit and stop here.
---

`Line(n)` returns the text of one line **without** its trailing newline, because the
newline is a separator between lines, not part of either. It runs from the line's
start offset up to the next newline or the end of the buffer. That single method,
together with `LineCount` and `LineLen`, is the entire surface the viewport will
draw from and the cursor will move across - the screen shows lines, and a line is
exactly this.

That completes the buffer. From an immutable original and an append-only add
buffer, a small list of pieces gives you exact inserts and deletes with no byte
ever copied, and a one-pass newline scan turns that flat sequence into lines you
can count, index, and read. Build a buffer, insert a `"Hi"`, an Enter's worth of
`"\n"`, and a `"Bye"`, and you can read `"Hi"` and `"Bye"` back as lines `0` and `1`.
Everything from here - cursor, editing, rendering, undo - is built on this
foundation.
