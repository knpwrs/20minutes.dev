---
project: build-a-tts-model
lesson: 12
title: Letter-to-sound rules
overview: 'A lexicon only covers the words already in it, and a synthesizer still needs a fallback for every word that is not. Today you apply an ordered letter-to-sound table that turns any spelling into a plausible pronunciation.'
goal: 'Apply an ordered, longest-grapheme-first letter-to-sound rule table to spell out a word not in the lexicon.'
spec:
  scenario: Applying letter-to-sound rules to an unknown word
  status: failing
  lines:
    - kw: Given
      text: 'the word "smith", which is not in the lexicon, and an ordered rule table where two-letter graphemes are tried before single letters'
    - kw: When
      text: letter-to-sound rules are applied left to right
    - kw: Then
      text: 'the result is exactly S, M, IH, TH - the digraph "th" matches as one unit at the end, rather than falling back to a "t" followed by an "h"'
    - kw: And
      text: 'the first vowel produced carries a stress digit, so the final result is exactly S, M, IH1, TH'
code:
  lang: go
  source: |
    // try each 2-letter grapheme first; fall through to 1-letter rules only if none match
    for _, r := range twoLetterRules {
      if word[i:i+2] == r.grapheme {
        out = append(out, r.phonemes...)
        i += 2
      }
    }
checkpoint: 'Any word can now get a pronunciation, lexicon or not, and the digraph-before-single-letter ordering is pinned. Commit and stop for today.'
---

The lexicon from lesson 11 only answers for words it already contains, and
no fixed table can hold every word a speaker might type. **Letter-to-sound
rules** are the fallback: an ordered table of grapheme-to-phoneme mappings,
walked left to right across the spelling, standing in for a pronunciation
nobody looked up in advance.

Order matters more than the individual rules. A two-letter grapheme like
"th" has to be tried before the single-letter rules for "t" and "h", or
"smith" would wrongly produce a `T` followed by an `HH` instead of the single
fricative `TH`. Checking the longest possible match first, and falling back
to shorter ones only when nothing longer fits, is the general shape every
rule-based fallback like this takes. Once the phonemes come out, the same
stress-stamping rule from the lexicon applies: the first vowel produced gets
a `1`.
