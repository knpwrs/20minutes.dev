---
project: build-a-spell-checker
lesson: 16
title: Inserting one letter
overview: The last edit family fills in a missing letter. Today you generate every string formed by inserting one letter at any gap, completing the four operations of edit distance.
goal: Generate all strings formed by inserting one alphabet letter at any position.
spec:
  scenario: Every single-letter insertion into a word
  status: failing
  lines:
    - kw: Given
      text: 'the word "cat" over the 26-letter lowercase alphabet'
    - kw: When
      text: its single-insertion edits are generated
    - kw: Then
      text: 'there are exactly 104 results (26 letters at each of 4 gaps), including "cart", "cats", and "scat"'
    - kw: And
      text: 'inserts of "" has exactly 26 results, one single-letter string for each letter'
code:
  lang: go
  source: |
    // for each gap i in 0..len(word) and each letter c:
    //   word[:i] + string(c) + word[i:]
    func inserts(word string) []string {
      // len(word)+1 gaps, 26 letters each
    }
checkpoint: All four edit families - delete, transpose, replace, insert - now exist. Commit and stop here.
---

The fourth and final edit is an **insertion**: a letter the typist dropped, added
back at one of the gaps. A word of length `n` has `n+1` gaps (before the first
letter, between each pair, after the last), and any of the 26 letters can go in
each, so `cat` produces `26 x 4 = 104` strings - among them the real words `cart`,
`cats`, and `scat`. The empty string has one gap, so it produces the 26
single-letter words.

That completes the toolkit: **delete, transpose, replace, insert** are exactly the
operations edit distance counts, so together they generate every string that is
distance 1 from the original. A few of these 100-odd strings per word will be real
dictionary words - the corrections - and the next lesson unions the four families
into a single deduplicated set of "one edit away" candidates.
