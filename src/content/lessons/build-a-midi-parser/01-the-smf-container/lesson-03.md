---
project: build-a-midi-parser
lesson: 3
title: A chunk header
overview: A chunk header is its 4-byte type followed by its 4-byte length - eight bytes that tell you what the chunk is and how many bytes of body follow. Today you read both into one record.
goal: Read an 8-byte chunk header into a value holding its type and length.
spec:
  scenario: Eight bytes decode to a type and a length
  status: failing
  lines:
    - kw: Given
      text: 'the eight bytes 0x4D 0x54 0x68 0x64 0x00 0x00 0x00 0x06'
    - kw: When
      text: 'they are read as a chunk header'
    - kw: Then
      text: 'the type is "MThd" and the length is 6'
    - kw: And
      text: 'the bytes 0x4D 0x54 0x72 0x6B 0x00 0x00 0x00 0x14 give type "MTrk" and length 20'
code:
  lang: go
  source: |
    type ChunkHeader struct {
      Type   string
      Length uint32
    }
    // reuse readType on the first 4 bytes and readU32 on the next 4
    func readChunkHeader(b []byte) ChunkHeader {
      // (fill in using readType and readU32)
    }
checkpoint: You can read a chunk header into a type and a length. Commit and stop here.
---

A **chunk header** is the fixed 8-byte preamble every chunk carries: the 4-byte
type you read yesterday, immediately followed by the 4-byte big-endian length you
read on the first day. The length counts only the bytes of the chunk's **body** -
the data after the header - so `MThd` with length `6` means six more bytes follow,
and `MTrk` with length `20` means twenty.

Combine the two helpers you already have: `readType` on bytes `0..4` and `readU32`
on bytes `4..8`. This little record is what lets you stride through a file one
chunk at a time, because once you know a chunk's length you know exactly where the
next chunk begins.
