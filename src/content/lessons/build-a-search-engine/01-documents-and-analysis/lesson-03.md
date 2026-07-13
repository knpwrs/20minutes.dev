---
project: build-a-search-engine
lesson: 3
title: Case folding
overview: Today you lowercase every token so that "The" and "the" become the same term. Without this, a search for one capitalization would miss all the others.
goal: Fold a list of tokens to lowercase, leaving digits and already-lowercase tokens unchanged.
spec:
  scenario: Folding tokens to a common case
  status: failing
  lines:
    - kw: Given
      text: 'the tokens ["Hello", "WORLD", "123"]'
    - kw: When
      text: they are case-folded
    - kw: Then
      text: 'the result is ["hello", "world", "123"]'
    - kw: And
      text: '["already", "lower"] is returned unchanged'
code:
  lang: python
  source: |
    def fold(tokens):
        return [t.lower() for t in tokens]
reading: 'Manning, Introduction to Information Retrieval - ch. 2.2.3.'
checkpoint: Tokens are normalized to a single case, so capitalization no longer splits a term. Commit and stop here.
---

If `Search`, `search`, and `SEARCH` land in the index as three different terms, a
query for one will miss documents that used another. **Case folding** collapses
them by lowercasing every token, so capitalization stops mattering.

Digits and tokens that are already lowercase pass through untouched - lowercasing
is idempotent, which is exactly what you want from a normalization step. This is a
one-line transform today, but it is one link in the **analysis pipeline** you will
assemble in a few lessons.
