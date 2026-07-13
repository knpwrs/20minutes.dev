---
project: build-a-compression-tool
lesson: 28
title: Assembling a DEFLATE-lite block
overview: Now the two big ideas meet. Today you Huffman-code both symbol streams, write their code tables into the container, and pack the codes - producing a real DEFLATE-lite compressed block under method 1.
goal: 'Encode data as a DEFLATE-lite block: two Huffman tables plus the packed literal/length and distance codes.'
spec:
  scenario: A DEFLATE-lite block has the right header
  status: failing
  lines:
    - kw: Given
      text: 'the input ABCABCD'
    - kw: When
      text: 'deflateEncode builds the block'
    - kw: Then
      text: 'the first seven bytes are 0x5A, 0x5A, 0x01, 0x00, 0x00, 0x00, 0x07 - magic, method 1, original length 7'
    - kw: And
      text: 'after the header come the literal/length code table, then the distance code table, then the packed codes, in that order'
code:
  lang: go
  source: |
    // 1. tokenize -> litlen[] and dist[] symbol streams (lesson 26)
    // 2. build Huffman lengths + canonical codes for EACH stream (chapter 3)
    // 3. write header (method 0x01, uint32 origLen)
    // 4. write litlen table, then dist table (wide format, lesson 27)
    // 5. pack: for each litlen symbol write its code; after a length symbol,
    //    write the matching distance symbol's code
checkpoint: Data encodes into a full DEFLATE-lite block. Commit and stop here.
---

This lesson is where LZ77 and Huffman finally combine. The steps chain everything
built so far: **tokenize** the input into literal/length and distance streams,
build a Huffman **code table** for each stream (frequencies, lengths, canonical
codes - the whole chapter-three pipeline, run twice), then write the container
**header** with method `0x01`, both **code tables** in the wide format, and finally
the **packed codes**.

The packing order is the contract the decoder relies on: walk the literal/length
symbols writing each one's code, and each time you emit a length symbol,
immediately write the code for the corresponding distance from the distance
stream. That interleaving is what lets the decoder recover matches in step. For
`ABCABCD` the block begins `0x5A 0x5A 0x01` with original length `0x00000007`, then
the two tables, then the bits. This is a genuine two-stage compressor - repeats
found by LZSS, then the resulting symbols entropy-coded by Huffman - and the
payoff, decoding it back, is the very next lesson.
