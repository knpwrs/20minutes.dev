---
project: build-a-protobuf-decoder
lesson: 21
title: Packed and unpacked repeated
overview: A repeated scalar can arrive packed in one Len field or spread across many tagged fields, and a correct decoder accepts both and yields the same list. Today you make a repeated field decode identically either way.
goal: Decode a repeated scalar field to the same list whether it is packed or unpacked.
spec:
  scenario: Both wire forms of a repeated field give one list
  status: failing
  lines:
    - kw: Given
      text: 'a descriptor with field 4 "scores" as a repeated int32'
    - kw: And
      text: 'the packed form 0x22, 0x06, 0x03, 0x8E, 0x02, 0x9E, 0xA7, 0x05'
    - kw: When
      text: 'the message is decoded'
    - kw: Then
      text: 'scores is the list 3, 270, 86942'
    - kw: And
      text: 'the unpacked form 0x20, 0x03, 0x20, 0x8E, 0x02, 0x20, 0x9E, 0xA7, 0x05 decodes to the same list'
code:
  lang: go
  source: |
    // for a repeated scalar field, accept either wire form:
    //   Len   -> UnpackVarints(f.Bytes) contributes many values
    //   Varint-> f.Varint contributes one value
    // concatenate contributions across every occurrence of the number
checkpoint: Repeated fields decode the same packed or unpacked. Commit and stop here.
---

A decoder must be liberal about repeated scalars because the two wire forms are
both legal and both common. The **packed** form is a single Len field whose payload
is the values' varints concatenated. The **unpacked** form is the same values each
written as its own tagged field, so the number repeats. Proto3 packs by default,
but an older sender, or a message merged from several sources, may send the
unpacked form - and the specification requires a decoder to accept either for the
same field.

The rule: for a field the descriptor marks repeated, gather contributions across
every occurrence. A Len occurrence unpacks into many values; a Varint occurrence
contributes one. Pin both encodings of `[3, 270, 86942]` on field 4 - the packed
`0x22 0x06 ...` and the unpacked triple of `0x20`-tagged varints - and confirm they
decode to the identical list. This tolerance is the wire-format side of protobuf's
forward compatibility, the same instinct as skipping unknowns and filling defaults.
