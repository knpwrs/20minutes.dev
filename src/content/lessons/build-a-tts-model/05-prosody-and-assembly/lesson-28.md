---
project: build-a-tts-model
lesson: 28
title: 'Phoneme durations'
overview: 'Every phoneme needs a target length before it can be placed in time, and manner of articulation is the simplest thing to key that length on. Today you front-load a literal base-duration table.'
goal: 'Build a literal table of base durations in milliseconds, keyed by manner of articulation.'
spec:
  scenario: 'Looking up a phoneme''s base duration by manner'
  status: failing
  lines:
    - kw: Given
      text: 'a literal base-duration table: vowel 130 ms, diphthong 180 ms, stop 70 ms, fricative 100 ms, affricate 90 ms, nasal 70 ms, liquid 60 ms, glide 50 ms'
    - kw: When
      text: 'each manner is looked up'
    - kw: Then
      text: 'diphthong is the longest at 180 ms, since a diphthong has to move between two vowel targets, and glide is the shortest at 50 ms'
    - kw: And
      text: 'stop''s 70 ms covers only the closure - a stop''s 10 ms release burst from lesson 27 is a separate, fixed addition, not part of this table'
code:
  lang: go
  source: |
    var BaseDurationMs = map[Manner]float64{
      MannerVowel: 130, MannerDiphthong: 180, MannerStop: 70,
      MannerFricative: 100, MannerAffricate: 90,
      MannerNasal: 70, MannerLiquid: 60, MannerGlide: 50,
    }
checkpoint: 'Every phoneme now has a real base duration to build on, and you know exactly what a stop''s 70 ms table entry does and does not include. Commit and stop for today.'
---

Chapter 4 built the sounds themselves; chapter 5 is about placing them in
**time**. The simplest possible starting point is a literal table: one base
duration per manner of articulation, the same feature the phoneme inventory
from lesson 10 already carried. A vowel gets more time than a stop by
default, because that is roughly how long speakers actually hold each kind
of sound - no rule needs deriving yet, only a table worth having in one
place before later lessons adjust it.

Read the stop entry carefully: its 70 ms is the **closure** only, matching
lesson 27's silent hold, not the whole consonant. The 10 ms release burst is
a separate, fixed addition on top - a full /t/ ends up longer than this
table's bare 70 ms entry suggests, and that split is deliberate rather than
an oversight.
