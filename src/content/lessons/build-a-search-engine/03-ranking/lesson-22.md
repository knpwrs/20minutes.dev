---
project: build-a-search-engine
lesson: 22
title: Scoring a multi-term query
overview: Today you score a document against a whole query by summing its TF-IDF weight for each query term. This is the vector space model's answer to "how well does this document match these words?"
goal: Score a document for a multi-term query as the sum of its tf-idf weights over the query terms.
spec:
  scenario: Adding up per-term weights
  status: failing
  lines:
    - kw: Given
      text: 'a document and a query - the query score is the sum of the document''s tf-idf weight for each query term'
    - kw: When
      text: 'the document''s weights happen to be 4.0 for "cat" and 1.5 for "dog"'
    - kw: Then
      text: 'the score for the query "cat dog" is 4.0 + 1.5 = 5.5'
    - kw: And
      text: 'a query term the document lacks contributes its weight of 0.0'
code:
  lang: python
  source: |
    def query_score(self, terms, doc_id):
        return sum(self.weight(t, doc_id) for t in terms)
        # weight(t, doc) = tfidf(tf(t, doc), idf(N, df(t)))
reading: 'Manning, Introduction to Information Retrieval - ch. 6.3.'
checkpoint: A document earns one score for an entire query. Commit and stop here.
---

A query is more than one word, so a document needs one score for the whole thing.
The vector space model's answer is simple: add up the document's tf-idf weight for
each query term. A document strong on `cat` and also present on `dog` outscores one
that only has `cat`, and query words the document never uses contribute their weight
of zero.

This summation is what turns per-term weights into a ranking signal. It quietly
favors documents that match *more* of the query, since each matched term adds
another positive weight - a reasonable default that the next lessons refine by
correcting for document length.
