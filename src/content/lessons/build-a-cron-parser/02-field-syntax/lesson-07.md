---
project: build-a-cron-parser
lesson: 7
title: Steps over the wildcard
overview: A step like `*/15` fires every nth value across the whole field - every fifteenth minute, starting at zero. Today you parse the `*/n` form into the field's range walked in strides of n.
goal: Compile `*/n` into the field's full range taken in steps of n from its minimum.
spec:
  scenario: A step over the wildcard strides across the whole range
  status: failing
  lines:
    - kw: Given
      text: 'the minute field with bounds 0-59'
    - kw: When
      text: 'parseField compiles ''*/15'''
    - kw: Then
      text: 'the set is {0, 15, 30, 45}'
    - kw: And
      text: 'parseField compiles ''*/20'' to {0, 20, 40}, and ''*/0'' (zero step) returns an error'
code:
  lang: go
  source: |
    // split a part on "/" into a base and a step:
    //   base "*"  -> the field's full range lo..hi
    //   step n    -> reject n <= 0, then walk lo, lo+n, lo+2n, ... <= hi
    if j := strings.Index(part, "/"); j >= 0 {
      base := part[:j]; n := atoi(part[j+1:])
      // ...
    }
checkpoint: A `*/n` step compiles to the field's range walked in strides of n. Commit and stop here.
---

A **step** answers "how often," not "which values": `*/15` in the minute field
means every fifteenth minute across the whole hour, which is minutes 0, 15, 30, and
45. The syntax is a base and a step joined by a slash. When the base is `*`, the
step walks the field's entire range - starting at the minimum and adding the step
until it passes the maximum. For minutes that is 0, then 15, 30, 45, and 60 is out
of range, so the set stops at 45.

Split each part on `/` before anything else, so a part is a base optionally
followed by a step. Today only the `*` base is in play; a step over an explicit
range comes next and reuses this same striding loop. Guard the step value: a step
of zero (or negative) would never advance, so reject `*/0` with an error rather
than looping forever.
