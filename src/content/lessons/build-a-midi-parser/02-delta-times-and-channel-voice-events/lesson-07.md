---
project: build-a-midi-parser
lesson: 7
title: Decoding a variable-length quantity
overview: Delta-times - the gap before each event - are stored as variable-length quantities, seven bits per byte with the high bit flagging "more to come". This is the format's famous tricky bit, and today you decode it.
goal: Decode a variable-length quantity to its value and the number of bytes it used.
spec:
  scenario: A VLQ decodes to a value and a byte count
  status: failing
  lines:
    - kw: Given
      text: 'a byte stream starting 0x00'
    - kw: When
      text: 'a variable-length quantity is decoded'
    - kw: Then
      text: 'the value is 0 and 1 byte was consumed'
    - kw: And
      text: '0x7F decodes to 127 in 1 byte, 0x81 0x00 to 128 in 2 bytes, 0xFF 0x7F to 16383 in 2 bytes, and 0x81 0x80 0x00 to 16384 in 3 bytes'
code:
  lang: go
  source: |
    // take 7 bits from each byte; the top bit means "another byte follows"
    func decodeVLQ(b []byte) (value uint32, n int) {
      for {
        c := b[n]
        n++
        // shift the accumulator up by 7 and add the low 7 bits
        // stop when the high bit (0x80) is clear
      }
    }
checkpoint: You can decode a variable-length quantity. Commit and stop here.
---

A **variable-length quantity** (VLQ) packs an unsigned number into as few bytes as
possible by using only the low **seven** bits of each byte for data. The high bit
(`0x80`) is a **continuation flag**: set means "another byte follows," clear means
"this is the last byte." So small numbers cost one byte and large ones grow as
needed. `0x00` is `0`; `0x7F` is `127`, the largest single-byte value.

Once a value needs an eighth bit it takes two bytes: `128` is `0x81 0x00`, that is
`0000001` then `0000000`, high bits set on every byte except the last. Decode by
looping - shift your accumulator left by 7, add the byte's low 7 bits, and stop the
first time the high bit is clear. Return **how many bytes** you used as well as the
value, because the caller needs to know where the next field begins. Pin the
single-byte, two-byte, and three-byte cases today; every delta-time and several
length fields are VLQs.
