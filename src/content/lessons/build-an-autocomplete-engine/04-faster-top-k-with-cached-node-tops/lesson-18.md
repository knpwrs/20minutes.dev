---
project: build-an-autocomplete-engine
lesson: 18
title: Serving queries from the cache
overview: With every node carrying its top list, a ranked query no longer needs to scan a subtree - it reads the cache directly. Today you rewire Suggest to use the cache, falling back to a full scan only when a caller wants more than the cache holds.
goal: Answer Suggest from the prefix node's cache for small K, and fall back to a full scan when K exceeds the cache capacity.
spec:
  scenario: Suggest reads the cache, with a scan fallback
  status: failing
  lines:
    - kw: Given
      text: 'a cache capacity of 5 and a trie with Add("cab", 2), Add("car", 5), Add("card", 7), Add("care", 3), Add("cart", 8), Add("cat", 9) (six completions under ca)'
    - kw: When
      text: 'Suggest("ca", K) is called'
    - kw: Then
      text: 'Suggest("ca", 3) reads the cache and returns exactly ["cat", "cart", "card"]'
    - kw: And
      text: 'Suggest("ca", 6) exceeds the capacity of 5, so it falls back to a full scan and returns all six ["cat", "cart", "card", "car", "care", "cab"]'
code:
  lang: go
  source: |
    func (t *Trie) Suggest(prefix string, k int) []string {
      start := t.find(prefix)
      if start == nil { return []string{} }
      var ranked []Completion
      if k <= cacheCap {
        ranked = start.cache // fast path: already ranked and capped
      } else {
        ranked = rankedScan(start, prefix) // fall back to the full subtree scan
      }
      out := []string{}
      for i := 0; i < k && i < len(ranked); i++ {
        out = append(out, ranked[i].Term)
      }
      return out
    }
    // rankedScan = the old WeightedCompletions + sort by ranks (kept as the fallback).
checkpoint: Suggest answers from the cache for small K and scans only when asked for more than the cap. Commit and stop here.
---

This is where the cache pays off. `Suggest` now walks to the prefix node and, when
the caller wants no more than `cacheCap` suggestions, simply reads that node's
`cache` - already ranked, already trimmed - and returns the first `k`. No subtree
traversal, no sort at query time: the whole query costs the prefix walk plus `k`,
which is what makes autocomplete feel instant even over a huge dictionary.

The one case the cache cannot serve is a request for **more** completions than it
stores. There are six words under `ca` but the cache holds only its top five, so
`Suggest("ca", 6)` falls back to the full scan you already wrote and returns all
six correctly. Keeping that scan as a fallback means the cache is a pure
optimisation - correct for every `k`, fast for the common small `k` - and the next
lesson proves the fast path and the scan always agree.
