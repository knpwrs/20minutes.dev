---
project: build-a-toml-parser
lesson: 13
title: Signed integers and underscores
overview: 'Back in lesson two you read a plain decimal integer. Today you complete the decimal integer grammar: an optional sign, and underscores between digits for readability.'
goal: 'Parse a decimal integer with an optional sign and underscore separators.'
spec:
  scenario: Signs and digit separators
  status: failing
  lines:
    - kw: Given
      text: 'decimal integer values with signs and separators'
    - kw: When
      text: 'they are parsed'
    - kw: Then
      text: '1_000 is the integer 1000, -17 is -17, +99 is 99, and 0 is 0'
    - kw: And
      text: 'an underscore must sit between two digits, so a leading, trailing, or doubled underscore is an error'
code:
  lang: go
  source: |
    // a bare (unquoted) value is read up to whitespace, '#', ',', ']', '}'
    // for a decimal integer:
    //   accept a leading '+' or '-'
    //   remove underscores that lie between two digits (reject others)
    //   parse the remaining digits as a base-10 int64
checkpoint: 'Decimal integers take a sign and underscore separators. Commit and stop here.'
---

Lesson two read a bare run of digits as an integer to get the pipeline working;
now you fill in the rest of the **decimal integer** grammar. TOML allows an optional
leading `+` or `-`, so `+99` and `-17` are integers, and a plain `0` is zero. The
sign, when present, is part of the number and sets its value's magnitude and
direction.

The readability feature is the **underscore separator**: `1_000` is one thousand and
`1_000_000` is a million. The rule is strict - an underscore must sit **between two
digits** - so `_1`, `1_`, and `1__0` are all errors, not just ignored. Strip the
valid separators and parse what remains. Because a bare value has no quotes to mark
its end, you also settle where an unquoted value stops: at whitespace, a `#`
comment, or one of the structural characters `,`, `]`, `}` that arrays and inline
tables will use. Reading that token cleanly is what lets the coming lessons tell an
integer from a float from a date.
