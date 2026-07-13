---
project: build-a-jpeg-codec
lesson: 45
title: Magnitude category encoding
overview: Encoding a coefficient means finding its magnitude category and the bits that represent it - the inverse of receive-and-extend. Today you build that encoding.
goal: Compute a signed value's magnitude category and the category-width bits that represent it, inverting the decoder's extend.
spec:
  scenario: Encoding a signed value to category and bits
  status: failing
  lines:
    - kw: Given
      text: 'the signed values 5 and -5'
    - kw: When
      text: each is encoded to a category and bits
    - kw: Then
      text: 'the value 5 gives category 3 and the 3-bit pattern 0b101'
    - kw: And
      text: 'the value -5 gives category 3 and the 3-bit pattern 0b010, and the value 0 gives category 0 with no bits'
code:
  lang: go
  source: |
    // category = number of bits needed for |value| (0 for value 0).
    // bits: if value >= 0, the low `category` bits of value;
    //       if value < 0,  the low `category` bits of (value - 1).
    func encodeMagnitude(value int) (category int, bits int) { }
checkpoint: You can encode a coefficient into its category and bits. Commit and stop here.
---

To transmit a coefficient the encoder must reverse the decoder's receive-and-extend. First it finds the **category** - the number of bits needed to hold the absolute value, so `|5|` needs 3 bits and category 0 is reserved for the value 0. Then it produces those category-width **bits**: for a positive value the bits are simply its low `category` bits (`5` is `101`), and for a negative value the bits are the low `category` bits of `value - 1` (`-5` becomes `-6`, whose low 3 bits are `010`).

That `value - 1` twist is precisely what makes extend's negative branch decode back correctly: the decoder reads `010`, sees the top bit is 0, and adds `-7` to get `-5`. Pinning both the positive and negative cases guards the sign handling, the same trap that bit the decoder. This category is what the DC and AC Huffman symbols are built around - the DC symbol *is* the category, and the AC symbol packs it with a zero run - so the next two lessons feed on this function.
