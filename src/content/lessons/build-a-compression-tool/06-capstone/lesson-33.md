---
project: build-a-compression-tool
lesson: 33
title: 'Capstone: compress a real document'
overview: The finale runs the whole tool on a real multi-line document, proves it comes back byte for byte, and reports how much it shrank. Every layer - bit I/O, RLE, Huffman, LZSS, the container - proves itself at once.
goal: Compress and decompress a real multi-line text, assert byte-identical output, and report the ratio.
spec:
  scenario: A real document round-trips and shrinks
  status: failing
  lines:
    - kw: Given
      text: "a 211-byte document of five repeated lines: the quick brown fox jumps over the lazy dog.\\nthe quick brown fox jumps over the lazy dog.\\nthe five boxing wizards jump quickly.\\nthe five boxing wizards jump quickly.\\nthe quick brown fox jumps over the lazy dog.\\n"
    - kw: When
      text: 'it is passed through Compress then Decompress'
    - kw: Then
      text: 'the result is byte-for-byte identical to the original, and Stats reports a Ratio below 1.0 (about 0.86, and the DEFLATE-lite method 0x01 was chosen)'
    - kw: And
      text: 'the same Compress then Decompress round-trip also holds for empty input and for the incompressible bytes 0x00, 0x01, 0x02, 0x03, which stays stored (method 0x00)'
code:
  lang: go
  source: |
    doc := []byte("the quick brown fox jumps over the lazy dog.\n" +
      "the quick brown fox jumps over the lazy dog.\n" +
      "the five boxing wizards jump quickly.\n" +
      "the five boxing wizards jump quickly.\n" +
      "the quick brown fox jumps over the lazy dog.\n")
    c := Compress(doc)
    out, err := Decompress(c)
    // err == nil; bytes.Equal(out, doc); Stats(doc,c).Ratio < 1.0 (~0.86)
    // and: round-trip("") == "" ; round-trip({0,1,2,3}) stays stored
checkpoint: The compressor round-trips a real document and reports its ratio. The project is complete - commit and stop here.
---

This is the promise the whole project was built to keep: a real, general-purpose
**compressor**. The document repeats whole lines and shares the `the ` prefix
throughout, so every layer gets exercised at once - LZSS finds the repeated
`the quick brown fox jumps over the lazy dog.` line and the shared words as
back-references, the resulting literal, length, and distance symbols are
Huffman-coded by frequency, the bit writer packs them tight, and the container
records the method and original length so the decoder is fully self-describing.
`Compress` weighs DEFLATE-lite against stored and, for this input, DEFLATE-lite
wins (about 182 bytes from 211), so `Stats` reports a **ratio below 1.0**.

The decisive assertion is **byte-for-byte identity**: `Decompress(Compress(doc))`
equals `doc`, exactly, which is only reachable if bit I/O, canonical Huffman, the
overlapping copy, the two-alphabet split, and the container all agree. And the same
round trip holds at the edges - empty input returns empty, and the incompressible
`0x00 0x01 0x02 0x03` stays stored rather than growing. From an MSB-first bit writer
you have built the honest core of a real compressor - run-length encoding, canonical
Huffman, LZ77/LZSS matching, and a DEFLATE-lite pipeline with a stored fallback -
the same ideas inside gzip and zlib, minus the larger window and extra-bit code
families they layer on top. That is a real compressor, and it is yours.
