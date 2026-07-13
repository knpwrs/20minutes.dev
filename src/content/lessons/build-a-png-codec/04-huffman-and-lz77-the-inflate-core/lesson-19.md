---
project: build-a-png-codec
lesson: 19
title: Canonical Huffman codes from lengths
overview: DEFLATE never stores Huffman codes directly - it stores only each symbol's code length and rebuilds the codes by a fixed rule. Today you implement that rule, the heart of every Huffman table you will decode.
goal: Given each symbol's code length, assign the canonical Huffman code to every symbol.
spec:
  scenario: Rebuilding codes from code lengths
  status: failing
  lines:
    - kw: Given
      text: 'four symbols A, B, C, D with code lengths 2, 1, 3, 3'
    - kw: When
      text: the canonical codes are assigned
    - kw: Then
      text: 'B is 0, A is 10, C is 110, and D is 111'
    - kw: And
      text: 'codes are assigned shortest-length first, and within a length in increasing symbol order, each code one greater than the last'
code:
  lang: go
  source: |
    // RFC 1951 algorithm: count how many symbols have each length; the first
    // code of length L is (firstCodeOfLength[L-1] + count[L-1]) << 1. Then walk
    // symbols in order, and each symbol of length L takes the next code for L.
    func assignCodes(lengths []int) []uint32 { }
checkpoint: You can rebuild canonical Huffman codes from lengths alone. Commit and stop here.
---

The elegant idea at the center of DEFLATE is that a Huffman table is fully determined by just the **code length** of each symbol - you never transmit the code bits. Given the lengths, the **canonical** rule assigns the actual codes: sort by length shortest-first, and within each length hand out consecutive binary values in increasing symbol order, shifting left by one each time the length grows. The RFC gives the exact three-step recipe - count lengths, compute the first code of each length, then assign.

The worked example from the spec is the one in the RFC itself: lengths `2,1,3,3` for `A,B,C,D` yield `B=0` (the only length-1 code), `A=10`, then `C=110` and `D=111`. Notice no code is a prefix of another - that is what makes the stream unambiguously decodable. This single function builds *every* table in the format: the fixed literal table, the dynamic tables, and the code-length table that describes them. Get it exact and the rest of inflate is plumbing.
