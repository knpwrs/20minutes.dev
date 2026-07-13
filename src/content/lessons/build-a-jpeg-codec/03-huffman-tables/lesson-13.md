---
project: build-a-jpeg-codec
lesson: 13
title: The symbol list
overview: After the length counts comes the list of symbols those codes stand for, in the order the codes are assigned. Today you read that list so each future code has a value to decode to.
goal: Read the HUFFVAL symbol list whose length equals the sum of the BITS counts.
spec:
  scenario: Reading the symbol values
  status: failing
  lines:
    - kw: Given
      text: 'the BITS counts total 12 and the following bytes are 0,1,2,3,4,5,6,7,8,9,10,11'
    - kw: When
      text: the symbol list is read
    - kw: Then
      text: 'the list has 12 entries and equals 0,1,2,3,4,5,6,7,8,9,10,11'
    - kw: And
      text: 'exactly that many bytes are consumed, leaving the reader at the next table'
code:
  lang: go
  source: |
    // HUFFVAL: `total` bytes, the symbols in canonical-code order.
    // (For a DC table these are magnitude categories 0..11.)
    func readHuffVal(b []byte, pos, total int) (syms []byte, next int) { }
checkpoint: You can read the ordered symbol list of a Huffman table. Commit and stop here.
---

The **HUFFVAL** list is the payload the codes point at: `total` bytes (that sum you computed from BITS), giving the symbols in the exact order codes will be assigned to them. Shorter codes are assigned first, and within a length the symbols appear in this list's order. For the standard luminance DC table the symbols are simply `0` through `11`, the twelve magnitude categories a DC difference can fall into.

You now hold everything a Huffman table is on the wire: the per-length counts and the ordered symbols. Neither is the decode structure yet - that is the canonical code assignment you build next - but together they fully determine it. Consuming exactly `total` bytes keeps the parser aligned so that a DHT segment carrying several tables reads each one cleanly after the last.
