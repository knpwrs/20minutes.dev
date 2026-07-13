---
project: build-a-protobuf-decoder
lesson: 4
title: Encoding a varint
overview: Decoding is only half a codec; to write protobuf you need to turn an integer back into varint bytes. Today you build the encoder and confirm it is the exact inverse of the reader on the canonical values.
goal: Encode an unsigned integer into varint bytes, the inverse of the reader.
spec:
  scenario: An integer encodes to the same bytes it decoded from
  status: failing
  lines:
    - kw: Given
      text: 'the value 150'
    - kw: When
      text: 'AppendVarint encodes it'
    - kw: Then
      text: 'it produces the bytes 0x96, 0x01'
    - kw: And
      text: '300 encodes to 0xAC, 0x02; the value 0 encodes to a single 0x00; and 127 encodes to a single 0x7F'
code:
  lang: go
  source: |
    // emit 7 bits at a time, low group first, setting 0x80 while more remain
    func AppendVarint(buf []byte, v uint64) []byte {
      for v >= 0x80 {
        buf = append(buf, byte(v)|0x80) // low 7 bits + continuation
        v >>= 7
      }
      return append(buf, byte(v))       // final group, continuation clear
    }
checkpoint: You can encode any unsigned integer to varint bytes. Commit and stop here.
---

Encoding reverses the read: peel off the low 7 bits, and if anything remains, set
the continuation flag `0x80` and shift the value right by 7 to move to the next
group. When the remaining value is small enough to fit in 7 bits, write it with the
flag clear and stop. Note that 0 is a special little case worth pinning: the loop
never runs, so a single `0x00` byte is emitted, and a varint is never zero bytes
long.

Because the encoder walks the same 7-bit groups the reader rebuilt, it is the
exact inverse: encode 150 and you get `0x96 0x01`; feed those bytes to last
lesson's reader and you get 150 back. That round-trip property is the backbone of
the whole project, and appending onto a caller-supplied buffer is the pattern
every later encoder follows, so you can build a message up field by field.
