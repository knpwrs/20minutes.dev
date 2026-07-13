---
project: build-a-wav-pcm-toolkit
lesson: 14
title: Encoding 16-bit samples
overview: Writing a WAV starts where reading ended, run backwards - turn integer samples into little-endian bytes. Today you encode 16-bit signed samples, the exact inverse of the decoder from lesson 8.
goal: Encode 16-bit signed samples into little-endian bytes.
spec:
  scenario: Signed samples encode to 16-bit little-endian bytes
  status: failing
  lines:
    - kw: Given
      text: 'the samples [0, 32767, -32768, -1]'
    - kw: When
      text: 'they are encoded as 16-bit signed little-endian bytes'
    - kw: Then
      text: 'the bytes are 00 00 FF 7F 00 80 FF FF'
    - kw: And
      text: 'the sample -32768 encodes to 00 80 - encoding round-trips the decoder from lesson 8'
code:
  lang: go
  source: |
    // low byte first; masking with 0xFF handles negatives via two's complement
    func encode16(samples []int) []byte {
      var out []byte
      for _, s := range samples {
        u := uint16(int16(s))          // wrap into 16-bit two's complement
        out = append(out, byte(u), byte(u>>8))
      }
      return out
    }
checkpoint: You can encode 16-bit samples back to bytes. Commit and stop here.
---

To write audio you invert the decode step: an integer sample becomes two
little-endian bytes. Take the sample as a 16-bit two's complement value, then emit
the **low** byte first and the **high** byte second - the mirror of reading `b[0] |
b[1]<<8`. For a negative sample the two's complement wrap does the work: `-1`
becomes the pattern `0xFFFF`, emitted as `FF FF`; `-32768` becomes `0x8000`,
emitted low-byte-first as `00 80`.

The test that matters is the **round trip**: encoding `[0, 32767, -32768, -1]` must
produce exactly the bytes that lesson 8 decoded back into those same samples,
`00 00 FF 7F 00 80 FF FF`. If encode and decode are true inverses on the full range
including both edges, you can trust neither one is quietly corrupting the extremes.
This is the first brick of the writer; the chunks that wrap these data bytes come
next.
