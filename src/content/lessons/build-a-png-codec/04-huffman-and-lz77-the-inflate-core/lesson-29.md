---
project: build-a-png-codec
lesson: 29
title: Decoding the code-length sequence
overview: The code-length code describes the big tables as a run-length-compressed list of lengths. Today you expand that list, including its repeat codes, into the full array of code lengths.
goal: Decode the code-length symbol stream into an array of code lengths, handling the repeat codes 16, 17, and 18.
spec:
  scenario: Expanding run-length-coded code lengths
  status: failing
  lines:
    - kw: Given
      text: 'a code-length symbol stream that decodes to literal 8, then symbol 17 whose 3 extra bits select a repeat count of 5, then literal 2'
    - kw: When
      text: the stream is expanded
    - kw: Then
      text: 'the resulting code lengths are 8, 0, 0, 0, 0, 0, 2'
    - kw: And
      text: 'symbol 16 repeats the previous length 3 to 6 times (2 extra bits plus 3), 17 writes 3 to 10 zeros (3 extra bits plus 3), and 18 writes 11 to 138 zeros (7 extra bits plus 11)'
code:
  lang: go
  source: |
    // read (HLIT+HDIST) lengths total using the code-length Huffman table:
    //   sym 0..15 -> a literal length
    //   sym 16    -> repeat previous length, count = ReadBits(2)+3
    //   sym 17    -> repeat 0,             count = ReadBits(3)+3
    //   sym 18    -> repeat 0,             count = ReadBits(7)+11
checkpoint: You can expand the code-length stream into a full length array. Commit and stop here.
---

The code-length code you built from the header is now used to decode a **run-length-compressed** list of the real code lengths - `HLIT + HDIST` of them, for the literal/length and distance tables concatenated. Most symbols (`0` to `15`) are a literal length for the next code. But three symbols compress the common runs: **16** repeats the *previous* length several times (handy for a stretch of equal lengths), while **17** and **18** write runs of **zeros** (symbols that do not appear at all), with 18 covering long runs up to 138. Each carries a few extra bits for the exact count.

The example expands `8`, then a `17` selecting five zeros, then `2` into `8,0,0,0,0,0,2` - a compact way to say "code 0 has length 8, the next five codes are unused, code 6 has length 2." Decode exactly `HLIT + HDIST` lengths in one pass, then split the array: the first `HLIT` are the literal/length lengths, the rest are the distance lengths. Feed each half to `assignCodes` and you have both dynamic tables, which the final lesson uses to inflate the block.
