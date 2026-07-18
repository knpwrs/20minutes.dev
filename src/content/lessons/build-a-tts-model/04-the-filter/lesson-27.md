---
project: build-a-tts-model
lesson: 27
title: 'Consonants: bursts and closures'
overview: 'A stop consonant like /t/ is not a filtered tone at all - it is silence while the mouth is sealed, then a short burst of noise on release. Today you model both phases.'
goal: 'Build a closure (silence) and a release burst (noise) for a stop consonant, and check both phases'' exact length and level.'
spec:
  scenario: 'Modeling a stop consonant as closure and burst'
  status: failing
  lines:
    - kw: Given
      text: 'a stop consonant modeled as a 70 ms silent closure followed by a 10 ms noise burst at amplitude 0.3, using a noise source fixed at 1.0, at a sample rate of 16000 samples per second'
    - kw: When
      text: 'both phases are generated'
    - kw: Then
      text: 'the closure holds exactly 1120 samples, every one of them exactly 0 - total silence during the constriction'
    - kw: And
      text: 'the burst holds exactly 160 samples, each exactly 0.3, with an RMS of exactly 0.3000000000 - a constant signal''s RMS equals its own value'
    - kw: When
      text: 'the closure and the burst are concatenated into one stop-consonant segment, in that order'
    - kw: Then
      text: 'the segment is exactly 1280 samples long, its first 1120 samples are all 0, and from sample 1120 onward every sample is 0.3 - the release lands at exactly the sample the silence ends, with no gap or overlap'
code:
  lang: go
  source: |
    // closure: pure silence for the hold duration
    // burst: lesson 16's noise burst, reused as the release phase
    // then join them with lesson 6's Concat - the two-phase shape IS the lesson
    closure := NewBuffer(sampleRate, samplesFor(closureMs))
    stop := Concat(closure, burst) // silence, then release, at one exact seam
checkpoint: 'Stop consonants now have their own two-phase shape - closure then burst - completing chapter 4''s filter and consonant machinery. Commit and stop for today.'
---

Everything chapter 4 has built so far - resonators, cascades, formant
transitions - only makes sense for sounds with a resonating vocal tract
behind them. A **stop consonant** like /t/ briefly has no such thing: the
mouth seals completely, cutting off airflow, then releases it all at once.
That is two distinct phases, not one filtered tone: a silent **closure**
while the constriction holds, then a short noise **burst** on release.

Both phases reuse machinery this project already has. The closure is simply
a buffer of zeros for its hold duration - no filter, no source, just
silence. The burst is lesson 16's noise generator again, scaled to a fixed
amplitude for a short, fixed duration. Nothing new needs deriving; the idea
worth taking away is that a stop consonant's shape in time is two
plainly different phases stitched together, not a single steady sound.
