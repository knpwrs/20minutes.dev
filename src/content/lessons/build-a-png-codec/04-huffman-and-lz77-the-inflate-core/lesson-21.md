---
project: build-a-png-codec
lesson: 21
title: The fixed Huffman table
overview: Fixed-Huffman blocks use one table baked into the spec, defined entirely by a fixed pattern of code lengths. Today you build that literal/length table so the next lesson can decode a fixed block.
goal: Build the fixed literal/length Huffman table from its specified code-length ranges.
spec:
  scenario: Constructing the fixed literal/length table
  status: failing
  lines:
    - kw: Given
      text: 'code lengths of 8 for symbols 0 to 143, 9 for 144 to 255, 7 for 256 to 279, and 8 for 280 to 287'
    - kw: When
      text: the canonical codes are assigned to these 288 symbols
    - kw: Then
      text: 'literal 0 gets the 8-bit code 00110000 and the end-of-block symbol 256 gets the 7-bit code 0000000'
    - kw: And
      text: 'literal 255 gets the 9-bit code 111111111 and symbol 280 gets the 8-bit code 11000000'
code:
  lang: go
  source: |
    // build a length array of 288 entries per the ranges, then reuse assignCodes.
    func fixedLitLenTable() HuffTable {
      lengths := make([]int, 288)
      // 0..143 -> 8, 144..255 -> 9, 256..279 -> 7, 280..287 -> 8
    }
checkpoint: You have the fixed literal/length Huffman table. Commit and stop here.
---

A **fixed-Huffman** block skips transmitting any table - it uses one the spec fixes forever, so decoder and encoder agree without exchanging anything. That table is defined purely as a pattern of code lengths across the 288 literal/length symbols: `8` bits for the common literals `0` to `143`, `9` for the rarer `144` to `255`, a short `7` for the low control symbols `256` to `279`, and `8` for `280` to `287`. Feed those lengths to the `assignCodes` you already built and the codes fall out.

The two anchors to pin are the ones you will lean on constantly: literal byte `0` becomes `00110000` and the **end-of-block** symbol `256` becomes the short `0000000`. Symbol `256` is special - it is not a byte, it is the marker that ends the block, which is why it gets one of the shortest codes. With this table in hand, a whole class of real DEFLATE streams becomes decodable, starting with plain literals next lesson.
