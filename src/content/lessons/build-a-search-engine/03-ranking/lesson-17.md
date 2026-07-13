---
project: build-a-search-engine
lesson: 17
title: Collecting candidates
overview: Today you gather the set of documents that could possibly answer a query - those containing at least one query term - and set up a score for each. This scoring scaffold is where every ranking formula will plug in.
goal: Collect the candidate documents for a set of query terms into a score map initialized to zero.
spec:
  scenario: Gathering documents worth scoring
  status: failing
  lines:
    - kw: Given
      text: 'an index with ("d1", "cat dog"), ("d2", "cat"), and ("d3", "bird") added'
    - kw: When
      text: 'you collect candidates for the query terms ["cat", "dog"]'
    - kw: Then
      text: 'the candidate scores are {"d1": 0.0, "d2": 0.0}'
    - kw: And
      text: '"d3" is absent, since it contains neither term'
code:
  lang: python
  source: |
    def candidates(self, terms):
        docs = []
        for t in terms:
            docs = union(docs, self.postings(t))   # from lesson 15
        return {doc_id: 0.0 for doc_id in docs}
reading: 'Manning, Introduction to Information Retrieval - ch. 6.3.'
checkpoint: You can collect exactly the documents worth scoring for a query, each starting at zero. Commit and stop here.
---

Ranking should never touch a document that contains none of the query terms -
scoring the entire collection would be wasteful and pointless. The **candidate
set** is the union of the postings lists of the query terms: every document with at
least one term, and no others.

Returning a map from candidate id to a score of `0.0` sets up the pattern for the
whole chapter. Each of the next several lessons is a better rule for filling in those
zeros - raw counts, then log-scaled counts, then counts weighted by rarity. The
loop that walks candidates and accumulates a score stays the same; only the number
you add changes.
