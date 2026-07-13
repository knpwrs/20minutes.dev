---
project: build-a-compression-tool
lesson: 3
title: Crossing a byte boundary
overview: Real codes do not line up with bytes - a 6-bit code followed by a 3-bit code spills into a second byte. Today you pin exactly how bits flow across the boundary and how the unfinished final byte is padded, the one place bit packing most often goes wrong.
goal: Write two codes whose total width exceeds eight bits and confirm the exact packed bytes.
spec:
  scenario: Nine bits pack into two bytes with a padded tail
  status: failing
  lines:
    - kw: Given
      text: 'a new bit writer'
    - kw: When
      text: 'WriteBits(0x2B, 6) then WriteBits(0x5, 3) are written and the writer is flushed'
    - kw: Then
      text: 'the output is exactly two bytes 0xAE, 0x80'
    - kw: And
      text: 'the first byte holds bits 101011 then the top two bits 10 of the second code, and the ninth bit 1 sits at the top of the second byte with the low seven bits zero-padded'
code:
  lang: go
  source: |
    // when cur fills up mid-code, emit it and keep going into the next byte
    func (w *BitWriter) WriteBit(b uint) {
      w.cur |= byte(b&1) << (7 - w.nbit)
      w.nbit++
      if w.nbit == 8 { w.out = append(w.out, w.cur); w.cur = 0; w.nbit = 0 }
    }
    func (w *BitWriter) Flush() { if w.nbit > 0 { w.out = append(w.out, w.cur); w.cur = 0; w.nbit = 0 } }
checkpoint: Codes now flow across byte boundaries and the final byte is padded. Commit and stop here.
---

The moment codes stop being 8 bits wide, they stop respecting byte edges. Write a
6-bit code and a 3-bit code and you have 9 bits, which is one full byte plus one
leftover bit. `0x2B` in 6 bits is `101011`; `0x5` in 3 bits is `101`. Laid end to
end that is `101011 101`, and the writer fills the first byte with the first eight
of those - `10101110`, which is `0xAE` - then starts a fresh byte with the ninth
bit, `1`, at the top: `10000000`, which is `0x80` after **flush** zero-pads the
rest.

This boundary case is where bit packing quietly breaks: an off-by-one in the fill
position, or forgetting to emit the full byte the instant it fills, corrupts
every code after it. Pin the exact two bytes now so the reader in the next lessons
has a known-good target. The padding in that final byte is not data; only the
bits you actually wrote count, and the reader will be told how many that is.
