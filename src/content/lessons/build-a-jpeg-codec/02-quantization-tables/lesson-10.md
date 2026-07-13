---
project: build-a-jpeg-codec
lesson: 10
title: 16-bit quantization tables
overview: High-quality JPEGs may store quantization divisors that exceed 255, using two bytes each. Today you read a precision-1 table, the other DQT format, so your parser handles both.
goal: Read a precision-1 (16-bit) quantization table, where each of the 64 values is a two-byte big-endian number.
spec:
  scenario: Reading a 16-bit quant table
  status: failing
  lines:
    - kw: Given
      text: 'a precision-1 quant table whose first four bytes are 0x00, 0x10, 0x01, 0x2C'
    - kw: When
      text: the values are read
    - kw: Then
      text: 'entry 0 is 16 and entry 1 is 300'
    - kw: And
      text: 'the table consumes 128 bytes (64 values of 2 bytes each), twice the size of an 8-bit table'
code:
  lang: go
  source: |
    // for Pq==1, each value is 2 bytes big-endian: hi<<8 | lo.
    // 64 values -> 128 bytes consumed.
    func readQuant16(b []byte, pos int) (t QuantTable, next int) {
      // value = uint16(b[pos])<<8 | uint16(b[pos+1])
    }
checkpoint: Your parser reads both 8-bit and 16-bit quantization tables. Commit and stop here.
---

When a quantization divisor would not fit in a single byte - anything above 255, common in very high or very low quality settings - the table is stored at **precision 1**, with each of the 64 entries taking **two big-endian bytes**. So `00 10` is 16 and `01 2C` is 300. A precision-1 table therefore occupies 128 bytes rather than 64, and your DQT reader must branch on the precision nibble you split out two lessons ago to know which width to read.

That the value type is already a 16-bit integer means both formats land in the same table shape; only the reading loop differs. With this in place your quantization parsing is complete for both precisions, and the divisors are ready for the dequantize step - a plain multiply - that you will reach once the entropy decoder has produced coefficients to multiply.
