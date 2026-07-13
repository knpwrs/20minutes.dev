---
project: build-a-protobuf-decoder
lesson: 19
title: A descriptor and named fields
overview: Raw field numbers are hard to work with, so a descriptor maps each number to a name and a type, letting you decode into named, typed values. Today you build that schema-directed decode.
goal: Decode a message into named fields using a descriptor of field number to name and type.
spec:
  scenario: A descriptor turns numbers into named typed values
  status: failing
  lines:
    - kw: Given
      text: 'a descriptor mapping field 1 to name "name" type string and field 2 to name "age" type int32'
    - kw: And
      text: 'the message bytes 0x0A, 0x05, 0x41, 0x6C, 0x69, 0x63, 0x65, 0x10, 0x1E'
    - kw: When
      text: 'the message is decoded against the descriptor'
    - kw: Then
      text: 'the decoded message has a Fields map with name equal to the string "Alice" and age equal to the int32 value 30'
code:
  lang: go
  source: |
    type FieldDesc struct {
      Name, Type string  // Type: "string","int32","bool","message",...
      Repeated   bool    // filled in by the repeated-fields lesson
      Sub        Descriptor // for Type "message": the nested descriptor
    }
    type Descriptor map[int]FieldDesc
    type Message struct {
      Fields  map[string]any
      Unknown []byte // raw bytes of fields the descriptor does not name (later lesson)
    }
    func Decode(d Descriptor, fields []Field) (Message, error) {
      m := Message{Fields: map[string]any{}}
      for _, f := range fields {
        fd, ok := d[f.Number]
        // switch fd.Type: "string" -> asString(f.Bytes); "int32" -> asInt32(f.Varint); ...
      }
      return m, nil
    }
checkpoint: You can decode a message into named, typed fields. Commit and stop here.
---

Up to now the decoder has been schema-free: it knows wire types but not what any
field means. A **descriptor** supplies that meaning, mapping each field number to a
**name** and a **type**. This is the hand-built stand-in for what a `.proto` file
and its generated code would give you - the project never compiles a `.proto`, you
just write the little map yourself. With it, decoding becomes: parse the raw
fields, then for each one look up its descriptor and interpret its raw value
according to the declared type.

The interpretation is a dispatch over the scalar readers you already built: a
`string` field reads its Len payload as text, an `int32` casts its varint, a `bool`
tests for nonzero, a `message` recurses. Decoding the Alice-and-age bytes against
the descriptor yields a `Message` whose `Fields` map has `name` equal to "Alice"
and `age` equal to 30 - structured data at last, not just numbered bytes.

Return a small `Message` value now rather than a bare map, and give `FieldDesc` a
`Repeated` flag and a `Sub` descriptor from the start. Those slots stay unused
today, but the next few lessons fill them in - defaults, repeated and packed
fields, nested messages, and the `Unknown` bytes for any field number the
descriptor does not mention - and starting with the whole shape means none of those
lessons has to reshape what you build today.
