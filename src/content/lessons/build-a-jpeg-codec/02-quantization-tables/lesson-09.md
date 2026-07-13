---
project: build-a-jpeg-codec
lesson: 9
title: The zig-zag order
overview: JPEG stores the 64 coefficients of a block in a diagonal zig-zag, not row by row. Today you build the zig-zag map and a helper that scatters a 64-value sequence into an 8-by-8 grid - the reorder every table and block needs.
goal: Define the 64-entry zig-zag map and a helper that places a zig-zag-ordered sequence into an 8-by-8 grid in natural (row-major) order.
spec:
  scenario: Un-zig-zagging a sequence into a grid
  status: failing
  lines:
    - kw: Given
      text: 'the zig-zag map that sends sequence position k to a natural (row-major) index'
    - kw: When
      text: the map is inspected
    - kw: Then
      text: 'position 0 maps to natural index 0, position 1 maps to natural index 1, position 2 maps to natural index 8, and position 8 maps to natural index 17'
    - kw: And
      text: 'placing a sequence into the grid puts sequence value at position 8 into row 2, column 1 (natural index 17), and position 63 into natural index 63'
code:
  lang: go
  source: |
    // ZigZag[k] = natural row-major index (row*8+col) of the k-th coefficient.
    var ZigZag = [64]int{
      0, 1, 8,16, 9, 2, 3,10,
     17,24,32,25,18,11, 4, 5,
     12,19,26,33,40,48,41,34,
     27,20,13, 6, 7,14,21,28,
     35,42,49,56,57,50,43,36,
     29,22,15,23,30,37,44,51,
     58,59,52,45,38,31,39,46,
     53,60,61,54,47,55,62,63,
    }
    // out[ZigZag[k]] = seq[k]
    func unZigZag(seq [64]int) (grid [64]int) { }
checkpoint: You can reorder a zig-zag sequence into a natural 8-by-8 grid. Commit and stop here.
---

The 64 coefficients of an 8-by-8 block are transmitted in **zig-zag** order: start at the top-left DC coefficient, then sweep diagonally back and forth toward the bottom-right, so that low frequencies come first and high frequencies last. This grouping is what makes the long runs of zeros at the end of a block - the basis of the run-length coding you will build in the scan chapter. The cost is that a stored sequence is scrambled relative to the pixel grid, and every reader must unscramble it.

The map does that. `ZigZag[k]` gives the **natural** row-major index (`row*8 + col`) of the coefficient that arrives `k`-th in the stream. So sequence position 1 is natural index 1 (row 0, column 1, immediately right of DC), position 2 is natural index 8 (row 1, column 0, straight below DC), and position 8 is natural index 17 (row 2, column 1). To un-zig-zag, you scatter each sequence value to its mapped grid slot. You will use this exact map twice: to place quantization values, and to place decoded coefficients before the inverse DCT.
