---
project: build-a-spell-checker
lesson: 24
title: The best correction
overview: This is the payoff of the chapter - a single function that takes a word and returns the one best correction. Today you compose the ladder and the frequency ranking into correct().
goal: Return the single most likely correction for a word by ranking its best tier of candidates by frequency.
spec:
  scenario: The one best correction for a word
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary with counts the:1000, ten:100, tea:50, spelling:200'
    - kw: When
      text: 'Correct is called'
    - kw: Then
      text: 'Correct("teh") is "the" and Correct("speling") is "spelling"'
    - kw: And
      text: 'Correct("the") is "the" (already correct) and Correct("xyzzy") is "xyzzy" (no correction found)'
code:
  lang: go
  source: |
    func (d *Dictionary) Correct(word string) string {
      // rank the best available tier by frequency:
      //   return BestByFreq(Candidates(word))
    }
checkpoint: The corrector returns a single best correction for any word. Commit and stop here.
---

Everything in this chapter converges here. `Correct` takes the best available tier
from the **ladder** and ranks it by **frequency**: `Candidates("teh")` is `tea`,
`ten`, `the`, and the towering count of `the` makes it the answer. `speling` has no
real word one edit away by frequency that beats `spelling`, which is a single
insertion away, so it corrects cleanly. This one line - rank the nearest tier by
count - is the heart of a Norvig spell corrector.

The edge cases fall out for free. A correctly-spelled word is its own only
candidate, so `Correct` returns it unchanged. A word with nothing within two edits
falls back to itself, so `Correct` is **total**: it always returns a string, never
an error or an empty result. That totality is what makes the next lesson - running
`Correct` across a whole document - so simple.
