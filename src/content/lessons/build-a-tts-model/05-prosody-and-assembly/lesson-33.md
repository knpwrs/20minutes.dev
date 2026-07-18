---
project: build-a-tts-model
lesson: 33
title: 'Sentence intonation'
overview: 'A whole utterance needs one pitch contour, not two separate ones - lesson 18''s accents and lesson 19''s declination have to combine. Today you layer them together by simple subtraction.'
goal: 'Combine a piecewise pitch-accent contour with a declination trend into one sentence-level F0 contour.'
spec:
  scenario: 'Combining pitch accents with declination for hi'
  status: failing
  lines:
    - kw: Given
      text: 'pitch accent points for "hi" - 100 Hz at sample 0, 140 Hz at sample 1600 (the HH-to-AY boundary), 90 Hz at sample 6438 (the end) - layered on a declination of 20 Hz per second, over the full 6438-sample buffer from lesson 32, at a sample rate of 16000 samples per second'
    - kw: When
      text: 'the sentence intonation is generated as the accent contour minus the declination trend'
    - kw: Then
      text: 'F0[0] is exactly 100.000000 Hz - the first accent point, with no time yet elapsed for declination to act on'
    - kw: And
      text: 'F0[1600] is exactly 138.000000 Hz - the 140 Hz accent peak minus 2 Hz of decline over 0.1 elapsed seconds'
    - kw: And
      text: 'F0[4019] is exactly 109.976250 Hz - exactly halfway between the peak and the final accent point, minus that much more decline'
    - kw: And
      text: 'F0[6437], the buffer''s last sample, is exactly 81.964085 Hz'
code:
  lang: go
  source: |
    // accents and decline combine by simple subtraction
    accents := PitchContour(points, n)
    out[i] = accents[i] - declineHzPerSec*t // t = elapsed seconds
checkpoint: 'A whole sentence now has one real pitch contour, accents and declination combined, closing out chapter 5''s assembly pipeline. Commit and stop for today.'
---

Lesson 18 built pitch **accents** - a rise into a stressed syllable, a fall
away from it - and lesson 19 built **declination** - a gentle downward drift
across the whole utterance, present even without any accent at all. A real
sentence needs both together, and the two combine in the simplest possible
way: the accent contour rides on top of the declining baseline, so the
sentence's F0 at any sample is just the accent value minus however much the
baseline has fallen by that point in time.

"Hi" gets one accent peak at the HH-to-AY boundary, decaying back down by
the end, riding on top of a steady 20 Hz-per-second decline. Sample 4019
sits exactly halfway between the peak and the final point in both contours
at once, which is why it is worth pinning as a spec value: it confirms the
combination is genuinely additive at a point that is not one of the three
named control points.
