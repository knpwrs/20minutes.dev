---
project: build-a-protobuf-decoder
lesson: 22
title: Preserving unknown fields
overview: When a decoder meets a field the descriptor does not name, discarding it loses data that a newer sender cared about, so protobuf keeps it as raw wire bytes. Today you preserve unknown fields untouched.
goal: Keep any field absent from the descriptor as its raw wire bytes.
spec:
  scenario: An unknown field is kept as raw bytes
  status: failing
  lines:
    - kw: Given
      text: 'a descriptor that names only field 1 "name" string'
    - kw: And
      text: 'the message bytes 0x0A, 0x03, 0x42, 0x6F, 0x62, 0x28, 0x63 (name "Bob" then unknown field 5, a varint, value 99)'
    - kw: When
      text: 'the message is decoded'
    - kw: Then
      text: 'name is "Bob" and field 5 is preserved as the raw wire bytes 0x28, 0x63 (its tag and value)'
    - kw: And
      text: 'the preserved bytes include the tag, so an unknown field can be re-emitted later exactly as received'
code:
  lang: go
  source: |
    // a field not in the descriptor: re-serialize its tag + value and stash it
    func keepUnknown(unknown *[]byte, f Field) {
      *unknown = AppendTag(*unknown, f.Number, f.Wire)
      // then append the value in its wire form (Varint, fixed bytes, or Len chunk)
    }
checkpoint: Unknown fields survive a decode as raw wire bytes. Commit and stop here.
---

Forward compatibility means old code can read a message written by newer code that
added fields the old code has never heard of. Protobuf achieves this by
**preserving unknown fields**: any field whose number is not in the descriptor is
kept aside as its **raw wire bytes** - tag and value both - rather than discarded.
When the message is later re-encoded, those bytes go back verbatim, so data round
trips through a program that does not understand it.

Preserving the value requires re-serializing it in its original wire form, which is
why `Skip` earlier had to know exactly where each value ends: an unknown Varint is
its varint bytes, an unknown I32 or I64 its fixed bytes, an unknown Len its length
and payload. Pin the example: with only field 1 named, decoding "Bob" plus an
unknown field 5 varint 99 keeps `name` as "Bob" and stashes field 5 as `0x28 0x63`,
the tag `0x28` and the value `0x63`. Keeping the tag is essential; without it you
could not put the field back.
