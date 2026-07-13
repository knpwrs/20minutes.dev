---
project: build-a-toml-parser
lesson: 16
title: Floats
overview: 'Numbers with a fractional or exponent part are a distinct type. Today you tell a float apart from an integer and parse it, so a config can hold measurements and ratios.'
goal: 'Parse floats with a fractional part, an exponent, or both.'
spec:
  scenario: Floating-point numbers
  status: failing
  lines:
    - kw: Given
      text: 'numeric values that carry a fraction or an exponent'
    - kw: When
      text: 'they are parsed'
    - kw: Then
      text: '3.14 is the float 3.14, -2.5 is -2.5, 1e6 is the float 1000000, and 6.022e23 is that float'
    - kw: And
      text: 'a value is a float exactly when it has a . or an e/E exponent, and underscores are allowed between digits (9_000.0 is 9000.0)'
code:
  lang: go
  source: |
    // classify the bare numeric token before parsing:
    //   contains '.' or 'e'/'E' (after the optional sign) -> float
    //   otherwise -> integer (the earlier path)
    // strip inter-digit underscores, parse as a 64-bit float
checkpoint: 'Floats with fractions and exponents parse apart from integers. Commit and stop here.'
---

A **float** is a number with a fractional part, an exponent, or both: `3.14`,
`-2.5`, `1e6` (a million), `6.022e23`. The presence of a decimal point `.` or an
exponent marker `e`/`E` is exactly what separates a float from an integer, so the
classification is a quick scan of the bare numeric token before you parse it. A
token with neither stays on the integer path from the earlier lessons.

The same readability rules carry over: an optional leading sign, and underscores
**between digits** in both the whole and fractional parts. TOML requires digits on
both sides of the decimal point - `3.14`, never `.14` or `3.` - and an exponent may
carry its own sign (`1e-9`). Store the result as a 64-bit floating-point value; that
matches how TOML defines floats and how nearly every consumer will use them. Telling
the two number types apart cleanly, then handing the float text to a float parse, is
today's step.
