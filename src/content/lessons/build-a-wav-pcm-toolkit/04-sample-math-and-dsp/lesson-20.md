---
project: build-a-wav-pcm-toolkit
lesson: 20
title: Mixing two signals
overview: Mixing is how two sounds become one - you add them sample by sample. Like gain, the sum can exceed the range, so today reuses the clamp to keep a loud mix from wrapping into noise.
goal: Add two signals sample by sample, clamping the sum to the 16-bit range.
spec:
  scenario: Mixing sums samples and clamps the result
  status: failing
  lines:
    - kw: Given
      text: 'signal A [10000, 20000, -20000, 100] and signal B [5000, 20000, -20000, -100]'
    - kw: When
      text: 'they are mixed'
    - kw: Then
      text: 'the result is [15000, 32767, -32768, 0]'
    - kw: And
      text: '20000+20000 clamps to 32767 (not the wrapped -25536) and -20000+-20000 clamps to -32768'
code:
  lang: go
  source: |
    func mix(a, b []int) []int {
      out := make([]int, len(a))
      for i := range a {
        out[i] = clampInt16(a[i] + b[i])   // sum, then clamp - never wrap
      }
      return out
    }
checkpoint: You can mix two signals with clamping. Commit and stop here.
---

**Mixing** combines two signals into one by **adding** their samples position by
position - the mathematical truth that sound pressures superimpose. Two voices, a
tone plus a drum, a signal plus its echo: all of them are a sample-wise sum. Where
both signals are loud and in phase, the sum can easily exceed the range, so mixing
has the same overflow hazard as gain and the same answer.

Reuse `clampInt16`: add the two samples, then clamp. `20000 + 20000` is `40000`,
which clamps to `32767` - crucially **not** the value a naive 16-bit add would give,
where `40000` wraps around to `-25536` and a loud passage turns to a click. The
negative edge mirrors it: `-20000 + -20000` clamps to `-32768`. Assume the two
signals are the same length here; padding a shorter one is a detail you can add
later. Mixing plus gain are the two building blocks the capstone leans on hardest.
