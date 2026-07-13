---
project: build-a-regex-engine
lesson: 4
title: The dot wildcard
overview: The first metacharacter - `.` matches any single character. It is the smallest possible step beyond literals and introduces the idea that a pattern character can stand for a set of input characters.
goal: Parse `.` into a Dot node that matches any one character during matching.
spec:
  scenario: Dot matches any single character
  status: failing
  lines:
    - kw: Given
      text: 'the pattern "a.c"'
    - kw: When
      text: 'Match is called against "axc"'
    - kw: Then
      text: it reports true
    - kw: And
      text: 'Match for "a.c" against "ac" reports false'
    - kw: And
      text: 'Match for "a.c" against "a.c" reports true'
code:
  lang: go
  source: |
    type Dot struct{}

    // in the parser: a '.' byte becomes a Dot node, not a Literal.
    // in the matcher: a Dot matches any one byte, as long as one is
    // left - so it still fails against an empty tail.
checkpoint: '`.` matches any single character while literals still match exactly. Commit and stop here.'
---

`.` is your first **metacharacter** - a pattern byte that means something other than
itself. Where a `Literal` matches exactly one specific byte, a `Dot` matches any one
byte at all. The only thing it insists on is that a byte is actually *there*: `a.c`
can't match `ac`, because there's no character for the `.` to consume.

This is a small change with a big conceptual payload. Until now, one pattern byte
matched one fixed input byte. `Dot` breaks that: a single node can accept a whole
*set* of characters. Character classes like `[a-z]` are the same idea with a
narrower set, so the matcher shape you write for `Dot` is the one they'll reuse.
