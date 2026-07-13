---
project: build-a-search-engine
lesson: 34
title: The complete search library
overview: Today you exercise the whole library through its public API in one usage example - add documents, then run free-text, boolean, and phrase queries against them. This is the deliverable the project has been building toward.
goal: Drive the finished index end to end - add documents and answer free-text, boolean, and phrase queries.
spec:
  scenario: The library works end to end
  status: failing
  lines:
    - kw: Given
      text: 'an index with ("d1", "the quick brown fox"), ("d2", "the lazy brown dog"), and ("d3", "a quick brown cat") added'
    - kw: When
      text: you use the public API
    - kw: Then
      text: 'search("quick fox") ranks "d1" first, and the phrase ["quick", "brown"] matches ["d1", "d3"]'
    - kw: And
      text: 'the boolean query "brown AND NOT dog" gives ["d1", "d3"]'
code:
  lang: python
  source: |
    idx = SearchIndex()
    idx.add("d1", "the quick brown fox")
    idx.add("d2", "the lazy brown dog")
    idx.add("d3", "a quick brown cat")
    idx.search("quick fox")          # -> ["d1", ...]
    idx.phrase(["quick", "brown"])   # -> ["d1", "d3"]
    idx.eval_bool(parse_bool("brown AND NOT dog"))  # -> ["d1", "d3"]
reading: 'Manning, Introduction to Information Retrieval - ch. 1-8, in review.'
checkpoint: The full search library - add, rank, boolean, phrase - works through one coherent API. Commit and stop here.
---

Thirty-three lessons of pieces come together here. There is nothing new to build:
today is about seeing the finished library answer real questions through the API a
user would call. Add a few documents, then ask for them three different ways -
ranked free text, a strict phrase, and a boolean expression - and watch each return
exactly the right documents.

`search("quick fox")` ranks `d1` on top because it matches both words; the phrase
`quick brown` finds only the documents where those words are truly adjacent; and
`brown AND NOT dog` keeps the brown documents while subtracting the one about a dog.
That is a working search engine in the spirit of Lucene - an analyzer, an inverted
index, BM25 ranking, and a query layer - small enough to hold in your head, and
entirely yours.
