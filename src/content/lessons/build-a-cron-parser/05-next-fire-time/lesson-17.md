---
project: build-a-cron-parser
lesson: 17
title: Scanning for the next fire time
overview: With a matcher in hand, the next fire time is just the first minute after a start instant that matches. Today you build that scan - step forward a minute at a time until Matches is true.
goal: Compute the next fire time strictly after a start instant by advancing one minute at a time until the expression matches.
spec:
  scenario: The next matching minute after a start
  status: failing
  lines:
    - kw: Given
      text: 'the expression ''*/15 * * * *'' and the start instant 2024-01-15 10:02'
    - kw: When
      text: 'Next is called'
    - kw: Then
      text: 'it returns 2024-01-15 10:15'
    - kw: And
      text: 'Next from 2024-01-15 10:15 returns 2024-01-15 10:30 (strictly after the start), and ''0 * * * *'' from 10:30 returns 11:00'
code:
  lang: go
  source: |
    func Next(e Expr, start time.Time) time.Time {
      // start strictly after: truncate to the minute, then add one minute
      t := start.Truncate(time.Minute).Add(time.Minute)
      for !Matches(e, t) {
        t = t.Add(time.Minute)
      }
      return t
    }
checkpoint: Next finds the first matching minute strictly after a start instant. Commit and stop here.
---

Once you can ask "does this minute match," finding the **next fire time** is almost
anticlimactic: start just after the given instant and keep advancing one minute
until the matcher says yes. That first matching minute is the answer. Cron has
minute resolution, so a minute is the natural step, and letting the time library add
a minute means all the calendar arithmetic - hour, day, and month rollover - is
handled for you underneath.

Two details make it correct. First, the search is **strictly after** the start: if
you ask for the next fire from a moment that itself matches, you want the following
one, so truncate to the minute and add one minute before you begin. That is why
`Next` from 10:15 with `*/15` returns 10:30, not 10:15. Second, seconds are ignored -
truncating to the minute means an odd start like 10:02:37 behaves the same as
10:02:00. Pin the within-the-hour case and the hour rollover now; the harder
calendar rollovers are just this same loop, proven next.
