---
project: build-a-cron-parser
lesson: 8
title: Steps over a range
overview: A step can ride on an explicit range, not just the wildcard - `10-20/2` means every second value from 10 to 20. Today you generalise the striding loop so its base can be a range as well as `*`.
goal: Compile `a-b/n` into the values from a to b taken in steps of n.
spec:
  scenario: A step over a range strides between its endpoints
  status: failing
  lines:
    - kw: Given
      text: 'the minute field'
    - kw: When
      text: 'parseField compiles ''10-20/2'''
    - kw: Then
      text: 'the set is {10, 12, 14, 16, 18, 20}'
    - kw: And
      text: 'parseField compiles ''0-30/10'' to {0, 10, 20, 30}, and ''*/n'' behaves exactly like the full-range step from before'
code:
  lang: go
  source: |
    // the base before "/" chooses the low/high the step walks between:
    //   base "*"     -> lo, hi = field bounds
    //   base "a-b"   -> lo, hi = a, b   (bounds-checked, a <= b)
    //   base "a"     -> lo, hi = a, field max   (open-ended step)
    // then walk lo, lo+n, lo+2n, ... <= hi
checkpoint: A step compiles over any base - a range or the wildcard - striding between its endpoints. Commit and stop here.
---

The step you just wrote hard-codes its start and end to the field bounds because
the base was `*`. The only new idea today is that the **base can be a range**:
`10-20/2` walks from 10 to 20 in strides of 2, giving 10, 12, 14, 16, 18, 20. So
the base determines the low and high the striding loop runs between, and the step
determines the stride. A `*` base simply means "low and high are the field's own
bounds," which is why `*/n` is just this same loop with the widest possible base.

That unifies the whole step family behind one loop: compute a low and a high from
the base, then add `lo`, `lo+n`, `lo+2n`, and so on up to `hi`. A bare-number base
like `5/15` (from 5 to the field maximum) also falls out of the same shape if you
treat a lone number as a range from that number to the field's max - a convenience
some crontabs use. Keep the striding logic in one place and the earlier `*/n`
tests stay green.
