---
title: 'Build a Search Engine'
order: 1
lessons: 34
size: 'Small'
tech: ['Inverted index', 'TF-IDF', 'BM25']
estMin: 20
desc: 'Build an in-memory search index you add documents to and query, with your own inverted index and ranking.'
blurb: 'Build a small search index in the spirit of Lucene or Elasticsearch: add documents, then search them. Each lesson opens with a concrete spec and closes with it satisfied, until the analyzer, index, and ranking all hold together.'
overview: |
  Over the next 34 lessons you build a working in-memory search index library from
  scratch - a small core in the spirit of Lucene or Elasticsearch. You add
  documents to it and search them: an analyzer turns text into normalized terms,
  an inverted index maps every term to the documents and positions where it
  appears, and a ranking layer scores matches with TF-IDF, cosine normalization,
  and BM25.

  You finish with a coherent library you import and use: construct an index, add
  documents, and run BM25-ranked free-text search alongside boolean and phrase
  queries, with highlighted snippets for results. It is a teaching-grade core -
  clear and correct, held in memory rather than persisted, sharded, or compressed
  like a production system - and every lesson ends green with the public API
  importable and working.
parts:
  - name: 'Documents & analysis'
    count: 8
  - name: 'The inverted index'
    count: 8
  - name: 'Ranking'
    count: 11
  - name: 'Querying'
    count: 7
caveats:
  note: 'The library implements BM25 free-text ranking, boolean AND/OR/NOT, phrase queries, and snippets end to end with fail-fast error handling, but the boolean grammar has no operator precedence and only free-text search is BM25-ranked.'
  future:
    - 'Add operator precedence and parentheses to boolean queries (currently a strict left-to-right fold)'
    - 'Rank phrase and boolean query results with BM25 instead of returning bare unordered doc-id lists'
    - 'Replace the four-rule suffix stripper with a real stemmer (Porter/Snowball)'
    - 'Highlight every matched occurrence in a snippet, not just the first'
    - 'Add index persistence (save/load to disk)'
    - 'Support named fields per document (e.g. title vs. body) with per-field weights'
resources:
  - title: 'Introduction to Information Retrieval'
    author: 'Christopher D. Manning, Prabhakar Raghavan, Hinrich Schütze'
    url: 'https://nlp.stanford.edu/IR-book/'
    note: 'The standard textbook on indexing, ranking, and evaluation - free online from the authors.'
  - title: 'Managing Gigabytes'
    author: 'Ian H. Witten, Alistair Moffat, Timothy C. Bell'
    note: 'The classic reference on index compression and large-scale text retrieval.'
  - title: 'A Vector Space Model for Automatic Indexing'
    author: 'Gerard Salton, A. Wong, C. S. Yang'
    url: 'https://ecommons.cornell.edu/items/dc340f22-1c38-4f0a-921e-27706685b1bf'
    note: 'The 1975 paper that introduced the vector space model underlying TF-IDF ranking.'
  - title: 'Search Engines: Information Retrieval in Practice'
    author: 'W. Bruce Croft, Donald Metzler, Trevor Strohman'
    url: 'https://ciir.cs.umass.edu/downloads/SEIRiP.pdf'
    note: 'A more implementation-minded companion, with worked examples of indexing and ranking pipelines.'
---
