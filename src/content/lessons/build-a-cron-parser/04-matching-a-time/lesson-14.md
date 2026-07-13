---
project: build-a-cron-parser
lesson: 14
title: Matching minute, hour, and month
overview: A time matches an expression only if each of its fields is an allowed value. Today you build the matcher for the three straightforward fields - minute, hour, and month - leaving the tangled day fields for next.
goal: Return whether a timestamp's minute, hour, and month are each members of the expression's corresponding sets.
spec:
  scenario: The simple fields must all match
  status: failing
  lines:
    - kw: Given
      text: 'the expression ''30 9 * 1 *'' and the instant 2024-01-15 09:30'
    - kw: When
      text: 'Matches is called'
    - kw: Then
      text: 'it returns true, because minute 30, hour 9, and month 1 are all allowed'
    - kw: And
      text: 'Matches is false for 2024-01-15 09:31 (minute) and false for 2024-06-15 09:30 (month)'
code:
  lang: go
  source: |
    func Matches(e Expr, t time.Time) bool {
      minute, hour, _, month, _ := timeFields(t)
      return e.Minute[minute] && e.Hour[hour] && e.Month[month]
      // day-of-month and day-of-week join in the next lessons.
    }
checkpoint: Matches checks the minute, hour, and month fields against a timestamp. Commit and stop here.
---

A cron expression **matches** an instant when every field of the expression allows
that instant's corresponding value. Three of the five fields are completely
independent and combine with a plain AND: the minute must be in the minute set, the
hour in the hour set, and the month in the month set. Because each field is already
a set of allowed values, matching one field is a single membership test, and the
whole thing is those tests joined with AND.

Leave the two day fields out of `Matches` for now - treat any day as acceptable this
lesson - because they do not combine so simply. `30 9 * 1 *` fires at 09:30 in
January regardless of the day, so it matches 2024-01-15 09:30 but not 09:31 (wrong
minute) and not a June instant (wrong month). Getting the three easy fields locked
down first means the next lessons can focus entirely on the day-of-month and
day-of-week rule without anything else in the way.
