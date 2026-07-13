---
project: build-sha-256
lesson: 10
title: Padding a short message
overview: SHA-256 processes fixed 512-bit blocks, so any message must first be padded to a whole number of blocks. Today you build the padding rule - a 1 bit, then zeros, then the length - and pin the exact bytes for the message "abc".
goal: Pad a byte message with 0x80, zero bytes, and a 64-bit length so its total length is a multiple of 64 bytes.
spec:
  scenario: Padding "abc" produces one 64-byte block
  status: failing
  lines:
    - kw: Given
      text: 'the 3-byte message "abc" (bytes 0x61, 0x62, 0x63)'
    - kw: When
      text: 'Pad(msg) appends 0x80, then zero bytes, then the 64-bit big-endian bit length, so the total is a multiple of 64 bytes'
    - kw: Then
      text: 'the result is 64 bytes: 0x61 0x62 0x63 0x80, then 52 zero bytes, then the 8-byte length 0x00 0x00 0x00 0x00 0x00 0x00 0x00 0x18'
    - kw: And
      text: 'the length field is the message length in BITS (3 bytes = 24 bits = 0x18), not in bytes'
code:
  lang: go
  source: |
    func Pad(msg []byte) []byte {
      out := append([]byte{}, msg...)
      out = append(out, 0x80)            // the single 1 bit, as a whole byte
      for len(out)%64 != 56 { out = append(out, 0x00) }
      // append uint64(len(msg)*8) as 8 big-endian bytes
      // (fill in)
      return out
    }
checkpoint: You can pad a short message into a single 64-byte block. Commit and stop here.
---

SHA-256 only ever consumes complete **512-bit (64-byte) blocks**, so before
hashing, the message is padded to a whole number of them. The rule has three
parts, always in this order: append a single `1` bit (a whole `0x80` byte, since
messages here are whole bytes), then as many `0` bits as needed, then the original
message length as a **64-bit big-endian** integer counting **bits**. The zeros are
chosen so that everything lands exactly on a 64-byte boundary.

For `"abc"` that means `0x61 0x62 0x63`, then the `0x80` marker, then zeros out to
byte 56, then the 8-byte length. The length is the crucial subtlety: it is the
message size in *bits*, not bytes, so 3 bytes becomes 24, which is `0x18`,
right-aligned in the 64-bit field as `00 00 00 00 00 00 00 18`. That fills the
block to exactly 64 bytes. Appending the length lets the hash tell messages apart
that would otherwise pad identically, and encoding it in bits (not bytes) is a
detail the standard is strict about - get it wrong and every digest is wrong.
