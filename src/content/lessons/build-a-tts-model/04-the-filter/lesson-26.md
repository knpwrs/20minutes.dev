---
project: build-a-tts-model
lesson: 26
title: 'Formant transitions'
overview: 'A diphthong like AY does not sit on one vowel''s formants - it glides from one vowel''s targets to another''s. Today you ramp F1/F2/F3 linearly across a segment while the filter''s own state persists underneath.'
goal: 'Ramp a cascade''s formant frequencies linearly from /a/''s targets to /i/''s over 800 samples, keeping filter state continuous across the change.'
spec:
  scenario: 'Transitioning a cascade''s formants from one vowel to another'
  status: failing
  lines:
    - kw: Given
      text: 'linear ramps of F1 (730 to 270 Hz), F2 (1090 to 2290 Hz) and F3 (2440 to 3010 Hz) over 800 samples (50 ms), modeling the diphthong AY as a transition from /a/ to /i/ - a phonetic approximation, since real AY moves from roughly [a] to [I]'
    - kw: And
      text: 'each formant''s bandwidth held at its lesson 23 slot value throughout, since bandwidth does not vary by vowel in this table - only the three frequencies actually move'
    - kw: When
      text: 'the ramps are generated'
    - kw: Then
      text: 'F1 starts at 730.0000, reaches 499.7121 at sample 400, and ends at 270.0000 at sample 799'
    - kw: And
      text: 'F2 starts at 1090.0000, reaches 1690.7509 at sample 400, and ends at 2290.0000 at sample 799'
    - kw: When
      text: 'a cascade is driven by the same glottal source as lesson 25 - a pulse train at F0 100 Hz, open quotient 0.6, amplitude 1.0, at 16000 samples per second - through these time-varying coefficients, recomputing each stage''s coefficients every sample while its delay-line state persists across the change'
    - kw: Then
      text: 'the output stays in the same tiny 1e-4-to-1e-7 range as lesson 24''s cascade, matched with a relative tolerance - for example y[400] is approximately 0.0002154865'
code:
  lang: go
  source: |
    // recompute each stage's coefficients every sample, but let its
    // delay-line state (x1,x2,y1,y2) persist across the coefficient change
    stage.B0, stage.B1, stage.B2, stage.A1, stage.A2 = coeffs(sampleRate, fRamp[i], bwRamp[i])
    y := stage.Step(source[i])
checkpoint: 'A vowel''s formants can now glide continuously from one target to another without resetting the filter, which is exactly how the diphthong AY will be built in chapter 5. Commit and stop for today.'
---

Lesson 25's cascade held one vowel's formants fixed for its whole duration.
A **diphthong** does not - AY starts near /a/'s formants and glides toward
/i/'s over the course of the sound, and this project models that glide as a
straight line from one vowel's targets to the other's. Real AY actually
moves from roughly [a] toward [I], not exactly /i/, so treat this as a
useful phonetic approximation rather than a claim about precise articulation.

The technique that makes this work is recomputing each resonator's
coefficients on every sample while never resetting its delay lines - the
filter's memory of recent input and output samples carries straight through
the coefficient change, exactly the way a real vocal tract's resonances
shift continuously as the tongue moves, rather than jumping between
disconnected filters. Note, too, that only the three frequencies actually
move here: bandwidth is fixed per slot from lesson 23, so its "ramp" is
really just a flat line.
