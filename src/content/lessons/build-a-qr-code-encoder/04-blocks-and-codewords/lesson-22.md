---
project: build-a-qr-code-encoder
lesson: 22
title: Interleaving codewords
overview: 'When a symbol has several blocks, their codewords are woven together column by column so a burst of damage spreads across blocks instead of destroying one. Today you write that interleave, with Version 1 as the passthrough case.'
goal: 'Interleave data blocks then error-correction blocks column by column into one sequence.'
spec:
  scenario: 'Blocks interleave into the final order'
  status: failing
  lines:
    - kw: Given
      text: 'data blocks [[1, 2, 3], [4, 5, 6]] and their error-correction blocks [[7, 8], [9, 10]]'
    - kw: When
      text: 'they are interleaved: first the data column by column, then the error correction column by column'
    - kw: Then
      text: 'the result is [1, 4, 2, 5, 3, 6, 7, 9, 8, 10]'
    - kw: And
      text: 'the single-block Version 1 case interleaves [[helloData]] with [[helloEC]] to give data followed by EC unchanged - the same 26-codeword sequence as before'
code:
  lang: go
  source: |
    // Take one codeword from each block per column, data first
    // (all columns), then EC (all columns).
    func interleave(cols [][]byte) []byte {
      var out []byte
      for c := 0; c < maxLen(cols); c++ {
        for _, b := range cols {
          if c < len(b) {
            out = append(out, b[c])
          }
        }
      }
      return out
    }
    // final = interleave(dataBlocks) ++ interleave(ecBlocks)
checkpoint: 'Codewords interleave into their final placement order. Commit and stop here.'
---

Reed-Solomon can repair a limited number of bad codewords **per block**, so the layout tries to keep damage from piling up in any one block. It does this by **interleaving**: instead of writing block 0 entirely, then block 1, it takes the first codeword of every block, then the second of every block, and so on - column by column. A scratch that wipes out a run of adjacent codewords in the symbol then lands one codeword on each block, well within every block's recovery limit. Data codewords are interleaved first, then error-correction codewords the same way.

With two data blocks `[[1,2,3],[4,5,6]]`, the columns are `1,4` then `2,5` then `3,6`, giving `1,4,2,5,3,6`; the EC blocks follow as `7,9,8,10`. For Version 1 there is a single block, so every "column" has one entry and interleaving is a **passthrough** - you get the same data-then-EC sequence from the last lesson. Writing the general version now means the placement code you build next is fed the correct order for any version. That sequence, as a bitstream, is what fills the grid.
