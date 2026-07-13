---
project: build-a-search-engine
lesson: 25
title: Document length and average
overview: Today you measure each document's length in tokens and the average length across the index. BM25 needs both to judge whether a document is long or short relative to its peers.
goal: Report a document's token length and the average document length over the index.
spec:
  scenario: Measuring document lengths
  status: failing
  lines:
    - kw: Given
      text: 'an index with ("d1", "cat dog") and ("d2", "cat dog cat dog") added'
    - kw: When
      text: you measure lengths
    - kw: Then
      text: 'doc_len("d1") is 2 and doc_len("d2") is 4'
    - kw: And
      text: 'the average document length is 3.0'
code:
  lang: python
  source: |
    def doc_len(self, doc_id):
        return len(self._terms[doc_id])       # analyzed term count
    def avg_doc_len(self):
        lengths = [self.doc_len(d) for d in self._docs]
        return sum(lengths) / len(lengths)
reading: 'Robertson & Zaragoza, "The Probabilistic Relevance Framework: BM25 and Beyond" (2009).'
checkpoint: The index knows each document's length and the collection average. Commit and stop here.
---

Cosine used a *vector* length built from weights. BM25 uses a plainer notion:
**document length** as the number of tokens, and the **average document length**
across the whole index. `cat dog` has length `2`; `cat dog cat dog` has length `4`;
the average over the two is `3.0`.

The ratio of a document's length to the average is what BM25 will use to decide
whether a document is unusually long - and should have its term frequencies
discounted - or unusually short. Count the analyzed terms you already stored per
document, including repeats, since a repeated word genuinely adds to length. This is
the last ingredient before the modern ranking function.
