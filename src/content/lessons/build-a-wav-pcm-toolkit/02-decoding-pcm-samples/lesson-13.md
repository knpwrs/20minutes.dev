---
project: build-a-wav-pcm-toolkit
lesson: 13
title: Reading samples end to end
overview: You have a container reader and a decoder for every depth - today you connect them. One call takes WAV bytes and returns per-channel samples, choosing the right decoder from the format.
goal: Parse a full WAV and return its de-interleaved integer samples, dispatching on bit depth.
spec:
  scenario: A full WAV decodes to per-channel samples
  status: failing
  lines:
    - kw: Given
      text: 'the reference 44-byte header (mono, 8000 Hz, 16-bit) followed by data bytes 00 00 FF 7F 00 80 FF FF'
    - kw: When
      text: 'ReadSamples parses the file'
    - kw: Then
      text: 'it returns Format with numChannels 1 and one channel of samples [0, 32767, -32768, -1]'
    - kw: And
      text: 'an 8-bit file dispatches to the 8-bit decoder and a 24-bit file to the 24-bit decoder, by bitsPerSample'
code:
  lang: go
  source: |
    func ReadSamples(b []byte) (Format, [][]int, error) {
      // parseHeader, walk to fmt and data
      f := parseFmt(fmtChunk.Payload)
      var flat []int
      switch f.BitsPerSample {   // pick the decoder by depth
      case 8:  flat = decode8(dataChunk.Payload)
      case 16: flat = decode16(dataChunk.Payload)
      case 24: flat = decode24(dataChunk.Payload)
      }
      return f, deinterleave(flat, f.NumChannels), nil
    }
checkpoint: One call turns WAV bytes into per-channel samples. The reader is complete; commit and stop here.
---

Everything in the first two chapters converges here. `ReadSamples` is the reader's
public front door: hand it the bytes of a WAV file and it returns the parsed
**Format** plus the audio as **per-channel integer slices**. Internally it does what
you have already built - validate the header, walk to the `fmt ` and `data` chunks,
parse the format, decode the data, de-interleave - with one new step tying them
together.

That new step is **dispatch**: the `bitsPerSample` field decides which decoder to
run. Eight bits routes to the unsigned decoder, 16 and 24 to the signed ones. (Float
data, being non-integer, stays a separate path; keep this integer front door for
the depths that share a representation.) An unsupported depth should return a clear
error rather than a wrong guess - the same graceful-failure habit from the header.
This is the deliverable of the reading half: raw file in, exact samples out.
