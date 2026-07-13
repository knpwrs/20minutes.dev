---
project: build-a-png-codec
lesson: 24
title: Distance codes and extra bits
overview: A back-reference needs how far back as well as how long. Today you decode the distance half - a distance symbol plus its extra bits - completing the information a copy needs.
goal: Convert a distance symbol into a backward distance using the base-distance and extra-bits tables.
spec:
  scenario: Decoding a match distance
  status: failing
  lines:
    - kw: Given
      text: 'the distance symbols 0, 3, and 4 with the standard base-distance and extra-bit tables'
    - kw: When
      text: each is resolved to a distance
    - kw: Then
      text: 'symbol 0 is distance 1 with 0 extra bits and symbol 3 is distance 4 with 0 extra bits'
    - kw: And
      text: 'symbol 4 has base distance 5 and 1 extra bit, giving distance 5 when that bit is 0 and 6 when it is 1'
code:
  lang: go
  source: |
    // 30 distance symbols. 0->1, 1->2, 2->3, 3->4 (0 extra). Then extra bits
    // grow in pairs: 4,5 have 1 extra; 6,7 have 2; ... up to symbol 29.
    // distance = distBase[sym] + ReadBits(distExtra[sym])
    var distBase [30]int; var distExtra [30]int
checkpoint: You can decode a match distance from a distance symbol and its extra bits. Commit and stop here.
---

The distance half works exactly like the length half, with its own 30-symbol table. In a fixed block, distance symbols are 5-bit values read straight from the stream; in a dynamic block they come through a second Huffman table. Either way, the symbol gives a **base distance** and a count of **extra bits** that pick the exact distance within the range. Symbol `0` is distance 1, symbol `3` is distance 4, and symbol `4` is base 5 with one extra bit, covering distances 5 and 6.

Distances range up to 32768 - the size of the sliding window - which is why the largest symbols carry as many as 13 extra bits. Together with the length from the previous lesson, a decoded reference now says exactly "copy this many bytes from this far back." The only thing left is to actually perform that copy into the output, including the case where the copy overlaps itself, which is where the next two lessons go.
