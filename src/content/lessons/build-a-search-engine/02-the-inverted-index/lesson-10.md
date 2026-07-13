---
project: build-a-search-engine
lesson: 10
title: Building the inverted index
overview: Today the index wires document terms into postings lists, so that adding a document updates one postings list per term. Then you can ask which documents contain a term.
goal: On add, route each of a document's terms into the matching postings list, and look a term up.
spec:
  scenario: Terms map to the documents that contain them
  status: failing
  lines:
    - kw: Given
      text: 'an index with ("d1", "cats and dogs") and ("d2", "the dog") added'
    - kw: When
      text: you look up postings for a term
    - kw: Then
      text: 'postings("dog") is ["d1", "d2"]'
    - kw: And
      text: 'postings("cat") is ["d1"]'
code:
  lang: python
  source: |
    def add(self, doc_id, text):
        self._docs[doc_id] = text
        for term in analyze(text):
            self._index.setdefault(term, Postings()).add(doc_id)
    def postings(self, term):
        p = self._index.get(term)
        return p.docs() if p else []
reading: 'Manning, Introduction to Information Retrieval - ch. 1.3.'
checkpoint: The index maps every term to the documents that contain it. Commit and stop here.
---

This is the moment the index becomes *inverted*. A document maps to its terms; an
inverted index flips that around so a **term** maps to its documents. As each
document arrives, walk its analyzed terms and drop the document's id into each
term's postings list, creating the list the first time you see a new term.

Notice how the lesson-1 store and the lesson-9 postings finally meet here. The document
`cats and dogs` analyzes to `cat` and `dog`, so its id lands in two postings lists.
Looking up `dog` now returns every document that contains it - the core retrieval
operation, and the thing every later chapter builds on.
