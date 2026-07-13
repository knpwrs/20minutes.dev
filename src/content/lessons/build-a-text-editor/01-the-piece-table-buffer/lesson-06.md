---
project: build-a-text-editor
lesson: 6
title: Deleting across pieces and lines
overview: A real delete often spans more than one piece - and deleting a newline is how two lines become one. Today you make Delete correct across piece boundaries, including joining lines.
goal: Delete a range that spans several pieces, and delete a newline so two lines join.
spec:
  scenario: Deleting across boundaries
  status: failing
  lines:
    - kw: Given
      text: 'a buffer created from "ab\ncd"'
    - kw: When
      text: 'Delete(2, 1) removes the newline at index 2'
    - kw: Then
      text: 'Text() is "abcd" (the two lines are now one)'
    - kw: And
      text: 'a buffer "abcd" with Insert(2, "XY") giving "abXYcd", then Delete(1, 4), has Text() "ad" (the delete spans all three pieces)'
code:
  lang: go
  source: |
    // the same trim walk, but now several pieces fall inside the range:
    //   pieces fully covered by [pos, pos+count) are dropped entirely,
    //   the first and last overlapping pieces keep their outside remainders.
    // a newline is just a byte in a piece - deleting it joins two lines.
checkpoint: Delete works across piece and line boundaries. Commit and stop here.
---

Deletes rarely respect piece boundaries. After a few inserts the text is a patchwork
of pieces, and a single backspace-and-hold can sweep across several of them. The
walk from last lesson already has the right shape; it just needs to handle the
range covering **whole pieces** in the middle (dropped entirely) as well as
trimming the first and last pieces it touches. Deleting `"bXYc"` out of `"abXYcd"`
drops the middle add-buffer piece completely and trims one character off each
original piece on either side, leaving `"ad"`.

The line-joining case is the one that matters most for an editor, and it needs no
special code at all: a **newline is just a byte** living in some piece, so deleting
it merges the line before with the line after. `"ab\ncd"` with its `\n` removed is
simply `"abcd"` - one line where there were two. This is exactly what backspace at
the start of a line will do later, and it works today because the buffer treats
newlines as ordinary content and lets the line structure fall out of where they sit.
