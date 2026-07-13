---
project: build-a-cron-parser
lesson: 2
title: Field bounds and a single number
overview: Each of the five fields has its own legal range - minutes are 0 to 59, days-of-month start at 1, and so on. Today you record those bounds in a small table and parse a single-number field into a one-element set, rejecting any number outside its field's range.
goal: Compile a single-number field into the set containing that number, or an error if it is out of range.
spec:
  scenario: A single number becomes a one-element set, bounds enforced
  status: failing
  lines:
    - kw: Given
      text: 'the field bounds minute 0-59, hour 0-23, day-of-month 1-31, month 1-12, day-of-week 0-6'
    - kw: When
      text: 'parseField is called for the minute field with text ''5'''
    - kw: Then
      text: 'it returns the set {5}'
    - kw: And
      text: 'parseField for the minute field with ''60'' returns an error, and for the day-of-month field with ''0'' returns an error'
code:
  lang: go
  source: |
    type FieldSpec struct{ Name string; Min, Max int }
    var specs = [5]FieldSpec{
      {"minute", 0, 59}, {"hour", 0, 23}, {"day-of-month", 1, 31},
      {"month", 1, 12}, {"day-of-week", 0, 6},
    }
    // parseField(spec, "5") -> {5}; reject n < Min or n > Max.
checkpoint: A single-number field compiles to a one-element set with bounds enforced. Commit and stop here.
---

Cron fields do not all share the same range. Minutes run 0 to 59 and hours 0 to 23,
but the calendar fields start at 1: there is no zeroth day of the month and no
zeroth month. Day-of-week is 0 to 6 with Sunday as 0. Capturing those five ranges in
one small **FieldSpec** table (a name, a minimum, and a maximum for each field)
gives every later parsing rule a single place to check what counts as in-range.

Today parse the simplest field there is - a bare number - into a set holding just
that number, and validate it against the field's bounds. Note the asymmetry the
table encodes: `0` is a perfectly good minute but an invalid day-of-month, so the
same text is accepted for one field and rejected for another. Returning a set (not
just an integer) from the start matters, because every richer form you add next -
lists, ranges, steps - also compiles down to a set of allowed values.
