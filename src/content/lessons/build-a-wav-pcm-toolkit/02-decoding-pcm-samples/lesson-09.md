---
project: build-a-wav-pcm-toolkit
lesson: 9
title: Decoding 8-bit samples
overview: Eight-bit WAV audio is the one depth stored unsigned, with silence sitting at 128 instead of 0. Today you decode it by removing that bias, a small twist that catches everyone once.
goal: Decode 8-bit unsigned samples into signed integers centered on zero.
spec:
  scenario: 8-bit unsigned bytes decode by subtracting the 128 bias
  status: failing
  lines:
    - kw: Given
      text: 'the four data bytes 0x80 0x00 0xFF 0x81'
    - kw: When
      text: 'they are decoded as 8-bit unsigned samples'
    - kw: Then
      text: 'the samples are [0, -128, 127, 1]'
    - kw: And
      text: '0x80 (128) decodes to 0 - the unsigned midpoint is silence'
code:
  lang: go
  source: |
    // 8-bit WAV is UNSIGNED: subtract the 128 bias to center on zero
    func decode8(b []byte) []int {
      var out []int
      for _, x := range b {
        out = append(out, int(x)-128)
      }
      return out
    }
checkpoint: You can decode 8-bit unsigned samples with the bias removed. Commit and stop here.
---

Eight-bit PCM is the odd one out: unlike every larger depth, it is stored
**unsigned**. A byte ranges `0` to `255`, and the format puts **silence at 128**,
the midpoint, rather than at 0. So a raw byte of `128` means a zero-amplitude
sample, `255` is the most positive, and `0` is the most negative. This is called a
**biased** or **offset** representation.

To bring 8-bit samples into the same signed, zero-centered world as every other
depth, you **subtract 128**: byte `128` becomes `0`, byte `255` becomes `127`, byte
`0` becomes `-128`. Now the values live in `-128` to `127`, exactly the signed
8-bit range, and the same mixing and gain math will work across all depths. Forget
the bias and every 8-bit file reads as a loud DC offset - constant near-maximum
instead of silence at rest.
