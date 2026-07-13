---
project: build-a-spell-checker
lesson: 3
title: Building from a word list
overview: A real dictionary holds tens of thousands of words, loaded in one go from a word list. Today you add bulk loading and a size count so a whole vocabulary can arrive at once.
goal: Load many words from a list in one call and report how many distinct words the dictionary holds.
spec:
  scenario: Loading a word list and counting it
  status: failing
  lines:
    - kw: Given
      text: an empty dictionary
    - kw: When
      text: 'AddAll(["cat", "dog", "Cat", "bird"]) is called'
    - kw: Then
      text: 'Size() is 3 (the duplicate "Cat" folds into "cat")'
    - kw: And
      text: 'Contains("cat"), Contains("dog"), and Contains("bird") are all true'
code:
  lang: go
  source: |
    func (d *Dictionary) AddAll(words []string) {
      // reuse Add for each - normalization and de-duplication
      // both fall out of the set you already have
    }
    func (d *Dictionary) Size() int {
      // number of distinct normalized words
    }
checkpoint: The dictionary loads a whole word list at once and reports its size. Commit and stop here.
---

Nobody types a vocabulary in by hand. A spell checker is seeded from a **word
list** - a file with one word per line, from a few hundred to a few hundred
thousand entries - so the dictionary needs a way to swallow a whole slice of words
at once. `AddAll` is just `Add` in a loop, but making it a first-class call is
what lets the rest of the project say "load a dictionary" in one line.

`Size` earns its place as the first thing you can *observe* about a loaded
dictionary, and it quietly proves normalization works: adding `cat` and `Cat`
leaves **one** word, not two, because both fold to the same key in the set. That
de-duplication is free - it is the set doing its job - and it is the first hint
that the same normalization will keep the whole checker consistent.
