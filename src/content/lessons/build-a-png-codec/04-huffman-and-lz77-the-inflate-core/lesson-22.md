---
project: build-a-png-codec
lesson: 22
title: Decoding literals from a fixed block
overview: With the fixed table built, you can decode a block made only of literal bytes. Today you run the decode loop until the end-of-block symbol, producing your first Huffman-compressed output.
goal: Decode a fixed-Huffman block of literal bytes, stopping at the end-of-block symbol.
spec:
  scenario: Decoding literal bytes
  status: failing
  lines:
    - kw: Given
      text: 'the DEFLATE bytes 0x73, 0x74, 0x02, 0x00 - a final fixed-Huffman block'
    - kw: When
      text: the block is decoded with the fixed literal/length table
    - kw: Then
      text: 'the output is the two bytes 0x41, 0x42 (the ASCII text "AB")'
    - kw: And
      text: 'decoding stops when symbol 256 (end of block) is read, and symbols 0 to 255 are emitted as literal bytes'
code:
  lang: go
  source: |
    // after reading BFINAL/BTYPE=01, loop:
    //   sym := decodeSymbol(r, fixedLitLenTable())
    //   if sym == 256 { break }        // end of block
    //   if sym < 256  { emit byte sym } // a literal
    //   (sym > 256 is a length code - next lessons)
    func inflateFixed(r *BitReader, out *[]byte) { }
checkpoint: You can decode a fixed-Huffman block of literals. Commit and stop here.
---

Now the pieces connect: read the block header (a fixed block, `BTYPE` 1), then loop `decodeSymbol` against the fixed table. Symbols `0` to `255` are **literal bytes** you append to the output; symbol `256` is **end of block**, which breaks the loop. The tiny stream `73 74 02 00` decodes to the two literals `A` and `B` and then hits `256`. That is a complete, real DEFLATE block - the same shape a compressor emits for incompressible-but-short data.

For now, only handle literals and the end marker; symbols above `256` are **length codes** that start a back-reference, and they are the next three lessons. Leaving them unhandled is deliberate - this lesson's block contains none. What you have built is the decode loop's skeleton, and every remaining inflate feature slots into the `sym > 256` branch you are pointedly leaving open.
