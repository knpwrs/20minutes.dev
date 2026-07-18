---
project: build-a-tts-model
lesson: 13
title: Word stress
overview: 'A word is not just its phonemes - which syllable is stressed changes how long a vowel lasts and where the pitch moves, both coming in later chapters. Today you extract just the stress pattern, one digit per vowel.'
goal: 'Extract the stress pattern of a phoneme sequence - one digit per vowel, ignoring every consonant.'
spec:
  scenario: Extracting a stress pattern from a phoneme sequence
  status: failing
  lines:
    - kw: Given
      text: 'the phoneme sequence T, W, EH1, N, T, IY0 for twenty'
    - kw: When
      text: its stress pattern is extracted
    - kw: Then
      text: 'the pattern is exactly 1, 0 - one entry per vowel, in order, with every consonant skipped'
    - kw: Given
      text: 'the phoneme sequence HH, AY1 for hi'
    - kw: When
      text: its stress pattern is extracted
    - kw: Then
      text: 'the pattern is exactly 1 - a single-vowel word has a single-entry pattern'
code:
  lang: go
  source: |
    // walk the phonemes; a trailing 0/1/2 marks a vowel and is the stress digit
    last := sym[len(sym)-1]
    if last == '0' || last == '1' || last == '2' {
      pattern = append(pattern, int(last-'0'))
    }
checkpoint: 'You can now read the stress pattern straight off any phoneme sequence, ready for durations and pitch to use later. Commit and stop for today.'
---

The stress digit stamped onto each vowel back in lessons 11 and 12 has been
sitting there unread. Pulling it back out is not a lookup or a rule - it is
a straight walk across the phoneme sequence, keeping the trailing digit off
every symbol that has one and skipping every consonant, which has none.

The result is a short pattern like `[1, 0]` for "twenty": one entry per
syllable's vowel, in order, with the consonants around it discarded entirely.
Nothing sounds different yet - this lesson only extracts the pattern, it
does not act on it - but chapter 5's duration rules and pitch accents both
key off exactly this array, so it earns its own lesson before either of them
needs it.
