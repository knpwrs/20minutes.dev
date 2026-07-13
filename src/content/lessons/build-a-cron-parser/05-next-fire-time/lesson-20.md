---
project: build-a-cron-parser
lesson: 20
title: The leap-day expression
overview: February 29th exists only in leap years, so a next-fire scan for it may have to jump years ahead. Today you confirm the scan lands on Feb 29 only in a leap year - the hardest calendar case, and still no new code.
goal: Confirm Next resolves a Feb 29 expression to the correct leap year, skipping the three common years in between.
spec:
  scenario: Next resolves a leap-day expression to the right year
  status: failing
  lines:
    - kw: Given
      text: 'the expression ''0 0 29 2 *'' - midnight on February 29th'
    - kw: When
      text: 'Next is called from 2023-06-01 00:00'
    - kw: Then
      text: 'it returns 2024-02-29 00:00, the next leap year''s leap day'
    - kw: And
      text: 'Next from 2024-02-29 00:00 returns 2028-02-29 00:00, strictly after and four years on'
code:
  lang: go
  source: |
    // Still no new code. The scan tests Day() == 29 && Month() == 2,
    // which is only ever true on a real leap day. So it naturally steps
    // over 2025, 2026, and 2027 - none of which has a February 29th -
    // and stops at the next leap year. The nine-year bound from the
    // previous lesson keeps even the rare eight-year century gap safe.
checkpoint: Next resolves a Feb 29 expression to the correct leap year, completing the next-fire chapter. Commit and stop here.
---

February 29th is the sharpest edge on the calendar: it occurs roughly once every four
years and not at all in between. But the minute-by-minute scan needs no calendar
theory to handle it. It tests every candidate minute against the expression, and only
a genuine February 29th ever reports a day-of-month of 29 in month 2. Starting from
mid-2023, the scan walks forward through the rest of 2023, then all of the non-leap
years - none of which contains that date - and finally matches on 2024-02-29, the next
leap year's leap day.

The second assertion shows the strictly-after rule doing real work across four years.
Ask for the next fire *from* a matching Feb 29 and the scan starts the following
minute, then has to cross 2025, 2026, and 2027 before landing on 2028-02-29. This is
exactly the case the bound in the previous lesson protects: a real leap-day expression
must still resolve, so the horizon has to be wide enough to clear the gap between two
February 29ths - normally four years, but as much as eight across a skipped century
leap year. Confirm both and the next-fire chapter is complete.
