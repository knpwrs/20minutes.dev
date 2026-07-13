---
project: build-a-qr-code-encoder
lesson: 12
title: A bitstream writer
overview: 'QR data is assembled bit by bit before it is grouped into bytes, so you need a small tool that appends a fixed number of bits and flushes to bytes. Today you build that bitstream writer - the scaffolding the rest of this chapter writes into.'
goal: 'Append fixed-width bit fields most-significant-bit first, and flush the buffer to bytes.'
spec:
  scenario: 'Bits accumulate and flush to bytes'
  status: failing
  lines:
    - kw: Given
      text: 'an empty bit writer'
    - kw: When
      text: 'writeBits(0b0010, 4) then writeBits(11, 9) are appended, most-significant-bit first'
    - kw: Then
      text: 'the buffer holds 13 bits in order (0010 then 000001011)'
    - kw: And
      text: 'toBytes() zero-pads up to the next byte boundary (16 bits) and returns [0x20, 0x58] (32 and 88)'
code:
  lang: go
  source: |
    // Append the low `n` bits of v, MSB first. Track a bit buffer;
    // toBytes flushes, zero-padding the final partial byte.
    type BitWriter struct{ bits []int }
    func (w *BitWriter) writeBits(v, n int) {
      for i := n - 1; i >= 0; i-- {
        w.bits = append(w.bits, (v>>i)&1)
      }
    }
    // toBytes packs 8 bits per byte, MSB first, zero-padding the tail.
checkpoint: 'You can accumulate bits and pack them into bytes. Commit and stop here.'
---

A QR data stream is built from **variable-width bit fields** - a 4-bit mode indicator, a 9-bit count, 11-bit character pairs - that only become bytes at the very end. Ordinary byte buffers cannot express "append exactly 4 bits", so the first job of this chapter is a tiny **bit writer**: append the low `n` bits of a value, most-significant-bit first, and later flush the whole buffer into bytes.

Most-significant-bit-first ordering matters: QR packs bits into bytes from the high bit down, so the first bit you write becomes bit 7 of byte 0. When you finally call `toBytes`, any leftover bits in the last partial byte are padded with zeros. Writing the 4-bit value `0b0010` then the 9-bit value `11` gives 13 bits; flushing pads to 16 and yields `[0x20, 0x58]`. That first byte `0x20` is `32` - and it is no accident it matches the first data codeword of HELLO WORLD, because those two fields are the start of its real header, which you assemble over the next few lessons.
