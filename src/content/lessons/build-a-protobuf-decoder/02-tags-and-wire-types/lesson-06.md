---
project: build-a-protobuf-decoder
lesson: 6
title: Decoding a tag
overview: Every field in a message begins with a tag, itself a varint, that packs together which field this is and how its value is encoded. Today you split a tag into its field number and wire type, the routing decision the whole decoder pivots on.
goal: Decode a tag varint into a field number and a wire type.
spec:
  scenario: A tag splits into field number and wire type
  status: failing
  lines:
    - kw: Given
      text: 'the tag byte 0x08 (which is the varint 8)'
    - kw: When
      text: 'DecodeTag reads it'
    - kw: Then
      text: 'the field number is 1 and the wire type is 0 (Varint)'
    - kw: And
      text: 'tag 0x0A gives field 1 wire type 2 (Len), tag 0x10 gives field 2 wire type 0, and tag 0x1D gives field 3 wire type 5 (I32)'
code:
  lang: go
  source: |
    const (
      WireVarint = 0
      WireI64    = 1
      WireLen    = 2
      WireI32    = 5
    )
    // low 3 bits are the wire type, the rest is the field number
    func (r *Reader) DecodeTag() (field int, wire int, err error) {
      tag, err := r.ReadVarint()
      // field = tag >> 3 ; wire = tag & 7
      return
    }
checkpoint: You can decode a tag into a field number and wire type. Commit and stop here.
---

A message is a flat list of **fields**, and each field starts with a **tag**. The
tag is encoded as a varint whose bits pack two things: the low **3 bits** are the
**wire type**, and everything above them is the **field number**. So
`field_number << 3 | wire_type` builds a tag, and `tag >> 3` with `tag & 7` takes
it apart. The wire type tells the decoder how to read the value that follows
without knowing anything about the schema.

There are four wire types in current protobuf: **0 Varint** (integers, bools,
enums), **1 I64** (a fixed 8 bytes), **2 Len** (a length-delimited chunk: strings,
bytes, embedded messages, packed fields), and **5 I32** (a fixed 4 bytes). Types 3
and 4 were the deprecated group markers and we skip them. Walk `0x08`: as a varint
it is 8, `8 >> 3` is 1 and `8 & 7` is 0, so field 1, wire type Varint. And `0x0A`
is 10: field 1, wire type Len - the tag you will see in front of almost every
string.
