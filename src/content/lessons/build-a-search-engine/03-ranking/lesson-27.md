---
project: build-a-search-engine
lesson: 27
title: BM25 length normalization
overview: Today you finish BM25 by folding document length into the saturation denominator, so a term in a long document counts for less than the same term in a short one. This completes the ranking function your search will use.
goal: Compute full BM25, idf * tf*(k1+1) / (tf + k1*(1 - b + b*dl/avgdl)), with k1 = 1.5 and b = 0.75.
spec:
  scenario: Full BM25 with length normalization
  status: failing
  lines:
    - kw: Given
      text: 'a term with idf 1.0 and tf 2 in a document, where avgdl is 3'
    - kw: When
      text: you score it with full BM25 (k1 = 1.5, b = 0.75)
    - kw: Then
      text: 'a document of length 3 scores 1.4286 (rounded to 4 places)'
    - kw: And
      text: 'a longer document of length 6 scores less, 1.0811'
code:
  lang: python
  source: |
    K1, B = 1.5, 0.75
    def bm25(idf, tf, dl, avgdl):
        denom = tf + K1 * (1 - B + B * dl / avgdl)
        return idf * (tf * (K1 + 1)) / denom
reading: 'Robertson & Zaragoza, "The Probabilistic Relevance Framework: BM25 and Beyond" (2009).'
checkpoint: Full BM25 ranks documents, discounting length. Wire it into search and run a ranked query. Commit and stop here.
---

Yesterday's saturation ignored length; today you put it back. BM25 scales the `k1`
term in the denominator by `1 - b + b * (dl / avgdl)`, where `dl` is the document's
length and `avgdl` the average. A document of exactly average length leaves the
factor at `1` and scores `1.4286` here; a document twice as long inflates the
denominator and drops to `1.0811`. The parameter `b` (use `0.75`) sets how hard
length is penalized - `0` disables it entirely.

Multiply by the term's `idf`, sum over the query terms, and you have the full BM25
score for a document. Swap it in as your ranking function and run a query over a few
documents: this is the same formula behind Lucene, Elasticsearch, and most
production search today. Your engine now ranks like the real thing.
