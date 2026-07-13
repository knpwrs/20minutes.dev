---
project: build-a-search-engine
lesson: 20
title: Inverse document frequency
overview: Today you measure how rare a term is across the whole index, so that matching an unusual word counts for more than matching a common one. This weight is what makes "the" nearly worthless and "photosynthesis" precious.
goal: Compute a term's inverse document frequency as log10(N / df).
spec:
  scenario: Weighting terms by rarity
  status: failing
  lines:
    - kw: Given
      text: an index of 1000 documents
    - kw: When
      text: you compute inverse document frequency
    - kw: Then
      text: 'a term in 10 documents has idf 2.0'
    - kw: And
      text: 'a term in all 1000 documents has idf 0.0'
code:
  lang: python
  source: |
    import math
    def idf(n_docs, df):
        # rarer term -> higher idf; a term in every doc -> 0
        return math.log10(n_docs / df)
reading: 'Manning, Introduction to Information Retrieval - ch. 6.2.1, eq. 6.7.'
checkpoint: Rare terms now carry more weight than common ones. Commit and stop here.
---

Term frequency rewards documents that use a query word often, but it treats all
words as equally meaningful. They are not. A word appearing in almost every
document - `the`, `is` - barely distinguishes anything, while a word in just a few
documents is a strong signal. **Inverse document frequency** captures that: `log10`
of the total document count divided by the term's document frequency.

The logarithm keeps the weight from exploding for ultra-rare terms, and the ratio
does the real work: a term in `10` of `1000` documents scores `log10(100) = 2.0`,
while a term in all `1000` scores `log10(1) = 0.0` and contributes nothing. Pair
this with the damped term frequency tomorrow and you have the classic weighting of
information retrieval.
