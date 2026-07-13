---
project: build-a-jpeg-codec
lesson: 47
title: Encoding AC coefficients
overview: The AC coefficients are run-length coded - counting zero runs, emitting a run-and-size symbol plus magnitude bits, and closing with end-of-block. Today you build that, mirroring the AC decode.
goal: Run-length encode a block's AC coefficients into run-and-size Huffman symbols with magnitude bits, ending with end-of-block.
spec:
  scenario: Run-length encoding AC coefficients
  status: failing
  lines:
    - kw: Given
      text: 'a zig-zag block whose only nonzero AC coefficient is 3 at index 1, the rest zero'
    - kw: When
      text: the AC coefficients are encoded
    - kw: Then
      text: 'the encoder emits the AC symbol 0x02 (run 0, size 2) then the 2 magnitude bits 0b11, then the end-of-block symbol 0x00'
    - kw: And
      text: 'a run of more than 15 zeros before a coefficient is emitted as one or more ZRL symbols (0xF0, sixteen zeros) before the run-and-size symbol'
code:
  lang: go
  source: |
    // walk indices 1..63, counting a running zero-run:
    //   nonzero coef: while run>15 { emit ZRL 0xF0; run -= 16 }
    //                 cat,bits := encodeMagnitude(coef)
    //                 emit acTable.code((run<<4)|cat); emit bits; run = 0
    // after the last nonzero: if any zeros remain, emit EOB 0x00.
    func encodeAC(w *BitWriter, seq [64]int, t *HuffTable) { }
checkpoint: You can run-length encode a block's AC coefficients. Commit and stop here.
---

AC encoding is the mirror of the AC decode loop. The encoder walks the zig-zag coefficients from index 1, counting a running **zero-run**. When it hits a nonzero coefficient it forms the symbol `(run << 4) | size`, emits its **Huffman code** from the AC table, then the coefficient's magnitude bits, and resets the run. A single coefficient of 3 at index 1 has run 0 and size 2, giving symbol `0x02`, bits `11`.

Two special cases mirror the decoder's. If the running zero-run exceeds 15 before the next nonzero coefficient, the encoder emits **ZRL** (`0xF0`, sixteen zeros) as many times as needed to whittle the run below 16, then the real symbol. And if the block ends in a tail of zeros - which it almost always does after quantization - the encoder emits a single **end-of-block** symbol (`0x00`) instead of coding all those zeros. EOB is what makes AC coding compact; skipping it would bloat every block. With DC and AC coding done, the last piece is the bit writer that packs these symbols and bits into bytes.
