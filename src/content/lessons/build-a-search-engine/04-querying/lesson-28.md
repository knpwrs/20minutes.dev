---
project: build-a-search-engine
lesson: 28
title: Free-text search
overview: Today you connect the analyzer to BM25 ranking behind one public method - give it a query string, get back ranked results. Reusing the very same analyzer on the query is what makes matches line up, and this method is the headline feature of the whole library.
goal: Implement search(text) that analyzes the query with the same pipeline as documents, scores candidates with BM25, and returns ranked results.
spec:
  scenario: End-to-end free-text search
  status: failing
  lines:
    - kw: Given
      text: 'an index with ("d1", "the cat sat"), ("d2", "the cat cat"), ("d3", "the dog") added'
    - kw: When
      text: 'you search for "Cats"'
    - kw: Then
      text: 'the results are ["d2", "d1"] in that order'
    - kw: And
      text: '"d3" is not in the results, and a query of only stop words returns []'
code:
  lang: python
  source: |
    def search(self, text, k=10):
        terms = analyze(text)                 # SAME analyzer as documents
        scores = self.candidates(terms)       # {doc: 0.0}
        for d in scores:
            for t in terms:
                scores[d] += bm25(idf(self.size, self.df(t)), self.tf(t, d),
                                  self.doc_len(d), self.avg_doc_len())
        return [doc for doc, _ in top_k(scores, k)]
reading: 'Manning, Introduction to Information Retrieval - ch. 6.3.'
checkpoint: One method takes a query string and returns ranked document ids. Commit and stop here.
---

Every piece is built; today you bolt them into the method users actually call. The
rule that makes it work is symmetry: analyze the query with the **exact same**
pipeline the documents went through, so a search for `Cats` becomes the term `cat`
and meets the indexed form. A custom query path that forgot to stem or lowercase
would silently match nothing - reusing one `analyze` guarantees the two sides agree.

From there `search` collects the candidate documents, scores each with full BM25
summed over the query terms, and returns the top ids in ranked order. The result
tells the story: `the cat cat` mentions the term twice and edges out `the cat sat`,
while `the dog` never appears - and a query of only stop words analyzes to nothing,
so it returns nothing rather than everything. This is your engine's front door.
