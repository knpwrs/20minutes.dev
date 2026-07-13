---
project: build-a-jpeg-codec
lesson: 44
title: Forward zig-zag
overview: Entropy coding wants the coefficients in zig-zag order, so the encoder gathers the natural-order grid into the diagonal sequence. Today you build that forward zig-zag, the mirror of the decoder's scatter.
goal: Gather an 8-by-8 natural-order coefficient grid into a 64-entry zig-zag sequence.
spec:
  scenario: Zig-zag ordering a block
  status: failing
  lines:
    - kw: Given
      text: 'a natural-order coefficient grid and the zig-zag map'
    - kw: When
      text: the grid is gathered into zig-zag sequence
    - kw: Then
      text: 'sequence position 0 is grid natural index 0, and sequence position 1 is grid natural index 1'
    - kw: And
      text: 'sequence position 2 is grid natural index 8 (row 1, col 0), because the zig-zag map sends position 2 there'
code:
  lang: go
  source: |
    // gather is the inverse of the decoder's scatter:
    //   seq[k] = grid[ZigZag[k]]
    func zigzagOrder(grid [64]int) (seq [64]int) { }
checkpoint: You can order a block's coefficients in zig-zag sequence. Commit and stop here.
---

The entropy coder processes coefficients in **zig-zag** order so that low frequencies come first and the quantized-to-zero high frequencies bunch at the end, ready for run-length coding. So before coding, the encoder gathers its natural-order grid into the zig-zag sequence - the exact inverse of the scatter the decoder did with the same `ZigZag` map. Where the decoder wrote `grid[ZigZag[k]] = seq[k]`, the encoder reads `seq[k] = grid[ZigZag[k]]`.

The map guarantees the two directions agree: sequence position 1 comes from natural index 1 (just right of DC), and position 2 comes from natural index 8 (just below DC), following the diagonal sweep. Reusing the single shared map for both encode and decode is what keeps them consistent - any mismatch here would scramble every block. With the coefficients in sequence, the encoder can split off the DC and run-length code the ACs, which are the next lessons.
