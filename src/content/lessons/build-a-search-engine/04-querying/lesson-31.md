---
project: build-a-search-engine
lesson: 31
title: Evaluating a boolean query
overview: Today you evaluate a parsed boolean query against the index, folding term postings together left to right with the intersect, union, and difference operations you built. The result is the exact set of documents the expression selects.
goal: Evaluate a parsed boolean token stream into a set of matching document ids, left to right.
spec:
  scenario: Resolving AND, OR, and NOT over postings
  status: failing
  lines:
    - kw: Given
      text: 'an index with ("d1", "cat dog"), ("d2", "cat"), and ("d3", "dog") added'
    - kw: When
      text: you evaluate boolean queries left to right
    - kw: Then
      text: '"cat AND dog" gives ["d1"] and "cat OR dog" gives ["d1", "d2", "d3"]'
    - kw: And
      text: '"cat AND NOT dog" gives ["d2"]'
code:
  lang: python
  source: |
    # start from the first term's postings, then fold each op + term
    # AND -> intersect, OR -> union, NOT after AND -> difference
    result = self.postings(tokens[0])
    # walk the rest: an operator, then a term (NOT flips AND into difference)
    ...
reading: 'Manning, Introduction to Information Retrieval - ch. 1.3.'
checkpoint: Boolean queries resolve to exactly the right set of documents. Commit and stop here.
---

With postings and the three set operations, evaluating a boolean query is a fold.
Start with the first term's postings list, then process the stream left to right: on
`AND` intersect with the next term's postings, on `OR` union, and on `AND NOT` take
the difference. `cat AND dog` keeps only documents with both; `cat OR dog` gathers
either; `cat AND NOT dog` subtracts the `dog` documents away.

Evaluating strictly left to right keeps today focused - it means `a OR b AND c`
groups as `(a OR b) AND c`, not the precedence a full parser would impose. Treat a
`NOT` after *any* operator as a difference (so `OR NOT` subtracts too, just like
`AND NOT`); it keeps the fold uniform. Both are known simplifications worth stating
plainly. The payoff is that boolean retrieval now works entirely on the linear-merge
primitives from the index chapter, with no new machinery.
