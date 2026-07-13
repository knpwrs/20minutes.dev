---
project: build-a-png-codec
lesson: 47
title: A stored DEFLATE block
overview: The encoder needs to produce a DEFLATE stream, and the simplest valid one wraps raw bytes in a stored block. Today you emit that block, guaranteed to inflate back through the decoder you already built.
goal: Wrap raw bytes in a single final stored (type 0) DEFLATE block.
spec:
  scenario: Emitting a stored block
  status: failing
  lines:
    - kw: Given
      text: 'the two bytes "Hi" (0x48, 0x69) to compress'
    - kw: When
      text: they are wrapped in a final stored block
    - kw: Then
      text: 'the DEFLATE bytes are 0x01, 0x02, 0x00, 0xFD, 0xFF, 0x48, 0x69'
    - kw: And
      text: 'the header byte 0x01 sets BFINAL and stored type, LEN is 0x0002 and NLEN is 0xFFFD (little-endian), and feeding this to Inflate returns "Hi"'
code:
  lang: go
  source: |
    // header byte 0x01 = BFINAL(1) + BTYPE(00). Then LEN and NLEN as 2-byte
    // little-endian (NLEN = ^LEN), then the raw bytes verbatim.
    func storedBlock(data []byte) []byte { }
checkpoint: You can emit a stored DEFLATE block your own inflater reads back. Commit and stop here.
---

The encoder's easiest path to a valid DEFLATE stream is a **stored block**: no compression, just framing. Emit one header byte `0x01` - `BFINAL` set (this is the only, final block) and `BTYPE` 00 (stored) - then the 2-byte little-endian **LEN**, its complement **NLEN**, and the raw bytes. For `Hi` that is `01 02 00 FD FF 48 69`, and it is a closed loop: `Inflate` from chapter four turns it straight back into `Hi`.

This is honest and complete on its own - an encoder that only ever emits stored blocks produces perfectly valid PNGs, just uncompressed ones. It also gives you an end-to-end round trip *today*: pixels to scanlines to a stored block that your decoder inflates back. For real files longer than 65535 bytes you would split into multiple stored blocks (each LEN maxes at that), but the mechanism is identical. Actual compression - a fixed-Huffman block that shrinks the data - comes shortly; the stored block is the reliable floor beneath it.
