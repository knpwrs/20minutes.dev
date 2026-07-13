---
project: build-a-spell-checker
lesson: 18
title: Candidates from the dictionary
overview: Most one-edit strings are gibberish. Today you filter them against the dictionary to keep only the real words - and prove the result exactly matches the brute-force oracle, at a fraction of the cost.
goal: Keep only the one-edit strings that are real dictionary words, and confirm they equal the oracle's answer.
spec:
  scenario: Real words one edit from a typo
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary containing "cat", "cot", "cats", "cart", "at", and "car"'
    - kw: When
      text: 'known1("cat") is computed'
    - kw: Then
      text: 'it returns exactly ["at", "car", "cart", "cats", "cot"] (sorted), excluding "cat" itself'
    - kw: And
      text: 'this set is identical to Nearby("cat", 1) from the brute-force scan'
code:
  lang: go
  source: |
    func (d *Dictionary) known1(word string) []string {
      // for each string in edits1(word), keep it if Contains(it)
      // return sorted for a deterministic, oracle-comparable result
    }
checkpoint: Generated candidates now match the brute-force oracle at distance 1. Commit and stop here.
---

Filtering `edits1` against the dictionary keeps only the strings that are actual
words - the **candidates**. For `cat` the 180-odd generated strings collapse to
five real neighbors: `at`, `car`, `cart`, `cats`, `cot`. That is the whole payoff
of candidate generation: you found the corrections by generating a fixed number of
edits and doing set lookups, never scanning the dictionary.

The crucial check is that this fast path is **correct**, and you already have the
tool to prove it - the `Nearby` oracle from chapter two. `known1(word)` must return
exactly `Nearby(word, 1)`: same words, arrived at a completely different way. When
they agree, you can trust generation over scanning. This equivalence is the
backbone of the rest of the project - every faster method is validated by showing
it returns what the honest scan returns.
