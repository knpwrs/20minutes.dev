---
project: build-a-tts-model
lesson: 29
title: 'Duration rules'
overview: 'A phoneme''s base duration is not its final duration - stress stretches vowels, and being the last sound in an utterance stretches almost anything. Today you apply both rules, in a fixed order.'
goal: 'Apply a stress multiplier to vowels and diphthongs and a final-lengthening multiplier to the last phoneme, base then stress then final.'
spec:
  scenario: 'Applying stress and final-lengthening to the word hi'
  status: failing
  lines:
    - kw: Given
      text: 'the word "hi", pronounced HH AY1 - HH an unvoiced fricative carrying no stress, AY a diphthong with primary stress (1), AY being the last phoneme in the word'
    - kw: And
      text: 'the rules: primary stress multiplies by 1.2, secondary stress by 1.1, no stress by 1.0 - applied only to vowels and diphthongs - and phrase-final position multiplies by 1.4 regardless of manner, applied in the fixed order base, then stress, then final'
    - kw: When
      text: 'each segment''s duration is resolved'
    - kw: Then
      text: 'HH''s duration is exactly 100.0000 ms - its 100 ms fricative base, unchanged, since HH is a consonant with no stress rule and is not phrase-final'
    - kw: And
      text: 'AY''s duration is exactly 302.4000 ms - its 180 ms diphthong base, times 1.2 for primary stress (216 ms), times 1.4 for being phrase-final (302.4 ms)'
code:
  lang: go
  source: |
    // fixed order: base, then stress (vowels/diphthongs only), then final
    d := base
    if manner == vowel || manner == diphthong { d *= stressFactor }
    if isFinal { d *= 1.4 }
checkpoint: 'Every segment now resolves a real duration from two composable rules applied in a fixed order, not a single ad hoc number. Commit and stop for today.'
---

Lesson 28's table is a starting point, not the answer - real speech stretches
sounds for reasons the manner alone cannot explain. Two of the biggest
effects are **stress**, which lengthens a stressed vowel relative to an
unstressed one, and **phrase-final lengthening**, which stretches whatever
sound happens to end an utterance, vowel or consonant alike. Both are
closed-form multipliers, and both compose onto the same base duration in a
fixed order: base, then stress, then final.

"Hi" - HH followed by the diphthong AY1 - shows both rules working together.
HH is a consonant, so the stress rule never touches it, and it is not the
word's last phoneme, so final-lengthening skips it too: it keeps its plain
100 ms base. AY gets both: its 180 ms diphthong base is stretched by 1.2 for
primary stress to 216 ms, then by 1.4 for being phrase-final, landing at
exactly 302.4 ms. Applying stress before final, rather than the reverse,
gives the same answer here, but the order still needs pinning so later
lessons never have to guess it.
