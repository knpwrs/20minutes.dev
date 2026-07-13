---
project: build-a-search-engine
lesson: 4
title: Removing stop words
overview: Today you drop the most common words - "the", "is", "and" - that appear in almost every document and so carry almost no signal about what a document is about. Filtering them keeps the index smaller and ranking sharper.
goal: Filter a list of tokens down to those not in a stop-word set.
spec:
  scenario: Discarding common stop words
  status: failing
  lines:
    - kw: Given
      text: 'the stop-word set contains "the", "is", "are", "and", "a"'
    - kw: When
      text: 'you remove stop words from ["the", "cat", "is", "black"]'
    - kw: Then
      text: 'the result is ["cat", "black"]'
    - kw: And
      text: 'a list with no stop words is returned unchanged'
code:
  lang: python
  source: |
    STOP_WORDS = {"the", "a", "an", "and", "or", "is", "are", "to", "of", "in", "it"}
    def remove_stopwords(tokens):
        return [t for t in tokens if t not in STOP_WORDS]
reading: 'Manning, Introduction to Information Retrieval - ch. 2.2.2.'
checkpoint: Common, low-signal words are filtered out of the token stream. Commit and stop here.
---

A handful of words - articles, conjunctions, forms of "to be" - show up in nearly
every English document. They bloat the index and, because they match almost
everything, tell you little about which document is a good result. These are
**stop words**, and the classic move is to drop them during analysis.

Assume the tokens are already lowercased, so your stop-word set can be lowercase
too. Keep the set small and explicit for now; real systems tune this list per
language and per corpus, and some skip stop-word removal entirely and lean on
ranking to demote them instead.
