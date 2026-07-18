---
project: build-a-tts-model
lesson: 14
title: The pulse shape
overview: 'A voice is built from one small waveform repeated - a single glottal pulse that rises to a peak and falls back to silence. Today you build that one pulse as a function of phase, before repeating it.'
goal: 'Define PulseShape as a function of phase and open quotient, and pin its exact value at the start, the open/closed boundary, and the midpoint of each side.'
spec:
  scenario: Pinning the glottal pulse shape at fixed phases
  status: failing
  lines:
    - kw: Given
      text: 'an open quotient of 0.6 - 60% of the period spent rising, 40% spent falling'
    - kw: When
      text: 'the shape is evaluated at phase 0.0'
    - kw: Then
      text: 'the result is 0.0000000000 - silence at the very start of the period'
    - kw: When
      text: 'the shape is evaluated at phase 0.3, the midpoint of the rising portion'
    - kw: Then
      text: 'the result is exactly 0.5000000000 - halfway up'
    - kw: When
      text: 'the shape is evaluated at phase 0.6, exactly the open/closed boundary'
    - kw: Then
      text: 'the result is 1.0000000000 - the peak, reached exactly at the open quotient'
    - kw: When
      text: 'the shape is evaluated at phase 0.8, the midpoint of the falling portion'
    - kw: Then
      text: 'the result is exactly 0.5000000000 - halfway back down'
    - kw: When
      text: 'the shape is evaluated at phase 0.999999, just before the period wraps'
    - kw: Then
      text: 'the result is 0.0000000000 - back to silence, matching phase 0 of the next period'
code:
  lang: go
  source: |
    // phase in [0,1): raised cosine rise 0->1 over [0,oq), then 1->0 over [oq,1)
    if phase < oq {
      return 0.5 * (1 - math.Cos(math.Pi*phase/oq))
    }
    return 0.5 * (1 + math.Cos(math.Pi*(phase-oq)/(1-oq)))
checkpoint: 'You have the single glottal pulse - the atom the whole voice source is built from - pinned at every boundary that matters. Commit and stop for today.'
---

Before you can repeat a pulse, you need one pulse. A voice source is one small
waveform played over and over, so today's job is that one waveform, as a
function of a single number: **phase**, the fraction of the way through one
period, from `0` up to (but not including) `1`. The **open quotient**, `oq`,
splits that fraction in two - the rising, "open" portion where the vocal folds
are apart, and the falling, "closed" portion where they come back together.

A raised cosine gives a smooth `0` to `1` rise over the open portion and a
smooth `1` to `0` fall over the closed one, meeting exactly at the peak when
`phase` equals `oq`. The five points in today's spec fix its shape at every
boundary: silence at `0`, halfway up at `0.3`, the peak exactly at the open
quotient `0.6`, halfway back down at `0.8`, and silence again as phase
approaches `1`. Get this one pulse right and tomorrow's job is only to repeat
it at a pitch.
