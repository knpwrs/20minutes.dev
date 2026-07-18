---
project: build-a-tts-model
lesson: 11
title: A pronunciation lexicon
overview: 'The most reliable way to pronounce a word is to already know it. Today you build a small lexicon mapping whole words straight to their ARPABET phoneme sequence, with a stress digit on every vowel.'
goal: 'Build a lexicon mapping whole words to their ARPABET phoneme sequence, each vowel carrying a stress digit.'
spec:
  scenario: Looking up words in the pronunciation lexicon
  status: failing
  lines:
    - kw: Given
      text: 'a lexicon mapping doctor, has, twenty, cats and hi to their phoneme sequences'
    - kw: When
      text: doctor is looked up
    - kw: Then
      text: 'the result is exactly D, AA1, K, T, ER0 - five phonemes, with a stress digit on the vowel'
    - kw: And
      text: 'has looks up to HH, AE1, Z'
    - kw: And
      text: 'twenty looks up to T, W, EH1, N, T, IY0 - two vowels, each carrying a stress digit'
    - kw: And
      text: 'cats looks up to K, AE1, T, S'
    - kw: And
      text: 'hi looks up to HH, AY1 - AY is the single diphthong phoneme, not two separate vowels'
code:
  lang: go
  source: |
    // map whole words straight to a phoneme slice; vowels carry a trailing digit
    var Lexicon = map[string][]string{
      "cats": {"K", "AE1", "T", "S"},
    }
checkpoint: 'Five real words now resolve straight to their exact pronunciation. Commit and stop for today.'
---

Letters do not determine pronunciation - the same spelling pattern can be
said several ways, and the only fully reliable answer is to already know the
word. A **lexicon** is exactly that: a fixed table from a whole word to the
phoneme sequence a speaker actually produces, sidestepping any spelling rule
entirely. Real systems ship lexicons with hundreds of thousands of entries;
this one needs five, because those are the only words the rest of this
project pronounces.

Each vowel in a lexicon entry carries a trailing stress digit - `0` for
unstressed, `1` for primary stress, `2` for secondary stress - stamped
directly onto the ARPABET symbol, as in `AE1` rather than a separate field.
None of today's five words need a `2`, but the digit is part of the symbol
from the start so lesson 13 has something to read off later. `hi` is worth a
second look: `AY` is one diphthong phoneme, not two vowels squeezed together.
