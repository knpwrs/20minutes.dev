---
project: build-a-cron-parser
lesson: 15
title: Matching a day when one day field is set
overview: The day-of-month and day-of-week fields both constrain which days fire, but usually only one of them is actually restricted. Today you fold the day check into Matches for the common case where at most one day field is set.
goal: Extend Matches so a restricted day-of-month or day-of-week field decides the day, and a wildcard day field imposes nothing.
spec:
  scenario: One restricted day field decides the day
  status: failing
  lines:
    - kw: Given
      text: 'the day-restriction flags from parsing tell Matches which day fields are real constraints'
    - kw: When
      text: 'Matches checks the day of an instant'
    - kw: Then
      text: '''0 0 15 * *'' matches 2024-01-15 00:00 but not 2024-01-16 00:00 (day-of-month decides)'
    - kw: And
      text: '''0 0 * * 1'' matches 2024-01-15 00:00 (a Monday) but not 2024-01-16 00:00 (a Tuesday), and ''0 0 * * *'' matches any day'
code:
  lang: go
  source: |
    // dom and dow are the instant's day-of-month and weekday.
    // domM := e.Dom[dom]; dowM := e.Dow[dow]
    switch {
    case e.DomRestricted && e.DowRestricted:
      // both restricted: handled next lesson
    case e.DomRestricted:
      dayOK = domM
    case e.DowRestricted:
      dayOK = dowM
    default:
      dayOK = true // neither restricted: every day is fine
    }
checkpoint: Matches respects a single restricted day field and ignores a wildcard one. Commit and stop here.
---

The two day fields are where cron gets subtle, so approach it in two steps. Today
handle the ordinary case: **at most one** of day-of-month and day-of-week is
actually restricted. This is where the `DomRestricted` and `DowRestricted` flags you
recorded back at parse time earn their keep - they tell you which day field is a
real constraint and which is just a `*`. If day-of-month is the restricted one, the
day matches when the instant's date is in the day-of-month set; if day-of-week is
the restricted one, it matches when the weekday is in the day-of-week set; if
neither is restricted, every day is fine.

A wildcard day field must impose nothing, which is exactly why you check the flag
rather than set membership - a `*` day-of-week expands to all seven weekdays, so
testing membership alone would always pass and hide the real question of whether the
field was even meant to constrain. `0 0 15 * *` fires only on the 15th, `0 0 * * 1`
fires only on Mondays, and `0 0 * * *` fires every day. The one remaining case,
where **both** fields are restricted at once, is the famous cron gotcha and gets its
own lesson next.
