---
project: build-a-search-engine
lesson: 19
title: Log-frequency weighting
overview: Today you tame raw counts with a logarithm, so the difference between one and ten mentions matters more than the difference between one hundred and one hundred and ten. This is the first principled ranking refinement.
goal: Weight a term frequency as 1 + log10(tf), with a frequency of zero weighting zero.
spec:
  scenario: Damping term frequency with a log
  status: failing
  lines:
    - kw: Given
      text: the log-frequency weighting rule
    - kw: When
      text: it is applied to term frequencies
    - kw: Then
      text: 'a tf of 1 weighs 1.0 and a tf of 10 weighs 2.0'
    - kw: And
      text: 'a tf of 0 weighs 0.0'
code:
  lang: python
  source: |
    import math
    def log_tf(tf):
        # zero stays zero; otherwise dampen with log base 10
        ...
reading: 'Manning, Introduction to Information Retrieval - ch. 6.2, eq. 6.7.'
checkpoint: Term frequency is damped so extra occurrences add less and less. Commit and stop here.
---

Relevance does not grow linearly with repetition. A document that mentions `cat`
ten times is more about cats than one that mentions it once - but not ten times
more. The standard fix is to compress the count with a logarithm: weight a nonzero
frequency as `1 + log10(tf)`, so `1` maps to `1.0`, `10` to `2.0`, `100` to `3.0`.

The `1 +` keeps a single occurrence at a full point rather than zero (`log10(1)` is
`0`). And a term that does not occur must weigh exactly `0`, not `1 + log10(0)`,
which is undefined - so guard the zero case explicitly. This damped weight replaces
the raw `tf` in every formula from here on.
