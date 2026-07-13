---
project: build-a-cron-parser
lesson: 9
title: A field of mixed parts
overview: Now every part type composes - a single field can mix numbers, ranges, and steps in one comma list, and overlapping parts collapse because the field is a set. Today you prove the whole field grammar holds together on a realistic field.
goal: Compile a comma list whose parts mix numbers, ranges, and steps into the union of all their values.
spec:
  scenario: Mixed parts union into one field set
  status: failing
  lines:
    - kw: Given
      text: 'the minute field'
    - kw: When
      text: 'parseField compiles ''1-5,15,*/20'''
    - kw: Then
      text: 'the set is {0, 1, 2, 3, 4, 5, 15, 20, 40}'
    - kw: And
      text: 'parseField compiles ''0-4,2-6'' to {0, 1, 2, 3, 4, 5, 6}, because overlapping parts collapse in a set'
code:
  lang: go
  source: |
    // no new parsing today - parseField already:
    //   splits the field on ","
    //   dispatches each part to the number / range / step logic
    //   unions every part's values into one map[int]bool
    // a set naturally dedups, so overlapping ranges just merge.
checkpoint: A single field can mix numbers, ranges, and steps, with overlaps collapsing. Commit and stop here.
---

Nothing new has to be built today - this lesson is the payoff for parsing each list
part on its own. Because `parseField` splits the field on commas and dispatches
every part to the number, range, or step logic you already wrote, a mixed field
like `1-5,15,*/20` just works: the range contributes 1 through 5, the single number
contributes 15, and the step contributes 0, 20, and 40. Their **union** is the
field's set, and that is the compiled minute field of a real expression.

The second half pins a property that falls straight out of using a set: overlapping
parts **collapse**. `0-4,2-6` names 0 through 4 and 2 through 6, but the shared
values 2, 3, and 4 appear once, so the field is exactly 0 through 6. There is no
double-counting to worry about anywhere in the grammar, which is why the whole
five-field parser is now complete and demoable. Confirm both sets and commit - the
field-syntax chapter is done.
