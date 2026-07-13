---
project: build-a-cron-parser
lesson: 11
title: Named days of the week
overview: The day-of-week field accepts three-letter names too - `SUN` is 0, `MON` is 1, up to `SAT` at 6. Today you translate day names the same way you translated months.
goal: Accept SUN through SAT (any case) in the day-of-week field as aliases for 0 through 6.
spec:
  scenario: Day names translate to their numbers
  status: failing
  lines:
    - kw: Given
      text: 'the day-of-week field'
    - kw: When
      text: 'parseField compiles ''MON-FRI'''
    - kw: Then
      text: 'the set is {1, 2, 3, 4, 5}'
    - kw: And
      text: 'parseField compiles ''SUN'' to {0} and ''SAT'' to {6}, case-insensitively'
code:
  lang: go
  source: |
    var days = map[string]string{
      "SUN": "0", "MON": "1", "TUE": "2", "WED": "3",
      "THU": "4", "FRI": "5", "SAT": "6",
    }
    // for the day-of-week field, upper-case and replace each 3-letter
    // name with its number BEFORE splitting into parts.
checkpoint: The day-of-week field accepts SUN through SAT as aliases for 0 through 6. Commit and stop here.
---

Days of the week get the same name treatment as months, and it is the same
technique: before the field is split into parts, upper-case the text and swap each
three-letter day name for its number. Sunday is 0, Monday 1, and so on through
Saturday at 6, matching the day-of-week bounds you set back in lesson 2. Once the
substitution is done the field is numeric again, so `MON-FRI` becomes `1-5` and
expands to the working week.

Keep the month and day tables separate even though the mechanism is shared - `SUN`
is only meaningful in the day-of-week field, and `JAN` only in the month field.
Apply each field's name table only to that field. This sets up the one genuinely
surprising day-of-week rule, which is the next lesson: the number 7 is also Sunday.
