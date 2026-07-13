---
project: build-a-protobuf-decoder
lesson: 7
title: Encoding a tag
overview: 'To write a field you first write its tag, so today you build the inverse of the decoder: pack a field number and wire type back into a single varint. This is the first thing every encoded field emits.'
goal: Encode a field number and wire type into a tag varint.
spec:
  scenario: A field number and wire type pack into a tag
  status: failing
  lines:
    - kw: Given
      text: 'field number 1 and wire type 2 (Len)'
    - kw: When
      text: 'AppendTag encodes them'
    - kw: Then
      text: 'it produces the single byte 0x0A'
    - kw: And
      text: 'field 2 wire type 0 gives 0x10, field 3 wire type 5 gives 0x1D, and field 16 wire type 2 gives the two bytes 0x82, 0x01'
code:
  lang: go
  source: |
    // shift the field number up by 3 and drop the wire type in the low bits
    func AppendTag(buf []byte, field int, wire int) []byte {
      tag := uint64(field)<<3 | uint64(wire)
      return AppendVarint(buf, tag)
    }
checkpoint: You can encode a tag from a field number and wire type. Commit and stop here.
---

Encoding a tag is the mirror of decoding one: combine the field number and wire
type with `field << 3 | wire`, then write the result as a varint using the encoder
you already have. For small field numbers the tag is a single byte, which is why
protobuf rewards putting your most common fields in numbers 1 through 15 - they
cost one tag byte instead of two.

Field 16 is the boundary worth pinning: `16 << 3 | 2` is 130, which is larger than
127, so the tag spills to two varint bytes, `0x82 0x01`. That is not a special case
in your code - it falls straight out of reusing `AppendVarint` - but it confirms
the tag really is just a varint like any other, and that field numbers above 15
carry a real encoding cost.
