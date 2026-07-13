---
project: build-a-wav-pcm-toolkit
lesson: 26
title: Synthesizing a sine tone
overview: Now you make sound from nothing. A sine wave is the purest tone, and generating one means sampling the sine function at the right rate. Today you synthesize an exact sine tone.
goal: Generate sine-wave samples from a frequency, amplitude, and sample rate.
spec:
  scenario: A sine tone samples the sine function at each instant
  status: failing
  lines:
    - kw: Given
      text: 'frequency 1000 Hz, amplitude 10000, sample rate 4000, and 4 samples, with sample n = round(amp * sin(2*pi*f*n/sampleRate))'
    - kw: When
      text: 'the tone is generated'
    - kw: Then
      text: 'the samples are [0, 10000, 0, -10000]'
    - kw: And
      text: 'at n=1 the phase is 2*pi*1000/4000 = pi/2, so sin is 1 and the sample is the full amplitude 10000'
code:
  lang: go
  source: |
    // sample n = round(amp * sin(2*pi*f*n/sr))
    func sine(freq, amp, sampleRate, count int) []int {
      out := make([]int, count)
      for n := 0; n < count; n++ {
        phase := 2 * math.Pi * float64(freq) * float64(n) / float64(sampleRate)
        out[n] = int(math.Round(float64(amp) * math.Sin(phase)))
      }
      return out
    }
checkpoint: You can synthesize a sine tone. Commit and stop here.
---

A digital tone is just the continuous wave **sampled** at each tick of the clock. For
a sine of frequency `f` at sample rate `sr`, the sample at index `n` is `amp *
sin(2*pi*f*n/sr)`: the fraction `f*n/sr` is how many full cycles have elapsed by
sample `n`, times `2*pi` turns it into radians, and `sin` of that scaled by the
amplitude is the value. This is the atom of synthesis - every other waveform is a
variation on stepping a phase forward each sample.

Because samples must be integers, you **round** the scaled sine, and the spec has to
say so - `round` here, half away from zero for the rare tie. With `f = 1000`,
`sr = 4000`, the phase advances `pi/2` per sample, so the four samples land exactly
on `sin` of `0, pi/2, pi, 3pi/2` - giving `[0, 10000, 0, -10000]`. (The `pi` case is
not exactly zero in floating point, but it rounds to `0`.) Pick amplitude below full
scale to leave headroom, and you have a clean tone to feed the rest of the chapter.
