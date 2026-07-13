---
project: build-a-video-container-parser
lesson: 3
title: The box header
overview: A box header is just the size and the type together - the first 8 bytes of every box. Today you combine yesterday's two readers into one Box value that records its size, its type, and how many bytes the header itself took.
goal: Parse the first 8 bytes of a box into a Box with Size, Type, and HeaderSize.
spec:
  scenario: An 8-byte header parses to size, type, and header length
  status: failing
  lines:
    - kw: Given
      text: 'the eight bytes 0x00 0x00 0x00 0x18 0x66 0x74 0x79 0x70'
    - kw: When
      text: 'the box header is parsed'
    - kw: Then
      text: 'Size is 24, Type is "ftyp", and HeaderSize is 8'
code:
  lang: go
  source: |
    type Box struct {
      Size       uint64 // total box length in bytes
      Type       string
      HeaderSize int    // bytes consumed by the header (8 for now)
    }
    func parseHeader(b []byte) Box {
      // reuse readU32 for the size and readType for the type
      // (fill in)
    }
checkpoint: You can parse a box header into a Box. Commit and stop here.
---

A **box header** is the size field followed immediately by the type field: eight
bytes total for a normal box. Bundling them into one `Box` value - `Size`, `Type`,
and a `HeaderSize` recording how many bytes the header consumed - gives you the
unit every later lesson works with. `HeaderSize` is `8` today, but it becomes
important the moment a box uses the 64-bit size form tomorrow.

Notice `Size` is a `uint64` even though we read a 32-bit value into it. That is
deliberate: the very next lesson introduces boxes whose real length does not fit in
32 bits, and widening now means the field never has to change type later.
