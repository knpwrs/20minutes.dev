---
project: build-a-fuzzy-finder
lesson: 18
title: An exact term
overview: Sometimes fuzzy is too loose and you want a literal substring. fzf spells that with a leading quote. Today you add exact terms - a term prefixed with a quote matches only a contiguous substring.
goal: Treat a term beginning with a single quote as an exact-substring match rather than a fuzzy one.
spec:
  scenario: Exact-substring terms
  status: failing
  lines:
    - kw: Given
      text: 'the candidate "src/main.go" and terms parsed so a leading single quote marks the rest as an exact term'
    - kw: When
      text: 'the query is "''main", then "''mn"'
    - kw: Then
      text: 'the query "''main" matches with positions [4, 5, 6, 7] and score 93 (the contiguous "main" substring, scored as a run), and the query "''mn" does not match - "mn" is not a literal substring, even though it would match fuzzily'
code:
  lang: go
  source: |
    // parseQuery: a leading ' sets Term.Exact and strips the quote.
    // An exact term matches only where its text appears as a CONTIGUOUS
    // substring. Score that occurrence's run of positions with the same
    // score() you already have; pick the best-scoring occurrence.
    if strings.HasPrefix(word, "'") {
      t := Term{Text: word[1:], Exact: true}
      // ...
    }
checkpoint: A quoted term now matches only a literal substring. Commit and stop here.
---

Fuzzy matching is forgiving, but sometimes you know exactly what you want and the forgiveness gets in the way - `mn` fuzzily matches `main.go`, but if you meant the literal letters `mn` you would rather it did not. fzf's answer is the **exact term**: prefix a term with a single quote and it matches only where its characters appear **contiguously**, as a real substring.

The elegant part is scoring. An exact match is just a **run** of adjacent positions, so you can feed that run straight into the same `score` function - it earns full consecutive bonuses and whatever boundary bonus its start qualifies for, with no gaps. If the substring appears more than once, score each occurrence and keep the best. Parsing is a one-character change: a leading `'` sets the `Exact` flag on the `Term` you built last lesson and strips the quote. The subsequence gate and the exact gate now coexist, chosen per term.
