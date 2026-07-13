---
project: build-a-toml-parser
lesson: 18
title: Offset and local date-times
overview: 'TOML has first-class dates and times. Today you introduce the datetime value and parse the two full-timestamp forms: an offset date-time with a timezone, and a local date-time without one.'
goal: 'Parse an RFC 3339 offset date-time and a local date-time into a datetime value.'
spec:
  scenario: Full date-time values
  status: failing
  lines:
    - kw: Given
      text: 'the value 1979-05-27T07:32:00Z and the value 1979-05-27T07:32:00'
    - kw: When
      text: 'they are parsed'
    - kw: Then
      text: 'the first is an offset date-time for 1979-05-27 at 07:32:00 with a zero UTC offset, and the second is a local date-time with the same date and time and no offset'
    - kw: And
      text: 'a space may replace the T separator, and a trailing Z means an offset of zero minutes while -07:00 means an offset of minus 420 minutes'
code:
  lang: go
  source: |
    // add a DateTime holder and two kinds:
    type DateTime struct {
      Year, Month, Day, Hour, Min, Sec, Nano int
      OffsetMinutes int
      HasDate, HasTime, HasOffset bool
    }
    // date part YYYY-MM-DD, 'T' or ' ', time HH:MM:SS, optional offset
    //   'Z' -> offset 0; (+/-)HH:MM -> signed minutes
    // offset present -> KindOffsetDateTime, else KindLocalDateTime
checkpoint: 'Offset and local date-times parse into a datetime value. Commit and stop here.'
---

TOML is unusual among config formats in having **datetimes as a real type**, using
the RFC 3339 timestamp syntax. Today you add the `DateTime` holder - year, month,
day, hour, minute, second, a nanosecond fraction, and a UTC offset in minutes - and
parse the two forms that carry both a date and a time. An **offset date-time** ends
in a timezone: `1979-05-27T07:32:00Z` (UTC, a zero offset) or
`1979-05-27T07:32:00-07:00` (offset of minus 420 minutes). A **local date-time** has
the same date and time but **no offset**, describing a wall-clock moment without
committing to a zone.

The shape is fixed: a date `YYYY-MM-DD`, a separator (`T`, or a space for
readability), a time `HH:MM:SS`, and an optional trailing offset (`Z`, or a signed
`HH:MM`). Whether an offset is present is exactly what decides the kind:
`KindOffsetDateTime` when there is one, `KindLocalDateTime` when there is not.
Parsing pulls the numeric fields out by position and records the offset (with `Z`
meaning zero). The next lesson handles the two shorter forms - a date alone and a
time alone - which reuse this same field extraction.
