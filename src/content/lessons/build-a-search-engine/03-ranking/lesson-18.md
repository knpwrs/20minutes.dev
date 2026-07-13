---
project: build-a-search-engine
lesson: 18
title: Term-frequency scoring
overview: Today you fill in those candidate scores with the simplest possible signal - add up how many times each query term appears in the document. It is a real ranking, just a naive one.
goal: Score each candidate document by the summed term frequency of the query terms.
spec:
  scenario: Ranking by raw term counts
  status: failing
  lines:
    - kw: Given
      text: 'an index with ("d1", "cat cat dog") and ("d2", "cat") added'
    - kw: When
      text: 'you score the query ["cat"]'
    - kw: Then
      text: 'the scores are {"d1": 2.0, "d2": 1.0}'
    - kw: And
      text: 'scoring the query ["cat", "dog"] gives "d1" a score of 3.0'
code:
  lang: python
  source: |
    def score(self, terms):
        scores = self.candidates(terms)
        for doc_id in scores:
            for t in terms:
                scores[doc_id] += self.tf(t, doc_id)   # raw count
        return scores
reading: 'Manning, Introduction to Information Retrieval - ch. 6.2.'
checkpoint: Documents get a real, if naive, relevance score from raw term counts. Commit and stop here.
---

You have candidates and a place to put their scores; today you put a number there.
The crudest useful rule is **term-frequency scoring**: a document's score is the
sum, over the query terms, of how often each appears in it. `cat cat dog` scores 2
for the query `cat`; add `dog` to the query and it climbs to 3.

This already ranks documents - more mentions, higher score - and it is worth
seeing work before you refine it. But raw counts have two flaws the next lessons fix:
the tenth mention of a word should not count as much as the first, and matching a
rare word should count for more than matching a common one. Each gets its own lesson.
