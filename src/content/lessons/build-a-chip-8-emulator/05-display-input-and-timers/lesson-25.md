---
project: build-a-chip-8-emulator
lesson: 25
title: DXYN - wrapping and clipping
overview: 'Real sprites land near the edges, so DXYN needs two edge rules: the starting position wraps around the screen, but the sprite itself clips rather than spilling over. Today you pin both.'
goal: Make DXYN wrap the starting coordinate modulo the screen and clip pixels that fall past an edge.
spec:
  scenario: The start wraps but the sprite clips
  status: failing
  lines:
    - kw: Given
      text: 'I points at a byte 0xFF, V1 = 62 (x), V2 = 0 (y), on a blank screen, about to execute 0xD121 (draw 1 row)'
    - kw: When
      text: 'Step runs it'
    - kw: Then
      text: 'only columns 62 and 63 of row 0 turn on - the remaining six pixels are clipped at the right edge, NOT wrapped to columns 0 and 1'
    - kw: And
      text: 'with V1 = 68 the start wraps (68 modulo 64 = 4), so the same draw lights columns 4 through 11'
    - kw: And
      text: 'clipping applies to the bottom edge too: a 3-row sprite (three 0xFF bytes) drawn with V1 = 0, V2 = 31 lights only row 31 columns 0 through 7 - the 2nd and 3rd rows fall past row 31 and are dropped, not wrapped to the top'
code:
  lang: go
  source: |
    // wrap only the starting corner into range:
    px := int(v.V[x]) % 64
    py := int(v.V[y]) % 32
    // ...then, per pixel, skip (clip) any column >= 64 or row >= 32
    // instead of wrapping the individual pixel
checkpoint: DXYN wraps the sprite's start position and clips pixels past the screen edge. Commit and stop here.
---

Two different edge behaviours meet in `DXYN`, and mixing them up is a classic bug. First, the **starting coordinate wraps**: because `VX` and `VY` are bytes but the screen is only 64 by 32, the start corner is taken modulo the screen size. A sprite told to start at `x = 68` actually starts at column `4` (`68 mod 64`). This is what lets a program position a sprite anywhere using a byte coordinate.

Second, once drawing begins from that wrapped corner, the **individual pixels clip** - they do not wrap. A sprite whose start is near the right edge simply loses the pixels that would fall past column 63; they are dropped, not drawn on the opposite side. So a sprite starting at column `62` lights only columns `62` and `63`, and the rest vanish. Pinning both in one lesson - one draw that clips at the edge and one whose start wraps into range - keeps the two rules from bleeding into each other, which is exactly the mistake that makes sprites smear across the screen.
