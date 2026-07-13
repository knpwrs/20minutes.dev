---
project: build-a-midi-parser
lesson: 1
title: Reading a big-endian length
overview: A Standard MIDI File is a stream of chunks, and almost every size, count, and length in it is a 4-byte big-endian unsigned integer. Today you build the one helper that reads it - the workhorse the whole parser leans on.
goal: Read a 4-byte big-endian unsigned integer from the front of a byte slice.
spec:
  scenario: Four big-endian bytes decode to their integer value
  status: failing
  lines:
    - kw: Given
      text: 'the four bytes 0x00 0x00 0x00 0x06'
    - kw: When
      text: 'they are read as a big-endian unsigned 32-bit integer'
    - kw: Then
      text: 'the value is 6'
    - kw: And
      text: 'the bytes 0x00 0x00 0x01 0x00 read the same way give 256'
code:
  lang: go
  source: |
    // big-endian: the first byte is the most significant
    func readU32(b []byte) uint32 {
      return uint32(b[0])<<24 | uint32(b[1])<<16 |
        uint32(b[2])<<8 | uint32(b[3])
    }
checkpoint: You can read a big-endian 32-bit length. Commit and stop here.
---

Everything in a Standard MIDI File is stored **big-endian** (most significant byte
first), the same byte order used on the network. A chunk announces its length as a
4-byte field, so before you can walk a file at all you need to turn four bytes into
a number. `0x00 0x00 0x00 0x06` is `0x06`, which is `6` - a track chunk whose body
is six bytes long.

This single helper is the backbone of the whole project: chunk lengths, and later
the header's own body length, are all big-endian 32-bit integers. Get it exactly
right today - byte 0 shifted left 24, byte 3 not shifted at all - and every later
lesson builds on it.
