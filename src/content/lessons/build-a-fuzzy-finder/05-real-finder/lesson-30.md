---
project: build-a-fuzzy-finder
lesson: 30
title: A fast path for big lists
overview: Sorting a whole corpus on every keystroke does not scale. Today you keep only the best K matches during the scan, so a huge candidate list costs a bounded amount of work per query.
goal: Compute the top K results in a single pass that never holds more than K results at once, matching the sort-then-truncate result exactly.
spec:
  scenario: Bounded top-K in one pass
  status: failing
  lines:
    - kw: Given
      text: 'the corpus ["a_xab", "xab", "ab", "zzab", "abc"] and query "ab" (scores ab 40, abc 40, xab 39, zzab 38, a_xab 37)'
    - kw: When
      text: scanTopK is called with k = 3
    - kw: Then
      text: 'it returns ["ab", "abc", "xab"] - identical to ranking everything and taking the top 3 (ab and abc tie at 40, so the shorter "ab" leads), but computed without ever sorting the full list'
code:
  lang: go
  source: |
    // Scan candidates; keep a bounded collection of the best K seen so far
    // (a small heap, or an insertion into a sorted slice of length <= k).
    // Score each candidate once; if it beats the worst kept (or K isn't
    // full), insert it and drop any overflow. Sort the K at the end using
    // the SAME comparison (score, then length, then order) as rank().
    func scanTopK(query string, candidates []string, k int) []Result { ... }
checkpoint: The finder finds the best matches on a large corpus without sorting it all. Commit and stop here.
---

Ranking sorts every match, which is fine for hundreds of candidates but wasteful for a corpus of hundreds of thousands where the finder only ever shows a screenful. The **fast path** keeps just the **best K** results *while scanning*: score each candidate once, and hold onto only the top K seen so far - a small bounded collection, a heap or a short sorted slice - discarding anything that cannot make the cut. Memory and per-candidate work stay bounded no matter how large the corpus grows.

The essential contract is that this **produces the same answer** as the simple sort-then-truncate: same K results, same order, using the same score-then-length-then-input-order comparison. Only the cost changes. Getting the tie-break identical is the subtle part - the bounded collection has to order equal-score candidates by length and original position exactly as `rank` did, or the fast path and the slow path would disagree on which matches sit at the boundary. With this, the finder is ready for a real, large corpus.
