---
project: build-a-compression-tool
lesson: 14
title: Canonical codes from lengths
overview: 'The trick that makes Huffman practical: the codes can be rebuilt from the lengths alone, so the header need only store one small number per symbol. Today you derive the canonical codes from a length vector, exactly as DEFLATE does.'
goal: Assign canonical codes to symbols given only their code lengths.
spec:
  scenario: Lengths alone determine the codes
  status: failing
  lines:
    - kw: Given
      text: 'the code lengths A:1, B:3, C:3, D:3, R:3'
    - kw: When
      text: 'canonical codes are assigned'
    - kw: Then
      text: 'A is 0, B is 100, C is 101, D is 110, and R is 111'
    - kw: And
      text: 'shorter codes come first numerically and, within one length, symbols are ordered by ascending byte value'
code:
  lang: go
  source: |
    // RFC 1951 canonical assignment:
    //   bl_count[len] = how many symbols have that length
    //   code = 0
    //   for bits = 1..maxlen:
    //     code = (code + bl_count[bits-1]) << 1
    //     next_code[bits] = code
    // then, in ascending SYMBOL order, give each symbol next_code[len]++ as its code
checkpoint: Codes are reconstructed from lengths alone. Commit and stop here.
---

Here is the idea that turns Huffman from theory into a real file format. A Huffman
tree can be drawn many ways that all give the same set of code **lengths**, and it
turns out the lengths alone are enough: fix a rule for turning lengths into codes
and both encoder and decoder can rebuild the exact same codes without ever sharing
the tree. That rule gives **canonical Huffman** codes, and it means a compressed
file needs to store only one small length per symbol, not the codes and not the
tree.

The rule (from RFC 1951) is mechanical. Assign codes shortest-first, and within a
single length in ascending symbol order, each code one greater than the last, with
a left shift each time the length increases. For lengths `A:1, B:3, C:3, D:3, R:3`
it produces `A = 0`, then `B = 100, C = 101, D = 110, R = 111`. Notice the
codes are a **prefix code** - no code is a prefix of another - which is what lets
the decoder tell where one code ends and the next begins with no separators. This
canonical assignment is the backbone of the rest of the project.
