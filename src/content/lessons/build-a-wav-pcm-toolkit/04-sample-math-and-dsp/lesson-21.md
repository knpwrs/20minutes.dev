---
project: build-a-wav-pcm-toolkit
lesson: 21
title: Normalizing to a target peak
overview: Normalization makes a quiet recording use the full range without distorting it - find the loudest sample and scale everything so that peak hits a chosen target. Today you compute that factor and apply it.
goal: Find a signal's peak amplitude and scale it so the peak reaches a target value.
spec:
  scenario: Normalization scales the peak to the target
  status: failing
  lines:
    - kw: Given
      text: 'the samples [8000, -16000, 4000] and a target peak of 32000'
    - kw: When
      text: 'the signal is normalized'
    - kw: Then
      text: 'the peak magnitude 16000 maps to 32000 (factor 2.0), giving [16000, -32000, 8000]'
    - kw: And
      text: 'the loudest sample reaches exactly the target while the others scale by the same factor'
code:
  lang: go
  source: |
    func normalize(samples []int, target int) []int {
      peak := 0
      for _, s := range samples {
        if abs(s) > peak { peak = abs(s) }   // largest magnitude, either sign
      }
      factor := float64(target) / float64(peak)
      return gain(samples, factor)           // reuse gain (scale + clamp)
    }
checkpoint: You can normalize a signal to a target peak. Commit and stop here.
---

**Normalization** answers "make this as loud as it can be without clipping." You
scan the signal for its **peak magnitude** - the largest absolute sample value,
regardless of sign - then compute the single factor that would lift that peak to a
chosen **target**, and apply it uniformly. Because every sample scales by the same
factor, the shape of the sound is untouched; only the overall level changes. The
target is usually full scale (`32767`), leaving the peak just shy of clipping.

Here the peak is `16000` (from `-16000`, magnitude wins over sign) and the target is
`32000`, so the factor is `32000 / 16000 = 2.0` and the signal doubles to
`[16000, -32000, 8000]` - the loudest sample landing exactly on target. Notice this
is just `gain` with a **computed** factor, so you get clamping for free; with a
target inside the range and an honest peak, nothing actually clips. Reusing gain
here is the point - the DSP operations compose rather than each reinventing the
scale-and-clamp.
