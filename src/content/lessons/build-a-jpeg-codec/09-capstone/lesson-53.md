---
project: build-a-jpeg-codec
lesson: 53
title: 'Capstone: the round trip'
overview: The final lesson closes the loop - encode a generated image to a valid JPEG, then decode it back and prove the pixels survive within tolerance and the file is structurally valid. This is the whole codec working as one.
goal: Encode a generated gradient image to a JPEG, confirm the file is structurally valid, and decode it back within a stated per-channel tolerance.
spec:
  scenario: A full encode-decode round trip
  status: failing
  lines:
    - kw: Given
      text: 'a generated 16-by-16 image with a smooth horizontal gray gradient'
    - kw: When
      text: it is encoded to JPEG bytes and those bytes are decoded again
    - kw: Then
      text: 'the encoded bytes begin with SOI and end with EOI and pass the chapter-one segment walk, so the file is structurally valid'
    - kw: And
      text: 'the decoded image is 16 by 16 and every pixel matches the original within a per-channel absolute difference of 15 (a steep gradient quantizes less cleanly than a flat region, so it needs a looser bound)'
code:
  lang: go
  source: |
    // 1. build im := gradient(16,16)
    // 2. data := Encode(im)
    // 3. assert data starts FFD8, ends FFD9, and walk(data) succeeds
    // 4. got, _ := Decode(data)
    // 5. assert got is 16x16 and every pixel within 15 of im (lossy tolerance)
checkpoint: Your codec round-trips real images and writes valid baseline JPEGs. The project is complete - commit and stop here.
---

This is the promise the whole project was built to keep: a codec that reads and writes real baseline JPEGs. Generate a smooth gradient image, `Encode` it to bytes, and `Decode` those bytes back. Two things are proven at once. The encoded file is **structurally valid** - it opens with SOI, closes with EOI, and your own segment walk parses APP0, DQT, SOF0, DHT, and SOS in order, so any conforming decoder could read it. And the pixels **survive the round trip** within a stated tolerance: because encode-quantize-decode is lossy, they are checked within a per-channel difference rather than for exact equality, which is the honest way to test a lossy codec.

Step back and look at what you built from two marker bytes: a marker-and-segment container, quantization and Huffman table parsing, the full baseline entropy scan with byte-stuffing, receive-and-extend, DC prediction, run-length AC coding, and restart markers, a separable inverse and forward DCT, chroma upsampling and downsampling, and color conversion in both directions - assembled into a decoder that turns a JPEG into pixels and an encoder that turns pixels into a valid JPEG. It is a teaching-grade codec, honest about its limits - baseline sequential only, standard tables, no progressive or arithmetic coding - but real in every byte it reads and writes. That is a genuine JPEG codec, and it is yours.
