---
project: build-a-search-engine
lesson: 6
title: The analysis pipeline
overview: Today you wire the four steps you built - tokenize, fold, remove stop words, stem - into a single analyze() function. This one function is what turns any text into the terms your index will store.
goal: Compose tokenizing, folding, stop-word removal, and stemming into one analyze() call.
spec:
  scenario: Analyzing text end to end
  status: failing
  lines:
    - kw: Given
      text: 'the text "The cats are jumping"'
    - kw: When
      text: it is analyzed
    - kw: Then
      text: 'the terms are ["cat", "jump"]'
    - kw: And
      text: 'analyzing "" gives an empty list'
code:
  lang: python
  source: |
    def analyze(text):
        tokens = tokenize(text)
        tokens = fold(tokens)
        tokens = remove_stopwords(tokens)
        return [stem(t) for t in tokens]
reading: 'Manning, Introduction to Information Retrieval - ch. 2.2.'
checkpoint: A single analyze() turns raw text into a clean stream of terms. Commit and stop here.
---

Each of the last four lessons built one link; today you connect them into a chain.
The order is not arbitrary: you tokenize first (nothing works on a raw string),
fold before comparing against the lowercase stop-word set, and stem last so that
suffixes come off canonical, lowercased words.

This `analyze` function is the single most important seam in the whole engine. The
exact same function must run on documents when you index them **and** on queries
when you search - if the two ever diverge, a query term and its matching document
term will no longer be spelled the same, and the match silently disappears.
