---
project: build-a-wav-pcm-toolkit
lesson: 8
title: Decoding 16-bit samples
overview: The data chunk is just numbers - audio samples packed as little-endian integers. Today you decode the most common depth, 16-bit signed, including the negative values that two's complement makes easy to get wrong.
goal: Decode a data payload of 16-bit signed little-endian samples into integers.
spec:
  scenario: 16-bit little-endian bytes decode to signed samples
  status: failing
  lines:
    - kw: Given
      text: 'the eight data bytes 00 00 FF 7F 00 80 FF FF'
    - kw: When
      text: 'they are decoded as 16-bit signed little-endian samples'
    - kw: Then
      text: 'the samples are [0, 32767, -32768, -1]'
    - kw: And
      text: 'the bytes 00 80 in particular decode to -32768, not 32768 (the negative edge)'
code:
  lang: go
  source: |
    // read a signed 16-bit LE value: low byte first, then interpret as signed
    func decode16(b []byte) []int {
      var out []int
      for i := 0; i+1 < len(b); i += 2 {
        v := int16(uint16(b[i]) | uint16(b[i+1])<<8)  // int16 gives two's complement
        out = append(out, int(v))
      }
      return out
    }
checkpoint: You can decode 16-bit signed samples, negatives included. Commit and stop here.
---

Uncompressed PCM stores each sample as a fixed-width integer, and **16-bit signed**
is by far the most common - it is what CDs use. Each sample is two bytes,
little-endian, interpreted as a **two's complement** signed value in the range
`-32768` to `32767`. Decoding is: combine the two bytes low-first into a 16-bit
pattern, then read that pattern as signed.

The trap is negatives. The bytes `00 80` form the bit pattern `0x8000`. Read as an
**unsigned** 16-bit number that is `32768`, but as a **signed** 16-bit number it is
`-32768` - the most negative value, sign bit set and nothing else. If you widen to
a bigger integer before applying the sign you get the wrong answer, so interpret it
at 16 bits first (a signed 16-bit type, or by subtracting `65536` when the value is
`>= 32768`). Getting this edge right is what keeps loud negative peaks from
flipping to loud positive ones.
