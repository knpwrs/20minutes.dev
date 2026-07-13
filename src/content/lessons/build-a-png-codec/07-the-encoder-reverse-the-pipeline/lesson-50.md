---
project: build-a-png-codec
lesson: 50
title: 'Assembling a valid PNG'
overview: Every encoder piece is built; today they combine into one Encode that writes a complete, valid PNG file - signature, IHDR, a compressed IDAT, and IEND - that your decoder and any other reads.
goal: Encode an image to a full PNG byte stream and confirm it decodes back to the same pixels.
spec:
  scenario: Encoding a whole PNG
  status: failing
  lines:
    - kw: Given
      text: 'a 2-by-1 RGBA image with pixels 255,0,0,255 and 0,255,0,255'
    - kw: When
      text: it is encoded and the resulting bytes are decoded again
    - kw: Then
      text: 'the decoded image is 2 by 1 with the same two pixels 255,0,0,255 and 0,255,0,255'
    - kw: And
      text: 'the output starts with the PNG signature and its chunks in order are IHDR, IDAT, IEND, each with a valid CRC'
code:
  lang: go
  source: |
    func Encode(im *Image) []byte {
      scan := toScanlines(im)               // filtered scanlines
      idat := zlibWrap(fixedBlock(scan), scan) // compress + zlib envelope
      out := append([]byte{}, Signature...)
      out = append(out, writeIHDR(im.Width, im.Height, 8, 6)...)
      out = append(out, writeChunk("IDAT", idat)...)
      return append(out, writeChunk("IEND", nil)...)
    }
checkpoint: You can encode an image into a valid, round-tripping PNG. Commit and stop here.
---

This is the encoder's payoff. `Encode` chains everything: pixels become **filtered scanlines**, those are **compressed** into a deflate block and **wrapped in zlib**, and the result is written as an **IDAT** chunk between a leading **IHDR** and a trailing **IEND**, all behind the **signature**. Because every stage is the exact inverse of a decoder stage - filter mirrors unfilter, deflate mirrors inflate, chunk-write mirrors chunk-read - the output is a real PNG. The proof is the round trip: encode the image, decode those bytes, and get the same pixels.

And it is not just *your* decoder that reads it - the CRCs, the zlib envelope, and the chunk structure are all standard, so any PNG viewer opens the file too. That interoperability is the whole point of building to the spec rather than a private format. You now have a complete codec: a full-featured decoder and a valid, if basic, encoder. The capstone brings them together on a real embedded image and proves the loop closes.
