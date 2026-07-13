---
project: build-a-fuzzy-finder
lesson: 22
title: The top of the list
overview: A finder shows a screenful, not thousands of matches. Today you take just the best K results, the first step toward a tool that stays fast and readable on a big list.
goal: Return only the top K results from a ranked list, handling K larger than the list and K of zero.
spec:
  scenario: Keeping the best K results
  status: failing
  lines:
    - kw: Given
      text: 'the candidates ["a_xab", "xab", "ab", "zzab"] ranked for query "ab" (scores ab 40, xab 39, zzab 38, a_xab 37)'
    - kw: When
      text: 'topK is called with k = 2, then k = 10, then k = 0'
    - kw: Then
      text: 'k = 2 returns ["ab", "xab"] (the two best), k = 10 returns all four in ranked order (k larger than the list is fine), and k = 0 returns an empty list'
code:
  lang: go
  source: |
    // Assumes results are already ranked. Slice off the first k, but never
    // past the end.
    func topK(results []Result, k int) []Result {
      if k > len(results) { k = len(results) }
      if k < 0 { k = 0 }
      return results[:k]
    }
checkpoint: The finder can return just the best handful of matches. Commit and stop here.
---

An interactive finder never shows every match - it shows the top of the list, one screenful, because that is all a person reads and all a terminal displays. So after ranking, the finder keeps only the **best K** results. Today that is a simple truncation of the sorted list, but pinning its edges matters: asking for more than exist should return everything, not error, and asking for zero should return nothing.

Truncating here is also the first move toward performance. Right now `topK` runs after a full sort, which is fine for hundreds of candidates. On a corpus of hundreds of thousands, sorting everything just to throw most of it away is wasteful - a later lesson keeps only the top K *during* the scan instead. Establishing the top-K contract now, on the easy path, means that optimization is a drop-in replacement with the same signature and the same result.
