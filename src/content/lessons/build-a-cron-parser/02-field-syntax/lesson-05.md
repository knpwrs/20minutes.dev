---
project: build-a-cron-parser
lesson: 5
title: Lists
overview: A field can name several values at once as a comma-separated list, like `1,3,5`. Today you split a field on commas and take the union of the values each part contributes.
goal: Compile a comma-separated list into the union of its parts.
spec:
  scenario: A list unions its comma-separated values
  status: failing
  lines:
    - kw: Given
      text: 'the minute field'
    - kw: When
      text: 'parseField compiles ''1,3,5'''
    - kw: Then
      text: 'the set is {1, 3, 5}'
    - kw: And
      text: 'parseField compiles ''0,30'' to {0, 30}, and each listed value is still bounds-checked'
code:
  lang: go
  source: |
    // split on "," first, then parse each part with the existing
    // single-number logic and union the results:
    set := map[int]bool{}
    for _, part := range strings.Split(text, ",") {
      // parse `part` (a number for now) and add its value(s) to set
    }
checkpoint: A comma list compiles to the union of its values. Commit and stop here.
---

A **list** lets one field name several unrelated values: `1,3,5` in the minute field
means minute 1, 3, and 5. The structure is simple - split the field text on commas,
parse each part on its own, and take the **union** of everything the parts produce.
Because each part is parsed by the machinery you already have, every listed value is
still bounds-checked, so `0,99` in the minute field fails on the second element.

Splitting on commas first, before interpreting each part, is the shape the rest of
the field grammar slots into. Ranges and steps, coming next, are just other kinds of
part - a list of ranges like `1-5,10-15` will fall out for free once each part can be
a range. Today keep the parts as plain numbers and pin the union.
