---
project: build-a-jpeg-codec
lesson: 51
title: Assembling the file
overview: Every segment writer is built - time to lay them out in order and wrap the entropy scan into a complete JPEG. Today you assemble a valid baseline file.
goal: Assemble a full baseline JPEG - SOI, APP0, DQT, SOF0, DHT, SOS, the byte-stuffed entropy scan, and EOI - into one byte stream.
spec:
  scenario: Assembling a complete JPEG file
  status: failing
  lines:
    - kw: Given
      text: 'a small image encoded through the full pipeline'
    - kw: When
      text: the file is assembled
    - kw: Then
      text: 'the bytes begin with the SOI marker 0xFF,0xD8 and end with the EOI marker 0xFF,0xD9'
    - kw: And
      text: 'walking the assembled bytes with the chapter-one segment walk finds the markers in order SOI, APP0, DQT, SOF0, DHT, SOS'
code:
  lang: go
  source: |
    // Encode: SOI, APP0/JFIF, DQT, SOF0, DHT, SOS header, then the entropy
    //   scan bytes (from the bit writer, already stuffed), then EOI.
    //   out := []byte{0xFF, 0xD8}; append each segment; ... ; 0xFF, 0xD9
    func Encode(im *Image) []byte { }
checkpoint: Your encoder writes a structurally valid baseline JPEG. Commit and stop here.
---

This is the encoder's assembly point. In order, the file is: **SOI** (`FF D8`); an **APP0/JFIF** header identifying it; the **DQT** segment with the quantization tables; the **SOF0** frame header; the **DHT** segment with the Huffman tables; the **SOS** scan header; then the **entropy scan** bytes the bit writer produced (already byte-stuffed); and finally **EOI** (`FF D9`). That segment order is the conventional one every decoder expects, and each piece was built in the preceding lessons.

The simplest correct encoder writes a **single-component (grayscale) baseline** file - one quantization table, one DC and one AC Huffman table, one component sampled `1x1` - which sidesteps chroma downsampling and MCU interleaving while still exercising the whole DCT, quantize, and entropy path; emitting full-color 4:2:0 is a natural extension once this works. The proof that it worked is structural: the assembled bytes start with SOI, end with EOI, and your own chapter-one segment walk steps through APP0, DQT, SOF0, DHT, and SOS cleanly before reaching the scan. That is a genuine baseline JPEG file - not just something your decoder can read, but a file conforming to the container other decoders parse. Whether the pixels survive the lossy round trip is the capstone's question; that the file is *valid* is settled here.
