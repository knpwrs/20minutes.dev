---
project: build-a-diff-tool
lesson: 12
title: 'Two engines, one answer'
overview: The chapter ends by proving the greedy Myers pass and the dynamic-programming baseline measure the same thing. The identity D = n + m - 2·LCS ties them together and confirms the fast algorithm is computing the right number.
goal: Verify that the Myers edit distance and the LCS length satisfy D = n + m - 2·LCS on several pairs.
spec:
  scenario: The Myers distance and the LCS length agree
  status: failing
  lines:
    - kw: Given
      text: 'both EditDistance (Myers) and lcsLength (dynamic programming) for a pair of documents'
    - kw: When
      text: 'they are computed and compared'
    - kw: Then
      text: 'for ["a", "b", "c"] against ["a", "x", "c"], D = 2 and LCS = 2 satisfy 2 = 3 + 3 - 2·2'
    - kw: And
      text: 'the identity D = n + m - 2·LCS holds for identical documents (0 = 3 + 3 - 2·3) and for "ABCABBA" against "CBABAC" (5 = 7 + 6 - 2·4)'
code:
  lang: go
  source: |
    // a property test, not new machinery
    for _, tc := range pairs {
      d := EditDistance(tc.a, tc.b)
      lcs := lcsLength(tc.a, tc.b)
      want := len(tc.a) + len(tc.b) - 2*lcs
      if d != want {
        t.Fatalf("D=%d, but n+m-2*LCS=%d", d, want)
      }
    }
checkpoint: Myers and the LCS baseline provably measure the same distance. Commit and stop here.
---

Two very different algorithms have now computed the cost of a diff: the quadratic baseline counts the lines you can **keep** (the LCS), and Myers' greedy pass counts the lines you must **change** (the distance `D`). They are two sides of one coin. Every line is either kept or changed, and a kept line is shared - counted once in each document - while a changed line is deleted from the old or inserted into the new. That bookkeeping gives the identity `D = n + m - 2·LCS`, exact for every pair of inputs.

This lesson writes almost no new code; it is a **property check**, and that is the point. When a fast algorithm and a slow-but-obvious one agree on a nontrivial identity across many inputs, you have strong evidence the fast one is correct - a technique worth reaching for whenever you replace a clear implementation with a clever one. With the distance trusted and the trace recorded, the engine is ready: the next chapter walks that trace backward and turns it into the actual keep, delete, and insert operations.
