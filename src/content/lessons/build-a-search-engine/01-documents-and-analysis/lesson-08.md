---
project: build-a-search-engine
lesson: 8
title: Analyzing added documents
overview: Today the index starts analyzing every document you add and can hand back the terms it derived. This is the join between the store from lesson 1 and the analyzer you just finished - and the first point where the whole pipeline runs end to end.
goal: Have the index analyze each document on add and expose its terms by id.
spec:
  scenario: The index remembers each document's terms
  status: failing
  lines:
    - kw: Given
      text: 'an index with ("d1", "The cats are jumping") added'
    - kw: When
      text: 'you ask for the terms of "d1"'
    - kw: Then
      text: 'they are ["cat", "jump"]'
    - kw: And
      text: 'the original text of "d1" is still available unchanged'
code:
  lang: python
  source: |
    def add(self, doc_id, text):
        self._docs[doc_id] = text
        self._terms[doc_id] = analyze(text)   # analyze once, on add
    def terms(self, doc_id):
        return self._terms[doc_id]
reading: 'Manning, Introduction to Information Retrieval - ch. 1.2.'
checkpoint: The index analyzes documents as they arrive and can return their terms. Commit and stop here.
---

Analysis has lived in free functions so far. Today it moves into the index: when a
document is added, the index runs `analyze` on it once and stashes the resulting
terms alongside the original text. Analyzing eagerly, on `add`, means the work
happens a single time per document rather than on every search.

You now have a walking skeleton of the whole first act - add a document, and the
index holds both what you can show a user (the original text) and what you can
search (the terms). Try adding two or three documents and printing their terms;
seeing the pipeline run on real input is the reward for the last week.
