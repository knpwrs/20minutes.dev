---
project: build-a-tts-model
lesson: 3
title: Writing a wav file
overview: 'The real work in writing a wav file is quantization - turning your floats into 16-bit integers without overflow. The header is a fixed template you wrap around them. Today you do both.'
goal: 'Quantize floating-point samples to 16-bit integers with the right rounding, then wrap them in the canonical 44-byte wav header.'
spec:
  scenario: Quantizing and writing a wav file
  status: failing
  lines:
    - kw: Given
      text: 'four samples - 0.0, 1.0, -1.0 and 0.5 - at a sample rate of 16000 samples per second'
    - kw: When
      text: 'each sample is quantized to a 16-bit integer by scaling by 32767, symmetrically, rounding halves away from zero'
    - kw: Then
      text: '0.0 quantizes to 0, and 1.0 quantizes to 32767 - not 32768, so full scale never overflows a signed 16-bit value'
    - kw: And
      text: '-1.0 quantizes to -32767, the same magnitude as the positive side'
    - kw: And
      text: '0.5 quantizes to 16384 - 0.5 times 32767 is 16383.5, and rounding half away from zero pushes it up'
    - kw: When
      text: the four quantized samples are written as a wav file
    - kw: Then
      text: 'the file is exactly 52 bytes - the canonical 44-byte RIFF/WAVE header, followed by 8 bytes of 16-bit little-endian sample data'
    - kw: And
      text: 'the header declares a data chunk size of 8 bytes and a RIFF chunk size of 44 bytes - 36 plus the data size'
code:
  lang: go
  source: |
    // the lesson's one real idea: quantize. scale by 32767 (not 32768),
    // symmetric, round half away from zero
    v := x * 32767.0
    if v >= 0 {
      return int16(math.Floor(v + 0.5))
    }
    return int16(math.Ceil(v - 0.5))
    // the header is a fixed 44-byte template; the ONLY values that change are
    // the two sizes: dataSize = numSamples*2, riffSize = 36 + dataSize.
    // write "RIFF", riffSize, "WAVE", "fmt ", 16, 1, 1, sampleRate, ... , then
    // "data", dataSize, then the little-endian samples. copy it, fill the sizes.
checkpoint: 'You can turn any buffer into a wav file that any player will open. Commit and stop for today.'
---

Two steps turn a buffer into a file a media player understands. First,
**quantize**: your floats live in -1 to 1, but a 16-bit PCM sample is an
integer, so scale by 32767 and round. Scaling by 32767 rather than 32768 keeps
the range symmetric - `1.0` and `-1.0` land on `32767` and `-32767`, equal
magnitudes either side of zero, instead of `1.0` overflowing a signed 16-bit
value by one. Rounding is **half away from zero**: a value exactly halfway
between two integers moves away from `0`, not always up, which matters once
negative samples are in the mix.

The header is the easy half, so do not let its length intimidate you. For mono
16-bit PCM - the only case this project needs - it is a **fixed 44-byte
template** that never changes shape. You are not designing a format or working
out field offsets; you are copying a known sequence of bytes and filling in the
two values that depend on your data: the size of the sample data, and the total
file size that follows from it. Treat it as boilerplate, not a puzzle. If you do
want the real container format, with its optional chunks and other bit depths,
`build-a-wav-pcm-toolkit` covers that in depth; here the header is a means to an
end, so that every remaining lesson has somewhere to put its sound.
