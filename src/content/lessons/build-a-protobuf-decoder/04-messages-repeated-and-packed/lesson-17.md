---
project: build-a-protobuf-decoder
lesson: 17
title: Embedded messages
overview: A Len field can hold not just a string but a whole nested message, and decoding it is the same parser called on the payload bytes. Today you recurse, turning a nested field into a decoded sub-message.
goal: Decode a Len field whose payload is itself a message by parsing it recursively.
spec:
  scenario: A nested message decodes by recursion
  status: failing
  lines:
    - kw: Given
      text: 'the bytes 0x1A, 0x03, 0x08, 0x96, 0x01'
    - kw: When
      text: 'the message is decoded and field 3 is treated as an embedded message'
    - kw: Then
      text: 'field 3 is a Len field whose three payload bytes 0x08, 0x96, 0x01 parse to a sub-message with field 1 equal to 150'
    - kw: And
      text: 'the outer decode is unchanged by the recursion; only fields you interpret as messages are parsed further'
code:
  lang: go
  source: |
    // a Len payload is nothing special: hand it to a fresh reader and parse
    func (f Field) AsMessage() ([]Field, error) {
      if f.Wire != WireLen { return nil, fmt.Errorf("field %d is not Len", f.Number) }
      return ParseFields(NewReader(f.Bytes))
    }
checkpoint: You can decode an embedded message by recursing into its bytes. Commit and stop here.
---

Nothing in the wire format distinguishes an **embedded message** from a `string` or
a `bytes` field - all three are the Len wire type, a length and a blob. The
difference is entirely in interpretation: if the schema (or you) decide a Len
field's payload is a message, you decode it by handing those payload bytes to the
same `ParseFields` you already wrote, on a fresh reader. That self-similarity is
what makes protobuf messages nest arbitrarily deep with no extra machinery.

Walk `0x1A 0x03 0x08 0x96 0x01`: the tag `0x1A` is field 3, wire type Len; the
length is 3; the three payload bytes are `0x08 0x96 0x01`, which parse to a
sub-message whose field 1 is 150. This is recursion in its most literal form - the
decoder calls itself on a slice of its own input. Because a message and a byte
string look identical on the wire, whether to recurse is a decision the caller
makes, which is exactly why the descriptor in the next chapter has to say "this
field is a message."
