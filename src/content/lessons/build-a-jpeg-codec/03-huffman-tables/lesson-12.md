---
project: build-a-jpeg-codec
lesson: 12
title: The sixteen length counts
overview: A Huffman table is described compactly by how many codes exist of each bit length. Today you read those sixteen counts, which is all you need to reconstruct the code shapes.
goal: Read the sixteen BITS bytes that follow a DHT header and report the total number of symbols in the table.
spec:
  scenario: Reading the BITS length counts
  status: failing
  lines:
    - kw: Given
      text: 'the sixteen BITS bytes 0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0'
    - kw: When
      text: they are read
    - kw: Then
      text: 'there are 0 codes of length 1, 1 code of length 2, and 5 codes of length 3'
    - kw: And
      text: 'the total number of symbols in the table is 12 (the sum of all sixteen counts)'
code:
  lang: go
  source: |
    // 16 bytes: counts[i] = number of Huffman codes that are (i+1) bits long.
    // total symbols = sum of the 16 counts (drives how many HUFFVAL bytes follow).
    func readBits(b []byte, pos int) (counts [16]int, total int) { }
checkpoint: You can read a Huffman table's per-length code counts and its symbol total. Commit and stop here.
---

Instead of listing each code's bit pattern, JPEG describes a Huffman table by its **BITS** array: sixteen bytes where the `i`-th says how many codes are exactly `i+1` bits long. The example `0,1,5,1,...` means no 1-bit codes, one 2-bit code, five 3-bit codes, and so on. That is enough to reconstruct every code, because JPEG codes are **canonical** - given the lengths, the actual bit patterns are fully determined by a fixed rule you build two lessons from now.

The other reason BITS comes first is that its **sum** tells you how many symbol bytes follow. Here the counts add to 12, so exactly 12 symbol values (the HUFFVAL list) come next. Reading the count array before the symbols is what lets the parser know where the symbol list ends and the next table or segment begins. This particular table, incidentally, is the standard luminance DC table from the spec's example tables.
