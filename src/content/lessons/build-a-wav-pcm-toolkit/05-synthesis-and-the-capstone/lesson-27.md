---
project: build-a-wav-pcm-toolkit
lesson: 27
title: Square and the phase fraction
overview: A square wave is a buzzy tone that sits at full positive for half a cycle and full negative for the other half. Today you generate it from the phase fraction, a cleaner idea than testing the sine's sign.
goal: Generate a square wave from the position within each cycle.
spec:
  scenario: A square wave alternates full positive and full negative per cycle
  status: failing
  lines:
    - kw: Given
      text: 'frequency 1000 Hz, amplitude 10000, sample rate 4000, and 4 samples, with frac = (f*n/sampleRate) mod 1'
    - kw: When
      text: 'the wave is generated, using +amp when frac < 0.5 and -amp otherwise'
    - kw: Then
      text: 'the samples are [10000, 10000, -10000, -10000]'
    - kw: And
      text: 'at n=2 the fraction is exactly 0.5, which is the boundary and yields -amp'
code:
  lang: go
  source: |
    func square(freq, amp, sampleRate, count int) []int {
      out := make([]int, count)
      for n := 0; n < count; n++ {
        frac := math.Mod(float64(freq)*float64(n)/float64(sampleRate), 1.0)
        if frac < 0.5 { out[n] = amp } else { out[n] = -amp }
      }
      return out
    }
checkpoint: You can synthesize a square wave. Commit and stop here.
---

A **square wave** holds full positive amplitude for the first half of every cycle and
full negative for the second half. Its abrupt jumps make it rich in harmonics - a
buzzy, hollow, retro-game timbre. You could define it as the sign of a sine, but the
`sin(pi) = 0` boundary makes that ambiguous; the robust definition works from the
**phase fraction** instead.

The phase fraction is `frac = (f*n/sr) mod 1` - how far you are through the current
cycle, from `0` up to (not including) `1`. If `frac < 0.5` you are in the first half,
so emit `+amp`; otherwise emit `-amp`. This makes the half-way boundary explicit and
deterministic: at `n = 2` with `f = 1000, sr = 4000` the fraction is exactly `0.5`,
which is **not** less than `0.5`, so it yields `-amp`. The four samples come out
`[10000, 10000, -10000, -10000]`. Carrying an explicit phase fraction is the pattern
the sawtooth reuses immediately.
