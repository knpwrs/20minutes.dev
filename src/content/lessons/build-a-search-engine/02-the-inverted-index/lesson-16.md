---
project: build-a-search-engine
lesson: 16
title: Difference of postings
overview: Today you compute the documents in one postings list but not another - the difference. It completes your boolean toolkit and is exactly what AND NOT needs.
goal: Compute the documents present in the first postings list but absent from the second.
spec:
  scenario: Documents in one term but not another
  status: failing
  lines:
    - kw: Given
      text: 'the postings ["d1", "d2", "d3"] and ["d2"]'
    - kw: When
      text: the second is subtracted from the first
    - kw: Then
      text: 'the result is ["d1", "d3"]'
    - kw: And
      text: 'subtracting an empty list returns the first list unchanged'
code:
  lang: python
  source: |
    def difference(a, b):
        i = j = 0
        out = []
        while i < len(a):
            # emit a[i] unless it also appears in b; advance b to keep up
            ...
        return out
reading: 'Manning, Introduction to Information Retrieval - ch. 1.3.'
checkpoint: You can exclude one term's documents from another's - the last boolean primitive. Commit and stop here.
---

The last boolean operation is **difference**: the documents in `a` that are not in
`b`, which is what `cat AND NOT dog` asks for. Like the others it is a linear merge
over two sorted lists - emit an id from `a` only when `b` has moved past it without
matching, and skip any id the two lists share.

With intersection, union, and difference in hand, you can evaluate any `AND` / `OR`
/ `NOT` combination by composing these three over postings lists. The query chapter
will parse boolean expressions and lean entirely on the primitives you finished
today; the retrieval math underneath is already done.
