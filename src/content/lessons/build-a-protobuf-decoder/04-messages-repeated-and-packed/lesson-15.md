---
project: build-a-protobuf-decoder
lesson: 15
title: Parsing a message into fields
overview: 'A message is just fields back to back, so parsing one is a loop: read a tag, read its value by wire type, repeat until the bytes run out. Today you build that loop and return the message as an ordered list of raw fields.'
goal: Parse a whole message into an ordered list of (field number, wire type, value) records.
spec:
  scenario: A message decodes into its sequence of fields
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 0x08, 0x96, 0x01, 0x12, 0x03, 0x61, 0x62, 0x63'
    - kw: When
      text: 'ParseFields reads to the end of the buffer'
    - kw: Then
      text: 'it returns two fields: field 1 wire type Varint with value 150, then field 2 wire type Len with the bytes 0x61, 0x62, 0x63'
    - kw: And
      text: 'the fields come back in the order they appear, and an empty input returns an empty list'
code:
  lang: go
  source: |
    type Field struct {
      Number int
      Wire   int
      Varint uint64 // for Varint, I32, I64
      Bytes  []byte // for Len
    }
    func ParseFields(r *Reader) ([]Field, error) {
      var out []Field
      for !r.AtEnd() {
        num, wire, err := r.DecodeTag()
        // read the value per wire type, append a Field, continue
      }
      return out, nil
    }
checkpoint: You can parse a message into its list of fields. Commit and stop here.
---

With tags, wire types, and every value reader built, parsing a message is the loop
that ties them together: while the reader is not at the end, decode a tag into a
field number and wire type, read the value the wire type prescribes, and record a
**field**. A Varint value stores its integer; an I32 or I64 stores its fixed value;
a Len value stores its raw payload bytes. The result is the message as an ordered
list of raw fields, faithful to the byte order and not yet interpreted by any
schema.

This raw list is the pivot of the whole decoder. Everything downstream is a view
over it: grouping repeated fields, recursing into an embedded message, or matching
field numbers against a descriptor. Keep the fields in wire order - protobuf allows
the same field number to appear more than once, and which occurrence came last will
matter when we resolve duplicates. An empty message is a legal message: zero fields.
