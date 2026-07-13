---
project: build-a-png-codec
lesson: 8
title: One byte through the CRC polynomial
overview: PNG guards every chunk with a CRC32, and the whole algorithm is built from one small step - pushing a single byte through the reversed polynomial. Today you write that step and pin its output exactly.
goal: Compute the CRC32 remainder for a single byte value by running it through eight shifts of the reversed polynomial.
spec:
  scenario: The per-byte CRC transform
  status: failing
  lines:
    - kw: Given
      text: 'the reversed CRC32 polynomial 0xEDB88320'
    - kw: When
      text: 'the byte value 1 is run through eight rounds of "shift right one bit, and XOR the polynomial whenever the bit shifted out was 1"'
    - kw: Then
      text: 'the result is 0x77073096'
    - kw: And
      text: 'running the byte value 0 through the same eight rounds gives 0x00000000'
code:
  lang: go
  source: |
    // start c at the byte value, do this 8 times:
    //   if c has its low bit set: c = 0xEDB88320 ^ (c >> 1)
    //   else:                     c = c >> 1
    func crcByte(n uint32) uint32 { /* 8 rounds, return c */ }
checkpoint: You can push one byte through the CRC polynomial and get the exact remainder. Commit and stop here.
---

A **CRC32** treats your data as one enormous binary number and takes its remainder modulo a fixed **generator polynomial**. PNG uses the standard IEEE polynomial, but in its **reversed** bit form `0xEDB88320`, because processing bits least-significant-first is cheaper. The entire checksum reduces to one primitive: take a value, and eight times over, shift it right by one bit and XOR in the polynomial whenever the bit that fell off was a `1`.

That is the whole trick, and everything else is bookkeeping around it. Run byte `1` through the eight rounds and you must land on exactly `0x77073096` - a value you will see again next lesson as the second entry of the lookup table. Getting this single step right, down to the exact hex, is what makes every chunk check that follows trustworthy, so pin it before building anything on top.
