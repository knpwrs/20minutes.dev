---
project: build-a-fuzzy-finder
lesson: 27
title: Backspacing
overview: Deleting a character can bring matches back, so unlike growing the query, shrinking it has to reconsider the whole corpus. Today you handle query editing correctly in both directions.
goal: Handle backspacing by re-ranking the shortened query against the full corpus, so matches removed by a now-deleted character reappear.
spec:
  scenario: Re-widening on backspace
  status: failing
  lines:
    - kw: Given
      text: 'a Finder over ["abc", "abx", "ab", "zzz"] whose query is "abc" (results ["abc"])'
    - kw: When
      text: 'a character is deleted so the query becomes "ab"'
    - kw: Then
      text: 'the results widen back to ["ab", "abc", "abx"] (all three re-ranked from the full corpus, not just the prior single result), with the selection reset to 0'
code:
  lang: go
  source: |
    // Backspace shortens the query; the match set can GROW, so you must
    // re-rank the FULL corpus, not the current results. Reuse SetQuery.
    func (f *Finder) Backspace() {
      if len(f.Query) == 0 { return }
      f.SetQuery(f.Query[:len(f.Query)-1])  // ranks over all candidates
    }
checkpoint: Editing the query works in both directions - narrowing and widening. Commit and stop here.
---

Narrowing had a shortcut: a longer query only removes matches, so you can filter the previous results. **Deleting** a character breaks that shortcut completely. A shorter query can **match more** candidates - the ones the deleted character had ruled out - and those are not in the current result set anymore. So backspace has to go back to the **full corpus** and re-rank from scratch.

That is exactly what `SetQuery` already does, so backspace is a thin wrapper that trims the last character and re-ranks everything, resetting the selection like any query change. The contrast is the lesson: growing the query can narrow from the previous results, but shrinking it must widen from the whole list. Pinning the widen case - a candidate that had disappeared reappearing after a backspace - is what proves the finder reconsiders the corpus instead of only ever shrinking its view.
