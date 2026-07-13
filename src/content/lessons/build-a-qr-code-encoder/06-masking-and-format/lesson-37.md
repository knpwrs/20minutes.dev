---
project: build-a-qr-code-encoder
lesson: 37
title: Choosing the mask
overview: 'With eight masks and four penalty rules, the encoder tries every mask, scores the result, and keeps the lowest. Today you run the selection for HELLO WORLD and confirm which mask wins.'
goal: 'Score all eight masks and select the one with the lowest total penalty.'
spec:
  scenario: 'The lowest-penalty mask is chosen'
  status: failing
  lines:
    - kw: Given
      text: 'the HELLO WORLD data grid, where each candidate is the grid with one mask applied and that mask''s format information placed'
    - kw: When
      text: 'all eight masks are scored by summing the four penalty rules'
    - kw: Then
      text: 'the totals for masks 0 through 7 are 347, 470, 506, 441, 539, 516, 314, 558'
    - kw: And
      text: 'the lowest is mask 6 at 314, so mask 6 is selected for the final symbol'
code:
  lang: go
  source: |
    best, bestScore := 0, math.MaxInt
    for m := 0; m < 8; m++ {
      g2 := applyMask(grid, m)
      placeFormat(g2, level, m)
      s := rule1(g2) + rule2(g2) + rule3(g2) + rule4(g2)
      if s < bestScore { best, bestScore = m, s }
    }
checkpoint: 'The best mask is chosen by penalty score. Commit and stop here.'
---

Now the four rules earn their keep. The encoder does not guess a mask - it **tries all eight**. For each mask it applies the flip to the data region, places that mask's format information (the score is computed on the complete grid, format bits included), sums the four penalty rules into a single total, and remembers the lowest. Ties break toward the lower mask number.

For HELLO WORLD at level Q the eight totals come out `347, 470, 506, 441, 539, 516, 314, 558`, and **mask 6** wins clearly at `314`. That is the mask a compliant encoder selects for this input, and the format information you place in the final symbol is the level-Q, mask-6 value `010111011011010` from the last lesson. Everything is now decided: the codewords, the layout, the mask, and the format bits. One lesson remains - assemble it all and prove the result is a real, scannable QR code.
