---
project: build-a-spell-checker
lesson: 19
title: Two edits away
overview: Most misspellings are within two edits, not one. Today you reach distance 2 by applying the edit generator twice, catching the words a single edit misses - and see why this power comes at a cost.
goal: Find the real dictionary words within two edits by generating the edits of every one-edit string.
spec:
  scenario: Real words two edits from a typo
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary containing "correct"'
    - kw: When
      text: 'the candidates of the typo "korrekt" are computed'
    - kw: Then
      text: 'known1("korrekt") is empty (no real word is one edit away)'
    - kw: And
      text: 'known2("korrekt") is ["correct"] (it is two substitutions away: k to c, twice)'
code:
  lang: go
  source: |
    func (d *Dictionary) known2(word string) []string {
      // for each e in edits1(word), for each e2 in edits1(e):
      //   keep e2 if Contains(e2)
      // dedupe and sort; this is edits1 applied twice
    }
checkpoint: The generator now reaches real words two edits away. Commit and stop here.
---

A great many real misspellings are **two** edits from the intended word - `korrekt`
for `correct` swaps two letters. To reach them, you apply the edit generator to
each string `edits1` already produced: the edits of the edits. `korrekt` has no real
word one edit away, so `known1` is empty, but two edits away lies `correct`, and
`known2` finds it.

This is where the cost of pure generation shows. `edits1` of a 7-letter word is a
few hundred strings; `edits1` of *each of those* is tens of thousands - `known2`
does hundreds of thousands of set lookups for one typo. It still beats scanning a
large dictionary word by word, and it is independent of dictionary size, but it is
clearly wasteful. That waste is the motivation for chapter five, where a BK-tree
index finds the same distance-2 words while visiting only a small fraction of the
dictionary. First, though, chapter four makes these candidates *rankable*, so the
checker suggests the single best word rather than a pile of them.
