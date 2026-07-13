---
project: build-a-wav-pcm-toolkit
lesson: 11
title: Decoding 32-bit float samples
overview: Modern audio pipelines often store samples as 32-bit floats in the range -1.0 to 1.0, sidestepping clipping entirely. Today you decode IEEE 754 floats from their little-endian bytes.
goal: Decode 32-bit little-endian IEEE 754 float samples into floating-point values.
spec:
  scenario: 32-bit little-endian bytes decode to IEEE 754 floats
  status: failing
  lines:
    - kw: Given
      text: 'the sixteen data bytes 00 00 80 3F 00 00 80 BF 00 00 00 00 00 00 00 3F'
    - kw: When
      text: 'they are decoded as 32-bit float little-endian samples'
    - kw: Then
      text: 'the samples are [1.0, -1.0, 0.0, 0.5]'
    - kw: And
      text: '00 00 80 3F is the bit pattern 0x3F800000, which is exactly 1.0'
code:
  lang: go
  source: |
    // combine 4 LE bytes into a uint32, then reinterpret those bits as float32
    func decodeF32(b []byte) []float64 {
      var out []float64
      for i := 0; i+3 < len(b); i += 4 {
        bits := uint32(b[i]) | uint32(b[i+1])<<8 | uint32(b[i+2])<<16 | uint32(b[i+3])<<24
        out = append(out, float64(math.Float32frombits(bits)))
      }
      return out
    }
checkpoint: You can decode 32-bit float samples. Commit and stop here.
---

Floating-point WAV (audioFormat 3, `WAVE_FORMAT_IEEE_FLOAT`) stores each sample as
a **32-bit IEEE 754** float, normally in the nominal range `-1.0` to `+1.0` where
`1.0` is full scale. The huge advantage is headroom: intermediate values can exceed
`1.0` without clipping, so mixing and effects stay clean until you convert back to
integers at the end. It is the native format of most audio software today.

Decoding is two steps: assemble the four little-endian bytes into a **uint32** bit
pattern exactly as you did for 32-bit integers, then **reinterpret** those same
bits as a float rather than converting the number. `00 00 80 3F` little-endian is
`0x3F800000`, and that bit pattern - sign 0, exponent representing 2^0, mantissa 0 -
is precisely `1.0`. The reinterpret (not a numeric cast) is the key move; every
language has a "bits to float" primitive for it. With four integer depths plus
float, you can now read any common PCM sample.
