---
project: build-a-jpeg-codec
lesson: 52
title: 'Capstone: decoding a real JPEG'
overview: Time to run the whole decoder on a real file. Today you wire every decoder stage into one Decode call and turn an embedded baseline JPEG into pixels.
goal: Decode an embedded baseline JPEG through the complete pipeline and read its dimensions and sample pixels.
spec:
  scenario: Decoding an embedded JPEG end to end
  status: failing
  lines:
    - kw: Given
      text: 'an embedded baseline JPEG that encodes a solid mid-gray image (a small 4:2:0 file included in the test)'
    - kw: When
      text: it is decoded through the full pipeline
    - kw: Then
      text: 'the decoded image has the file''s declared width and height, and every sampled pixel is within 2 of (128, 128, 128) per channel'
    - kw: And
      text: 'because JPEG is lossy, the pixels are checked within a small per-channel tolerance rather than for exact equality'
code:
  lang: go
  source: |
    // Decode: walk markers -> parse DQT/DHT/SOF0 -> read SOS -> decode the
    //   entropy scan (MCUs of blocks) -> dequantize + un-zig-zag -> inverse
    //   DCT -> level shift -> upsample chroma -> YCbCr to RGB -> crop.
    // The embedded file is a valid baseline JPEG; assert dims + sample pixels.
    func Decode(b []byte) (*Image, error) { }
checkpoint: Your decoder turns a real baseline JPEG into pixels, end to end. Commit and stop here.
---

This is the decoder's finish line. `Decode` finally strings every chapter into one call: walk the **markers**, parse the **DQT**, **DHT**, and **SOF0** segments, read the **SOS** header, decode the **entropy scan** into blocks of coefficients, then **dequantize**, **inverse-DCT**, **level-shift**, **upsample** chroma, and **convert** YCbCr to RGB, cropping to the declared size. The embedded file is a genuine baseline JPEG, and it comes out as an image of the right dimensions whose pixels are a flat mid-gray.

Because JPEG is **lossy**, the check is a **tolerance**, not exact bytes: a solid-gray source survives the transform and quantization almost perfectly, so every pixel lands within a couple of levels of `(128,128,128)`, but pinning an exact value would be fragile. Every hard thing you built is exercised at once - the marker walk, the canonical Huffman decode with byte-stuffing, receive-and-extend, the run-length AC loop, the inverse DCT, and chroma upsampling - all cooperating to turn a real file into a picture. One capstone remains: proving the encoder closes the loop.
