---
project: build-a-fuzzy-finder
lesson: 15
title: Best first
overview: Scoring earns its keep only when the best matches rise to the top. Today you sort the results so the highest score comes first - the moment the finder starts to feel smart.
goal: Sort the results so the highest-scoring candidate appears first.
spec:
  scenario: Ordering results by score
  status: failing
  lines:
    - kw: Given
      text: 'the candidates ["a_xab", "xab", "ab"] and the query "ab"'
    - kw: When
      text: rank sorts its results
    - kw: Then
      text: 'the order is "ab" (score 40), "xab" (score 39), "a_xab" (score 37) - highest score first, regardless of input order'
code:
  lang: go
  source: |
    // Sort results by Score descending. Keep it a stable sort so equal
    // scores retain a predictable order (tie-breaking is the next lesson).
    sort.SliceStable(results, func(i, j int) bool {
      return results[i].Score > results[j].Score
    })
checkpoint: The best matches now come first. Commit and stop here.
---

This is the lesson where a filter becomes a **finder**. Filtering told you which candidates match; scoring told you how well; **sorting** puts that to use by floating the strongest matches to the top. Type `ab` and the tight `ab` outranks the looser `xab`, which outranks the scattered `a_xab` - exactly the order a person would pick by eye, now produced by the numbers.

Use a **stable** sort. When two candidates tie on score, a stable sort leaves them in their original relative order, which keeps results from jumping around unpredictably and gives the next lesson a clean base to layer real tie-breaking on. Everything visible about the finder's "intelligence" comes from this step: the same candidates, reordered by match quality.
