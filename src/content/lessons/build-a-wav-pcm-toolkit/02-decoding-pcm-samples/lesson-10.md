---
project: build-a-wav-pcm-toolkit
lesson: 10
title: Decoding 24-bit samples
overview: Twenty-four-bit audio is studio quality but awkward - three bytes per sample, with no native integer that size, so you assemble it and sign-extend by hand. Today you decode it exactly.
goal: Decode 24-bit signed little-endian samples, sign-extending the top bit.
spec:
  scenario: 24-bit little-endian bytes decode with sign extension
  status: failing
  lines:
    - kw: Given
      text: 'the twelve data bytes 00 00 00 FF FF 7F 00 00 80 FF FF FF'
    - kw: When
      text: 'they are decoded as 24-bit signed little-endian samples'
    - kw: Then
      text: 'the samples are [0, 8388607, -8388608, -1]'
    - kw: And
      text: '00 00 80 decodes to -8388608 (the negative edge), because bit 23 is the sign bit'
code:
  lang: go
  source: |
    // assemble three LE bytes, then sign-extend from bit 23
    func decode24(b []byte) []int {
      var out []int
      for i := 0; i+2 < len(b); i += 3 {
        v := int(b[i]) | int(b[i+1])<<8 | int(b[i+2])<<16
        if v >= 1<<23 {   // top bit set -> negative
          v -= 1 << 24
        }
        out = append(out, v)
      }
      return out
    }
checkpoint: You can decode 24-bit signed samples with correct sign extension. Commit and stop here.
---

**24-bit** PCM gives more dynamic range than 16-bit and is common in recording and
mastering, but no CPU has a 24-bit integer type. Each sample is **three** bytes,
little-endian, so you assemble it into a wider integer: `b[0] | b[1]<<8 | b[2]<<16`,
giving a value in `0` to `16777215`. That is the unsigned reading; you still have to
apply the sign.

The sign bit of a 24-bit value is **bit 23**. If the assembled value is `>= 2^23`
(`8388608`), the number is negative and you recover it by subtracting `2^24`
(`16777216`) - the same two's complement fix-up you would get for free from a
native signed type, done manually. So `00 00 80` assembles to `0x800000` =
`8388608`, and subtracting `2^24` gives `-8388608`, the most negative 24-bit
sample. The valid range is `-8388608` to `8388607`. Sign extension is the one thing
to get right here; the byte assembly is just last lesson's pattern with a third
byte.
