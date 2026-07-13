---
project: build-a-compression-tool
lesson: 2
title: Writing a fixed-width code
overview: Writing bits one at a time is tedious; codes come in fixed widths. Today you add a helper that writes the low N bits of a value in one call, still most significant bit first, so a Huffman or length code is a single operation later.
goal: Add WriteBits(value, width) that writes the low width bits of value, most significant first.
spec:
  scenario: A three-bit code packs high first
  status: failing
  lines:
    - kw: Given
      text: 'a new bit writer'
    - kw: When
      text: 'WriteBits(6, 3) is called (6 is binary 110) and the writer is flushed'
    - kw: Then
      text: 'the output is a single byte 0xC0 (binary 11000000)'
    - kw: And
      text: 'the bits appear in order 1, 1, 0 from the top of the byte'
code:
  lang: go
  source: |
    // walk the chosen bits from the highest down to bit 0
    func (w *BitWriter) WriteBits(value uint, width uint) {
      for i := int(width) - 1; i >= 0; i-- {
        w.WriteBit((value >> uint(i)) & 1)
      }
    }
    // WriteBits(6, 3): i=2 -> bit1, i=1 -> bit1, i=0 -> bit0  => 1,1,0
checkpoint: You can write a whole fixed-width code in one call. Commit and stop here.
---

A code is a value plus a **width**: the Huffman code for a symbol might be the
value `6` written in `3` bits, `110`. Writing it bit by bit works but reads
badly, so wrap it once. `WriteBits(value, width)` emits the low `width` bits of
`value`, **most significant first** - the same order as `WriteBit`, so the two
compose cleanly.

The direction matters. To write high bit first you loop from bit `width-1` down
to bit `0`, shifting each into place and calling `WriteBit`. `WriteBits(6, 3)`
sends `1`, then `1`, then `0`, giving `11000000` once flushed, which is `0xC0`.
Only the low `width` bits are used; any higher bits of `value` are ignored, so a
3-bit code and a value like `6` fit exactly.
