---
project: build-a-png-codec
lesson: 44
title: The IHDR and IEND chunks
overview: Every PNG opens with an IHDR describing the image and closes with an empty IEND. Today you write both, plus the signature, framing the file the pixel data will sit inside.
goal: Write the signature, a serialized IHDR chunk for an image, and the closing IEND chunk.
spec:
  scenario: Framing a PNG file
  status: failing
  lines:
    - kw: Given
      text: 'a 2-by-2 image to encode as color type 6 at bit depth 8'
    - kw: When
      text: the IHDR chunk is written
    - kw: Then
      text: 'its 13-byte data is 0,0,0,2, 0,0,0,2, 8, 6, 0, 0, 0 and its serialized chunk carries the CRC 0x72B60D24'
    - kw: And
      text: 'the file begins with the 8-byte signature and the IEND chunk is 0x00,0x00,0x00,0x00 then "IEND" then 0xAE,0x42,0x60,0x82'
code:
  lang: go
  source: |
    // IHDR data: width:4, height:4 (big-endian), then bitDepth, colorType,
    // then 0,0,0 (compression, filter, interlace).
    // file so far = Signature ++ writeChunk("IHDR", ihdrData) ++ ... ++ writeChunk("IEND", nil)
    func writeIHDR(w, h, depth, colorType int) []byte { }
checkpoint: You can frame a PNG with a signature, IHDR, and IEND. Commit and stop here.
---

A PNG is bookended: the **8-byte signature**, then an **IHDR** chunk that declares the image's shape, and finally an empty **IEND** that marks the end. Writing IHDR is the mirror of parsing it - width and height as big-endian 4-byte integers, then the five single bytes for bit depth, color type, and the three method fields (all `0` for the standard deflate/filter/no-interlace case). For a 2x2 RGBA image the data is those thirteen bytes, and `writeChunk` wraps them with the length and the CRC `0x72B60D24`.

These are the fixed walls of the file; only the `IDAT` in the middle carries the actual picture, and that is the rest of the chapter. Writing the frame first means you always have a valid, if empty, container to drop compressed image data into - the same walking-skeleton discipline the decoder followed. With the signature, IHDR, and IEND writing correctly, the encoder's remaining job is to turn pixels into the bytes that go between them.
