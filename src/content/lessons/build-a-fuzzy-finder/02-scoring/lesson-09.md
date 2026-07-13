---
project: build-a-fuzzy-finder
lesson: 9
title: Penalize a slow start
overview: A match that starts near the front of a candidate usually beats one that starts deep inside it. Today you add a small, capped penalty for characters skipped before the first match.
goal: Subtract a penalty for each candidate character skipped before the first matched character, capped at a small maximum.
spec:
  scenario: Leading-gap penalty with a cap
  status: failing
  lines:
    - kw: Given
      text: 'the scoring rule -1 for each candidate character before the first match, capped at -3 total'
    - kw: When
      text: 'score is called with candidate "abcd" and positions [1], then with candidate "abcde" and positions [4]'
    - kw: Then
      text: 'candidate "abcd" with positions [1] scores 15 (16, minus 1 for the single skipped leading character), and candidate "abcde" with positions [4] scores 13 (16, minus 3 - four leading characters were skipped but the penalty is capped at 3)'
code:
  lang: go
  source: |
    // The FIRST matched char (k == 0) has a leading gap equal to its index.
    // Penalize it, but cap the penalty so a deep match is not crushed.
    const maxLeading = 3
    // inside the k == 0 branch:
    lead := p          // p characters were skipped before the first match
    if lead > maxLeading { lead = maxLeading }
    s -= lead
checkpoint: Matches that start earlier now score higher, without over-punishing deep ones. Commit and stop here.
---

Where a match **begins** carries information. Type `main` and the copy that starts at the front of `main.go` is usually what you want, more than the `main` buried inside `src/domain/main`. The **leading-gap penalty** captures that: each candidate character skipped before the *first* matched character costs **-1**, so earlier starts score higher.

The important design choice is the **cap**. Without one, a match deep in a long path would be penalized into oblivion and could never rank, even when it is the only thing that matches. Capping the leading penalty at **-3** keeps a mild preference for early matches while still letting a strong deep match compete. This is the model's one asymmetry with the between-match gap penalty from lesson 7, which is uncapped - a reminder that leading gaps and interior gaps play different roles.
