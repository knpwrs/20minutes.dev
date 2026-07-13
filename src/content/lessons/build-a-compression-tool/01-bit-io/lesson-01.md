---
project: build-a-compression-tool
lesson: 1
title: A bit writer, most significant bit first
overview: Every compressor speaks in bits, not bytes, because its codes are rarely a whole number of bytes long. Today you build the substrate everything else needs - a bit writer that packs individual bits into bytes, high bit first, and pads the last byte when you flush.
goal: Build a bit writer that accepts single bits and packs them into bytes, most significant bit first.
spec:
  scenario: Three bits pack into one padded byte
  status: failing
  lines:
    - kw: Given
      text: 'a new bit writer'
    - kw: When
      text: 'the bits 1, 0, 1 are written and the writer is flushed'
    - kw: Then
      text: 'the output is a single byte 0xA0 (binary 10100000)'
    - kw: And
      text: 'the three bits occupy the top three bit positions and the remaining five are zero padding'
code:
  lang: go
  source: |
    // fill each byte from the top bit (0x80) downward
    type BitWriter struct {
      out  []byte
      cur  byte // byte being filled
      nbit uint // bits used in cur, 0..7
    }
    func (w *BitWriter) WriteBit(b uint) {
      w.cur |= byte(b&1) << (7 - w.nbit) // place at the next high position
      w.nbit++
      // when nbit reaches 8, append cur and reset (left as an exercise)
    }
checkpoint: You can write individual bits and flush them into a padded byte. Commit and stop here.
---

A compressor's whole job is to spend fewer bits on common things, so it must be
able to emit codes that are not a whole number of bits: a 3-bit code here, a
7-bit code there. Bytes are the wrong unit. The fix is a **bit writer** that
accepts bits one at a time and packs them into bytes for you.

We pack **most significant bit first**: the first bit you write lands in the top
position of the byte (the `0x80` place), the next just below it, and so on. So
writing `1, 0, 1` builds the byte `10100000`, which is `0xA0`. When you
**flush**, any partially filled byte is emitted as-is, with the unused low bits
left as zero **padding**. That padding is harmless as long as the reader knows
how many real bits to expect, which is exactly what later lessons arrange. Pick a
bit order and state it plainly; the only rule is that the reader must use the
same one.
