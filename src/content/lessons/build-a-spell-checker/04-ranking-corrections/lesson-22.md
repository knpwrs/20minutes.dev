---
project: build-a-spell-checker
lesson: 22
title: Ranking a candidate set
overview: Given a handful of candidate words, the checker must pick the best one. Today you rank a candidate set by frequency, breaking ties alphabetically so the choice is always deterministic.
goal: Choose the highest-frequency word from a set of candidates, with alphabetical order breaking ties.
spec:
  scenario: Picking the most likely candidate
  status: failing
  lines:
    - kw: Given
      text: 'a dictionary with counts the:1000, ten:100, tea:100'
    - kw: When
      text: 'BestByFreq(["tea", "ten", "the"]) is called'
    - kw: Then
      text: 'it returns "the" (the highest count)'
    - kw: And
      text: 'BestByFreq(["ten", "tea"]) returns "tea", because the counts tie at 100 and "tea" sorts first'
code:
  lang: go
  source: |
    func (d *Dictionary) BestByFreq(cands []string) string {
      // return the candidate with the greatest Count; on a tie,
      // prefer the alphabetically smaller word so the result is
      // deterministic (never depends on candidate order)
    }
checkpoint: You can pick the most likely word from a candidate set. Commit and stop here.
---

Candidate generation hands you a *set* of plausible words; ranking turns that set
into a single answer. The rule is Norvig's: prefer the **most frequent** candidate,
because a common word is a likelier intended target than a rare one. Among `tea`,
`ten`, and `the`, the count of `the` towers over the others, so it wins.

The tie-break matters more than it looks. When two candidates share the top count,
picking "whichever came first" makes the answer depend on the order the generator
happened to produce - flaky and unrepeatable. Breaking ties **alphabetically**
makes `BestByFreq` a pure function of the candidates and their counts, so the same
input always yields the same correction. Determinism like this is what lets every
later lesson pin an exact expected suggestion.
