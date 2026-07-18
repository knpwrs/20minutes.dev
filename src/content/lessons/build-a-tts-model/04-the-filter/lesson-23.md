---
project: build-a-tts-model
lesson: 23
title: 'The vowel formant table'
overview: 'Real vowels differ from each other almost entirely in their formant frequencies. Today you front-load a small table of three vowels'' F1, F2 and F3 so every later lesson can look a vowel up instead of hardcoding numbers.'
goal: 'Build a table of F1/F2/F3 frequencies for /i/, /a/ and /u/, with bandwidths held constant per formant slot.'
spec:
  scenario: 'Looking up a vowel''s formant frequencies and bandwidths'
  status: failing
  lines:
    - kw: Given
      text: 'the Peterson & Barney (1952) adult-male average formant frequencies for three vowels, with bandwidths held constant per formant slot - 50 Hz for F1, 70 Hz for F2, 170 Hz for F3 - across every vowel: a deliberate simplification, not measured per-vowel data'
    - kw: When
      text: 'each vowel is looked up'
    - kw: Then
      text: '/i/ is F1=270 Hz, F2=2290 Hz, F3=3010 Hz'
    - kw: And
      text: '/a/ is F1=730 Hz, F2=1090 Hz, F3=2440 Hz'
    - kw: And
      text: '/u/ is F1=300 Hz, F2=870 Hz, F3=2240 Hz'
    - kw: And
      text: 'every vowel shares the same three bandwidths - 50, 70, 170 Hz - since bandwidth is fixed per slot here, not measured per vowel'
code:
  lang: go
  source: |
    type Formant struct{ Freq, BW float64 }
    type VowelFormants struct{ F1, F2, F3 Formant }
    // bandwidth is fixed per SLOT (50, 70, 170 Hz) across every vowel - not measured per vowel
checkpoint: 'Three vowels now have a real formant table behind them, sourced from measured frequencies with an explicitly-flagged simplification on bandwidth. Commit and stop for today.'
---

/i/, /a/ and /u/ are the three **corner vowels** - the extremes of the vowel
space, as far apart from each other as a vowel can get. Peterson & Barney's
1952 study measured exactly this: average formant frequencies across adult
male speakers, still the standard small reference table nearly every
teaching formant synthesizer reaches for.

Frequencies in today's table are real measurements. Bandwidths are not -
they are held constant per formant **slot** (F1 always 50 Hz wide, F2 always
70, F3 always 170) rather than measured separately for each vowel, because
real bandwidth varies only slightly across vowels and a single synthesizer
built on three vowels does not need to track that variation to sound
plausible. Say that plainly rather than letting a reader assume every number
in the table came from the same measurement.
