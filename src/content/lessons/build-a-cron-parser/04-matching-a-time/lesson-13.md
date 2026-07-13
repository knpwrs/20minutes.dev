---
project: build-a-cron-parser
lesson: 13
title: Reading a timestamp's fields
overview: Matching a cron expression means comparing an expression's sets against a specific moment in time. Today you pull the five relevant numbers out of a fixed timestamp - minute, hour, day-of-month, month, and day-of-week - with no wall clock involved.
goal: Decompose an explicit timestamp into the minute, hour, day-of-month, month, and day-of-week a matcher will compare.
spec:
  scenario: A fixed instant yields its five cron-relevant fields
  status: failing
  lines:
    - kw: Given
      text: 'the fixed instant 2024-01-15 09:30 (a Monday)'
    - kw: When
      text: 'timeFields is called on it'
    - kw: Then
      text: 'it returns minute 30, hour 9, day-of-month 15, month 1, day-of-week 1'
    - kw: And
      text: 'timeFields for 2024-01-14 00:00 (a Sunday) returns day-of-week 0, confirming Sunday is 0'
code:
  lang: go
  source: |
    // take an explicit time value (no "now"); read its parts.
    // day-of-week must be Sunday=0 .. Saturday=6 to match the field bounds.
    func timeFields(t time.Time) (minute, hour, dom, month, dow int) {
      return t.Minute(), t.Hour(), t.Day(), int(t.Month()), int(t.Weekday())
    }
checkpoint: You can read the five cron-relevant fields out of any explicit instant. Commit and stop here.
---

Everything the scheduler does from here compares an expression against a **moment**,
and a moment is described by exactly five numbers: what minute, what hour, what day
of the month, what month, and what day of the week it falls on. Today's job is to
extract those five numbers from an explicit timestamp you pass in. There is no
"now" anywhere in this library - every instant is given, which is what makes every
result reproducible and assertable to the minute.

The one detail that matters is the day-of-week convention. The compiled day-of-week
field runs 0 to 6 with Sunday as 0, so `timeFields` must report the weekday the same
way - Sunday 0, Monday 1, through Saturday 6 - or the matcher will compare against
the wrong day. Pin a Monday and a Sunday now so that convention is locked before any
matching logic depends on it.
