---
project: build-a-png-codec
lesson: 6
title: The IHDR fields
overview: IHDR is the first chunk of every PNG and it declares the image's shape. Today you parse its thirteen data bytes into width, height, and the four one-byte fields that decide how every pixel is stored.
goal: Parse the 13-byte IHDR data section into its seven fields.
spec:
  scenario: Reading the image header
  status: failing
  lines:
    - kw: Given
      text: 'IHDR data bytes 0x00,0x00,0x00,0x08, 0x00,0x00,0x00,0x04, 0x08, 0x06, 0x00, 0x00, 0x00'
    - kw: When
      text: the header is parsed
    - kw: Then
      text: 'width is 8, height is 4, bit depth is 8, and color type is 6'
    - kw: And
      text: 'compression method, filter method, and interlace method are all 0'
code:
  lang: go
  source: |
    type IHDR struct {
      Width, Height              uint32
      BitDepth, ColorType        uint8
      Compression, Filter, Interlace uint8
    }
    // layout: width:4, height:4, then five single bytes
    func parseIHDR(data []byte) IHDR { /* big-endian width/height, then bytes */ }
checkpoint: You can read an image's dimensions and storage format from IHDR. Commit and stop here.
---

**IHDR** is exactly thirteen bytes and it sets the terms for everything that follows: a 4-byte **width**, a 4-byte **height**, then five single bytes - **bit depth**, **color type**, **compression method**, **filter method**, and **interlace method**. Width and height are big-endian like every PNG integer. The color type (here `6`, truecolor with alpha) and bit depth (`8`) together decide how many bytes each pixel takes, which the whole decoding pipeline downstream depends on.

The last three bytes are nearly always zero and the spec only defines those values: compression method `0` (the zlib/DEFLATE stream you will build), filter method `0` (the five filters in chapter five), and interlace `0` (no interlacing) or `1` (Adam7). Parse all seven fields now; validating that the combination is one you support is the next step, once the fields exist to check.
