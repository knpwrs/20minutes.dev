---
project: build-a-png-codec
lesson: 30
title: 'Inflating a whole stream'
overview: The last inflate piece ties the block loop, all three block types, and the zlib envelope into one function. Today you decompress a complete zlib stream, exactly what a PNG's concatenated IDAT data is.
goal: Decompress a full zlib stream by stripping the header, looping over blocks until the final one, and applying the right decoder to each.
spec:
  scenario: Decompressing a complete zlib stream
  status: failing
  lines:
    - kw: Given
      text: 'the zlib stream 0x78,0x01,0x04,0xC0,0x81,0x00,0x00,0x00,0x00,0x83,0x30,0xD6,0x57,0xFE,0x0C,0xDF,0xB6,0x01,0xA8,0x56,0x3D,0x00,0x00,0xFF,0xFF,0x34,0x14,0x06,0x29'
    - kw: When
      text: it is decompressed
    - kw: Then
      text: 'the output is the 16 bytes "aaaabbbbccccdddd"'
    - kw: And
      text: 'the loop runs blocks until a block with the final flag set - here a dynamic block followed by an empty stored final block - and dispatches on block type'
code:
  lang: go
  source: |
    func Inflate(zlibStream []byte) []byte {
      parseZlib(zlibStream[:2])       // validate CMF/FLG (chapter 3)
      r := &BitReader{data: zlibStream[2:]} // deflate follows the 2 header bytes
      var out []byte
      for {
        final, btype := readBlockHeader(r)
        switch btype { /* 0 stored, 1 fixed, 2 dynamic */ }
        if final { break }
      }
      return out
    }
checkpoint: You have a complete inflate that decompresses any zlib stream your codec will meet. Commit and stop here.
---

This is the summit of the decoder. The **driver** strips the two zlib header bytes, then loops: read a block header, dispatch on `BTYPE` to the stored, fixed, or dynamic decoder you built, and stop after the block whose **BFINAL** flag is set. A real stream mixes types - the test vector is a dynamic block carrying the data followed by an empty stored block that just sets the final flag - and the loop handles both without caring which is which. The trailing four bytes are the Adler-32, which you can verify against `Adler32(out)` or, for now, simply stop before.

A PNG's image data is precisely this: the data sections of all its `IDAT` chunks **concatenated** into one zlib stream. So `Inflate` applied to that concatenation yields the raw, still-filtered scanline bytes - the input to the entire next chapter. From eight magic bytes you have reached real decompressed image data. Everything ahead is turning those bytes into pixels.
