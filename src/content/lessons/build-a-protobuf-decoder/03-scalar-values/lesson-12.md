---
project: build-a-protobuf-decoder
lesson: 12
title: Fixed32, little-endian
overview: 'Some types skip the varint entirely and store exactly four little-endian bytes: fixed32, sfixed32, and float. Today you decode and encode those four bytes, the I32 wire type, and confirm the byte order both ways.'
goal: Decode and encode a fixed32 value as four little-endian bytes.
spec:
  scenario: A fixed32 is four little-endian bytes
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 0xD2, 0x02, 0x96, 0x49'
    - kw: When
      text: 'ReadFixed32 decodes them as little-endian'
    - kw: Then
      text: 'the uint32 value is 1234567890 (0x499602D2)'
    - kw: And
      text: 'encoding 1234567890 back gives the same four bytes, and the float32 value 1.0 is the bytes 0x00, 0x00, 0x80, 0x3F'
code:
  lang: go
  source: |
    // low byte first
    func ReadFixed32(b []byte) uint32 {
      return uint32(b[0]) | uint32(b[1])<<8 | uint32(b[2])<<16 | uint32(b[3])<<24
    }
    func AppendFixed32(buf []byte, v uint32) []byte {
      return append(buf, byte(v), byte(v>>8), byte(v>>16), byte(v>>24))
    }
    // a float32 is these same 4 bytes reinterpreted (math.Float32frombits)
checkpoint: You can decode and encode fixed32 values. Commit and stop here.
---

The **I32** wire type is dead simple: exactly **four bytes**, no length prefix,
stored **little-endian** (least-significant byte first). It backs `fixed32`,
`sfixed32`, and `float`. Decoding is just reassembling the four bytes with the
first byte in the low position; encoding writes them back low byte first. Pin the
example `0xD2 0x02 0x96 0x49`, which is 1234567890 - reversing the bytes gives the
hex `0x499602D2`, so getting the order wrong is immediately visible.

A `float` uses the same four bytes, reinterpreted as an IEEE 754 single-precision
number rather than an integer - most languages expose this as a bit-cast (Go's
`math.Float32frombits`, for instance). The value 1.0 has the bit pattern
`0x3F800000`, which little-endian is `0x00 0x00 0x80 0x3F`, and a negative like -2.5
is `0x00 0x00 0x20 0xC0`. The integer and the float share the wire; only the schema
says which one you meant.
