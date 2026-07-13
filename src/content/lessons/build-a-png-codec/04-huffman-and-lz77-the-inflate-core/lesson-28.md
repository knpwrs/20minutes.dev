---
project: build-a-png-codec
lesson: 28
title: The dynamic block header
overview: A dynamic block carries its own Huffman tables, and it begins by saying how big they are and describing a small table used to encode them. Today you read that header, the gateway to dynamic decoding.
goal: Read a dynamic block's HLIT, HDIST, and HCLEN counts and the code-length-code lengths in their permuted order.
spec:
  scenario: Reading the dynamic table header
  status: failing
  lines:
    - kw: Given
      text: 'a dynamic-Huffman block beginning with the bytes 0x04, 0xC0, 0x81 (after its 3-bit block header)'
    - kw: When
      text: the counts are read
    - kw: Then
      text: 'HLIT is 257 literal/length codes, HDIST is 1 distance code, and HCLEN is 18 code-length codes'
    - kw: And
      text: 'the HCLEN code-length-code lengths are read 3 bits each in the order 16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15'
code:
  lang: go
  source: |
    hlit  := ReadBits(5) + 257   // number of literal/length codes
    hdist := ReadBits(5) + 1     // number of distance codes
    hclen := ReadBits(4) + 4     // number of code-length codes
    order := []int{16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15}
    // read hclen 3-bit lengths, storing each at order[i]
checkpoint: You can read a dynamic block's header and its code-length-code lengths. Commit and stop here.
---

A **dynamic block** does not use the fixed table - it transmits its own, tuned to the data. First come three counts: **HLIT** (literal/length codes, plus 257), **HDIST** (distance codes, plus 1), and **HCLEN** (code-length codes, plus 4). These offsets exist because the minimum useful count is never zero - there are always at least 257 literal/length symbols, since 256 is the mandatory end-of-block.

Then comes the delightfully meta part: to transmit the two big tables compactly, DEFLATE first sends a *small* table - the **code-length code** - that will encode the lengths of the big ones. Its 19 possible lengths are read 3 bits each, but in a fixed **permuted order** (`16,17,18,0,8,...`) chosen so the most common ones come first and trailing zeros can be omitted. You read only `HCLEN` of them and place each at its real index. This header is pure bookkeeping, but getting the permutation and the offsets exact is what makes the next two lessons decode a real table.
