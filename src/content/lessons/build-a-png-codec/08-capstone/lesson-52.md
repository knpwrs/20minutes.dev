---
project: build-a-png-codec
lesson: 52
title: 'Capstone: the round trip'
overview: The final lesson closes the loop - encode a generated image, then decode it back and prove the pixels survive and the bytes are a structurally valid PNG. This is the whole codec working as one.
goal: Encode a generated image to PNG, decode the result, and confirm both the pixels round-trip and the bytes are a valid PNG.
spec:
  scenario: A full encode-decode round trip
  status: failing
  lines:
    - kw: Given
      text: 'a generated 3-by-2 RGBA image with distinct known pixels in each of its six cells'
    - kw: When
      text: it is encoded to PNG bytes and those bytes are decoded again
    - kw: Then
      text: 'the decoded image is 3 by 2 and every one of the six pixels equals the original'
    - kw: And
      text: 'the encoded bytes start with the PNG signature and every chunk passes CRC validation, so the file is structurally valid'
code:
  lang: go
  source: |
    // 1. build im := NewImage(3,2); Set each of the 6 pixels to a known color.
    // 2. data := Encode(im)
    // 3. assert HasSignature(data) and Verify(data) == nil (all CRCs good)
    // 4. got, _ := Decode(data); assert got matches im pixel for pixel
checkpoint: Your codec round-trips real images and writes valid PNGs. The project is complete - commit and stop here.
---

This is the promise the whole project was built to keep: a codec that reads and writes real PNGs. Generate an image with known pixels, `Encode` it, and `Decode` the bytes back - every pixel returns unchanged, and the encoded file carries the correct signature and passes the very CRC check your chapter-two `Verify` runs on any PNG. The encoder and decoder are exact inverses, and the round trip is the proof.

Step back and look at what you built from eight magic bytes: a CRC-validated chunk container, a complete from-scratch DEFLATE inflater with canonical Huffman decoding and overlapping LZ77 copies, the full set of reconstruction filters including the exact Paeth predictor, pixel assembly across every color type and bit depth, and an encoder that reverses the entire pipeline into a valid file any viewer can open. It is a teaching-grade codec, honest about its limits - basic compression, no interlacing - but real in every byte it reads and writes. That is a genuine PNG codec, and it is yours.
