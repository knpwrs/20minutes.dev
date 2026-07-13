---
project: build-an-autocomplete-engine
lesson: 15
title: Top-K suggestions
overview: A suggestion box shows only a handful of options, so the engine must return the top K, not the whole list. Today you cap Suggest at K - and confirm asking for more than exist simply returns them all.
goal: Return at most K suggestions, and all of them when K exceeds the number of completions.
spec:
  scenario: Suggest returns at most K results
  status: failing
  lines:
    - kw: Given
      text: 'a trie with Add("cab", 2), Add("car", 5), Add("card", 7), Add("care", 3), Add("cat", 9)'
    - kw: When
      text: 'Suggest("ca", 2) is called'
    - kw: Then
      text: 'it returns exactly ["cat", "card"] - the two heaviest, dropping the rest'
    - kw: And
      text: 'Suggest("ca", 10) returns all five ["cat", "card", "car", "care", "cab"] (K larger than the count returns everything, never padding)'
code:
  lang: go
  source: |
    // After sorting by the total order, keep at most k:
    if k < len(out) {
      out = out[:k]
    }
    return out
    // Asking for more than exist just returns the whole (shorter) list.
checkpoint: Suggest returns the top K, or all of them when K is larger. Commit and stop here.
---

Truncation is the last step of ranking: sort by the total order, then slice off
everything past the first `k`. With `cat` (9), `card` (7), `car` (5), `care` (3),
`cab` (2) under `ca`, asking for the top 2 gives `cat` and `card` and drops the
rest. This is what keeps a suggestion box short and relevant no matter how many
words share the prefix.

The boundary to get right is `k` **larger** than the number of completions: there
are five words under `ca`, so `Suggest("ca", 10)` returns all five and stops -
never an error, never padded with blanks. Guarding the slice with `if k <
len(out)` handles it cleanly, because slicing to a length beyond the slice would
otherwise panic. That completes ranking; the whole list is computed by scanning
the subtree every time, which the next chapter makes fast.
