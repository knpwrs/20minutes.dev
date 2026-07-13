---
project: build-a-cron-parser
lesson: 10
title: Named months
overview: The month field accepts three-letter names as well as numbers - `JAN` is 1, `DEC` is 12. Today you translate month names to their numbers before the field is parsed, so names work everywhere numbers do.
goal: Accept JAN through DEC (any case) in the month field as aliases for 1 through 12.
spec:
  scenario: Month names translate to their numbers
  status: failing
  lines:
    - kw: Given
      text: 'the month field'
    - kw: When
      text: 'parseField compiles ''JAN'''
    - kw: Then
      text: 'the set is {1}'
    - kw: And
      text: 'parseField compiles ''MAR-JUN'' to {3, 4, 5, 6} and ''SEP,DEC'' to {9, 12}, case-insensitively'
code:
  lang: go
  source: |
    var months = map[string]string{
      "JAN": "1", "FEB": "2", "MAR": "3", "APR": "4", "MAY": "5", "JUN": "6",
      "JUL": "7", "AUG": "8", "SEP": "9", "OCT": "10", "NOV": "11", "DEC": "12",
    }
    // for the month field, upper-case the text and replace each 3-letter
    // name with its number BEFORE splitting into parts.
checkpoint: The month field accepts JAN through DEC as aliases for 1 through 12. Commit and stop here.
---

Crontabs let you write `JAN` instead of `1` in the month field, because a name is
easier to read than a number. The cleanest way to support this is **translation**:
before the field is split into parts, upper-case the text and swap every
three-letter month name for its number. After that substitution the field is a
plain numeric field again, so lists, ranges, and steps all keep working - `MAR-JUN`
becomes `3-6` and expands exactly as a numeric range would.

Do the substitution as pure text replacement and let the machinery you already have
finish the job. Names are case-insensitive in real crontabs, so `jan`, `Jan`, and
`JAN` all mean January - normalise the case first. Because you translate to numbers
and reuse the number path, `SEP,DEC` and `9,12` compile to the identical set, and
every bound check still applies.
