---
project: build-a-toml-parser
lesson: 24
title: Implicit and explicit tables
overview: 'A nested header quietly creates its parents. Today you pin the rule that distinguishes those implicit tables from explicit ones, so a parent can still be defined once, in any order.'
goal: 'Allow an implicitly-created super-table to be defined explicitly exactly once.'
spec:
  scenario: Defining a parent after its child
  status: failing
  lines:
    - kw: Given
      text: 'the document open-bracket a.b close-bracket then x = 1 then open-bracket a close-bracket then y = 2'
    - kw: When
      text: 'Parse is called'
    - kw: Then
      text: 'the root has table a with entry y (integer 2) and a subtable b with entry x (integer 1): defining a after a.b is allowed'
    - kw: And
      text: 'but open-bracket a close-bracket twice is still an error, because the second one redefines an already-explicit table'
code:
  lang: go
  source: |
    // mark a table `explicit` when a header names it directly
    // walking a header's intermediate segments creates implicit tables
    // a header on a table that already exists:
    //   was implicit -> now mark explicit (allowed, once)
    //   was already explicit -> error ("already defined")
checkpoint: 'An implicit parent can be defined once, in any order. Commit and stop here.'
---

The nested header `[a.b]` creates `a` **implicitly** as a side effect of naming
`a.b`. TOML treats that implicit table differently from one you name directly: it is
a placeholder that has not really been "defined" yet, so you are still allowed to
write `[a]` later and give it its own keys. That is why `[a.b]` then, further down,
`[a]` is legal and simply fills in the parent - config sections do not have to
appear in top-down order.

The distinction to track is a per-table **explicit flag**. Walking the intermediate
segments of a header creates implicit tables with the flag off. A header that names
a table directly turns the flag **on**. So the first `[a]` on an implicit `a`
promotes it to explicit and is fine, but a **second** `[a]` finds the flag already
on and is the redefinition error from the previous lesson. This one bit of state is
what lets TOML be liberal about ordering while still forbidding a genuine
double-definition.
