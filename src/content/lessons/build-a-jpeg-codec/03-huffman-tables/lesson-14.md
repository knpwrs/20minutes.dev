---
project: build-a-jpeg-codec
lesson: 14
title: Building canonical codes
overview: The BITS counts and symbol list determine every code's exact bit pattern by a fixed rule. Today you assign those canonical codes, turning a table description into something you can decode with.
goal: Assign a canonical Huffman code (a bit pattern and length) to each symbol from the BITS counts.
spec:
  scenario: Assigning canonical Huffman codes
  status: failing
  lines:
    - kw: Given
      text: 'the standard luminance DC table (BITS 0,1,5,1,1,1,1,1,1,0... and symbols 0..11)'
    - kw: When
      text: canonical codes are assigned
    - kw: Then
      text: 'symbol 0 gets the 2-bit code 0b00 and symbol 1 gets the 3-bit code 0b010'
    - kw: And
      text: 'symbol 6 gets the 4-bit code 0b1110'
code:
  lang: go
  source: |
    // canonical assignment (T.81 Annex C):
    //   code := 0
    //   for length 1..16:
    //     for each symbol of this length (HUFFVAL order): assign code; code++
    //     code <<= 1            // step to the next length
    // store (code, length) per symbol, indexed for decode.
    func buildCodes(counts [16]int, syms []byte) { }
checkpoint: You can turn a Huffman table description into assigned canonical codes. Commit and stop here.
---

JPEG Huffman codes are **canonical**, meaning the BITS counts and symbol order pin down every bit pattern with no ambiguity. The rule: walk lengths from 1 to 16, keep a running `code` value, hand it to the next symbol of the current length and increment, and when you move to the next length, shift `code` left by one. Because there are no 1-bit codes here, the first real code is the 2-bit `00` for symbol 0; the five 3-bit codes are `010, 011, 100, 101, 110` for symbols 1 through 5; then the 4-bit `1110` for symbol 6, and so on.

Deriving codes this way, rather than storing them, is what keeps the table description tiny. The `(code, length)` pairs you produce are the decode table: given a run of bits, you accumulate them and check whether the value so far matches a code of the current length. That accumulate-and-match loop is the next chapter's job; today you have turned a compact description into the concrete codes it stands for.
