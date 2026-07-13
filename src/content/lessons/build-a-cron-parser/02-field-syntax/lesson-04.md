---
project: build-a-cron-parser
lesson: 4
title: The wildcard
overview: The asterisk is cron's most common token - it means every value the field allows. Today parseField expands `*` to the field's full range, and Parse records that a `*` day field is unrestricted.
goal: Expand `*` to the full set of a field's values and mark `*` day fields unrestricted.
spec:
  scenario: A wildcard expands to every value in range
  status: failing
  lines:
    - kw: Given
      text: 'the minute field bounds 0-59 and the month field bounds 1-12'
    - kw: When
      text: 'parseField compiles ''*'' for each'
    - kw: Then
      text: 'the minute set is every value 0 through 59 (60 values) and the month set is 1 through 12 (12 values)'
    - kw: And
      text: 'Parse(''* * * * *'') sets DomRestricted false and DowRestricted false'
code:
  lang: go
  source: |
    // in parseField, before the number path:
    if text == "*" {
      set := map[int]bool{}
      for v := spec.Min; v <= spec.Max; v++ { set[v] = true }
      return set, nil
    }
checkpoint: '`*` expands to a field''s full range and clears the day-restriction flags. Commit and stop here.'
---

A `*` in a cron field is a **wildcard**: it places no constraint, so it stands for
every value the field can take. For minutes that is the whole set 0 through 59; for
months, 1 through 12. Because a field compiles to a set of allowed values, the
wildcard is just the special case where the set is the field's entire range - no new
machinery, only the widest possible set.

The wildcard is also what the day-restriction flags key off. A day-of-month or
day-of-week of `*` means "any day," so it is *not* a restriction, and `Parse` records
`DomRestricted` or `DowRestricted` as false. That distinction looks idle today, but
it is the switch that decides, several lessons from now, whether the two day fields
are combined with AND or with OR. Pin both the full expansion and the cleared flags.
