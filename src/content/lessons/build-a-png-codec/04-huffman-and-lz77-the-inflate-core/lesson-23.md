---
project: build-a-png-codec
lesson: 23
title: Length codes and extra bits
overview: DEFLATE compresses by referring back to earlier bytes, and each reference starts with a length. Today you turn a length symbol plus its extra bits into an actual copy length.
goal: Convert a literal/length symbol above 256 into a match length using the base-length and extra-bits tables.
spec:
  scenario: Decoding a match length
  status: failing
  lines:
    - kw: Given
      text: 'the literal/length symbols 257, 264, 265, and 285 with the standard base-length and extra-bit tables'
    - kw: When
      text: each is resolved to a length
    - kw: Then
      text: 'symbol 257 is length 3 with 0 extra bits, symbol 264 is length 10 with 0 extra bits, and symbol 285 is length 258'
    - kw: And
      text: 'symbol 265 has base length 11 and 1 extra bit, giving length 11 when that bit is 0 and 12 when it is 1'
code:
  lang: go
  source: |
    // symbol 257 -> base 3; 258->4 ... 264->10 (all 0 extra). Then extra bits
    // grow: 265..268 have 1 extra, 269..272 have 2, and so on; 285 -> 258 exactly.
    // length = base[sym] + ReadBits(extra[sym])
    var lenBase [29]int; var lenExtra [29]int  // indexed by sym-257
checkpoint: You can decode a match length from a length symbol and its extra bits. Commit and stop here.
---

DEFLATE's real compression comes from **back-references**: "copy N bytes that appeared M bytes ago." The N is encoded as a **length symbol** (257 through 285) plus a few **extra bits**. Rather than a code per possible length, the spec groups lengths into ranges: each symbol carries a **base length**, and a fixed number of extra bits select the exact value within its range. Symbol `257` is base 3 with no extra bits; `265` is base 11 with 1 extra bit, so it covers lengths 11 and 12; `285` is the single largest, exactly 258.

The extra bits are read with the low-first `ReadBits` from earlier, not the Huffman order - length symbols come through the Huffman decoder, but their trailing extra bits are ordinary fixed-width values. Build the two small tables (base and extra-bit count, indexed by `symbol - 257`) and the conversion is one addition. Next you will do the same for the *distance* half of a reference, and then actually perform the copy.
