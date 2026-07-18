---
project: build-a-tts-model
lesson: 10
title: The phoneme inventory
overview: 'Every remaining lesson in this project dispatches on what a sound actually is, not on its spelling. Today you front-load the full 39-symbol ARPABET phoneme set, each tagged with whether it is voiced and its manner and place of articulation.'
goal: 'Define the full 39-phoneme ARPABET inventory, each with a voiced flag, a manner of articulation and a place of articulation.'
spec:
  scenario: Building the phoneme inventory
  status: failing
  lines:
    - kw: Given
      text: the full ARPABET phoneme inventory
    - kw: When
      text: the inventory is inspected
    - kw: Then
      text: it holds exactly 39 phonemes
    - kw: And
      text: 'AA is voiced, manner vowel, place back'
    - kw: And
      text: 'IY is voiced, manner vowel, place front, and UW is voiced, manner vowel, place back - three vowels distinguished only by place'
    - kw: And
      text: 'B is voiced, manner stop, place bilabial'
    - kw: And
      text: 'S is unvoiced, manner fricative, place alveolar'
    - kw: And
      text: 'M is voiced, manner nasal, place bilabial'
    - kw: And
      text: 'HH is unvoiced, manner fricative, place glottal'
code:
  lang: go
  source: |
    type Phoneme struct {
      Symbol string // ARPABET symbol, no stress digit
      Voiced bool
      Manner string // "vowel", "stop", "fricative", "nasal", ...
      Place  string // oral place of articulation, or tongue position for vowels
    }
    // 39 entries total - a vowel, a stop, a fricative, a nasal and more
reading: 'The CMU Pronouncing Dictionary ARPABET chart lists all 39 symbols with example words.'
checkpoint: 'Every phoneme this project will ever synthesize now has a name and three features that later lessons dispatch on directly. Commit and stop for today.'
---

Up to now, a "phoneme" has just been a string like "AA" or "S" - a symbol
with no properties of its own. That stops working the moment synthesis needs
to decide *how* a sound is made: chapter 3 needs to know whether a phoneme
buzzes the vocal folds or hisses air past them, and chapter 4 needs to know
roughly where in the mouth it is shaped. So today's job is not "make a list
of symbols" - it is attaching **voiced**, **manner** and **place** to every
one of the 39 symbols in the standard ARPABET set, once, so every later
lesson can read a feature off a phoneme instead of special-casing its name.

Manner spans vowels, stops, fricatives, nasals, liquids, glides, diphthongs
and affricates - eight shapes a sound can take. Place is mostly where the
sound is made in the mouth, except for vowels, where it stands in for tongue
position (front, central or back) since a vowel has no real constriction to
locate. Type the full table out now, even though today's spec only checks
seven of the thirty-nine: every remaining phoneme lesson reads straight from
this inventory rather than rebuilding it.
