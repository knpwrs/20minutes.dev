---
project: build-a-jpeg-codec
lesson: 20
title: An MSB-first bit reader
overview: The entropy stream is read as a stream of bits, most significant bit first. Today you build the bit reader that serves those bits, the workhorse under every symbol you will decode.
goal: Build a bit reader that returns bits from a byte slice most-significant-bit first.
spec:
  scenario: Reading bits MSB-first
  status: failing
  lines:
    - kw: Given
      text: 'a bit reader over the single byte 0xB4 (binary 1011 0100)'
    - kw: When
      text: 3 bits are read, then 5 more
    - kw: Then
      text: 'the first read yields the value 5 (bits 101) and the second yields 20 (bits 10100)'
    - kw: And
      text: 'bits come out most-significant first, so the very first bit read is 1'
code:
  lang: go
  source: |
    // serve bits from the top of each byte downward.
    type BitReader struct{ data []byte; pos, bit int }
    func (r *BitReader) ReadBit() int {
      b := r.data[r.pos]
      v := int(b>>(7-r.bit)) & 1
      // advance r.bit; when it hits 8, move to the next byte
      return v
    }
    func (r *BitReader) ReadBits(n int) int { /* accumulate MSB-first */ }
checkpoint: You can pull bits from the entropy stream MSB-first. Commit and stop here.
---

Unlike DEFLATE, which reads bits least-significant first, JPEG reads its entropy stream **most-significant bit first**: the top bit of each byte comes out before the bits below it, and bytes are consumed left to right. Reading three bits from `0xB4` (`1011 0100`) therefore takes the top three bits `101`, which is 5; the next five bits `10100` are 20. Accumulating `n` bits is a loop that shifts your accumulator left and drops in each new bit.

This reader is the single most-used piece of the decoder - every Huffman symbol and every magnitude value is pulled through it. Keep it minimal today: just bytes in, bits out, MSB-first. It is missing one crucial rule that makes it correct on real scan data, the handling of `0xFF` bytes, and that is precisely the next lesson. Build the plain reader first so that rule has something to slot into.
