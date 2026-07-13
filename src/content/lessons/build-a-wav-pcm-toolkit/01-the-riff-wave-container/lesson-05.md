---
project: build-a-wav-pcm-toolkit
lesson: 5
title: The fmt chunk fields
overview: The fmt chunk holds everything you need to interpret the audio - format, channels, sample rate, and bit depth. Today you unpack its six fields and confirm the two that are derived agree with the rest.
goal: Parse the fmt payload into its six fields and check the derived fields are consistent.
spec:
  scenario: The fmt payload unpacks into six fields
  status: failing
  lines:
    - kw: Given
      text: 'a 16-byte fmt payload 01 00 02 00 44 AC 00 00 10 B1 02 00 04 00 10 00'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'audioFormat 1, numChannels 2, sampleRate 44100, byteRate 176400, blockAlign 4, bitsPerSample 16'
    - kw: And
      text: 'the consistency checks hold: blockAlign == numChannels*bitsPerSample/8 and byteRate == sampleRate*blockAlign'
code:
  lang: go
  source: |
    type Format struct {
      AudioFormat, NumChannels, BitsPerSample int
      SampleRate, ByteRate, BlockAlign        int
    }
    // fields in order: u16 u16 u32 u32 u16 u16
    func parseFmt(p []byte) Format {
      // AudioFormat = u16(p[0:2]); NumChannels = u16(p[2:4]); ...
    }
checkpoint: You can parse the fmt chunk into a Format struct. Commit and stop here.
---

The `fmt ` chunk is the audio's data sheet. Its 16-byte payload holds six fields in
a fixed order: **audioFormat** (1 means uncompressed PCM), **numChannels** (1 mono,
2 stereo), **sampleRate** (samples per second per channel), **byteRate**,
**blockAlign**, and **bitsPerSample**. Read them with the `u16`/`u32` helpers you
already have - two `u16`, two `u32`, two `u16`.

Two of these fields are **derived** and must agree with the others, which makes
them a free integrity check. **blockAlign** is the size of one sample frame across
all channels: `numChannels * bitsPerSample/8` (here `2 * 16/8 = 4`). **byteRate**
is how many bytes one second of audio takes: `sampleRate * blockAlign` (here
`44100 * 4 = 176400`). A file whose stored values disagree with these formulas is
malformed; computing them yourself both validates the header and gives you the
numbers you will regenerate when you write files.
