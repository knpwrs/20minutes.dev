---
project: build-a-protobuf-decoder
lesson: 3
title: Multi-byte varints
overview: Values above 127 spill across several bytes, each carrying seven more bits in little-endian group order. Today you extend the reader to keep consuming bytes while the continuation flag is set, and decode the canonical example 150.
goal: Decode a varint that spans multiple bytes by combining 7-bit groups little-endian.
spec:
  scenario: A larger integer spans several varint bytes
  status: failing
  lines:
    - kw: Given
      text: 'a reader over the bytes 0x96, 0x01'
    - kw: When
      text: 'ReadVarint is called'
    - kw: Then
      text: 'it returns 150 and the position is now 2'
    - kw: And
      text: 'the bytes 0xAC, 0x02 decode to 300, and 0xFF, 0x01 decode to 255'
code:
  lang: go
  source: |
    func (r *Reader) ReadVarint() uint64 {
      var result uint64
      var shift uint
      for {
        b := r.ReadByte()
        result |= uint64(b&0x7F) << shift // lowest group comes first
        if b&0x80 == 0 { break }          // continuation bit clear: done
        shift += 7
      }
      return result
    }
checkpoint: You can decode varints of any length. Commit and stop here.
---

When a value needs more than 7 bits, protobuf keeps emitting bytes, each with the
continuation flag `0x80` set, until a final byte with the flag clear. The groups
arrive **least-significant first** (little-endian by group): the first byte holds
bits 0 to 6, the next holds bits 7 to 13, and so on. To rebuild the number, mask
each byte to its low 7 bits, shift it left by a growing multiple of 7, and OR it in.

Walk `0x96, 0x01`: the first byte is `1001_0110`, continuation set, payload
`001_0110` which is 22; the second is `0000_0001`, continuation clear, payload 1
shifted left by 7 which is 128. Add them: 128 + 22 is 150. That single example -
150 encodes to `0x96 0x01` - is the one every protobuf tutorial opens with, and
now your reader produces it. The loop naturally handles the one-byte case from the
last lesson too, so this replaces the earlier body.
