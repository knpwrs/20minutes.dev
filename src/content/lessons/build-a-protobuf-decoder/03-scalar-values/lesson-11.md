---
project: build-a-protobuf-decoder
lesson: 11
title: Zigzag for signed integers
overview: Because a plain negative int wastes ten bytes, protobuf offers sint32 and sint64 that zigzag small negatives into small unsigned varints. Today you build the zigzag mapping and its inverse so signed values encode compactly.
goal: Map signed integers to and from their zigzag varint encoding.
spec:
  scenario: Zigzag interleaves negatives and positives
  status: failing
  lines:
    - kw: Given
      text: 'the signed values 0, -1, 1, -2, 2'
    - kw: When
      text: 'each is zigzag-encoded'
    - kw: Then
      text: 'they map to 0, 1, 2, 3, 4 respectively'
    - kw: And
      text: 'decoding zigzag runs the mapping backward, so 1 decodes to -1 and 3 decodes to -2, round-tripping every value'
code:
  lang: go
  source: |
    // encode: fold the sign bit into bit 0 (arithmetic shift copies the sign)
    func zigzagEncode(v int64) uint64 { return uint64((v << 1) ^ (v >> 63)) }
    // decode: pull bit 0 back out as the sign
    func zigzagDecode(u uint64) int64 { return int64(u>>1) ^ -int64(u&1) }
checkpoint: You can zigzag-encode and decode signed integers. Commit and stop here.
---

**Zigzag** encoding makes small-magnitude negatives cheap by interleaving signs:
0 maps to 0, -1 to 1, 1 to 2, -2 to 3, 2 to 4, so a value near zero stays near zero
whether it is positive or negative, and the resulting small unsigned number varint
encodes to one byte. The `sint32` and `sint64` types use this; plain `int32` and
`int64` from the last lesson do not.

The encode is `(v << 1) ^ (v >> 63)`: shifting left by one makes room for the sign
in bit 0, and the arithmetic right shift by 63 produces all-ones for a negative and
all-zeros for a non-negative, which the XOR uses to flip the other bits for
negatives. Decoding reverses it: `(u >> 1) ^ -(u & 1)` moves the magnitude back
down and rebuilds the sign from bit 0. Confirm the two are inverses on the whole
sample - a codec that cannot round-trip its own signed values is worse than
useless.
