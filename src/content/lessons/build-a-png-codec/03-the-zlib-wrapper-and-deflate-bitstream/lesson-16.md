---
project: build-a-png-codec
lesson: 16
title: Reading multi-bit values
overview: Most DEFLATE fields are several bits wide - lengths, distances, header counts. Today you read n bits at once as an integer, assembled in the same low-bit-first order, so higher lessons can ask for whole values.
goal: Read an n-bit unsigned integer from the bit reader, with the first bit read as the least significant.
spec:
  scenario: Reading a value of several bits
  status: failing
  lines:
    - kw: Given
      text: 'a bit reader positioned at the start of the byte 0xB4'
    - kw: When
      text: '3 bits are read as a value, then 5 more bits are read as a value'
    - kw: Then
      text: 'the first value is 4 and the second value is 22'
    - kw: And
      text: 'each value places its first-read bit in position 0, so the low bits of 0xB4 give 4 and the high bits give 22'
code:
  lang: go
  source: |
    func (r *BitReader) ReadBits(n uint) uint32 {
      var v uint32
      for i := uint(0); i < n; i++ {
        v |= r.ReadBit() << i   // first bit read -> bit 0
      }
      return v
    }
checkpoint: You can read multi-bit DEFLATE values in the correct order. Commit and stop here.
---

A single-bit reader is not enough; DEFLATE constantly reads small fixed-width numbers - a 2-bit block type, a 5-bit count, a handful of extra bits on a length. `ReadBits(n)` calls `ReadBit` n times and, keeping the low-bit-first rule, puts the **first bit read into position 0**, the second into position 1, and so on. So reading 3 bits from `0xB4` takes its low three bits (`100` in stream order) and assembles them as `4`, then reading 5 bits takes the remaining `10110` and assembles them as `22`.

This is where the ordering rule pays off concretely: the same bits, read low-first and placed low-first, reconstruct exactly the values the encoder wrote. Note that this scheme is used for the *numeric* fields; Huffman codes have their own bit order, which is the next thing you will meet. For now, `ReadBits` gives every fixed-width field in the format.
