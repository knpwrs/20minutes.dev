---
project: build-a-json-parser
lesson: 4
title: Line and column positions
overview: A byte offset is precise but unfriendly - people read errors as "line 2, column 3". Today you track line and column alongside the offset so every token knows its human-readable position.
goal: Stamp each token with a 1-based line and column, resetting the column after every newline.
spec:
  scenario: Positions across a newline
  status: failing
  lines:
    - kw: Given
      text: 'the input "[\n  ]" (a bracket, a newline, two spaces, a bracket)'
    - kw: When
      text: it is scanned
    - kw: Then
      text: 'the LBracket is at Line 1, Column 1, and the RBracket is at Line 2, Column 3'
    - kw: And
      text: 'line and column both start at 1, a line feed increments Line and resets Column to 1, and a tab advances Column by 1'
code:
  lang: go
  source: |
    // add Line and Col to Token; track them as you advance
    // start line=1, col=1
    // on consuming a byte: if it is '\n' { line++; col = 1 } else { col++ }
    // record line and col at the moment a token starts (after skipping ws)
checkpoint: Every token reports a human-readable line and column. Commit and stop here.
---

A byte offset is exact but nobody debugs by counting bytes. Editors and error
messages speak in **line and column**, so the scanner tracks those too. Both start
at `1`. As the scanner walks forward it counts columns, and every time it passes a
line feed (`\n`) it bumps the line and snaps the column back to `1`.

Keep the rule mechanical: advancing over one byte either moves the column right or,
for a newline, drops to the next line. A tab counts as a single column here - not a
jump to the next tab stop - which keeps positions predictable regardless of how an
editor renders tabs. Record the line and column at the point each token starts, the
same moment you already record its offset, so a token carries all three coordinates
at once.
