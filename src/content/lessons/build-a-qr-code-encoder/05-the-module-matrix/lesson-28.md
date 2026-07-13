---
project: build-a-qr-code-encoder
lesson: 28
title: The zigzag path
overview: 'Data snakes through the grid in a fixed order: upward and downward through pairs of columns, skipping every function and reserved module. Today you generate that traversal path, without yet writing any bits.'
goal: 'Produce the ordered list of placeable module coordinates in the standard zigzag.'
spec:
  scenario: 'The placement path skips function modules'
  status: failing
  lines:
    - kw: Given
      text: 'the grid with all function patterns placed and the format area reserved'
    - kw: When
      text: 'the placement path is generated, walking two columns at a time from the bottom-right, upward then downward, skipping column 6 (the timing column) and every occupied or reserved module'
    - kw: Then
      text: 'the first eight coordinates are (20,20), (20,19), (19,20), (19,19), (18,20), (18,19), (17,20), (17,19)'
    - kw: And
      text: 'the path visits exactly the unoccupied modules - 208 of them for Version 1 - and never a finder, timing, or reserved module'
code:
  lang: go
  source: |
    // Column pairs right-to-left; within a pair take the right
    // column then the left. Direction flips each pair. Skip col 6.
    for col := size - 1; col > 0; col -= 2 {
      if col == 6 { col-- }
      // for each row in the current direction:
      //   try (row, col) then (row, col-1); emit if not occupied
    }
checkpoint: 'You have the exact order data will fill the grid. Commit and stop here.'
---

Data modules are not placed left-to-right like text; they follow a **zigzag** that weaves around the function patterns. The rule: work in **pairs of columns**, moving from the right edge leftward. Within a pair you always take the right column's module then the left column's. You move **upward** through the first pair, **downward** through the next, alternating direction each pair so the path snakes continuously. Column 6 (the vertical timing line) is skipped entirely, so the column stepping jumps over it.

Any module that is already a function pattern or is reserved for format is stepped over - the path only emits **placeable** modules. Starting at the bottom-right corner, the first cells are `(20,20), (20,19)` then up to `(19,20), (19,19)`, and so on. For Version 1 there are exactly **208 placeable modules**, which is no coincidence: that is `26 codewords * 8 bits`, the whole codeword sequence. This lesson produces just the ordered path; the next writes the bits along it.
