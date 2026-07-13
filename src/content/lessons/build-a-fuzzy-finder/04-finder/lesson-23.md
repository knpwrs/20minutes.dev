---
project: build-a-fuzzy-finder
lesson: 23
title: Narrowing as you type
overview: When the query grows by a character, the new matches are always a subset of the old ones - so you can filter the previous results instead of rescanning everything. Today you exploit that to narrow incrementally.
goal: When the query is extended, produce the new results by re-ranking only the previous result set, and show it equals ranking the extended query over the whole corpus.
spec:
  scenario: Incremental narrowing on an extended query
  status: failing
  lines:
    - kw: Given
      text: 'the corpus ["abc", "abx", "ab", "zzz"], and the results for query "ab" (matching "abc", "abx", "ab")'
    - kw: When
      text: 'the query is extended to "abc" and re-ranked over only those previous results'
    - kw: Then
      text: 'it returns just "abc", and this equals ranking "abc" over the whole corpus - extending a query can only ever remove matches, never add them'
code:
  lang: go
  source: |
    // Extending a query only shrinks the match set, so re-rank the prior
    // matches instead of the full corpus.
    func narrow(prev []Result, extendedQuery string) []Result {
      cands := make([]string, len(prev))
      for i, r := range prev { cands[i] = r.Candidate }
      return rank(extendedQuery, cands)   // same result, less work
    }
checkpoint: Growing the query narrows the previous results without rescanning the corpus. Commit and stop here.
---

Interactive typing has a property worth exploiting: each new character can only ever **remove** matches. If a candidate does not contain `ab` as a subsequence, it certainly does not contain `abc`, so the matches for a longer query are always a **subset** of the matches for its prefix. That means when the user types another character, the finder does not need to look at the whole corpus again - it can re-rank just the **previous results**.

On a small list this is only a nicety, but on a large one it is the difference between rescanning a million lines per keystroke and rescanning the few thousand that still match. The correctness check is that narrowing from the previous results yields exactly the same set as ranking the extended query against the whole corpus - so the optimization changes cost, not answers. The mirror case, when the user **deletes** a character and the match set can *grow* again, needs the full corpus and gets its own lesson later.
