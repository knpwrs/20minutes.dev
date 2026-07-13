---
project: build-a-protobuf-decoder
lesson: 24
title: Encoding a message back
overview: A codec must close the loop by writing structured fields back to bytes. Today you encode a message from its named values in field-number order, the inverse of the schema-aware decode.
goal: Encode named field values into a message, emitting fields in ascending number order.
spec:
  scenario: A message encodes to bytes that decode back to itself
  status: failing
  lines:
    - kw: Given
      text: 'a descriptor with field 1 "name" string and field 2 "age" int32, and the values name "Alice" and age 30'
    - kw: When
      text: 'the message is encoded'
    - kw: Then
      text: 'the bytes are 0x0A, 0x05, 0x41, 0x6C, 0x69, 0x63, 0x65, 0x10, 0x1E'
    - kw: And
      text: 'decoding those bytes against the descriptor returns the same name and age, so encode and decode round-trip'
code:
  lang: go
  source: |
    // walk descriptor fields in ascending number, emit tag + value per type:
    //   string -> AppendStringField ; int32 -> AppendTag + AppendVarint ; ...
    // omit a scalar equal to its default; append preserved unknown bytes last
checkpoint: You can encode a message and round-trip it through decode. Commit and stop here.
---

Encoding a whole message pulls together every writer you have built. Walk the
descriptor's fields in ascending **field-number order** (the canonical order a
protobuf encoder uses), and for each one emit its tag and value in the type's wire
form: a `string` via the length-delimited field writer, an `int32` as a tag plus a
varint, a `fixed32` as a tag plus four little-endian bytes, and so on. Encoding
"Alice" and 30 reproduces exactly the `0x0A 0x05 ...` bytes you first decoded.

Two rules keep the round-trip honest. First, **omit** any scalar equal to its
proto3 default, matching how real encoders drop zero-valued fields - decode will
put the default back. Second, append any **preserved unknown** fields' raw bytes so
data you did not understand survives the trip. The property to confirm is
`decode(encode(m)) == m`: a message, encoded and decoded again, is unchanged. That
is the definition of a working codec, and you now have one.
