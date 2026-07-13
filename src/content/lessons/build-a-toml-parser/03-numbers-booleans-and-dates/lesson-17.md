---
project: build-a-toml-parser
lesson: 17
title: Infinity and not-a-number
overview: 'Floats have three special named values. Today you parse infinity and not-a-number, the named floats that a plain number grammar cannot express.'
goal: 'Parse inf, +inf, -inf, and nan as their special float values.'
spec:
  scenario: Special float values
  status: failing
  lines:
    - kw: Given
      text: 'the special float tokens'
    - kw: When
      text: 'they are parsed'
    - kw: Then
      text: 'inf and +inf are positive infinity, -inf is negative infinity, and nan is a not-a-number float'
    - kw: And
      text: 'these are float values (their kind is float), and nan compares as not equal to itself'
code:
  lang: go
  source: |
    // before the numeric parse, match the named floats exactly:
    //   "inf" or "+inf" -> +Inf     "-inf" -> -Inf
    //   "nan", "+nan", "-nan" -> NaN
    // all are KindFloat (use your language's inf / nan constructors)
checkpoint: 'Infinity and not-a-number parse as special floats. Commit and stop here.'
---

TOML floats include three **special values** that a digit grammar cannot write:
positive infinity `inf` (also spelled `+inf`), negative infinity `-inf`, and
not-a-number `nan` (with optional sign). These are the same special values IEEE-754
floating point defines, and TOML spells them as bare lowercase words, much like the
booleans.

Match them **before** the ordinary numeric parse, because `inf` and `nan` are
letters, not digits, and would otherwise look like bare words. Each produces a
`KindFloat` value built from your language's infinity or NaN constructor. The
property to remember for testing is that **NaN is not equal to itself**, so a test
asserts not-a-number by checking that the value is a float and that it fails an
equality check with itself, rather than comparing to a literal. With these, the
float type is complete.
