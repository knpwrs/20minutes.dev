---
project: build-a-tts-model
lesson: 22
title: 'A formant, and staying stable'
overview: 'A formant is exactly lesson 21''s resonator tuned to a vowel''s measured frequency and bandwidth. Today you plug in real numbers - and find the one bandwidth where the resonator stops being stable at all.'
goal: 'Tune a resonator to the first formant of the vowel /a/, then find the exact bandwidth where its pole leaves the unit circle and the filter stops decaying.'
spec:
  scenario: 'Building a formant resonator and locating its stability boundary'
  status: failing
  lines:
    - kw: Given
      text: 'the vowel /a/''s first formant - 730 Hz with a bandwidth of 50 Hz - at a sample rate of 16000 samples per second'
    - kw: When
      text: 'lesson 21''s resonator formula is applied to these values'
    - kw: Then
      text: 'B0 is 0.0054978284, A1 is -1.8996398597, A2 is 0.9805565561, and the pole magnitude is 0.9902305571 - all matching to about 8 decimal places'
    - kw: And
      text: 'its impulse response begins 0.0054978284, 0.0104438939, 0.0144487055, 0.0172065083, 0.018518396, 0.0183063288 - rising toward a peak before decaying, the signature of a resonance'
    - kw: Given
      text: 'the same resonator formula but with B0 fixed at 1.0 instead of the peak-gain value - so the pole itself, not the gain, is what gets tested - at bandwidth 0 Hz and frequency 1000 Hz'
    - kw: When
      text: 'this fixed-gain filter is driven with an impulse for 1616 samples'
    - kw: Then
      text: 'its pole magnitude R is exactly 1.0 - sitting on the unit circle - and the largest output magnitude in samples 0-16 equals the largest in samples 1600-1616: sustained oscillation, not decay, after 100 full cycles'
    - kw: Given
      text: 'the same fixed-gain construction at bandwidth -1 Hz'
    - kw: When
      text: 'it is driven with an impulse for 100000 samples'
    - kw: Then
      text: 'its pole magnitude is 1.0001963688, just past the unit circle, and the largest output magnitude grows from order 1 in the first 1000 samples to order 1e8 in the last 1000 - unbounded growth, checked by order of magnitude only, since the exact values are not meant to reproduce bit for bit'
code:
  lang: go
  source: |
    // a formant is just Resonator() pointed at a vowel's measured numbers
    f1 := Resonator(sampleRate, 730, 50) // /a/'s first formant
    // for the stability test, fix B0=1 and reuse only a1,a2 built the same way -
    // Resonator's own B0 = (1-R^2)*sin(theta) vanishes to 0 at BW=0, which would
    // silence the very impulse response you are trying to watch
checkpoint: 'A resonator now models a real vowel formant, and you have watched the exact bandwidth where its pole crosses the unit circle and the filter stops being stable. Commit and stop for today.'
---

A **formant** is a resonance of the vocal tract - a frequency band where the
throat and mouth's shape amplifies the glottal source. Acoustically that is
exactly what lesson 21 built: a two-pole resonator tuned to a center frequency
and a bandwidth. So the first half of today needs nothing new, only new
numbers. /a/'s first formant sits at 730 Hz with a 50 Hz bandwidth - low and
narrow, typical of an open vowel - and its impulse response *rises* for a few
samples before decaying, because the pole needs time to build up energy. That
rise is the resonance doing its work.

The second half is where bandwidth bites back. The whole thing only stays
stable while the pole sits inside the unit circle, and the boundary is worth
watching directly rather than taking on faith. One snag: `Resonator()`'s own
`B0`, `(1-R^2)*sin(theta)`, vanishes to exactly `0` right at the marginal case
(`BW=0`, `R=1`) - which would silence the impulse response and hide the very
behaviour you want to see. So fix `B0=1` and study the pole alone. At `BW=0` it
sits exactly on the circle and the resonance rings forever without decaying;
nudge the bandwidth to `-1` and the pole steps outside, and the same recursion
diverges without bound. That boundary is why every formant in the vowel table
you build next carries a safely positive bandwidth.
