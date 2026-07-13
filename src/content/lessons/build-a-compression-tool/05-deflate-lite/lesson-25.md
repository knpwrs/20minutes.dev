---
project: build-a-compression-tool
lesson: 25
title: A self-describing container
overview: 'A compressed file must say what it is. Today you define the container - a magic number, a method byte, and the original length - and ship the simplest codec through it: stored, which just wraps the raw bytes. This is the public Compress and Decompress the whole tool is built around.'
goal: Wrap data in a container header with a stored (uncompressed) payload, and unwrap it.
spec:
  scenario: Stored data round-trips through the container
  status: failing
  lines:
    - kw: Given
      text: 'the input Hi (bytes 0x48, 0x69)'
    - kw: When
      text: 'Compress runs with the stored method'
    - kw: Then
      text: 'the output is 0x5A, 0x5A, 0x00, 0x00, 0x00, 0x00, 0x02, 0x48, 0x69'
    - kw: And
      text: 'Decompress of that output returns Hi'
code:
  lang: go
  source: |
    // header: magic 0x5A 0x5A, method byte, original length (uint32 big-endian)
    const magic0, magic1 = 0x5A, 0x5A
    const methodStored = 0x00
    // Compress (stored): magic, method, uint32(len(data)), then data verbatim
    // Decompress: check magic, read method + length, method 0x00 -> return payload
checkpoint: The public Compress and Decompress round-trip via a stored container. Commit and stop here.
---

Every real compressed format is **self-describing**: it opens with enough
metadata that a decoder can process it with no side channel. Ours is deliberately
small - two **magic** bytes `0x5A 0x5A` to identify the format, one **method**
byte to say how the payload is encoded, and a big-endian **uint32** for the
**original length** so the decoder knows how much data to expect. That seven-byte
header precedes every payload.

The first method is **stored** (`0x00`): no compression at all, just the raw bytes
after the header. It sounds pointless, but it is the honest floor - the fallback
for data that will not compress, so the tool never makes a file bigger than
necessary. `Compress` of `Hi` is the header (`0x5A 0x5A 0x00`, length
`0x00000002`) followed by `0x48 0x69`, and `Decompress` reads the method, sees
stored, and returns the payload. This pair, `Compress` and `Decompress`, is the
entire public surface of the tool; every following lesson makes the payload
smarter without changing this interface.
