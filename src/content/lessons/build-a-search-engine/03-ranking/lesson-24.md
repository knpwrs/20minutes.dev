---
project: build-a-search-engine
lesson: 24
title: Cosine length normalization
overview: Today you stop long documents from winning just because they are long. Dividing a document's score by the length of its weight vector puts short and long documents on a fair footing.
goal: Normalize a document's score by its vector length - the square root of the sum of its squared term weights.
spec:
  scenario: Correcting for document length
  status: failing
  lines:
    - kw: Given
      text: 'a document whose term weights are [3.0, 4.0]'
    - kw: When
      text: you compute its vector length and normalize a raw score of 10.0
    - kw: Then
      text: 'the vector length is 5.0'
    - kw: And
      text: 'the normalized score is 2.0'
code:
  lang: python
  source: |
    import math
    def vector_length(weights):
        return math.sqrt(sum(w * w for w in weights))
    def cosine(score, length):
        return score / length
reading: 'Manning, Introduction to Information Retrieval - ch. 6.3.1.'
checkpoint: Scores are normalized by document length, so long documents no longer win by default. Commit and stop here.
---

Summed tf-idf has a bias: a long document accumulates more matched terms and higher
counts simply because it contains more words, so it tends to outscore a short,
sharply relevant one. The vector space model corrects this by treating each
document as a **vector** of term weights and dividing its score by that vector's
**length** - the square root of the sum of squared weights.

With weights `[3.0, 4.0]` the length is `5.0` (a 3-4-5 triangle), and a raw score
of `10.0` normalizes to `2.0`. This is the "cosine" in cosine similarity: dividing
by length is what makes the comparison about *direction* - what the document is
about - rather than *magnitude* - how much it says. It is one of two great answers
to length; BM25, coming up, is the other.
