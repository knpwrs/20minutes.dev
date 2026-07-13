---
project: build-a-search-engine
lesson: 14
title: Intersecting postings
overview: Today you merge two sorted postings lists to find the documents they share. This intersection is exactly what a two-word AND query needs.
goal: Intersect two sorted postings lists into the documents common to both.
spec:
  scenario: Documents common to two terms
  status: failing
  lines:
    - kw: Given
      text: 'the postings ["d1", "d2", "d4"] and ["d2", "d3", "d4"]'
    - kw: When
      text: they are intersected
    - kw: Then
      text: 'the result is ["d2", "d4"]'
    - kw: And
      text: 'intersecting with an empty list gives []'
code:
  lang: python
  source: |
    def intersect(a, b):
        i = j = 0
        out = []
        while i < len(a) and j < len(b):
            # advance the smaller; on a tie, keep it
            ...
        return out
reading: 'Manning, Introduction to Information Retrieval - ch. 1.3.'
checkpoint: You can find the documents two terms have in common. Commit and stop here.
---

A query for `cat AND dog` wants documents containing *both* terms - the
**intersection** of their postings lists. Because both lists are sorted, you do not
need to compare every pair: walk two pointers forward together, and whenever they
point at the same id, record it and advance both. When they differ, advance the one
pointing at the smaller id.

This linear merge is the beating heart of boolean retrieval, and the reason you
kept postings sorted back on lesson 9. It runs in time proportional to the sum of the
list lengths, not their product - the difference between a search engine that scales
and one that does not.
