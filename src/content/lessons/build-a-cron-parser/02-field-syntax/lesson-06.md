---
project: build-a-cron-parser
lesson: 6
title: Ranges
overview: A range like `1-5` names every value between two endpoints. Today you teach a single list-part to expand a hyphenated range into the full run of values it covers, still bounds-checked.
goal: Compile a hyphenated range into the set of every value from its low to its high endpoint.
spec:
  scenario: A range expands to every value between its endpoints
  status: failing
  lines:
    - kw: Given
      text: 'the minute field'
    - kw: When
      text: 'parseField compiles ''1-5'''
    - kw: Then
      text: 'the set is {1, 2, 3, 4, 5}'
    - kw: And
      text: 'parseField compiles ''1-3,5'' to {1, 2, 3, 5}, and ''5-2'' (low above high) returns an error'
code:
  lang: go
  source: |
    // inside the per-part parser, before the single-number path:
    if i := strings.Index(part, "-"); i >= 0 {
      lo := atoi(part[:i]); hi := atoi(part[i+1:])
      // error if lo > hi, or either endpoint is out of the field bounds,
      // then add every value lo..hi to the set
    }
checkpoint: A hyphenated range expands to the run of values it covers. Commit and stop here.
---

A **range** is a compact way to name a contiguous run of values: `1-5` in the
minute field means minutes 1, 2, 3, 4, and 5. It is just another kind of list
**part**, so it slots into the comma-splitting you built for lists - each part is
parsed on its own and unioned into the field's set. That is why `1-3,5` works the
moment ranges do: the first part expands to a run, the second is a plain number,
and the union is `{1, 2, 3, 5}`.

Enforce two things while expanding. Both endpoints must sit inside the field's
bounds, so `1-70` fails in the minute field. And the low endpoint must not exceed
the high one - a backwards range like `5-2` is meaningless, so reject it rather
than silently producing an empty set. Pinning the backwards-range error now keeps
the field grammar honest as steps arrive next.
