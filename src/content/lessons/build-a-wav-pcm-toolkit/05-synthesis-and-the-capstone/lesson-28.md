---
project: build-a-wav-pcm-toolkit
lesson: 28
title: The sawtooth wave
overview: A sawtooth ramps steadily from the negative peak up to the positive peak each cycle, then snaps back. It reuses the phase fraction from last lesson as a linear ramp. Today you generate one.
goal: Generate a sawtooth wave by mapping the phase fraction to a linear ramp.
spec:
  scenario: A sawtooth ramps linearly across each cycle
  status: failing
  lines:
    - kw: Given
      text: 'frequency 1000 Hz, amplitude 10000, sample rate 4000, and 4 samples, with sample = round(amp * (2*frac - 1)) and frac = (f*n/sampleRate) mod 1'
    - kw: When
      text: 'the wave is generated'
    - kw: Then
      text: 'the samples are [-10000, -5000, 0, 5000]'
    - kw: And
      text: 'frac 0 maps to -amp (the ramp bottom) and frac approaching 1 maps toward +amp'
code:
  lang: go
  source: |
    func sawtooth(freq, amp, sampleRate, count int) []int {
      out := make([]int, count)
      for n := 0; n < count; n++ {
        frac := math.Mod(float64(freq)*float64(n)/float64(sampleRate), 1.0)
        out[n] = int(math.Round(float64(amp) * (2*frac - 1)))   // -1..+1 ramp
      }
      return out
    }
checkpoint: You can synthesize a sawtooth wave. Commit and stop here.
---

A **sawtooth** rises in a straight line from the negative peak to the positive peak
across each cycle, then drops instantly back - the shape that names it. Like the
square it is harmonically rich (it contains every harmonic), which is why it is the
classic starting point for subtractive synthesis. And it falls straight out of the
**phase fraction** you already have.

Map the fraction, which runs `0` to `1` within a cycle, onto the amplitude range
`-1` to `+1` with `2*frac - 1`, then scale by amplitude and round. At `frac = 0` that
is `-amp` (the bottom of the ramp) and as `frac` approaches `1` it climbs toward
`+amp`. With `f = 1000, sr = 4000` the fractions `0, 0.25, 0.5, 0.75` give
`[-10000, -5000, 0, 5000]` - a clean rising ramp. Three waveforms in, you have a
small oscillator bank; next you shape their loudness over time with an envelope.
