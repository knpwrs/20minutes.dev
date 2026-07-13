---
project: build-a-png-codec
lesson: 49
title: Fixed-Huffman literal encoding
overview: Stored blocks never shrink data; the smallest real compressor emits fixed-Huffman codes. Today you encode bytes as fixed literal codes, producing a genuinely deflated block your own inflater decodes.
goal: Encode a run of literal bytes as a final fixed-Huffman block, ending with the end-of-block code.
spec:
  scenario: Emitting fixed-Huffman literals
  status: failing
  lines:
    - kw: Given
      text: 'the two bytes "AB" (0x41, 0x42) to encode'
    - kw: When
      text: they are written as a final fixed-Huffman block of literals
    - kw: Then
      text: 'the DEFLATE bytes are 0x73, 0x74, 0x02, 0x00 and Inflate returns "AB"'
    - kw: And
      text: 'each literal is written as its fixed code most-significant-bit first, followed by the end-of-block code for symbol 256'
code:
  lang: go
  source: |
    // write BFINAL=1, BTYPE=01. For each byte b, look up its fixed lit/len code
    // and length, and write the code MSB-first. Finish with symbol 256 (0000000).
    // (bytes are still packed into the stream low-bit-first, as the reader expects.)
    func fixedBlock(data []byte) []byte { }
checkpoint: You can emit a compressing fixed-Huffman block. Commit and stop here.
---

A stored block frames data but never shrinks it; the smallest **compressing** encoder emits a **fixed-Huffman** block. Set `BFINAL` and `BTYPE` 01, then for each byte write its fixed literal/length code from the table you built decoding, **most-significant-bit first**, and close with the end-of-block code for symbol `256`. Encoding `AB` yields `73 74 02 00` - the very bytes you decoded back in chapter four, now generated. The reverse code table is just the fixed lengths run through your canonical assignment, inverted to map byte to code.

Two bit orders coexist here, and both must be right: Huffman **codes** go out MSB-first, while the stream as a whole still fills each byte from its **low bit**, exactly as the reader consumes it. This encoder emits only literals - it does not search for LZ77 back-references - so it shrinks data modestly by giving common bytes short codes, without the bigger wins a match-finder would bring. That is a deliberate, honest scope: a valid, compressing encoder without the complexity of an optimizing compressor. Now assemble the whole PNG.
