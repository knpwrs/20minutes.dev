---
project: build-a-png-codec
lesson: 2
title: A chunk's length and type
overview: After the signature, a PNG is a flat sequence of chunks, each introduced by a four-byte length and a four-byte type. Today you read that eight-byte header so the decoder can find where each chunk starts and how big it is.
goal: Read a chunk's big-endian length and four-character type from the bytes right after the signature.
spec:
  scenario: Parsing a chunk header
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52 at the start of a chunk'
    - kw: When
      text: the chunk header is read
    - kw: Then
      text: 'the length is 13 and the type string is "IHDR"'
    - kw: And
      text: 'the four length bytes are read most-significant byte first (big-endian)'
code:
  lang: go
  source: |
    // length is a 4-byte big-endian unsigned int; type is 4 ASCII bytes
    func readHeader(b []byte) (length uint32, typ string) {
      length = uint32(b[0])<<24 | uint32(b[1])<<16 | uint32(b[2])<<8 | uint32(b[3])
      typ = string(b[4:8])
    }
checkpoint: You can read a chunk's declared length and its four-letter type. Commit and stop here.
---

A PNG after its signature is nothing but a run of **chunks**, back to back, until the end. Each chunk starts with a fixed eight-byte header: a **4-byte length** giving the size of the chunk's data section, then a **4-byte type** code, four ASCII letters like `IHDR` or `IDAT` that say what the chunk is. The length counts only the data bytes - not the type, and not the CRC that follows the data.

The one thing to get right is byte order. PNG stores every multi-byte integer **big-endian**, most significant byte first, so `00 00 00 0D` is 13, not 0x0D000000. That convention holds for every integer in the format, so building the habit now - shift the first byte highest - pays off for every width, height, and CRC to come.
