---
project: build-a-video-container-parser
lesson: 7
title: A box carries its payload
overview: Before boxes can nest or be looked up, each parsed box needs to hold its own contents - the bytes after its header. Today you attach that payload slice to every Box, which is what lets you parse a found box later.
goal: Extend box parsing so each Box carries a Payload slice of exactly the bytes after its header.
spec:
  scenario: A parsed box exposes its payload bytes
  status: failing
  lines:
    - kw: Given
      text: 'an ftyp box of size 28 at offset 0 whose payload begins with the brand "isom"'
    - kw: When
      text: 'the box is parsed with its payload attached'
    - kw: Then
      text: 'Payload has length 20 (28 minus the 8-byte header) and its first four bytes are "isom"'
    - kw: And
      text: 'a box using the 64-bit largesize form (16-byte header) declaring total size 20 has a Payload of length 4'
code:
  lang: go
  source: |
    type Box struct {
      Size       uint64
      Type       string
      HeaderSize int
      Payload    []byte // the bytes after the header, to the box end
    }
    // payload runs from offset+HeaderSize to offset+Size
    // (attach it when parsing a header at a known offset)
checkpoint: Each box now carries its payload. Commit and stop here.
---

A box is a header followed by a payload, and to do anything with a box - parse its
fields, find children inside it - you need those payload bytes in hand. So the
parser attaches a **Payload** slice to every `Box`: the bytes from `offset +
HeaderSize` up to `offset + Size`. For a 28-byte box with an 8-byte header, that is
20 bytes; here they start with the `isom` brand.

The `HeaderSize` you tracked earlier is what makes this exact. A box using the
64-bit largesize form has a 16-byte header, so its payload is `Size - 16`, not
`Size - 8` - slice from the wrong offset and every field reads 8 bytes early. With
each box now carrying its own contents, walking a container's children becomes
"parse the boxes inside this box's payload," which is the next lesson.
