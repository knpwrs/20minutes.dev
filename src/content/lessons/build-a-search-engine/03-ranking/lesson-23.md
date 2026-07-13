---
project: build-a-search-engine
lesson: 23
title: Ranked retrieval
overview: Today you turn a map of document scores into an ordered list of the best few results - sorted by score, ties broken predictably, cut to the top k. This is the moment search returns a ranking, not just a set.
goal: Sort scored documents by score descending, break ties by document id, and return the top k.
spec:
  scenario: Ordering results and taking the best
  status: failing
  lines:
    - kw: Given
      text: 'the document scores {"d1": 2.0, "d2": 5.0, "d3": 5.0}'
    - kw: When
      text: you take the top 2 ranked results
    - kw: Then
      text: 'they are [("d2", 5.0), ("d3", 5.0)]'
    - kw: And
      text: 'ranking all three gives [("d2", 5.0), ("d3", 5.0), ("d1", 2.0)]'
code:
  lang: python
  source: |
    def top_k(scores, k):
        # highest score first; ties -> smaller id first
        ordered = sorted(scores.items(), key=lambda kv: (-kv[1], kv[0]))
        return ordered[:k]
reading: 'Manning, Introduction to Information Retrieval - ch. 6.3.2.'
checkpoint: Scored documents come back as an ordered top-k ranking. Commit and stop here.
---

Users do not want a set of matching documents; they want the *best* ones, in order.
**Ranked retrieval** sorts the scored candidates by score, highest first, and
returns only the top `k`. Everything upstream - candidates, weighting, summing -
existed to produce the numbers this step now orders.

Ties need a rule, or results wobble between runs. Break them by document id so the
order is deterministic: `d2` and `d3` both score `5.0`, but `d2` comes first. Wire
this onto your query scorer and you have end-to-end search - hand it query terms,
get back a ranked list. Try it on a handful of documents; this is the first lesson the
engine truly *searches*.
