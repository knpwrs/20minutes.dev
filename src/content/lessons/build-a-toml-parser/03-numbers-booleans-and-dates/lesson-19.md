---
project: build-a-toml-parser
lesson: 19
title: Local dates and local times
overview: 'Not every timestamp needs both a date and a time. Today you parse the two remaining datetime forms, a local date on its own and a local time on its own, completing the four-way classification.'
goal: 'Parse a local date, a local time, and a fractional-second time.'
spec:
  scenario: Date-only and time-only values
  status: failing
  lines:
    - kw: Given
      text: 'the value 1979-05-27 and the value 07:32:00 and the value 00:32:00.999999'
    - kw: When
      text: 'they are parsed'
    - kw: Then
      text: 'the first is a local date (year 1979, month 5, day 27, no time), the second is a local time (07:32:00, no date), and the third is a local time whose fractional second is 999999000 nanoseconds'
    - kw: And
      text: 'the four datetime kinds are told apart by shape: date then time gives a date-time, date alone gives a local date, time alone gives a local time, and a trailing offset makes it an offset date-time'
code:
  lang: go
  source: |
    // classify a numeric token by its shape:
    //   has a date part and a time part -> (offset?) date-time
    //   matches YYYY-MM-DD only          -> KindLocalDate
    //   matches HH:MM:SS(.fff) only       -> KindLocalTime
    // a fraction after seconds: scale to nanoseconds (.999999 -> 999999000)
checkpoint: 'Local dates and local times parse, completing the datetime forms. Commit and stop here.'
---

The two full-timestamp forms have shorter siblings. A **local date** is a calendar
day with no time at all, like `1979-05-27` - a birthday, a release date. A **local
time** is a time of day with no date, like `07:32:00` - a daily alarm, an opening
hour. Both reuse the field extraction from the previous lesson; they just fill in
fewer parts and leave `HasTime` or `HasDate` false.

This completes a four-way **classification by shape**. When the value has a leading
sign or is all digits with an optional `.` or `e`, it is a number. Otherwise, a
date part (`YYYY-MM-DD`) followed by a time part is a date-time - offset if a
timezone trails it, local if not; a date part alone is a local date; and a time part
(`HH:MM:SS`) alone is a local time. Times may carry a **fractional second**, and TOML
records it to nanosecond precision, so `.999999` becomes `999999000` nanoseconds.
With these four forms plus the numbers and booleans, every TOML scalar value now
parses.
