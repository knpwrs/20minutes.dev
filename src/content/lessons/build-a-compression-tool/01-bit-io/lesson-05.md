---
project: build-a-compression-tool
lesson: 5
title: Reading codes and the round trip
overview: With single bits reversible, you add the reader's ReadBits to pull a whole code back, including across a byte boundary, and prove the central invariant in miniature - what the writer packs, the reader unpacks unchanged.
goal: Add ReadBits(width) and show that writing then reading a list of codes returns them unchanged.
spec:
  scenario: A code list survives a write-then-read round trip
  status: failing
  lines:
    - kw: Given
      text: 'a bit reader over the two bytes 0xAE, 0x80 from lesson 3'
    - kw: When
      text: 'ReadBits(6) then ReadBits(3) are called'
    - kw: Then
      text: 'they return 0x2B then 0x5, the two codes that were written'
    - kw: And
      text: 'for any list of (value, width) codes, writing them all and then reading them back with the same widths returns the identical values'
code:
  lang: go
  source: |
    // accumulate width bits, most significant first, mirroring WriteBits
    func (r *BitReader) ReadBits(width uint) uint {
      var v uint
      for i := uint(0); i < width; i++ {
        v = (v << 1) | r.ReadBit()
      }
      return v
    }
    // round trip: write codes -> Flush -> read same widths -> equal values
checkpoint: Multi-bit codes read back across byte boundaries; the bit layer round-trips. Commit and stop here.
---

`ReadBits(width)` is the inverse of `WriteBits`: it reads `width` bits high-first
and shifts them into a value, so reading 6 bits from `0xAE, 0x80` recovers `0x2B`
and the next 3 recover `0x5` - the very codes lesson 3 packed, boundary and all.
Because both sides agree on order and count, the leftover padding in that second
byte is simply never read.

This is the first appearance of the invariant the whole project is built on:
`read(write(x)) == x`. Here it is at its smallest - a list of fixed-width codes
in, the same list out - but every codec you build from now on ultimately rests on
this bit layer being exactly reversible. A good check is a list mixing several
widths that together cross many byte boundaries; if any code comes back wrong, the
packing or the padding is off by a bit.
