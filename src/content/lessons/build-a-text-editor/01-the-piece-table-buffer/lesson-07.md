---
project: build-a-text-editor
lesson: 7
title: Where the lines start
overview: An editor thinks in lines, but the buffer is a flat byte sequence - so you need to know where each line begins. Today you compute the line count and the start offset of every line.
goal: Report how many lines the buffer holds and the byte offset where each line begins.
spec:
  scenario: Line count and line-start offsets
  status: failing
  lines:
    - kw: Given
      text: 'a buffer created from "ab\ncd"'
    - kw: When
      text: LineCount and LineStart are queried
    - kw: Then
      text: 'LineCount() is 2, LineStart(0) is 0, and LineStart(1) is 3'
    - kw: And
      text: 'an empty buffer "" has LineCount() 1 and LineStart(0) 0, while "ab\n" has LineCount() 2 (a trailing newline opens an empty final line)'
code:
  lang: go
  source: |
    // scan Text() once: line 0 starts at 0, and every '\n' at index i
    // opens a new line starting at i+1.
    //   starts := []int{0}
    //   for i, ch := range text { if ch == '\n' { starts = append(starts, i+1) } }
    // LineCount() == len(starts)
checkpoint: You can locate every line's start in the buffer. Commit and stop here.
---

The buffer stores one flat run of bytes, but the cursor, the screen, and search all
think in **lines**. Lines are not a separate structure to maintain - they are
implied by where the newlines fall. A single scan of the text builds the map you
need: line `0` begins at offset `0`, and every `\n` at index `i` begins a new line
at `i+1`. The number of line starts is the line count.

Two edges define the convention and are easy to get wrong. An **empty buffer** has
one line (an empty one), not zero - an editor always shows at least a blank line to
put the cursor on. And a **trailing newline** opens a new, empty final line: `"ab\n"`
is two lines, `"ab"` and `""`, not one. Fixing these now means every later feature
that counts or indexes lines inherits the same, correct notion of what a line is.
