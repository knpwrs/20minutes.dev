---
project: build-a-fuzzy-finder
lesson: 2
title: Does the query fit?
overview: The one idea that makes a finder "fuzzy" is subsequence matching - the query characters must appear in the candidate, in order, but not necessarily together. Today you build that test, the gate every candidate passes through.
goal: Write a match test that returns true when the query is an in-order subsequence of the candidate.
spec:
  scenario: Query as an in-order subsequence
  status: failing
  lines:
    - kw: Given
      text: 'the candidate "src/main.go"'
    - kw: When
      text: 'matches is called with query "smg", then "sml", then "gsm", then ""'
    - kw: Then
      text: '"smg" matches (s, then m, then g appear in order), "sml" does not (no l after m), "gsm" does not (out of order), and "" matches (an empty query fits everything)'
code:
  lang: go
  source: |
    // Walk both strings once. Advance the query cursor only when the
    // current query char is found; the candidate cursor always advances.
    // Match succeeds when the query cursor reaches the end.
    func matches(query, candidate string) bool {
      qi := 0
      for ci := 0; qi < len(query) && ci < len(candidate); ci++ {
        if query[qi] == candidate[ci] {
          qi++
        }
      }
      return qi == len(query)
    }
checkpoint: You can tell whether a query fuzzy-matches a candidate at all. Commit and stop here.
---

**Fuzzy** matching means the query characters have to show up in the candidate **in order**, but gaps between them are fine. Typing `smg` finds `src/main.go` because `s`, `m`, and `g` occur left to right; `sml` fails because there is no `l` after the `m`; `gsm` fails because the letters are out of order. This "is the query a subsequence of the candidate" test is the single gate that decides whether a candidate is a match at all.

The classic implementation is a **two-cursor walk**: step through the candidate once, and every time its current character equals the character the query is waiting for, advance the query. If the query cursor runs off the end, every query character was found in order. Two edges are worth pinning now: an **empty query** matches everything (there is nothing to find), and order is strict, so a reordering of matching letters must fail. This predicate stays the fast first filter forever - scoring only ever runs on candidates that pass it.
