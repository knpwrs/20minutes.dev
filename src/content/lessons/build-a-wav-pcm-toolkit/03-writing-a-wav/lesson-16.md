---
project: build-a-wav-pcm-toolkit
lesson: 16
title: Building the fmt chunk
overview: Now you generate a header instead of reading one. Today you build the 16-byte fmt payload, deriving byteRate and blockAlign from the basic parameters so they are always consistent.
goal: Build a 16-byte fmt chunk payload from channels, sample rate, and bit depth.
spec:
  scenario: The fmt payload is built with derived fields
  status: failing
  lines:
    - kw: Given
      text: 'numChannels 1, sampleRate 8000, bitsPerSample 16, audioFormat 1 (PCM)'
    - kw: When
      text: 'the fmt payload is built'
    - kw: Then
      text: 'blockAlign is 2 and byteRate is 16000 (derived, not passed in)'
    - kw: And
      text: 'the 16 payload bytes are 01 00 01 00 40 1F 00 00 80 3E 00 00 02 00 10 00'
code:
  lang: go
  source: |
    func buildFmt(channels, sampleRate, bits int) []byte {
      blockAlign := channels * bits / 8
      byteRate := sampleRate * blockAlign
      p := make([]byte, 16)
      putU16(p[0:], 1)              // audioFormat = PCM
      putU16(p[2:], channels)
      putU32(p[4:], sampleRate)
      putU32(p[8:], byteRate)       // derived
      // putU16 blockAlign at p[12:], bits at p[14:]
      return p
    }
checkpoint: You can build a consistent fmt chunk payload. Commit and stop here.
---

Building the `fmt ` chunk is the mirror of parsing it, with one improvement: you do
not accept `byteRate` and `blockAlign` as inputs, you **compute** them. That is the
right design because they are fully determined by the other fields, and computing
them means a file you write can never have the inconsistent header a careless writer
might produce. `blockAlign = numChannels * bitsPerSample/8`, and `byteRate =
sampleRate * blockAlign`.

You will need little-endian **writers** to match the readers from lesson 2 - a
`putU16` and `putU32` that lay an integer down low byte first. With those, encode
the six fields in order into 16 bytes: format `1`, channels, sample rate, the
derived byte rate, the derived block align, and bits per sample. For mono 8000 Hz
16-bit that is `blockAlign 2`, `byteRate 16000`, and the exact bytes above - the
same 16-byte payload your parser would read straight back. Next you wrap this in the
full file.
