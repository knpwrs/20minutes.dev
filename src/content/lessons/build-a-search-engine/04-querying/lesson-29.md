---
project: build-a-search-engine
lesson: 29
title: Requiring every term
overview: Today you add a stricter search mode that only returns documents containing every query term, not just some of them. It is the difference between an engine's "match any" and "match all" behavior - the same choice Elasticsearch exposes as its OR/AND operator.
goal: Add a match-all mode to search that keeps only documents containing all query terms.
spec:
  scenario: Any-term versus all-term matching
  status: failing
  lines:
    - kw: Given
      text: 'an index with ("d1", "cat dog"), ("d2", "cat"), ("d3", "dog") added'
    - kw: When
      text: 'you search "cat dog" requiring all terms'
    - kw: Then
      text: 'the result is ["d1"] - the only document with both'
    - kw: And
      text: 'a normal (any-term) search for "cat dog" returns all of d1, d2, d3'
code:
  lang: python
  source: |
    def search(self, text, k=10, require_all=False):
        terms = analyze(text)
        if require_all and terms:
            docs = self.postings(terms[0])
            for t in terms[1:]:
                docs = intersect(docs, self.postings(t))   # from lesson 14
        else:
            docs = list(self.candidates(terms))            # union
        # ... score docs with bm25 and return top_k as before
reading: 'Manning, Introduction to Information Retrieval - ch. 6.3.'
checkpoint: Search can require all query terms, not just any. Commit and stop here.
---

Your `search` so far is generous: a document matches if it contains **any** query
term, because candidates are the *union* of the terms' postings. That is the right
default for ranked retrieval - partial matches still rank, just lower - but
sometimes a user wants only documents that contain **every** term. Search engines
expose this as the difference between an `OR` and an `AND` default operator.

The change is small because the boolean primitives are already built. In match-all
mode, replace the union of candidates with the **intersection** of the query terms'
postings lists - `cat dog` then keeps only `d1`, which has both, and drops `d2` and
`d3`, which have just one. Scoring and ranking stay exactly the same; only the set
of candidates narrows. One flag, two very different search behaviors.
