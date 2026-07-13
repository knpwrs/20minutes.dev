---
project: build-a-spell-checker
lesson: 35
title: Matching the original case
overview: A suggestion should look like what the user typed - correcting "Teh" to lower-case "the" feels broken. Today you restore the original word's capitalization pattern onto each suggestion.
goal: Reshape a lower-case suggestion to match the capitalization pattern of the word it corrects.
spec:
  scenario: Restoring capitalization onto suggestions
  status: failing
  lines:
    - kw: Given
      text: the lower-case correction "the"
    - kw: When
      text: its case is matched to the original typed word
    - kw: Then
      text: 'MatchCase("the", "Teh") is "The" and MatchCase("the", "TEH") is "THE"'
    - kw: And
      text: 'MatchCase("the", "teh") is "the" (all lower-case stays lower-case)'
code:
  lang: go
  source: |
    func MatchCase(suggestion, original string) string {
      // if original is all upper-case  -> upper-case the suggestion
      // if original is title-case (first letter upper, rest not)
      //                                 -> title-case the suggestion
      // otherwise                       -> leave it lower-case
    }
checkpoint: Suggestions now mirror the capitalization of the word they replace. Commit and stop here.
---

Corrections are generated and stored in lower case, but a user who typed `Teh` at
the start of a sentence expects `The`, not `the`. So the last step before showing a
suggestion is to **restore the case** of the original word onto it: an all-caps typo
gets an all-caps fix, a leading-capital typo gets a leading-capital fix, and an
ordinary lower-case word is left alone.

The three patterns - all upper, title case, all lower - cover the vast majority of
real writing, and matching them makes the tool feel like it understands the text
rather than mechanically lower-casing everything. The `Checker` applies `MatchCase`
to each suggestion as it fills an `Issue`, using the token's *original* text as the
template, so `Suggestions` come out looking like drop-in replacements for what was
typed.
