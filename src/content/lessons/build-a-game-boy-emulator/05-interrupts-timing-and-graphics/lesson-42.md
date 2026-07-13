---
project: build-a-game-boy-emulator
lesson: 42
title: Decoding a tile
overview: Today you decode the Game Boy's packed 2bpp tile format, combining a low and high bit-plane byte into eight pixel color indices. Getting this decoding right is the key to turning raw video RAM bytes into anything resembling a picture.
goal: Decode one row of a tile from its two bit-plane bytes into eight pixel color indices.
spec:
  scenario: Combining two bit planes into pixels
  status: failing
  lines:
    - kw: Given
      text: a tile row whose low byte is 0x80 and high byte is 0x00
    - kw: When
      text: the row is decoded into eight pixels (leftmost first)
    - kw: Then
      text: pixel 0 is color index 1 and pixels 1 through 7 are index 0
    - kw: And
      text: if both bytes are 0xFF instead, every pixel is index 3
code:
  lang: go
  source: |
    // Decode two bytes into 8 pixels. Two gotchas to get right:
    //   - bit 7 is the LEFTMOST pixel (pixel i reads bit 7-i)
    //   - each pixel's 2-bit id combines both planes: the LOW byte supplies the
    //     low bit, the HIGH byte the high bit -> id = highBit<<1 | lowBit (0..3)
    func decodeRow(lo, hi uint8) [8]uint8 {
        // ...loop i = 0..7, pull bit (7-i) from each byte, combine
    }
reading: 'The 2bpp tile format - 16 bytes per 8x8 tile, two interleaved bit planes.'
checkpoint: A tile row now decodes into four-color pixel indices. Commit and stop here.
---

Graphics are built from **tiles**: 8×8 pixel squares stored in video RAM. Each
pixel is 2 bits, giving four possible **color indices** (0–3), and the encoding
is the part that surprises everyone. A tile is 16 bytes - 2 per row - stored as
**two bit planes**. For each pixel, one bit comes from the low byte and one from
the high byte; combine them as `high<<1 | low` to get the index.

The **leftmost** pixel is **bit 7**, not bit 0, so you walk the bits from high to
low. Low byte `0x80` alone lights bit 7 with index 1; both bytes `0xFF` give
every pixel index 3. This packed format is why copying graphics is
byte-efficient and why naively reading tile memory looks like garbage. Decode one
row correctly and a whole tile is just eight rows of the same.
