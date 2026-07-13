---
project: build-a-qr-code-encoder
lesson: 25
title: Separators
overview: 'Each finder pattern is wrapped on its inner edges by a one-module light border so it cannot blur into the data beside it. Today you draw those separators.'
goal: 'Place the one-module light separator along the inner edges of each finder.'
spec:
  scenario: 'Light separators fence off the finders'
  status: failing
  lines:
    - kw: Given
      text: 'the three finder patterns already placed'
    - kw: When
      text: 'a one-module-wide light border is drawn along each finder''s inner edges'
    - kw: Then
      text: 'for the top-left finder, row 7 columns 0-7 are all light and column 7 rows 0-7 are all light, so (7,0), (7,7), and (0,7) are all light'
    - kw: And
      text: 'the top-right and bottom-left finders get the same one-module light fence on the sides that face the data region'
code:
  lang: go
  source: |
    // Top-left finder: light row just below (row 7, cols 0..7)
    // and light column just right (col 7, rows 0..7).
    for i := 0; i <= 7; i++ {
      g.set(7, i, 0)
      g.set(i, 7, 0)
    }
    // Mirror for the other two finders on their data-facing edges.
checkpoint: 'The finders are separated from the data region. Commit and stop here.'
---

Right next to each finder pattern the symbol places a **separator**: a one-module-wide line of **light** modules along the finder's inner edges - the edges that face the rest of the grid. Without it, a dark data module touching the finder's dark border could smear the 1:1:3:1:1 ratio the scanner keys on, so the separator guarantees a clean light boundary around each finder.

For the top-left finder that means the whole of **row 7** (columns 0 through 7) and the whole of **column 7** (rows 0 through 7) are light, forming an L that hugs the finder. The top-right and bottom-left finders get the same treatment on the edges that face inward. These modules are light function patterns: fixed, and off-limits to data. With the finders fenced off, the two thin dotted lines that calibrate module spacing come next.
