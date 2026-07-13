---
project: build-a-qr-code-encoder
lesson: 27
title: The dark module and reserved format area
overview: 'One lone module is always dark, and a strip beside the finders is reserved for format information written later. Today you place the dark module and mark the format area off-limits so data placement skips it.'
goal: 'Set the fixed dark module and reserve the format-information modules.'
spec:
  scenario: 'Dark module set and format area reserved'
  status: failing
  lines:
    - kw: Given
      text: 'the fixed dark module at (4*version + 9, 8), which is (13, 8) for Version 1'
    - kw: When
      text: 'the dark module is set and the format-information modules (along row 8 and column 8, beside the finders) are marked reserved'
    - kw: Then
      text: 'module (13, 8) is dark'
    - kw: And
      text: 'the format-area modules are reserved - not yet given a color, but flagged so the upcoming data placement steps over them'
code:
  lang: go
  source: |
    // The always-dark module.
    g.set(4*version+9, 8, 1) // (13,8) for version 1
    // Reserve format cells: row 8 (cols 0..8) and col 8 (rows 0..8)
    // near the finders, plus the mirror strips by the other two.
    // SKIP position 6 in both strips - the timing pattern already
    // owns (8,6) and (6,8); that leaves 15 format cells per copy.
    // Mark them reserved so data placement skips them.
checkpoint: 'The dark module is placed and the format area is reserved. Commit and stop here.'
---

Two small bookkeeping steps remain before data. First, the **dark module**: a single module that is always dark, sitting at `(4 * version + 9, 8)` - `(13, 8)` in Version 1, just above the bottom-left finder's separator. It has no meaning beyond "always here"; the format-information decoder relies on its fixed position.

Second, the **format information** area. The format bits (error-correction level and mask, protected by a BCH code) are written in the last chapter, but their positions - a strip along **row 8** and **column 8** wrapping the top-left finder, mirrored beside the other two finders - must be **reserved now**. Reserving means marking those modules so the data placement you write next treats them as occupied and routes around them, exactly as it routes around finders and timing. One thing to watch: **skip position 6** in both strips - the timing pattern already owns `(8,6)` and `(6,8)`, so reserving them again would clobber it. That leaves exactly 15 format cells per copy. Get the reservation right and the zigzag placement never collides with the format strip; get it wrong and the data and format overwrite each other. With every function module either set or reserved, the grid is finally ready for data.
