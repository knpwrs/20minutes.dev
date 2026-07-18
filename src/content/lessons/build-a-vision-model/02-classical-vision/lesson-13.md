---
project: build-a-vision-model
lesson: 13
title: Downsampling by pooling
overview: 'A full-resolution edge map is often more detail than anything downstream needs. Today you shrink one the way pooling always will in this project: split it into small non-overlapping blocks and keep the strongest value in each block, closing out classical vision with a complete pixels-to-edges pipeline.'
goal: Downsample a grid by 2x2 max pooling, and confirm what happens to a row or column that does not divide evenly into pairs.
spec:
  scenario: Max pooling with a leftover row and column
  status: failing
  lines:
    - kw: Given
      text: 'the 3 by 3 Gx grid from lesson 10, whose rows are all 0, 760, 760'
    - kw: When
      text: 'the grid is downsampled by 2x2 max pooling: split into non-overlapping 2 by 2 blocks starting at the top-left corner, keeping the maximum value in each block'
    - kw: Then
      text: 'only one full 2 by 2 block fits inside the 3 by 3 grid, so the trailing row and column are dropped rather than padded, leaving a 1 by 1 output'
    - kw: And
      text: 'that block contains the four values 0, 760, 0 and 760, and the pooled result is 760'
code:
  lang: go
  source: |
    // non-overlapping 2x2 blocks; height/2 and width/2 use integer division,
    // so a trailing odd row or column is simply dropped, not padded
    func maxOf4(a, b, c, d float64) float64 {
      m := a
      for _, v := range []float64{b, c, d} {
        if v > m {
          m = v
        }
      }
      return m
    }
checkpoint: 'The classical vision pipeline now runs end to end, from raw pixels through gradients to a downsampled edge map, and you have pinned the one dimension gotcha every pooling operation has: leftover rows and columns are dropped, never padded. Try chaining Sobel, magnitude, threshold and this pooling over the test pattern from lesson 5 and writing the result to a PGM to see the whole chapter output for yourself. Commit and stop for today.'
---

Every step so far has kept the grid the same size (same-padding) or shrunk it a little (valid-only, by the kernel radius). **Pooling** shrinks it on purpose and by a lot: split the grid into small non-overlapping blocks, and keep only the strongest value from each one. A 2 by 2 max pool, the version used here, looks at four numbers and keeps the largest, throwing away the other three entirely - which is the point, since downstream code usually only needs to know that an edge was somewhere in that block, not exactly where.

Pooling only behaves cleanly when the grid divides evenly into blocks, and today's grid does not: 3 rows and 3 columns leave one row and one column that cannot form a full 2 by 2 block with anything. The fix used throughout this project is the simplest one - integer division rounds the block count down, and whatever does not fit in a full block is dropped rather than padded or wrapped. It is a small edge case, but it is the one every pooling call in the rest of this project inherits.
