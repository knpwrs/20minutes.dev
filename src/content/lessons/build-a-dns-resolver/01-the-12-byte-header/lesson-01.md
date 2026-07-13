---
project: build-a-dns-resolver
lesson: 1
title: A 16-bit value on the wire
overview: DNS is a byte format, and almost every field in it is a 16-bit number stored big-endian - most significant byte first. Today you build the two tiny helpers that put a 16-bit value into two bytes and read it back, the foundation every later lesson reuses.
goal: Write a 16-bit integer to two big-endian bytes and read it back.
spec:
  scenario: A 16-bit value round-trips through two big-endian bytes
  status: failing
  lines:
    - kw: Given
      text: 'the 16-bit value 1234 (which is 0x04D2)'
    - kw: When
      text: 'it is written to two bytes big-endian'
    - kw: Then
      text: 'the bytes are 0x04 then 0xD2'
    - kw: And
      text: 'reading those two bytes back gives 1234, and reading 0xFF 0xFF gives 65535'
code:
  lang: go
  source: |
    // big-endian: high byte first, low byte second
    func putUint16(v uint16) []byte {
      return []byte{byte(v >> 8), byte(v)}
    }
    func uint16At(b []byte, off int) uint16 {
      // combine the two bytes back into one value
      return uint16(b[off])<<8 | uint16(b[off+1])
    }
checkpoint: You can move a 16-bit value to and from the wire. Commit and stop here.
---

Everything in a DNS message is packed into bytes in a fixed order, and the single
most common unit is the **16-bit unsigned integer** stored **big-endian**: the
high byte comes first, the low byte second. The message identifier, every section
count, the record type, the class, and the data length are all 16-bit big-endian
values. So the very first thing to build is a reliable way to move a 16-bit number
onto two bytes and back off them.

The value `1234` is `0x04D2` in hex, so its high byte is `0x04` and its low byte
is `0xD2`. Writing high-then-low and reading `hi<<8 | lo` is the whole idea. It is
deliberately tiny, but you will call these two helpers in nearly every lesson from
here on, so getting the byte order right now saves a great deal of confusion
later.
