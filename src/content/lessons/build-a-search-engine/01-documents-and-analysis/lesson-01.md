---
project: build-a-search-engine
lesson: 1
title: The index and its documents
overview: Today you create the core object of the whole project - a search index you can add documents to and read them back. Everything else you build hangs off this one type.
goal: Build a SearchIndex that stores documents by id and reports how many it holds.
spec:
  scenario: Adding and retrieving documents
  status: failing
  lines:
    - kw: Given
      text: a new empty search index
    - kw: When
      text: 'you add ("d1", "hello world") and ("d2", "goodbye")'
    - kw: Then
      text: index.size is 2
    - kw: And
      text: 'index.document("d1") is "hello world"'
code:
  lang: python
  source: |
    class SearchIndex:
        def __init__(self):
            self._docs = {}          # id -> original text
        def add(self, doc_id, text):
            ...                      # store it
        # size, document(id) read it back
reading: 'Manning, Introduction to Information Retrieval - ch. 1.'
checkpoint: You can add documents to an index and read them back by id. Commit and stop here.
---

Every search engine begins with the same humble object: a place to put documents.
Before you can tokenize, index, or rank anything, you need a **document store** -
a mapping from a document **id** to its original text. Keeping the raw text around
matters: later you will show **snippets** of it in results, so the store is not
just a stepping stone.

Keep it tiny. A dictionary from id to text, an `add` method, a `size`, and a
`document(id)` lookup. This is the spine the rest of the project attaches to -
every later lesson adds a method to this same class.
