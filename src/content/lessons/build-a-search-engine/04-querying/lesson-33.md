---
project: build-a-search-engine
lesson: 33
title: Snippets and highlighting
overview: Today you generate the little preview shown under each result - a window of the original text around the matched term, with the match marked. It is what turns a document id into something a person can read.
goal: Produce a snippet of original text around the first occurrence of a term, with the match highlighted.
spec:
  scenario: A readable preview around a match
  status: failing
  lines:
    - kw: Given
      text: 'the text "the quick brown fox jumps" and the term "brown"'
    - kw: When
      text: you build a snippet with one word of context on each side
    - kw: Then
      text: 'the snippet is "quick **brown** fox"'
    - kw: And
      text: 'the matched word is wrapped in ** ** to mark it'
code:
  lang: python
  source: |
    def snippet(text, term, window=1):
        toks = tokenize(text)
        for i, tok in enumerate(toks):
            if analyze(tok) == [term]:          # match on the analyzed form
                lo, hi = max(0, i - window), i + window + 1
                out = toks[lo:hi]
                out[i - lo] = f"**{tok}**"      # highlight, keep original casing
                return " ".join(out)
        return ""
reading: 'Manning, Introduction to Information Retrieval - ch. 8.7 (results presentation).'
checkpoint: Results can show a readable, highlighted snippet of context. Commit and stop here.
---

A ranked list of document ids is not a search result a person can use. Real engines
show a **snippet**: a short window of the original text around where the query
matched, with the matched word **highlighted**. You kept the original text back on
lesson 1 for exactly this - the index searches on analyzed terms, but snippets read
from the untouched source so the user sees real words and real casing.

Find the first token whose analyzed form equals the term - so a search for `brown`
lands on `brown`, and a stemmed query still finds its source word - then take a
window of tokens around it and wrap the match in markers. One occurrence and a
one-word window is enough to show the idea; widening the window or highlighting
every match is a small extension from here.
