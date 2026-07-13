---
project: build-a-video-container-parser
lesson: 1
title: The box size field
overview: An MP4 file is nothing but boxes laid end to end, and every box begins with its own length. Today you read that first field - a 4-byte big-endian unsigned integer - which is the single most-used operation in the whole parser.
goal: Read a 4-byte big-endian unsigned integer from the front of a byte slice.
spec:
  scenario: A 4-byte big-endian size decodes to its integer value
  status: failing
  lines:
    - kw: Given
      text: 'the four bytes 0x00 0x00 0x00 0x18'
    - kw: When
      text: 'they are read as a big-endian unsigned 32-bit integer'
    - kw: Then
      text: 'the value is 24'
    - kw: And
      text: 'the bytes 0x00 0x00 0x02 0x00 read the same way give 512'
code:
  lang: go
  source: |
    // big-endian: the first byte is the most significant
    func readU32(b []byte) uint32 {
      return uint32(b[0])<<24 | uint32(b[1])<<16 |
        uint32(b[2])<<8 | uint32(b[3])
    }
checkpoint: You can read a big-endian 32-bit size. Commit and stop here.
---

Everything in an MP4 file is stored **big-endian** (most significant byte first),
which is also called network byte order. A box starts with a 4-byte field giving
its total length in bytes, so before you can do anything else you need to turn
four bytes into a number. `0x00 0x00 0x00 0x18` is `0x18`, which is `24` in
decimal - a box that is 24 bytes long including this size field itself.

This one helper is the workhorse of the whole project: sizes, counts, timescales,
durations, and offsets are almost all big-endian 32-bit integers. Get it exactly
right today - byte 0 shifted left 24, byte 3 not shifted at all - and every later
lesson leans on it.
