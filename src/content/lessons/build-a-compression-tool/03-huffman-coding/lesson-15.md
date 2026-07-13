---
project: build-a-compression-tool
lesson: 15
title: Encoding a message with Huffman codes
overview: With canonical codes in hand, encoding is just look-up-and-write. Today you turn a message into a packed bit stream, reusing the bit writer from chapter one, and pin the exact compressed bytes.
goal: Encode a message by writing each symbol's canonical code to the bit writer.
spec:
  scenario: A message packs into three bytes
  status: failing
  lines:
    - kw: Given
      text: 'the message ABRACADABRA and the canonical codes A=0, B=100, C=101, D=110, R=111'
    - kw: When
      text: 'each symbol''s code is written to the bit writer in order and flushed'
    - kw: Then
      text: 'the packed output is exactly three bytes 0x4E, 0xAC, 0x9C'
    - kw: And
      text: 'the stream is 23 bits long, so the final byte carries one padding bit'
code:
  lang: go
  source: |
    // for each symbol, write its canonical code (value, width) to the BitWriter
    for _, sym := range message {
      c := codes[sym] // c.value, c.width
      bw.WriteBits(c.value, c.width)
    }
    bw.Flush()
    // A=0(1b) B=100(3b) R=111(3b) A=0 ... total 23 bits -> 3 bytes
checkpoint: A message compresses to a known-good packed bit stream. Commit and stop here.
---

Encoding is the easy half now that the pieces exist. Walk the message symbol by
symbol, look up each symbol's canonical code, and write it to the **bit writer**
from chapter one. Because the codes are a prefix code and the writer packs them
tightly, the bits run together with no separators and no waste.

`ABRACADABRA` with codes `A=0, B=100, R=111, C=101, D=110` becomes the bit string
`0 100 111 0 101 0 110 0 100 111 0` - `23` bits. Packed most-significant-first into
bytes that is `0x4E, 0xAC, 0x9C`, with the last byte holding one real bit and
seven of padding. This is genuine compression: eleven bytes of text became three
bytes of payload. Of course the decoder also needs the code lengths to rebuild the
codes, which is why the next lessons handle decoding and then the header that
carries those lengths - the payload alone is not yet a self-contained file.
