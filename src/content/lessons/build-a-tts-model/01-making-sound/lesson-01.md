---
project: build-a-tts-model
lesson: 1
title: A buffer of samples
overview: 'Sound, to a computer, is a long list of numbers taken some number of times a second. Today you define the type that pairs those numbers with that rate - the one every remaining lesson passes around.'
goal: 'Define a Buffer holding a sample rate and a slice of samples, and read its duration back.'
spec:
  scenario: Building a sample buffer
  status: failing
  lines:
    - kw: Given
      text: 'a new buffer at a sample rate of 16000 samples per second, holding 5 samples'
    - kw: When
      text: the buffer is inspected
    - kw: Then
      text: 'its sample rate is 16000 and it holds exactly 5 samples'
    - kw: And
      text: 'its duration is 0.0003125 seconds - the sample count divided by the sample rate'
code:
  lang: go
  source: |
    // one struct, not two - every later stage passes both together
    type Buffer struct {
      SampleRate int
      Samples    []float64
    }
    // Duration is just len(Samples) / SampleRate, as a float
checkpoint: 'You have the type every later lesson passes around: a sample rate and the samples themselves. Commit and stop for today.'
---

A recording is a rate and a list: how many numbers are taken per second, and
what those numbers are. Neither one means anything alone - four samples at 8
samples per second is half a second of sound, the same four samples at 16000
samples per second are a quarter of a millisecond. So the first design
decision is small but permanent: the sample rate travels everywhere the
samples do, bundled into one type, rather than as a separate argument every
function has to remember to accept.

Keep the samples themselves as plain floating-point numbers between -1 and 1,
not the 16-bit integers a wav file actually stores on disk. Converting to
integers is a lossy, one-way step, so it is worth taking only once, right at
the end when you write a file - every synthesis stage between now and then
reads and writes these same floats.
