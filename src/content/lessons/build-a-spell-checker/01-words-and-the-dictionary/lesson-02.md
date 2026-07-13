---
project: build-a-spell-checker
lesson: 2
title: Adding words, case-insensitively
overview: A dictionary you cannot fill is useless. Today you add words to it and make membership ignore case, so "Apple", "apple", and "APPLE" are all the same known word.
goal: Store added words and make Contains match regardless of the case of either the stored word or the query.
spec:
  scenario: Adding a word and matching it in any case
  status: failing
  lines:
    - kw: Given
      text: an empty dictionary
    - kw: When
      text: 'Add("Apple") is called'
    - kw: Then
      text: 'Contains("apple") is true, Contains("APPLE") is true, and Contains("Apple") is true'
    - kw: And
      text: 'Contains("banana") is still false'
code:
  lang: go
  source: |
    // fold case ONCE, on the way in and on the way out, so the
    // stored form and the query form always agree
    func normalize(word string) string { /* lower-case it */ }
    func (d *Dictionary) Add(word string) {
      // store normalize(word) in a set
    }
    func (d *Dictionary) Contains(word string) bool {
      // look up normalize(word)
    }
checkpoint: The dictionary holds words and matches them case-insensitively. Commit and stop here.
---

Spelling is not about capitalization - `Apple` at the start of a sentence and
`apple` mid-sentence are the same word, and a checker that flagged one because it
learned the other would be useless. The fix is **normalization**: fold every word
to a single canonical form (lower case) both when you store it and when you look
it up. Do it in one small helper so the two paths can never drift apart.

A **set** is the natural home for the words - you only care whether a word is
present, not how many times or in what order (that changes later, when frequency
starts to matter). Storing the normalized form means the set holds `apple`, and
any casing of the query normalizes to the same key and hits.
