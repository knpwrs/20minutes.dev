---
project: build-a-protobuf-decoder
lesson: 25
title: 'Capstone: decode and round-trip a real message'
overview: The finale decodes one real protobuf message that exercises every piece at once - a string, an int, a nested message, a packed repeated list, and an unknown field - into exact structured values, then encodes it back to equivalent bytes. Every layer proves itself together.
goal: Decode a full message to exact values, preserve its unknown field, and round-trip it back to bytes.
spec:
  scenario: A whole message decodes and re-encodes losslessly
  status: failing
  lines:
    - kw: Given
      text: 'a descriptor with field 1 "name" string, field 2 "age" int32, field 3 "home" a message whose field 1 is "zip" string, and field 4 "scores" a repeated int32'
    - kw: And
      text: 'the message bytes 0x0A, 0x03, 0x41, 0x64, 0x61, 0x10, 0x24, 0x1A, 0x07, 0x0A, 0x05, 0x31, 0x30, 0x30, 0x30, 0x31, 0x22, 0x03, 0x07, 0x08, 0x09, 0x48, 0x7B'
    - kw: When
      text: 'the message is decoded against the descriptor'
    - kw: Then
      text: 'name is "Ada", age is 36, home.zip is "10001", scores is the list 7, 8, 9, and unknown field 9 is preserved as the raw bytes 0x48, 0x7B'
    - kw: And
      text: 'encoding the decoded message back produces the identical 23 bytes, unknown field included'
code:
  lang: go
  source: |
    fields, _ := ParseFields(NewReader(msg))
    m, _ := Decode(personDesc, fields)   // name, age, home{zip}, scores, +unknowns
    out := Encode(personDesc, m)          // fields in number order, then unknown bytes
    // out is byte-for-byte equal to msg
checkpoint: Your codec decodes a real message to exact values and round-trips it byte for byte. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a real Protocol Buffers
**codec**. The capstone message packs one of everything - a `string` name, an
`int32` age, a nested `home` message with its own `zip` string, a packed repeated
`scores` list, and an unknown field 9 the descriptor never mentions. Decoding it
walks every path you built: varints for the tags and the age, a length-delimited
string for the name, recursion into the nested message, unpacking the packed
`[7, 8, 9]`, proto3 defaults for anything absent, and stashing field 9's raw bytes.

Then the round-trip closes the loop. Encoding the decoded message emits the known
fields in ascending number order and appends the preserved unknown bytes, and the
result is byte-for-byte identical to the 23 bytes you started with. That exact match
is only reachable if varints, tags, wire types, scalars, nesting, packing, defaults,
and unknown-field preservation all agree. From a cursor that read one byte, you have
built the honest core of the format that gRPC and countless systems move data with -
a decoder and encoder that are entirely yours, and that speak the real protobuf
wire format.
