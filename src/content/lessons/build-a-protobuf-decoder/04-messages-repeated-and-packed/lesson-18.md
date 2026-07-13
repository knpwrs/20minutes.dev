---
project: build-a-protobuf-decoder
lesson: 18
title: Unpacking packed varints
overview: A packed repeated field crams many scalars into a single Len payload as back-to-back varints, saving a tag per element. Today you unpack that payload into the list of integers it holds.
goal: Read a Len payload as a run of concatenated varints, returning the list of values.
spec:
  scenario: A packed payload unpacks into many values
  status: failing
  lines:
    - kw: Given
      text: 'the Len payload bytes 0x03, 0x8E, 0x02, 0x9E, 0xA7, 0x05'
    - kw: When
      text: 'UnpackVarints reads varints until the payload is exhausted'
    - kw: Then
      text: 'it returns the three values 3, 270, and 86942'
    - kw: And
      text: 'the full field 0x22, 0x06, then those six payload bytes is field 4, wire type Len, holding that packed list'
code:
  lang: go
  source: |
    // keep reading varints out of the payload until it runs out
    func UnpackVarints(payload []byte) ([]uint64, error) {
      r := NewReader(payload)
      var out []uint64
      for !r.AtEnd() {
        v, err := r.ReadVarint()
        if err != nil { return nil, err }
        out = append(out, v)
      }
      return out, nil
    }
checkpoint: You can unpack a packed repeated field into its values. Commit and stop here.
---

Writing a tag in front of every element of a large repeated scalar field is
wasteful, so protobuf offers a **packed** encoding: one Len field whose payload is
the elements' varints concatenated with no tags between them. The classic example
is the repeated `int32` list `[3, 270, 86942]` on field 4, which serializes to the
tag `0x22`, length `0x06`, then the six bytes `0x03 0x8E 0x02 0x9E 0xA7 0x05` - one
varint for 3, two for 270, three for 86942.

Unpacking is the same idea as parsing a message, minus the tags: point a reader at
the payload and pull varints until it is empty. Because a packed payload is
indistinguishable on the wire from an ordinary `bytes` field, you only know to
unpack it because the schema says the field is a packed repeated scalar - the same
"the bytes need a meaning" theme as embedded messages. In proto3, scalar repeated
fields are packed by default, so this is the common case, not the exotic one.
