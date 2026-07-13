---
project: build-a-qr-code-encoder
lesson: 33
title: Penalty rule 2 - blocks
overview: 'The second penalty rule punishes solid 2x2 blocks of one color, which make dense clumps a scanner can misread. Today you write it.'
goal: 'Score a grid by penalizing every 2x2 block of a single color.'
spec:
  scenario: 'Solid 2x2 blocks are penalized'
  status: failing
  lines:
    - kw: Given
      text: 'penalty rule 2: every 2x2 area whose four modules are the same color scores 3, counting overlapping placements'
    - kw: When
      text: 'a single 2x2 all-dark block is scored'
    - kw: Then
      text: 'it contributes 3'
    - kw: And
      text: 'a 3x3 all-dark area contributes 12 - it contains four overlapping 2x2 blocks, each worth 3'
code:
  lang: go
  source: |
    // Every top-left corner of a same-colored 2x2 adds 3.
    func rule2(g [][]int8) int {
      s := 0
      for r := 0; r < len(g)-1; r++ {
        for c := 0; c < len(g[0])-1; c++ {
          v := g[r][c]
          if g[r][c+1] == v && g[r+1][c] == v && g[r+1][c+1] == v {
            s += 3
          }
        }
      }
      return s
    }
checkpoint: 'You can score a grid on 2x2 blocks. Commit and stop here.'
---

**Rule 2** discourages solid rectangular clumps. Every `2x2` area in which all four modules share a color scores **3**, and the placements **overlap** - you slide the 2x2 window one module at a time, so a larger solid region contributes many overlapping blocks. A `3x3` solid area, for instance, contains four 2x2 sub-blocks and scores `4 * 3 = 12`.

The implementation is a double loop over every module that could be a 2x2 top-left corner (all but the last row and column), checking whether it and its three neighbours match. This rule, together with rule 1, is why a good mask spreads dark and light into a fine texture rather than large fields. Two rules down, two to go: next is the one that protects the finder pattern's signature.
