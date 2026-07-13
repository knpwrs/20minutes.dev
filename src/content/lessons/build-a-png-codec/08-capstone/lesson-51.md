---
project: build-a-png-codec
lesson: 51
title: 'Capstone: decoding a real PNG'
overview: Time to run the whole decoder on a real file. Today you wire the full pipeline into one Decode and turn an embedded PNG into pixels, proving every stage from signature to color assembly works together.
goal: Decode a real embedded PNG through the complete pipeline and read its dimensions and pixels.
spec:
  scenario: Decoding an embedded PNG end to end
  status: failing
  lines:
    - kw: Given
      text: 'the 91-byte PNG in the hint - a 2-by-2 truecolor-with-alpha image'
    - kw: When
      text: it is decoded
    - kw: Then
      text: 'the image is 2 by 2, pixel (0,0) is 255,0,0,255 (red) and pixel (1,0) is 0,255,0,255 (green)'
    - kw: And
      text: 'pixel (0,1) is 0,0,255,255 (blue) and pixel (1,1) is 255,255,255,128 (white at half alpha)'
code:
  lang: go
  source: |
    // Decode: verify signature -> walk chunks -> parse IHDR -> concat IDAT data
    //   -> Inflate -> unfilter -> assemble -> Image.
    // hex of the test PNG (decode this to bytes and hand to Decode):
    // 89504e470d0a1a0a0000000d49484452000000020000000208060000
    // 0072b60d2400000022494441547801001200edff00ff0000ff00ff00
    // ff000000ffffffffff80010000ffff494909786e85b47a0000000049454e44ae426082
    func Decode(b []byte) (*Image, error) { }
checkpoint: Your decoder turns a real PNG into pixels, end to end. Commit and stop here.
---

This is the decoder's finish line. `Decode` finally strings together every chapter into one call: verify the **signature**, walk the **chunks**, read **IHDR**, concatenate all **IDAT** data into one zlib stream, **inflate** it, **unfilter** the scanlines, and **assemble** the raw bytes into RGBA pixels. The embedded 91-byte file is a genuine PNG - stored-block compressed, color type 6 - and it comes out as a 2x2 image whose four corners are red, green, blue, and a half-transparent white.

Every hard thing you built is exercised at once: the CRC-checked container, the from-scratch inflater with its bit reader and Huffman machinery, the filter reconstruction, and the color assembly. That the half-alpha white pixel `255,255,255,128` survives unpremultiplied proves the alpha path and the byte-exact plumbing all the way down. From eight magic bytes to a picture in memory, the decoder is complete and real. One capstone remains: proving the encoder closes the loop.
