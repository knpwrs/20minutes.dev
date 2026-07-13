---
project: build-a-protobuf-decoder
lesson: 14
title: Strings and bytes
overview: 'Strings and byte fields are just Len values: a length prefix and that many raw bytes, read as UTF-8 text or kept as-is. Today you interpret a Len payload as a string and encode a full string field, tag and all.'
goal: Decode a Len payload as a string, and encode a string field with its tag and length.
spec:
  scenario: A string field is a tag, a length, and the bytes
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 0x0A, 0x05, 0x68, 0x65, 0x6C, 0x6C, 0x6F'
    - kw: When
      text: 'the field is decoded'
    - kw: Then
      text: 'it is field 1, wire type Len, with the string value "hello"'
    - kw: And
      text: 'encoding field 1 with the string "hi" produces the bytes 0x0A, 0x02, 0x68, 0x69, and an empty string encodes to just 0x0A, 0x00'
code:
  lang: go
  source: |
    // decode: the Len payload bytes are the string, no transformation
    func asString(payload []byte) string { return string(payload) }
    // encode a whole string field: tag, then length-prefixed bytes
    func AppendStringField(buf []byte, field int, s string) []byte {
      buf = AppendTag(buf, field, WireLen)
      buf = AppendVarint(buf, uint64(len(s)))
      return append(buf, s...)
    }
checkpoint: You can decode and encode string and bytes fields. Commit and stop here.
---

A `string` and a `bytes` field share the **Len** wire type and are identical on the
wire: a varint length followed by that many bytes. The only difference is
interpretation. `bytes` is the payload verbatim; `string` is those same bytes read
as **UTF-8** text. Since `ReadBytes` already hands you the payload, decoding a
string is just wrapping it as text, and an empty payload is a legal empty string.

Encoding a full field ties together everything from this chapter and the last:
write the **tag** (field number plus the Len wire type), then the **length** as a
varint, then the raw bytes. The classic worked example, field 1 with "hello",
serializes to `0x0A 0x05` followed by the five ASCII bytes of "hello". Pin the
empty-string case too - `0x0A 0x00` - because a zero length is a value, not an
absence, a distinction the defaults lesson will lean on hard.
