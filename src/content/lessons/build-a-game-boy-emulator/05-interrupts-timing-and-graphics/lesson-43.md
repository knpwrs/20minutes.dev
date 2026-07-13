---
project: build-a-game-boy-emulator
lesson: 43
title: Palettes
overview: Today you implement the background palette, which maps each tile's raw color index through the BGP register to an actual shade of gray. Keeping this lookup separate from tile decoding is what lets a game repaint its whole screen by changing a single byte.
goal: Map a 2-bit color index through the BGP register to a final gray shade.
spec:
  scenario: Mapping indices through the background palette
  status: failing
  lines:
    - kw: Given
      text: the BGP register (0xFF47) holds 0xE4
    - kw: When
      text: color index 2 is mapped
    - kw: Then
      text: the resulting shade is 2
    - kw: And
      text: with BGP set to 0x1B, color index 0 maps to shade 3
code:
  lang: go
  source: |
    // each index selects a 2-bit field of BGP: index i -> bits [2i+1:2i]
    func shade(bgp, index uint8) uint8 {
        return (bgp >> (index * 2)) & 0x03
    }
reading: 'The BGP palette register - four 2-bit fields mapping indices to gray shades.'
checkpoint: Color indices now resolve to shades through the palette. Commit and stop here.
---

A tile's pixels are color *indices*, not colors - the mapping from index to an
actual shade of gray lives in the **background palette** register `BGP` at
`0xFF47`. It packs four 2-bit fields: index 0 reads bits 1–0, index 1 reads bits
3–2, and so on. The **shade** values run 0 (white) to 3 (black). So `BGP = 0xE4`
(`11 10 01 00`) is the identity mapping - index 2 gives shade 2.

Why the indirection? Because a game can animate or invert its whole screen by
rewriting one byte. `BGP = 0x1B` (`00 01 10 11`) reverses the palette so index 0
now maps to the darkest shade 3 - the classic screen-flash effect. Keep this
lookup separate from tile decoding: the tile gives you an index, the palette
turns it into something you can draw.
