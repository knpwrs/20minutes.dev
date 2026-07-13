---
project: build-a-qr-code-encoder
lesson: 35
title: Penalty rule 4 - balance
overview: 'The last penalty rule keeps the whole symbol close to half dark and half light, so no scanner threshold is starved. Today you write it and finish the scoring toolkit.'
goal: 'Score a grid by how far its proportion of dark modules strays from 50 percent.'
spec:
  scenario: 'Imbalance between dark and light is penalized'
  status: failing
  lines:
    - kw: Given
      text: 'penalty rule 4, based on the percentage of dark modules: take the two multiples of five that bracket it, and for each, the absolute difference from 50 divided by 5; the smaller, times 10, is the penalty'
    - kw: When
      text: 'a grid that is exactly 50 percent dark is scored'
    - kw: Then
      text: 'it contributes 0'
    - kw: And
      text: 'an all-dark grid (100 percent) scores 100, and a grid that is 60 percent dark scores 20'
code:
  lang: go
  source: |
    // percent of dark modules, then distance from 50% in 5% steps.
    ratio := dark * 100 / total
    prev := (ratio / 5) * 5
    next := prev + 5
    lo := min(abs(prev-50), abs(next-50))
    penalty := (lo / 5) * 10
checkpoint: 'All four penalty rules are done. Commit and stop here.'
---

A scanner decides dark-versus-light against a threshold, and a symbol skewed heavily toward one color gives it less to work with. **Rule 4** nudges the grid toward a **50/50** balance. Compute the percentage of dark modules, find the two **multiples of five** on either side of it, subtract 50 from each and take absolute values, divide each by 5, keep the **smaller**, and multiply by 10.

The effect is a staircase: anything from 45 to 55 percent scores 0, and each further 5 percent of imbalance adds 10. A perfectly balanced grid scores 0; an all-dark grid scores 100; 60 percent dark scores 20. This rule is usually small compared to rule 3, but it is the tiebreaker that favors a well-textured symbol. With all four rules in hand, the next lesson totals them across the eight masks - but first you need the format information, because it is placed before scoring.
