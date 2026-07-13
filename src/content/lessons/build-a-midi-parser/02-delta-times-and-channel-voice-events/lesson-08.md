---
project: build-a-midi-parser
lesson: 8
title: Encoding a variable-length quantity
overview: To round-trip a file you also need to write delta-times, so today you build the inverse - turning a number back into its variable-length bytes - and confirm encode-then-decode returns the original.
goal: Encode an unsigned value as variable-length bytes that decode back to it.
spec:
  scenario: A value encodes to VLQ bytes and round-trips
  status: failing
  lines:
    - kw: Given
      text: 'the value 0'
    - kw: When
      text: 'it is encoded as a variable-length quantity'
    - kw: Then
      text: 'the bytes are 0x00'
    - kw: And
      text: '127 encodes to 0x7F, 128 to 0x81 0x00, and 16384 to 0x81 0x80 0x00, and decoding any of these returns the original value'
code:
  lang: go
  source: |
    // build 7-bit groups low-to-high, then emit high-to-low with continuation bits
    func encodeVLQ(v uint32) []byte {
      out := []byte{byte(v & 0x7F)} // last byte has its high bit clear
      for v >>= 7; v > 0; v >>= 7 {
        // prepend (v&0x7F)|0x80 so every earlier byte flags "more follows"
      }
      return out
    }
checkpoint: You can encode a value as a variable-length quantity. Commit and stop here.
---

Encoding is decoding run backwards. Peel the value into **7-bit groups** from the
low end, then emit them most-significant first, setting the continuation bit
(`0x80`) on every byte **except the last**. The last byte - the one carrying the
lowest 7 bits - always has its high bit clear, which is how the decoder knows to
stop.

The trick is ordering: you discover the groups low-to-high but must write them
high-to-low, so build the last byte first and **prepend** each higher group. `16384`
is `0x81 0x80 0x00` - three groups `1`, `0`, `0`, the first two flagged as
continuing. The real test today is the **round-trip**: encode then decode should
return exactly what you started with, for every case you pinned yesterday. That
property is what proves both halves agree.
