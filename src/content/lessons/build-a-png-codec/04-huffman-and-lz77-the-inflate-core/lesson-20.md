---
project: build-a-png-codec
lesson: 20
title: Decoding one symbol
overview: A code table is only useful if you can read a symbol back out of the bitstream. Today you decode symbols by walking bits one at a time until they match a code, the inner loop of all Huffman decoding.
goal: Decode symbols from the bit reader against a canonical code table by accumulating bits until a code matches.
spec:
  scenario: Decoding a symbol bit by bit
  status: failing
  lines:
    - kw: Given
      text: 'the code table from the previous lesson (B=0, A=10, C=110, D=111) and a bit reader delivering the bits 0, then 1, 0, then 1, 1, 1'
    - kw: When
      text: three symbols are decoded in a row
    - kw: Then
      text: 'they are B, then A, then D'
    - kw: And
      text: 'each bit read is appended to the accumulated code as a new low-order-to-high step (code = code*2 + bit), matched against codes of the current length'
code:
  lang: go
  source: |
    // read one bit at a time, building: code = (code << 1) | bit; length++.
    // after each bit, check whether any symbol has exactly this (length, code).
    func decodeSymbol(r *BitReader, table HuffTable) int { }
checkpoint: You can decode a Huffman symbol from the bitstream. Commit and stop here.
---

Decoding reverses the assignment. You read **one bit at a time**, growing a candidate code with `code = (code << 1) | bit` and tracking its length, and after each bit you ask: does any symbol have exactly this length-and-code? Because the codes are prefix-free, the first match is unambiguous - there is never a choice. Reading `0` matches `B` immediately; reading `1` then `0` matches `A`; reading `1,1,1` matches `D`.

Watch the bit order carefully: Huffman codes are consumed **most-significant-bit-first** into the accumulator, even though the bit reader itself hands you bits low-first from each byte. That distinction trips everyone once - the byte-level order and the code-level order are different rules that coexist. A simple linear scan of the table per bit is perfectly fine for a teaching decoder; real libraries use lookup tables for speed, but the behavior is identical. This one function decodes every symbol in every Huffman block from here on.
