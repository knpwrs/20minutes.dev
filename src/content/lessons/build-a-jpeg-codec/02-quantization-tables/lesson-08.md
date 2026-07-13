---
project: build-a-jpeg-codec
lesson: 8
title: Reading 64 quantization values
overview: An 8-bit quantization table is just 64 bytes, one divisor per frequency. Today you read them into a table, storing them in exactly the order the file gives them.
goal: Read 64 one-byte quantization values following an 8-bit DQT header into a 64-entry table.
spec:
  scenario: Reading the quant table values
  status: failing
  lines:
    - kw: Given
      text: 'a precision-0 quant table whose 64 bytes begin 16, 11, 12, 14, 12, 10, 16, 14 and end with a final byte of 99'
    - kw: When
      text: the 64 values are read
    - kw: Then
      text: 'entry 0 is 16, entry 1 is 11, entry 2 is 12, and entry 63 is 99'
    - kw: And
      text: 'exactly 64 bytes are consumed for the table'
code:
  lang: go
  source: |
    // for Pq==0, the table is 64 consecutive bytes, read in file order.
    // Keep them in this order for now; the order is "zig-zag", handled next.
    type QuantTable [64]uint16
    func readQuant8(b []byte, pos int) (t QuantTable, next int) { }
checkpoint: You can read an 8-bit quantization table's 64 values. Commit and stop here.
---

After the header byte, an 8-bit quantization table is simply **64 consecutive bytes**, each a divisor for one frequency coefficient. You read them straight into a 64-entry table and consume exactly 64 bytes. The values in a real luminance table start around `16` in the top-left (low frequencies, quantized gently) and climb toward `99` (high frequencies, quantized hard) - that spread is the heart of why JPEG compresses so well, because the eye barely notices the coarsely-stored high frequencies.

There is one subtlety you are deliberately postponing: these 64 values are **not** laid out row by row. They are stored in **zig-zag** order, the same diagonal scan the coefficients use, so entry 1 in the file is not the pixel-grid position to its right. For now, keep them in file order exactly as read; the next lesson builds the map that reorders them into a real 8-by-8 grid.
