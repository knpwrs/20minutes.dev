---
project: build-a-tts-model
lesson: 31
title: 'Coarticulation smoothing'
overview: 'Feeding a filter an abrupt step between two phonemes'' formant targets produces an audible click at the boundary. Today you replace that step with a short ramp centered on it.'
goal: 'Smooth a sequence of held formant targets by replacing the step at each boundary with a linear ramp centered on it.'
spec:
  scenario: 'Smoothing a step between two formant targets'
  status: failing
  lines:
    - kw: Given
      text: 'an F1 target sequence - 730 Hz held for 200 samples, then 270 Hz held for 200 samples, the same /a/-to-/i/ F1 endpoints as lesson 26 - with a 40-sample linear transition on the boundary between them, covering the half-open index range from 20 samples before the boundary up to (but not including) 20 samples after it, so sample 180 is the first ramped sample and sample 219 the last'
    - kw: When
      text: 'the smoothed contour is generated'
    - kw: Then
      text: 'the output holds exactly 400 samples total'
    - kw: And
      text: 'F1[179] is still exactly 730 - one sample before the transition begins'
    - kw: And
      text: 'F1[180] is exactly 730 and F1[199] is exactly 511.5 - the transition''s start and a point partway through it'
    - kw: And
      text: 'F1[200] is exactly 500 - the boundary sample itself sits mid-transition, not at either target'
    - kw: And
      text: 'F1[220] is exactly 270 - the transition has finished and the target holds for the rest'
code:
  lang: go
  source: |
    // write each plateau first; then, at every internal boundary, overwrite
    // half the transition length on each side with a straight line between
    // that boundary's two neighbouring target values
checkpoint: 'A sequence of formant targets can now be smoothed at its boundaries instead of stepping abruptly, which is exactly what keeps a concatenated utterance from clicking at every phoneme edge. Commit and stop for today.'
---

Lesson 30 can now place segments back to back, but each segment so far has
carried one held formant target for its entire duration - and gluing two
different held targets directly together makes the filter jump
instantaneously from one frequency to the next. A real vocal tract cannot
jump; it has to move continuously between targets, and a hard step in a
formant contour is exactly what an abrupt click in the output comes from.

**Coarticulation smoothing** fixes this without touching the rest of the
timing model: hold each target for its own duration as before, but then
revisit every internal boundary and overwrite a short window around it - half
the transition length before, half after - with a straight line between the
two neighbouring targets. Centering the ramp on the boundary, rather than
starting it there, is the detail worth noticing: sample 200 in today's spec
is the boundary itself, and it lands at 500, exactly halfway between 730 and
270, not at either target.
