---
project: build-a-search-engine
lesson: 26
title: BM25 term saturation
overview: Today you build BM25's term-frequency component, which saturates - the fifth occurrence of a word adds far less than the first, approaching a ceiling instead of growing forever. It is a sharper answer to repetition than the logarithm.
goal: Compute BM25's saturating term-frequency factor, tf*(k1+1)/(tf+k1) with k1 = 1.5.
spec:
  scenario: Diminishing returns on repetition
  status: failing
  lines:
    - kw: Given
      text: 'the BM25 term factor with k1 = 1.5'
    - kw: When
      text: it is applied to term frequencies
    - kw: Then
      text: 'a tf of 1 gives 1.0'
    - kw: And
      text: 'a tf of 3 gives 1.6667 (rounded to 4 places)'
code:
  lang: python
  source: |
    K1 = 1.5
    def bm25_tf(tf):
        # rises fast at first, then flattens toward k1 + 1
        return tf * (K1 + 1) / (tf + K1)
reading: 'Robertson & Zaragoza, "The Probabilistic Relevance Framework: BM25 and Beyond" (2009).'
checkpoint: Term frequency now saturates, so repeated words add less and less. Commit and stop here.
---

**BM25** is the ranking function most modern search engines reach for, and its
handling of term frequency is the heart of it. Instead of growing without bound,
its term factor **saturates**: `tf * (k1 + 1) / (tf + k1)`. As `tf` climbs, the
value rises quickly then flattens, approaching a ceiling of `k1 + 1`. A single
occurrence already earns `1.0`; three earn only about `1.67`.

The parameter `k1` (commonly `1.2` to `2.0`; use `1.5`) tunes how fast it saturates
- smaller `k1` flattens sooner. This is a more principled curve than the logarithm:
it directly encodes "the first mention matters most, and beyond a point more
mentions barely move the needle." Tomorrow you fold in document length to complete
the formula.
