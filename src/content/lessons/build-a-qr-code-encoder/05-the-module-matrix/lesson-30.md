---
project: build-a-qr-code-encoder
lesson: 30
title: Rendering the grid
overview: 'A grid of modules is easier to trust when you can see it. Today you render the symbol as text - dark and light blocks with a light quiet-zone border - so the whole chapter''s work becomes visible.'
goal: 'Render the grid as text with a quiet zone around it.'
spec:
  scenario: 'The grid renders as readable text'
  status: failing
  lines:
    - kw: Given
      text: 'the Version 1 grid with its function patterns and data placed'
    - kw: When
      text: 'the grid is rendered with dark modules as a filled block, light as a space or dot, and a 4-module light quiet zone on every side'
    - kw: Then
      text: 'the rendered output is 29 rows by 29 columns (21 plus a 4-module border each side)'
    - kw: And
      text: 'the top-left finder appears as a solid 7-module dark bar on its first row (####### within the content area), a recognizable QR shape'
code:
  lang: go
  source: |
    // Two chars per module reads squarer in a terminal. Wrap with
    // `quiet` light modules on every side.
    for r := -quiet; r < size+quiet; r++ {
      for c := -quiet; c < size+quiet; c++ {
        if g.dark(r, c) { print("##") } else { print("  ") }
      }
      println()
    }
checkpoint: 'You can see your symbol as text. The layout works - commit and stop here.'
---

Every chapter ends on something you can look at, and a QR grid is the most literal case. Rendering is a straightforward double loop: dark modules print as a filled block (two characters wide reads squarer in a terminal), light modules as blanks. The one thing you must add is the **quiet zone** - a border of light modules, at least four wide, around the whole symbol. A scanner needs that margin to separate the code from whatever surrounds it; without it, even a perfect grid may not scan.

With a 4-module quiet zone, the 21-module Version 1 symbol renders as a `29x29` field, and the three finder patterns jump out as the familiar nested squares. What you are looking at right now is the **unmasked** symbol - correct in structure but not yet optimized for scanning, and still missing its format bits. The last chapter applies masking to even out the data pattern, chooses the best mask by scoring, writes the format information, and finally produces a symbol a real scanner reads.
