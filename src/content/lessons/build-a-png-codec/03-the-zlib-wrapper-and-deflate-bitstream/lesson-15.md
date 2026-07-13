---
project: build-a-png-codec
lesson: 15
title: A least-significant-bit-first bit reader
overview: DEFLATE is a bitstream, not a bytestream, and it packs bits least-significant-first. Today you build the bit reader that every later inflate step pulls from, one bit at a time.
goal: Read individual bits from a byte buffer in DEFLATE order - the low bit of each byte first.
spec:
  scenario: Reading bits low-bit-first
  status: failing
  lines:
    - kw: Given
      text: 'a bit reader over the single byte 0xB4'
    - kw: When
      text: eight bits are read one at a time
    - kw: Then
      text: 'they come out in the order 0, 0, 1, 0, 1, 1, 0, 1'
    - kw: And
      text: 'that is the byte 0xB4 read from its least significant bit to its most significant bit'
code:
  lang: go
  source: |
    type BitReader struct { data []byte; bytePos int; bitPos uint }
    func (r *BitReader) ReadBit() uint32 {
      bit := (uint32(r.data[r.bytePos]) >> r.bitPos) & 1
      r.bitPos++
      if r.bitPos == 8 { r.bitPos = 0; r.bytePos++ }
      return bit
    }
checkpoint: You can pull DEFLATE bits off a buffer in the correct low-bit-first order. Commit and stop here.
---

DEFLATE is read as a stream of **bits**, and the packing rule is the one thing to internalize: within each byte, the **least significant bit comes first**. So the byte `0xB4` (binary `1011_0100`) is read as `0, 0, 1, 0, 1, 1, 0, 1` - bit 0, then bit 1, and so on up to bit 7 - and only then does the reader move to the next byte. Getting this order backwards is the single most common way a from-scratch inflater produces garbage.

The reader is tiny: a byte position, a bit position within that byte, and a `ReadBit` that returns one bit and advances. Everything in the inflate core - block headers, Huffman codes, extra bits, stored-block padding - pulls from this one primitive. Build it small and correct now, because you will call it thousands of times per image and never think about it again.
