---
project: build-a-search-engine
lesson: 9
title: The postings list
overview: Today you build the postings list - the sorted, duplicate-free list of document ids for a single term. It is the atom the entire inverted index is made of.
goal: Build a postings list that stays sorted and free of duplicate document ids.
spec:
  scenario: A term's list of documents
  status: failing
  lines:
    - kw: Given
      text: an empty postings list
    - kw: When
      text: 'you add "d3", then "d1", then "d1" again'
    - kw: Then
      text: 'its documents are ["d1", "d3"]'
    - kw: And
      text: 'the list has length 2 - the duplicate was ignored'
code:
  lang: python
  source: |
    class Postings:
        def __init__(self):
            self._docs = []
        def add(self, doc_id):
            # keep sorted and unique
            ...
        def docs(self):
            return self._docs
reading: 'Manning, Introduction to Information Retrieval - ch. 1.3.'
checkpoint: A term's postings stay sorted and deduplicated as documents are added. Commit and stop here.
---

An **inverted index** answers one question fast: "which documents contain this
term?" The answer for a single term is a **postings list** - the set of document
ids where that term appears. Today you build just that list, in isolation.

Two invariants make everything downstream easier. Keep the list **sorted**, so the
merge algorithms you write in a few lessons can walk two lists in lockstep. And keep
it **unique** - a term appearing three times in one document still yields one
posting for that document. Counting *how many* times comes later; for now, presence
is all that matters.
