---
project: build-a-spell-checker
lesson: 15
title: Replacing one letter
overview: A wrong key press swaps one correct letter for another. Today you generate every string that changes a single letter to a different one, covering the substitution typos.
goal: Generate all strings formed by replacing one character with a different letter of the alphabet.
spec:
  scenario: Every single-letter substitution of a word
  status: failing
  lines:
    - kw: Given
      text: 'the word "cat" over the 26-letter lowercase alphabet'
    - kw: When
      text: its single-replacement edits are generated
    - kw: Then
      text: 'there are exactly 75 results (25 different letters at each of 3 positions), including "cot", "car", and "bat", and never "cat" itself'
    - kw: And
      text: 'replaces of "a" has exactly 25 results, one for each letter b through z'
code:
  lang: go
  source: |
    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    // for each position i and each letter c != word[i]:
    //   word[:i] + string(c) + word[i+1:]
    func replaces(word string) []string {
      // skip replacing a letter with itself - that is not an edit
    }
checkpoint: You can list every one-letter substitution of a word. Commit and stop here.
---

A **substitution** replaces one letter with another - the typo you make when your
finger lands one key over. For each of the word's positions you try all 25 *other*
letters (replacing a letter with itself is not an edit, so you skip it), which is
why `cat` produces exactly `25 x 3 = 75` strings and a single letter produces 25.
Among `cat`'s 75 are the real words `cot`, `car`, and `bat`.

Skipping the identity replacement is a deliberate choice that keeps every generated
edit genuinely one step away, so the original word never sneaks into its own
candidate set. That mirrors the earlier decision to exclude distance 0 from
`Nearby`: a correctly-spelled word is handled separately, never suggested to itself.
The alphabet here is the 26 lowercase letters, which is why normalization back in
chapter one matters - candidates are generated in lower case, the same form the
dictionary stores.
