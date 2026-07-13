---
project: build-a-search-engine
lesson: 15
title: Unioning postings
overview: Today you merge two sorted postings lists into one that holds every document from either - the union. It is what an OR query needs, and it must not repeat ids.
goal: Merge two sorted postings lists into their sorted, duplicate-free union.
spec:
  scenario: Documents in either of two terms
  status: failing
  lines:
    - kw: Given
      text: 'the postings ["d1", "d3"] and ["d2", "d3"]'
    - kw: When
      text: they are unioned
    - kw: Then
      text: 'the result is ["d1", "d2", "d3"]'
    - kw: And
      text: 'the shared "d3" appears only once'
code:
  lang: python
  source: |
    def union(a, b):
        i = j = 0
        out = []
        while i < len(a) and j < len(b):
            # take the smaller; on a tie, take one and advance BOTH
            ...
        # append whatever remains in a or b
        return out
reading: 'Manning, Introduction to Information Retrieval - ch. 1.3.'
checkpoint: You can combine the documents of two terms without duplicates. Commit and stop here.
---

A query for `cat OR dog` wants every document containing *either* term - the
**union** of the two postings lists. The merge is a cousin of yesterday's
intersection: walk both pointers, but this time emit the smaller id each step
rather than only the matches, and when one list runs out, append the rest of the
other.

The trap is duplicates. When both lists point at the same id, emit it once and
advance both pointers, so a document in both lists still appears a single time. Keep
the output sorted and unique, and it is itself a valid postings list you can feed
into the next operation.
