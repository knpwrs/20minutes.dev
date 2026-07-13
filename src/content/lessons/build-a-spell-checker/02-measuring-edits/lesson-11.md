---
project: build-a-spell-checker
lesson: 11
title: The nearest real words
overview: Now that you can measure edits, you can suggest. Today you scan the whole dictionary for the real words closest to a typo - the honest, brute-force oracle that every faster method later has to agree with.
goal: Return the dictionary words within a given edit distance of a word, excluding the word itself, in sorted order.
spec:
  scenario: Finding the dictionary words near a typo
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary containing "world", "word", "ward", and "cord"'
    - kw: When
      text: 'Nearby("wrld", 1) is called'
    - kw: Then
      text: 'it returns exactly ["world"] (distance 1), sorted alphabetically'
    - kw: And
      text: 'Nearby("wrld", 2) returns ["ward", "word", "world"], and a word at distance 0 from a query is never included'
code:
  lang: go
  source: |
    func (d *Dictionary) Nearby(word string, max int) []string {
      // for every word in the dictionary, keep it when
      //   1 <= Distance(word, entry) <= max
      // (distance 0 is the word itself - not a suggestion)
      // return the matches sorted for a deterministic result
    }
checkpoint: You can list the dictionary words within k edits of any typo. Commit and stop here.
---

A suggestion is just "the real words closest to what you typed." With edit distance
in hand, the most direct way to get them is to **scan the whole dictionary** and
keep every entry within `max` edits of the query. `wrld` is one insertion from
`world`, so at distance 1 that is the only match; widen to distance 2 and both
`word` and `ward` join it. Sorting the result makes the output deterministic, which matters the
moment you start pinning exact expected values.

This brute-force scan is slow - it measures the typo against **every** word in the
dictionary - and the whole back half of the project exists to make it fast. But it
has one priceless property: it is obviously **correct**. That makes `Nearby` the
**oracle**. When candidate generation and the BK-tree index arrive, you will prove
them right by checking they return exactly what this scan returns, only faster.
Excluding distance 0 keeps a correctly-spelled word from ever suggesting itself.
