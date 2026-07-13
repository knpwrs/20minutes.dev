---
project: build-a-spell-checker
lesson: 25
title: Correcting a document
overview: Close the chapter with a corrector that reads text and fixes it. Today you run correct() over every unknown word in a passage, reporting each typo with its single best correction.
goal: For each unknown word in a text, report it with its one best correction.
spec:
  scenario: Correcting the misspellings in a passage
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary with counts the:1000, cat:500, sat:100'
    - kw: When
      text: 'Corrections("teh cat sat") is called'
    - kw: Then
      text: 'it returns one entry: the word "teh" at start 0, corrected to "the"'
    - kw: And
      text: '"cat" and "sat" produce no entries, because they are known words'
code:
  lang: go
  source: |
    type Correction struct {
      Token Token
      Best  string
    }
    func (d *Dictionary) Corrections(text string) []Correction {
      // Check(text) finds unknown tokens; for each, attach Correct(word)
    }
checkpoint: The corrector rewrites the unknown words of a passage to their best guesses. Commit and stop here.
---

This is a real spell corrector in miniature: hand it a line, and it returns each
word it did not recognize alongside the single word it thinks you meant. It threads
together the whole project so far - the tokenizer finds words and positions,
membership decides which are suspect, and `Correct` picks the best fix using
distance and frequency together.

Compared with chapter two's `Suggestions`, which dumped every nearby word, this
gives one confident answer per typo - the behavior a user actually wants. What it
does *not* yet have is speed: `Correct` still leans on `known2`, whose
tens-of-thousands of generated strings make a large document slow. Chapter five
replaces that engine with a BK-tree index that finds the same candidates while
touching only a sliver of the dictionary - same corrections, far less work.
