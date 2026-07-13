---
project: build-a-protobuf-decoder
lesson: 13
title: Fixed64, little-endian
overview: The I64 wire type is the eight-byte twin of I32, backing fixed64, sfixed64, and double. Today you decode and encode those eight little-endian bytes and pin the bit pattern of the double 1.0.
goal: Decode and encode a fixed64 value as eight little-endian bytes.
spec:
  scenario: A fixed64 is eight little-endian bytes
  status: failing
  lines:
    - kw: Given
      text: 'the value 1 as a fixed64'
    - kw: When
      text: 'it is encoded'
    - kw: Then
      text: 'it is the bytes 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 and decodes back to 1'
    - kw: And
      text: 'the double 1.0 has the bit pattern 0x3FF0000000000000, which little-endian is 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF0, 0x3F'
code:
  lang: go
  source: |
    func ReadFixed64(b []byte) uint64 {
      var v uint64
      for i := 0; i < 8; i++ { v |= uint64(b[i]) << (8 * i) } // low byte first
      return v
    }
    func AppendFixed64(buf []byte, v uint64) []byte {
      for i := 0; i < 8; i++ { buf = append(buf, byte(v>>(8*i))) }
      return buf
    }
    // a double is these same 8 bytes reinterpreted (math.Float64frombits)
checkpoint: You can decode and encode fixed64 values. Commit and stop here.
---

The **I64** wire type is I32's bigger sibling: exactly **eight bytes**,
little-endian, no length prefix, backing `fixed64`, `sfixed64`, and `double`. The
decode and encode are the same low-byte-first loop as fixed32 with eight iterations
instead of four. Encoding the integer 1 gives a single `0x01` followed by seven
zero bytes, a good sanity check that the least-significant byte really does come
first.

A `double` reinterprets those eight bytes as an IEEE 754 double-precision number.
The value 1.0 is the bit pattern `0x3FF0000000000000`; written little-endian the
nonzero bytes land at the high end, `... 0xF0 0x3F`, which is a useful shape to
recognize when you eyeball a hex dump. With fixed32 and fixed64 in hand you can now
read every numeric scalar protobuf defines; only strings and bytes remain.
