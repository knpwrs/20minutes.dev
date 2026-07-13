---
project: build-a-wav-pcm-toolkit
lesson: 18
title: Round-trip proof
overview: The real test of a writer is that a reader gets back exactly what you put in. Today you write samples to a file and read them back, proving the whole read/write path is lossless.
goal: Write samples to WAV bytes, read them back, and confirm the samples and format match.
spec:
  scenario: Writing then reading returns the original samples
  status: failing
  lines:
    - kw: Given
      text: 'mono 8000 Hz 16-bit with samples [0, 32767, -32768, -1]'
    - kw: When
      text: 'the samples are written to WAV bytes and then read back with ReadSamples'
    - kw: Then
      text: 'the read-back channel equals [0, 32767, -32768, -1] and the Format matches (numChannels 1, sampleRate 8000, bitsPerSample 16)'
    - kw: And
      text: 'a stereo signal (left [100, 300], right [200, 400]) round-trips to the same two channels'
code:
  lang: go
  source: |
    // WriteSamples: interleave -> encode16 -> buildFile
    func WriteSamples(f Format, channels [][]int) []byte {
      flat := interleave(channels)
      data := encode16(flat)
      return buildFile(f, data)
    }
    // round-trip: ReadSamples(WriteSamples(f, chans)) == (f, chans)
checkpoint: Writing and reading are proven inverses. The writer is complete; commit and stop here.
---

A writer you cannot verify is a writer you cannot trust, and the cleanest
verification is a **round trip**: take samples, write them to bytes, read those
bytes back, and assert you got the identical samples and format. `WriteSamples` ties
the chapter together - interleave the channels, encode them to 16-bit bytes, wrap
them in a file - and `ReadSamples` from lesson 13 unwinds all of it. If the two are
true inverses, the loop is lossless.

Test it on values that stress the extremes and the channel logic at once: the
`[0, 32767, -32768, -1]` mono case covers both signed edges, and a stereo case
proves interleave and de-interleave undo each other while the format survives the
trip. This is the payoff of the writing chapter - not a single new algorithm but the
proof that everything built so far composes into a correct, symmetric codec. From
here on you stop moving bytes and start changing the audio itself.
