---
project: build-an-stt-model
lesson: 1
title: A signal, not a wav file
overview: Every later lesson needs a waveform to work on, and parsing a real audio file format is a distraction from the signal processing itself. Today you build the one signal the whole project runs on - generated from a formula.
goal: Define a signal type and synthesize the pinned 256-sample test signal - silence, then a tone, then silence.
spec:
  scenario: Synthesizing the test signal
  status: failing
  lines:
    - kw: Given
      text: 'a sample rate of 8000 Hz'
    - kw: And
      text: 'a signal of 256 samples: 64 samples of silence, then 128 samples of a 1000 Hz tone at amplitude 0.5, then 64 more samples of silence'
    - kw: And
      text: 'the tone sample at position t within the tone (0-based, t from 0 to 127) is 0.5 times the sine of 2 times pi times 1000 times t, all divided by 8000'
    - kw: When
      text: the signal is synthesized
    - kw: Then
      text: 'it holds exactly 256 samples'
    - kw: And
      text: 'the first 64 samples are all exactly 0'
    - kw: And
      text: 'sample 64 is 0, sample 65 is 0.3535533906, and sample 66 is 0.5 - the tone rising from zero through its first quarter cycle'
    - kw: And
      text: 'sample 192 is exactly 0 again - the trailing silence begins'
code:
  lang: go
  source: |
    // one struct: sample rate plus the raw samples
    type Signal struct {
      SampleRate int
      Samples    []float64
    }
    // silence is just zeros; the tone fills samples 64..191
checkpoint: You have the signal every later lesson in this chapter operates on, built from a formula with no file to read. Commit and stop for today.
---

Real speech recognizers read a **wav** file, but decoding that container format is
a well-defined problem of its own and not this project's problem to solve today -
build-a-wav-pcm-toolkit already covers it. So instead you synthesize the signal:
one flat list of samples at a fixed **sample rate**, 8000 Hz throughout this
project, chosen so that every sample index and frequency stays a clean,
hand-checkable number. The signal itself is silence, then a pure tone, then
silence again - the shape of a single spoken sound with quiet on either side.

The tone's frequency is not arbitrary. `1000 Hz` is chosen because later, once the
signal is cut into 64-sample frames, the tone completes exactly 8 whole cycles per
frame - `1000 * 64 / 8000 = 8`, no remainder. That exactness is what will make the
frequency analysis in chapter 2 land the tone precisely on one bin instead of
smearing it across several, so keep the number in mind even though framing itself
is still two lessons away.
