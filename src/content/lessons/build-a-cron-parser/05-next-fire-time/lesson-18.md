---
project: build-a-cron-parser
lesson: 18
title: Guarding against an impossible expression
overview: Some expressions can never fire - `0 0 30 2 *` asks for February 30th, which does not exist. A naive scan would loop forever, so today you cap the search and report no fire instead of hanging.
goal: Bound the next-fire scan so an impossible expression returns "no fire found" rather than looping forever.
spec:
  scenario: An impossible expression terminates with no result
  status: failing
  lines:
    - kw: Given
      text: 'the expression ''0 0 30 2 *'' - February 30th, a date that never occurs'
    - kw: When
      text: 'Next is called from 2024-01-01 00:00'
    - kw: Then
      text: 'it reports no fire found rather than looping (for example, returns ok=false)'
    - kw: And
      text: 'a possible expression like ''0 0 29 2 *'' still returns a real fire time within the bound'
code:
  lang: go
  source: |
    func Next(e Expr, start time.Time) (time.Time, bool) {
      t := start.Truncate(time.Minute).Add(time.Minute)
      limit := start.AddDate(9, 0, 0) // no valid cron gap exceeds 8 years
      for t.Before(limit) {
        if Matches(e, t) { return t, true }
        t = t.Add(time.Minute)
      }
      return time.Time{}, false
    }
checkpoint: Next terminates on impossible expressions and signals no fire found. Commit and stop here.
---

A minute-by-minute scan is only safe if it is guaranteed to stop. Most expressions
fire soon, but a few can never fire at all: `0 0 30 2 *` wants the 30th of February,
which no year provides, so the loop would run forever looking for a match that does
not exist. The fix is a **bound**. The largest legitimate gap between fire times in
this grammar is the eight-year jump between two February 29ths across a skipped
century leap year (2096 to 2104, since 2100 is not a leap year), so a nine-year
horizon is a safe ceiling - if nothing matches within it, the expression is
effectively impossible and `Next` reports no fire found.

Returning a found/not-found signal alongside the time also makes the function honest
about failure instead of returning a zero time that looks like a real answer. Keep
the bound generous enough that every genuinely schedulable expression still resolves -
a real Feb 29 expression must still return its fire time - while any impossible one
terminates cleanly. This guard is what lets the next two lessons trust the scan on
the hardest calendar cases.
