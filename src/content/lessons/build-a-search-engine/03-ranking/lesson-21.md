---
project: build-a-search-engine
lesson: 21
title: The TF-IDF weight
overview: Today you multiply the two weights you built - damped term frequency and inverse document frequency - into the single TF-IDF score that has anchored text ranking for decades. A term matters when it is frequent in a document and rare across the collection.
goal: Combine log-frequency weighting and idf into one tf-idf weight.
spec:
  scenario: Frequent-here-and-rare-overall weighting
  status: failing
  lines:
    - kw: Given
      text: 'a term with frequency 10 in a document and idf 2.0'
    - kw: When
      text: its tf-idf weight is computed
    - kw: Then
      text: 'the weight is 4.0'
    - kw: And
      text: 'a term with frequency 0 has tf-idf weight 0.0'
code:
  lang: python
  source: |
    def tfidf(tf, idf):
        # damped frequency (lesson 19) times rarity (lesson 20)
        return log_tf(tf) * idf
reading: 'Salton & Buckley, "Term-weighting approaches in automatic text retrieval" (1988).'
checkpoint: Each term-document pair now has a single, principled weight. Commit and stop here.
---

The two ideas combine by multiplication. **TF-IDF** weights a term in a document as
its damped frequency times its inverse document frequency: `(1 + log10(tf)) * idf`.
A term scores high only when it is both frequent *in this document* and rare
*across the collection* - exactly the two conditions that make a word a good signal
of what a document is about.

With frequency `10` (log-weight `2.0`) and idf `2.0`, the tf-idf weight is `4.0`;
drop the frequency to zero and the whole product collapses to `0.0`. This single
number per term-document pair is what your query scorer will sum over the query
terms - the workhorse weight of the vector space model.
