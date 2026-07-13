---
project: build-a-search-engine
lesson: 11
title: Term frequency
overview: Today you record how many times each term appears in each document. That count - the term frequency - is the raw signal every ranking formula later leans on.
goal: Track and report the term frequency of a term within a document.
spec:
  scenario: Counting term occurrences per document
  status: failing
  lines:
    - kw: Given
      text: 'an index with ("d1", "cat cat dog") added'
    - kw: When
      text: you ask for term frequencies in "d1"
    - kw: Then
      text: 'tf("cat", "d1") is 2 and tf("dog", "d1") is 1'
    - kw: And
      text: 'tf for a term not in the document is 0'
code:
  lang: python
  source: |
    # alongside the postings, keep a per-document count
    for term in analyze(text):
        self._tf[(term, doc_id)] = self._tf.get((term, doc_id), 0) + 1
    def tf(self, term, doc_id):
        return self._tf.get((term, doc_id), 0)
reading: 'Manning, Introduction to Information Retrieval - ch. 6.2.'
checkpoint: The index knows how often each term occurs in each document. Commit and stop here.
---

Presence tells you a document is *relevant*; frequency starts to tell you *how*
relevant. A document that says `cat` five times is, all else equal, more about
cats than one that says it once. That count is the **term frequency** (tf), and it
is the first ingredient of every scoring formula in the ranking chapter.

The postings list already dedupes ids, so it cannot hold counts. Keep the counts
beside it, keyed by term and document. A term absent from a document has frequency
zero - make sure your lookup returns `0` rather than raising, because ranking will
ask about many terms a given document does not contain.
