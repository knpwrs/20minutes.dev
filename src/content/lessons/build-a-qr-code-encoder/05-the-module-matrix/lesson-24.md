---
project: build-a-qr-code-encoder
lesson: 24
title: Finder patterns
overview: 'The three big nested squares in the corners are the finder patterns - the marks a scanner locates first. Today you draw the 7x7 pattern and place it in three corners of the grid.'
goal: 'Place the 7x7 finder pattern in the top-left, top-right, and bottom-left corners.'
spec:
  scenario: 'Finder patterns fill three corners'
  status: failing
  lines:
    - kw: Given
      text: 'the 7x7 finder pattern: a solid dark border, a light ring inside it, and a solid 3x3 dark center'
    - kw: When
      text: 'finders are placed at the top-left (0,0), top-right (0,14), and bottom-left (14,0)'
    - kw: Then
      text: 'in the top-left finder module (0,0) is dark, (1,1) is light, and the 3x3 center (rows 2-4, cols 2-4) is all dark'
    - kw: And
      text: 'the top-right finder has its top-left corner at (0,14) and the bottom-left finder at (14,0), each an identical 7x7 pattern'
code:
  lang: go
  source: |
    // Row-by-row: dark iff on the outer border, or in the 3x3 core.
    var finder = [7][7]int8{
      {1,1,1,1,1,1,1},
      {1,0,0,0,0,0,1},
      {1,0,1,1,1,0,1},
      {1,0,1,1,1,0,1},
      {1,0,1,1,1,0,1},
      {1,0,0,0,0,0,1},
      {1,1,1,1,1,1,1},
    }
checkpoint: 'The three finder patterns are placed. Commit and stop here.'
---

The most recognizable part of a QR code is the trio of nested squares in three corners: the **finder patterns**. A scanner uses them to locate the symbol and work out its orientation and scale, so their shape is fixed and unmistakable: a `7x7` block with a solid dark outer border, a one-module light ring just inside it, and a solid `3x3` dark core. The dark-light ratios across a finder (1:1:3:1:1) are what the scanner scans for.

There are exactly **three** finders - top-left, top-right, and bottom-left - leaving the fourth corner for data (Version 1 has no alignment pattern there). Their top-left corners sit at `(0,0)`, `(0,14)`, and `(14,0)`. Placing them is just copying the fixed `7x7` grid into those positions. These are the first **function patterns**: modules whose value is fixed by the symbol structure, never by data. Everything around them - separators, timing, format - exists to keep them readable, and the data must route around them.
