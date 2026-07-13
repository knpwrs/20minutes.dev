---
project: build-a-jpeg-codec
lesson: 21
title: Byte-stuffing
overview: A 0xFF byte inside the entropy stream is special - it might be stuffing or a real marker. Today you teach the bit reader that rule, the one detail that makes it correct on actual scan data.
goal: Make the bit reader treat 0xFF, 0x00 as a literal 0xFF byte and treat 0xFF followed by a non-zero as a marker that ends the scan.
spec:
  scenario: Handling stuffed bytes and markers
  status: failing
  lines:
    - kw: Given
      text: 'a bit reader over the bytes 0xFF, 0x00'
    - kw: When
      text: 8 bits are read
    - kw: Then
      text: 'the value is 255 - the stuffed 0x00 is discarded and the 0xFF is delivered as data'
    - kw: And
      text: 'over the bytes 0xFF, 0xD9 the reader reports the scan has ended at a marker rather than delivering data bits'
code:
  lang: go
  source: |
    // when the reader crosses into a 0xFF byte:
    //   next byte 0x00 -> it is a stuffed literal 0xFF; skip the 0x00
    //   next byte in 0xD0..0xD7 -> a restart marker (handled later)
    //   any other non-zero -> a real marker: the scan is over
    func (r *BitReader) nextByte() (b byte, end bool) { }
checkpoint: Your bit reader survives 0xFF bytes in the scan. Commit and stop here.
---

Because a marker is a `0xFF` followed by a non-zero code, the entropy stream cannot contain a bare `0xFF` that means "data" - a decoder scanning for the next marker would mistake it for one. JPEG solves this with **byte-stuffing**: whenever the encoder emits a `0xFF` data byte, it inserts a `0x00` right after it. So on decode, a `0xFF 0x00` pair delivers a single `0xFF` data byte and the `0x00` is thrown away. Read eight bits across `FF 00` and you get `255`, not two bytes' worth.

A `0xFF` followed by anything **non-zero** is a genuine marker. If it is `0xD0` through `0xD7` it is a restart marker, which you handle at the end of this chapter; anything else - most importantly `0xD9`, EOI - means the entropy data is finished and the reader must stop rather than hand out garbage bits. This one rule, folded into the byte-advance step of the reader, is what separates a toy bit reader from one that decodes real JPEGs.
