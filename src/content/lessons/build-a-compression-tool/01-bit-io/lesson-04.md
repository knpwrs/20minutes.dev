---
project: build-a-compression-tool
lesson: 4
title: A bit reader, most significant bit first
overview: Compression is only useful if it reverses, so the writer needs a mirror. Today you build a bit reader that pulls bits out of a byte slice in the same high-first order the writer put them in.
goal: Build a bit reader that returns single bits from a byte slice, most significant bit first.
spec:
  scenario: Reading the top bits back out
  status: failing
  lines:
    - kw: Given
      text: 'a bit reader over the single byte 0xA0 (binary 10100000)'
    - kw: When
      text: 'ReadBit is called three times'
    - kw: Then
      text: 'it returns 1, then 0, then 1'
    - kw: And
      text: 'those are the same three bits lesson 1 wrote before padding'
code:
  lang: go
  source: |
    // read from the top bit of the current byte downward, mirroring the writer
    type BitReader struct {
      in   []byte
      pos  int  // index of current byte
      nbit uint // bits consumed from in[pos], 0..7
    }
    func (r *BitReader) ReadBit() uint {
      b := (r.in[r.pos] >> (7 - r.nbit)) & 1
      r.nbit++
      if r.nbit == 8 { r.pos++; r.nbit = 0 }
      return uint(b)
    }
checkpoint: You can read bits back in the order they were written. Commit and stop here.
---

A writer with no reader compresses nothing you can get back. The **bit reader** is
the writer's mirror image: it must consume bits in exactly the order they were
laid down, which for us is **most significant first**. Reading the byte `0xA0`
(`10100000`) one bit at a time gives `1`, `0`, `1`, and then the padding zeros -
precisely the bits lesson 1 wrote.

The mechanics mirror the writer exactly. Track the current byte index and how many
bits you have consumed from it; each read pulls the bit at position `7 - nbit`,
then advances, rolling to the next byte after the eighth. Get the order wrong here
and every code decodes to garbage, so keeping reader and writer symmetric is the
whole discipline. The padding bits at the end are still present in the byte slice;
the reader simply stops before them because it knows how many real bits to expect.
