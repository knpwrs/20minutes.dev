---
project: build-a-jpeg-codec
lesson: 3
title: A segment's length
overview: Most markers introduce a segment whose size is given by a two-byte length field. Today you read that length, learning the one quirk that trips everyone up - the count includes the two length bytes themselves.
goal: Read a segment's two-byte big-endian length and report how many payload bytes follow it.
spec:
  scenario: Reading a segment length field
  status: failing
  lines:
    - kw: Given
      text: 'the two length bytes 0x00, 0x11 right after a marker code'
    - kw: When
      text: the segment length is read
    - kw: Then
      text: 'the length field is 17 and the payload is 15 bytes (the length minus the two length bytes)'
    - kw: And
      text: 'the two length bytes are read most-significant byte first (big-endian), and the minimum length 0x00, 0x02 describes an empty payload of 0 bytes'
code:
  lang: go
  source: |
    // length is a 2-byte big-endian value that COUNTS ITSELF:
    // payload size = length - 2
    func readLength(b []byte, pos int) (length int, payload int) {
      length = int(b[pos])<<8 | int(b[pos+1])
      payload = length - 2
    }
checkpoint: You can read a segment's length and know how many payload bytes it carries. Commit and stop here.
---

Right after most marker codes comes a **two-byte length field**, stored big-endian (most significant byte first), so `00 11` is `0x0011` = 17. The quirk that catches everyone: this length **includes the two length bytes themselves**. A field of 17 therefore describes a segment of 15 payload bytes plus the 2 bytes of the length field. Get this off by two and every later segment lands at the wrong offset.

This framing is what lets a decoder skip a segment it does not care about: read the length, jump `length` bytes past the start of the length field, and you are positioned at the next marker. Not every marker has a length - SOI and EOI do not, and neither do a few others you will handle next lesson - but every table and header segment you actually parse begins with this field.
