---
project: build-a-cron-parser
lesson: 12
title: Both 0 and 7 mean Sunday
overview: Cron has a quirk in the day-of-week field - the number 7 is a second name for Sunday, alongside 0. Today you accept 7 in that field and fold it into 0 so both spellings compile to the same value.
goal: Accept 7 in the day-of-week field and normalise it to 0, so 0, 7, and SUN all mean Sunday.
spec:
  scenario: Seven is an alias for Sunday
  status: failing
  lines:
    - kw: Given
      text: 'the day-of-week field'
    - kw: When
      text: 'parseField compiles ''7'''
    - kw: Then
      text: 'the set is {0}'
    - kw: And
      text: 'parseField compiles ''5-7'' to {0, 5, 6} and ''0-7'' to {0, 1, 2, 3, 4, 5, 6}, because every 7 folds into 0'
code:
  lang: go
  source: |
    // day-of-week only: allow the value 7 (extend the accepted max to 7
    // just for this field), then after building the set fold 7 into 0:
    if spec.Name == "day-of-week" && set[7] {
      delete(set, 7); set[0] = true
    }
checkpoint: In the day-of-week field, 0, 7, and SUN all compile to Sunday. Commit and stop here.
---

Cron inherited two conventions for Sunday and kept both. Most of the world numbers
the week 0 to 6 with Sunday as 0, but some systems number it 1 to 7 with Sunday as
7. Rather than choose, cron accepts **either**: in the day-of-week field, `7` is a
second spelling of Sunday, exactly equal to `0`. So you must accept 7 as a valid
value in that field - one past the usual maximum of 6 - and then **fold** it into 0
so the compiled set never actually contains 7.

Folding after expansion is what makes ranges behave. A range like `5-7` is Friday,
Saturday, Sunday, so accept 7 as the endpoint, expand to 5, 6, 7, then rewrite 7 to
0, giving `{0, 5, 6}`. Likewise `0-7` covers the whole week and collapses to
`{0, 1, 2, 3, 4, 5, 6}` once the duplicate Sunday folds away. This tidies the
day-of-week field into a clean 0-to-6 set no matter how Sunday was written, which is
exactly what the matcher will compare against next.
