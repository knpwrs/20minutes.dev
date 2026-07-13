---
project: build-a-search-engine
lesson: 7
title: Recording positions
overview: Today you extend analysis to remember where each term sat in the original token stream. Those positions are what will later let you answer phrase queries like "quick brown".
goal: Analyze text into (term, position) pairs, where position is the term's index in the original token stream.
spec:
  scenario: Tracking each term's position
  status: failing
  lines:
    - kw: Given
      text: 'the text "the quick brown fox"'
    - kw: When
      text: it is analyzed with positions
    - kw: Then
      text: 'the pairs are [("quick", 1), ("brown", 2), ("fox", 3)]'
    - kw: And
      text: 'the dropped stop word "the" leaves a gap - no term has position 0'
code:
  lang: python
  source: |
    def analyze_positions(text):
        pairs = []
        for i, tok in enumerate(fold(tokenize(text))):
            # keep the ORIGINAL index i even when tokens are dropped
            if tok not in STOP_WORDS:
                pairs.append((stem(tok), i))
        return pairs
reading: 'Manning, Introduction to Information Retrieval - ch. 2.4.'
checkpoint: Analysis now yields each term with its position, gaps and all. Commit and stop here.
---

A phrase query like `"quick brown"` needs more than "both words appear" - it needs
them **adjacent**. To know that later, you must remember where each term sat.
**Position** is the token's index in the original stream, assigned *before* stop
words are dropped.

Keeping the original index is the subtle part. If you numbered terms only after
removing stop words, then `the quick` and `quick` would look identical, and a
phrase search could match words that were never actually next to each other. By
preserving gaps where stop words used to be, adjacency stays honest.
