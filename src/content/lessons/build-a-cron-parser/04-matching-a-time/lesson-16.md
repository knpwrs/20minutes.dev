---
project: build-a-cron-parser
lesson: 16
title: The day-of-month OR day-of-week rule
overview: When both day fields are restricted at once, cron does something surprising - it fires if EITHER matches, not both. Today you pin that OR rule, the single most misunderstood behavior in cron.
goal: Make Matches combine a restricted day-of-month and day-of-week with OR, so either one matching is enough.
spec:
  scenario: Both day fields restricted means either may match
  status: failing
  lines:
    - kw: Given
      text: 'the expression ''0 0 13 * 5'' - the 13th of the month OR any Friday - where both day fields are restricted'
    - kw: When
      text: 'Matches checks the day'
    - kw: Then
      text: 'it matches 2024-09-06 00:00 (a Friday, not the 13th) and 2024-01-13 00:00 (the 13th, a Saturday)'
    - kw: And
      text: 'it matches 2024-09-13 00:00 (a Friday and the 13th) but not 2024-01-15 00:00 (a Monday, the 15th)'
code:
  lang: go
  source: |
    // fill in the both-restricted branch from the previous lesson:
    case e.DomRestricted && e.DowRestricted:
      dayOK = domM || dowM // EITHER matches - the cron OR quirk
checkpoint: Matches applies the day-of-month OR day-of-week rule, completing the matcher. Commit and stop here.
---

Here is the rule that trips up almost everyone. When **both** the day-of-month and
day-of-week fields are restricted, cron does not require both to match - it fires
when **either** one does. `0 0 13 * 5` means "at midnight on the 13th of the month,
or on any Friday," not "only on Friday the 13th." So it fires on a Friday that is not
the 13th, and on the 13th even when that is not a Friday, and of course on an actual
Friday the 13th. The only way it fails to fire is when the day is neither the 13th
nor a Friday.

This asymmetry is why the restriction flags mattered so much. When just one day
field is set, that field alone decides (the previous lesson); when both are set,
they combine with OR; when neither is set, every day passes. Filling in the
both-restricted branch with `domM || dowM` completes `Matches` - you can now ask any
expression whether it fires at any explicit instant. That single question, asked
over and over as time advances, is exactly what computing the next fire time is built
from, which is the next chapter.
