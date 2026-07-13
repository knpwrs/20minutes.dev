---
project: build-a-cron-parser
lesson: 19
title: Rolling across months and skipping absent days
overview: The scan already advances a minute at a time, so month and year rollover fall out for free - and a day that a month does not have is simply never matched. Today you confirm both, with no new code.
goal: Confirm the next-fire scan rolls into the next month or year and skips months that lack the requested day.
spec:
  scenario: Next rolls across month boundaries and skips absent days
  status: failing
  lines:
    - kw: Given
      text: 'the expression ''0 0 1 * *'' and the start instant 2024-01-15 10:00'
    - kw: When
      text: 'Next is called'
    - kw: Then
      text: 'it returns 2024-02-01 00:00, rolling forward into the next month'
    - kw: And
      text: '''0 0 31 * *'' from 2024-04-10 00:00 returns 2024-05-31 00:00, skipping April because it has no 31st'
code:
  lang: go
  source: |
    // No new code today. Next already advances with a plain add-a-minute,
    // so the time library rolls the day, month, and year underneath you:
    //   0 0 1 * *   keeps missing until Day() is 1 of the next month.
    //   0 0 31 * *  never matches in a 30-day month, so the scan walks
    //               straight into the next month that actually has a 31st.
checkpoint: Next rolls across month and year boundaries and skips months missing the target day, with no new code. Commit and stop here.
---

This is a payoff lesson: the calendar-rollover behavior you might expect to write by
hand is already done, because `Next` steps forward one minute at a time and lets the
time library handle every increment. When the clock passes 23:59 on the last day of a
month, adding a minute lands on 00:00 of the first day of the next month, and the
day-of-month and month numbers the matcher reads update automatically. So `0 0 1 * *`
scanning from mid-January simply keeps failing to match until the calendar reaches
February 1st.

The **absent-day** case is even more satisfying. `0 0 31 * *` asks for the 31st, but
April only has thirty days, so no instant in April ever reports a day-of-month of 31
and the matcher never fires there. The scan just keeps walking, straight past the end
of April, until it reaches a month that does have a 31st - May. There is no special
"does this month have 31 days" check anywhere; the impossibility of April 31st is
handled purely by the fact that such a minute never exists to be tested. Confirm both
results and commit.
