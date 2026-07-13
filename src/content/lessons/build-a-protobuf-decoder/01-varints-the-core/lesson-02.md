---
project: build-a-protobuf-decoder
lesson: 2
title: A single-byte varint
overview: Protobuf stores integers as varints, and the simplest case is a value small enough to fit in one byte. Today you decode that case and learn the rule that decides when a varint is only one byte long.
goal: Decode a varint whose value fits in a single byte, consuming exactly one byte.
spec:
  scenario: A small integer is one varint byte
  status: failing
  lines:
    - kw: Given
      text: 'a reader over the single byte 0x08'
    - kw: When
      text: 'ReadVarint is called'
    - kw: Then
      text: 'it returns 8 and the position is now 1'
    - kw: And
      text: 'over the byte 0x7F it returns 127, and over 0x00 it returns 0, each consuming exactly one byte'
code:
  lang: go
  source: |
    // if the high bit (0x80) is clear, this byte is the whole value
    func (r *Reader) ReadVarint() uint64 {
      b := r.ReadByte()
      // the low 7 bits are the value; bit 7 says "more bytes follow"
      // for now assume it is clear
      return uint64(b & 0x7F)
    }
checkpoint: You can decode a one-byte varint. Commit and stop here.
---

A **varint** (variable-length integer) uses as few bytes as the value needs. Each
byte carries **7 bits of payload** in its low bits; the top bit, `0x80`, is the
**continuation flag**. When that flag is clear, the byte is the last (or only) byte
of the number. So any value from 0 to 127 is a single byte equal to the value
itself: `0x08` is 8, `0x7F` is 127.

That is why the first useful integers you will meet - small field numbers, short
lengths, a boolean - cost exactly one byte. Mask off the top bit with `& 0x7F` to
be safe, even though it is already clear here, because the very next lesson keeps
reading while that bit is set. Confirm the position advanced by one: the cursor
must be left sitting on the next field, not the byte you just read.
