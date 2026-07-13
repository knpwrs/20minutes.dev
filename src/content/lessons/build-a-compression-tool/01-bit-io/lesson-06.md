---
project: build-a-compression-tool
lesson: 6
title: Byte alignment and a length field
overview: Headers are counted in bytes, payloads in bits, so the two need a clean seam. Today you add byte alignment plus a big-endian 32-bit field - the primitive every container header uses to record an original length.
goal: Add Align plus WriteUint32 and ReadUint32, and round-trip a length field written after some bits.
spec:
  scenario: A uint32 written after a byte boundary reads back exactly
  status: failing
  lines:
    - kw: Given
      text: 'a new bit writer'
    - kw: When
      text: 'the bits 1, 0, 1 are written, then Align is called, then WriteUint32(0x01020304), then Flush'
    - kw: Then
      text: 'the output is exactly five bytes 0xA0, 0x01, 0x02, 0x03, 0x04'
    - kw: And
      text: 'a reader that reads three bits, calls Align, then ReadUint32 returns 1, 0, 1 and 0x01020304'
code:
  lang: go
  source: |
    // Align finishes the current byte so the next write starts clean
    func (w *BitWriter) Align() { if w.nbit > 0 { w.out = append(w.out, w.cur); w.cur = 0; w.nbit = 0 } }
    // WriteUint32 assumes the stream is byte-aligned: call Align first.
    func (w *BitWriter) WriteUint32(v uint32) {
      w.out = append(w.out, byte(v>>24), byte(v>>16), byte(v>>8), byte(v)) // big-endian
    }
    // reader Align: if nbit>0, advance to the next byte and reset nbit
checkpoint: Bit streams and byte-aligned header fields coexist. Commit and stop here.
---

A compressed file is part header, part packed payload, and the header is easiest
to read as whole bytes. **Byte alignment** is the seam between the two: `Align`
finishes off any partially filled byte (padding it) so the next thing you write
starts on a byte boundary. After writing three bits, `Align` emits `0xA0`, and a
big-endian `WriteUint32(0x01020304)` appends `0x01, 0x02, 0x03, 0x04` right after.

The reader's `Align` is the mirror: if it is mid-byte, it skips the rest of that
byte before reading the next field. Big-endian order (most significant byte
first) matches the most-significant-first convention already used for bits, so the
whole stream reads left to right, high to low. This little pair - align, then a
32-bit field - is exactly what a container header needs to store the **original
length** of the data, so the decoder knows how many bytes to expect. With the bit
layer complete and reversible, the real codecs can begin.
