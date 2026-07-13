---
project: build-a-jpeg-codec
lesson: 22
title: Decoding a Huffman symbol
overview: With the bit reader and the canonical codes, you can decode one Huffman symbol from the stream. Today you build the accumulate-and-match loop at the heart of entropy decoding.
goal: Decode one Huffman symbol by reading bits until the accumulated code matches a code in the table.
spec:
  scenario: Decoding a symbol from the bitstream
  status: failing
  lines:
    - kw: Given
      text: 'the standard luminance DC table and a bit reader over the single byte 0x40 (binary 0100 0000)'
    - kw: When
      text: one Huffman symbol is decoded
    - kw: Then
      text: 'the symbol is 1 and exactly 3 bits were consumed (the code 0b010)'
    - kw: And
      text: 'reading the byte 0x00 would instead decode symbol 0 after 2 bits (the code 0b00)'
code:
  lang: go
  source: |
    // lesson 14 gave you codes per symbol; build the inverse view today -
    // a (code,length) -> symbol lookup - so decode can match against it.
    // accumulate bits; after each, check if (code,length) matches a table entry.
    //   code := 0
    //   for length := 1..16:
    //     code = code<<1 | readBit()
    //     if symbol, ok := table.lookup(code, length); ok { return symbol }
    func decodeSymbol(r *BitReader, t *HuffTable) byte { }
checkpoint: You can decode a single Huffman symbol from the scan. Commit and stop here.
---

Decoding a canonical Huffman code is a tight loop against the bit reader: start with an empty accumulator, read one bit at a time shifting it in, and after each bit ask whether the value so far is a valid code of the current length. Because the code set is prefix-free, the first match is unambiguous. Over `0x40` (`0100 0000`) the reader yields `0`, then `01` (no 2-bit code but `00` in this table, so no match), then `010` - which is the 3-bit code for symbol 1 - and the loop returns after three bits.

This is the same loop for DC and AC tables; only the meaning of the returned symbol differs. A DC symbol is a magnitude **category** telling you how many more bits to read for the coefficient value; an AC symbol packs a zero-run and a category. Everything from here builds on this one call: read a symbol, then act on what it means. The next lessons give those symbols their meaning.
