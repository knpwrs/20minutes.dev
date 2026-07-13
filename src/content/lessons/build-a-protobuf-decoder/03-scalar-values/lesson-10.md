---
project: build-a-protobuf-decoder
lesson: 10
title: Varint scalar types
overview: A varint value is just bits until a type gives it meaning, and several protobuf scalars all ride the Varint wire type. Today you interpret one varint as a bool, an enum, and an int32, including the surprise that a negative int32 costs ten bytes.
goal: Interpret a decoded varint as a bool, an enum, and a signed int32.
spec:
  scenario: One varint, several scalar meanings
  status: failing
  lines:
    - kw: Given
      text: 'the varint value 1'
    - kw: When
      text: 'it is interpreted as a bool and as an enum'
    - kw: Then
      text: 'the bool is true (0 would be false) and the enum is the integer 1'
    - kw: And
      text: 'a negative int32 of -1 is stored as the ten-byte varint 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF 0x01, which decodes to the unsigned value that reinterprets to int32 -1'
code:
  lang: go
  source: |
    func asBool(v uint64) bool   { return v != 0 }
    func asEnum(v uint64) int32  { return int32(v) }
    func asInt32(v uint64) int32 { return int32(uint32(v)) } // low 32 bits
    // int64/uint32/uint64 are the same varint bits, just cast differently
checkpoint: You can read the varint-encoded scalar types. Commit and stop here.
---

The **Varint** wire type is shared by a whole family of scalar types:
`int32`, `int64`, `uint32`, `uint64`, `bool`, and `enum`. On the wire they are all
just a varint; the schema decides how to read the bits. A **bool** is false when
the varint is 0 and true otherwise. An **enum** is stored exactly like an `int32`.
An unsigned value is the varint as-is. The interpretation is a cast, not a
different decode.

The sharp edge is a **negative** `int32` or `int64`. Protobuf does not do anything
clever for plain signed types: a negative value is sign-extended to a full 64 bits
and then varint-encoded, so `int32` -1 becomes ten `0xFF...0x01` bytes on the wire.
Reading it back gives a large unsigned value; casting its low 32 bits back to a
signed `int32` recovers -1. This is wasteful for negative numbers, which is exactly
the problem the next lesson's zigzag encoding solves. Pin the ten-byte encoding so
you know a negative `int32` is never short.
