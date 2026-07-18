---
project: build-a-tts-model
lesson: 18
title: A pitch contour
overview: 'A voice''s pitch is never flat - it rises into accented syllables and falls away between them. Today you interpolate F0 linearly between a handful of control points, so a phrase''s intonation is more than a single flat tone.'
goal: 'Build a piecewise-linear pitch contour that interpolates F0 between control points, holding each end value flat outside the range they span.'
spec:
  scenario: Interpolating a piecewise-linear pitch contour
  status: failing
  lines:
    - kw: Given
      text: 'three pitch control points - 100 Hz at sample 0, 140 Hz at sample 160, and 100 Hz at sample 320'
    - kw: When
      text: the contour is generated for 321 samples
    - kw: Then
      text: 'F0[0] is exactly 100 - the first control point'
    - kw: And
      text: 'F0[80] is exactly 120 - the linear midpoint on the way up to the peak'
    - kw: And
      text: 'F0[160] is exactly 140 - the peak, exactly at its control point'
    - kw: And
      text: 'F0[240] is exactly 120 - the linear midpoint on the way back down'
    - kw: And
      text: 'F0[320] is exactly 100 - the last control point'
code:
  lang: go
  source: |
    // find the two control points surrounding sample i, then interpolate linearly
    t := float64(i-a.Sample) / float64(b.Sample-a.Sample)
    out[i] = a.F0 + t*(b.F0-a.F0)
checkpoint: 'A phrase can now rise and fall between named pitch targets instead of sitting on one flat F0. Commit and stop for today.'
---

Lesson 14's pulse train took a single, fixed F0 - fine for a single steady
tone, wrong for anything a person would actually say. Real pitch moves: it
climbs into a stressed syllable and eases back down between them. A **pitch
contour** models that as a handful of named control points, each a sample
index paired with an F0 in Hz, with every sample in between filled in by
straight-line interpolation.

Three points are enough to see the whole shape: pitch rising from 100 Hz to
a 140 Hz peak, then falling back to 100 Hz. Sample 80 sits exactly halfway
between the first two points, and its F0, 120, is exactly the linear
midpoint between 100 and 140 - the same arithmetic repeats falling back down
to sample 240. Outside the first and last point the contour simply holds
that point's value - a small convention today's spec does not pin, but a
sensible default so a contour never has to guess at a pitch beyond its own
control points.
