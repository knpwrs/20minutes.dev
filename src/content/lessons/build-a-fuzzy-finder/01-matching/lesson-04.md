---
project: build-a-fuzzy-finder
lesson: 4
title: Smart-case matching
overview: Typing lowercase and still finding uppercase letters is what makes a finder feel effortless. Today you add smart-case - case-insensitive when the query is all lowercase, case-sensitive the moment the user types a capital.
goal: Make matching ignore case for an all-lowercase query, but respect case when the query contains any uppercase letter.
spec:
  scenario: Smart-case subsequence matching
  status: failing
  lines:
    - kw: Given
      text: 'the candidate "src/MainWidget.go"'
    - kw: When
      text: 'matches is called with query "mw", then "MW", then "Mw", then "mW"'
    - kw: Then
      text: '"mw" matches (all-lowercase query ignores case), "MW" matches (the uppercase M then the uppercase W are both present in order), "Mw" does not (the query has a capital so it is case-sensitive, and there is no lowercase w in the candidate), and "mW" does not (case-sensitive again, and there is no lowercase m in the candidate)'
code:
  lang: go
  source: |
    // Smart-case: if the query has ANY uppercase letter, compare exactly.
    // Otherwise lowercase the candidate char before comparing.
    caseSensitive := hasUpper(query)
    // in the compare:
    qc, cc := query[qi], candidate[ci]
    if !caseSensitive {
      cc = toLower(cc)   // query is already all-lowercase here
    }
    if qc == cc { qi++ }
checkpoint: Matching now respects case only when the user opts in by typing one. Commit and stop here.
---

**Smart-case** is a small rule with a big feel: a query in all lowercase is treated as case-insensitive, so `mw` finds the `M` and `W` in `MainWidget`; but as soon as the query contains an uppercase letter, matching becomes case-sensitive. The intuition is that typing a capital is a deliberate signal - the user means *that* case - while an all-lowercase query is just the lazy, fast way to type.

The mechanism is one decision made once per query: does the query contain an uppercase letter? If not, lowercase each candidate character before comparing. The tricky edge is a **mixed** query like `Mw`: because it contains a capital, the *whole* query is case-sensitive, so the `w` must match an actual lowercase `w` - and `MainWidget` has none, so it fails. The rule is whole-query, not per-character: `mW` fails the same way, because there is no lowercase `m` to match. Pinning both keeps the rule honest rather than "uppercase letters are case-sensitive but lowercase ones are not."
