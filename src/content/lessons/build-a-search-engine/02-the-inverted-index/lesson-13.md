---
project: build-a-search-engine
lesson: 13
title: Positional postings
overview: Today the index stores the positions where each term occurs in each document, not just that it occurs. Those positions are what phrase queries will walk to prove two words were adjacent.
goal: Store and return the list of positions for a term within a document.
spec:
  scenario: Recording where terms occur
  status: failing
  lines:
    - kw: Given
      text: 'an index with ("d1", "the quick brown fox") and ("d2", "cat cat") added'
    - kw: When
      text: you ask for positions
    - kw: Then
      text: 'positions("quick", "d1") is [1]'
    - kw: And
      text: 'positions("cat", "d2") is [0, 1]'
code:
  lang: python
  source: |
    # use analyze_positions(text) from lesson 7
    for term, pos in analyze_positions(text):
        self._pos.setdefault((term, doc_id), []).append(pos)
    def positions(self, term, doc_id):
        return self._pos.get((term, doc_id), [])
reading: 'Manning, Introduction to Information Retrieval - ch. 2.4.2.'
checkpoint: The index records the positions of every term occurrence. Commit and stop here.
---

A plain postings list says *whether* a term is in a document; a **positional**
index says *where*. For each term-document pair, you now keep the list of
positions - the token indices from lesson 7 - at which the term occurs. `cat cat`
stores `[0, 1]`; the stop-word gap in `the quick brown fox` is why `quick` sits at
position `1`, not `0`.

This is the richest form your postings take, and it is what unlocks the phrase and
proximity queries in the final chapter. Store the positions as you index, from the
`(term, position)` pairs your analyzer already produces - there is nothing new to
compute, only somewhere new to keep it.
