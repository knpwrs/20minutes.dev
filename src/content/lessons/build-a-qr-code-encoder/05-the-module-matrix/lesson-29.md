---
project: build-a-qr-code-encoder
lesson: 29
title: Placing the data bits
overview: 'Now the codewords become modules: walk the zigzag path and write one bit per module, most-significant-bit first. Today you fill the grid with the HELLO WORLD codeword bitstream.'
goal: 'Write the codeword bitstream along the placement path, dark for 1 and light for 0.'
spec:
  scenario: 'Codeword bits fill the grid'
  status: failing
  lines:
    - kw: Given
      text: 'the 26-codeword sequence as 208 bits (most-significant-bit first) and the zigzag path'
    - kw: When
      text: 'each bit is written to the next path module, 1 as dark and 0 as light'
    - kw: Then
      text: 'the first codeword 0x20 (00100000) fills the first eight path modules so that only (19,20) is dark and the other seven are light'
    - kw: And
      text: 'all 208 bits are placed, leaving no placeable module unset (the bitstream length exactly matches the path length)'
code:
  lang: go
  source: |
    bits := toBits(codewords) // 208 bits, MSB first
    for i, cell := range path {
      g.set(cell.row, cell.col, int8(bits[i]))
    }
checkpoint: 'The data and error-correction codewords are laid into the grid. Commit and stop here.'
---

Placement is the moment the abstract codewords become a picture. Take the interleaved codeword sequence, expand it to **bits** (most-significant-bit first, 208 of them for Version 1), and walk the zigzag path from the last lesson, writing one bit per module: a `1` is a **dark** module, a `0` is **light**. Because the path length and the bit count are both 208, they line up exactly - every placeable module gets a bit and every bit gets a module.

Trace the very first codeword, `0x20` = `00100000`, across the first eight path cells `(20,20), (20,19), (19,20), (19,19), (18,20), (18,19), (17,20), (17,19)`: only the third bit is `1`, so only `(19,20)` is dark. This is the raw, **unmasked** data pattern. It is already a complete grid, but it is not yet a good QR code: long runs and awkward clumps may confuse a scanner. Fixing that is the job of masking, the final chapter - but first, one lesson to actually see what you have built.
