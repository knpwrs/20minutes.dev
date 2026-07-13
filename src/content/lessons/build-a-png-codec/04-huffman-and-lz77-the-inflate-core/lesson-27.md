---
project: build-a-png-codec
lesson: 27
title: A full fixed-Huffman block
overview: Now the fixed-block decoder handles the whole language - literals, lengths, distances, and copies. Today you wire the length and distance branches into the decode loop and inflate a real compressed block.
goal: Decode a complete fixed-Huffman block that mixes literals with a length/distance back-reference.
spec:
  scenario: Inflating a fixed block with a back-reference
  status: failing
  lines:
    - kw: Given
      text: 'the DEFLATE bytes 0x73, 0x04, 0x02, 0x00 - a final fixed block encoding a literal followed by a length-3 distance-1 copy'
    - kw: When
      text: the block is fully decoded
    - kw: Then
      text: 'the output is the four bytes "AAAA"'
    - kw: And
      text: 'a length symbol reads its extra bits then a 5-bit distance symbol and its extra bits, and the resulting copy is applied to the output'
code:
  lang: go
  source: |
    // extend the fixed-block loop: for sym > 256,
    //   length   := lenBase[sym-257]  + ReadBits(lenExtra[sym-257])
    //   distSym  := ReadBits(5)                 // fixed 5-bit distance code
    //   distance := distBase[distSym] + ReadBits(distExtra[distSym])
    //   copyMatch(out, distance, length)
checkpoint: Your fixed-Huffman decoder is complete, back-references and all. Commit and stop here.
---

This completes the fixed-block decoder. The loop now has all three cases: symbol `< 256` is a literal, `256` ends the block, and `> 256` is a **length code** that triggers a back-reference. For a reference you decode the length (symbol plus extra bits), then read the **distance** - in a fixed block the distance symbol is a plain 5-bit value, not a Huffman code - and its extra bits, and hand the pair to `copyMatch`. The stream `73 04 02 00` is a literal `A` followed by a copy of length 3 at distance 1, which the overlap logic turns into `AAAA`.

Everything you built across the last eight lessons converges here into a decoder for one of DEFLATE's three block types. It exercises the canonical table, the symbol decoder, both extra-bit tables, and the self-overlapping copy in a single real block. What remains is the **dynamic** block type, where the Huffman tables are not fixed but transmitted in the stream itself - the last and most intricate piece of inflate.
