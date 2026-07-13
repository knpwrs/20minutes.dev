---
project: build-a-toml-parser
lesson: 12
title: Multiline literal strings
overview: 'The last string form combines multiline spanning with literal, no-escape semantics. Today you parse a multiline literal string, delimited by three single quotes, for raw multi-line text.'
goal: 'Parse a triple-single-quoted multiline literal string with no escaping.'
spec:
  scenario: A multiline literal string
  status: failing
  lines:
    - kw: Given
      text: 'a value opened with three single quotes, then a newline, then the text first-backslash-n-second, then a newline, then three closing single quotes'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'the value is exactly first, backslash, n, second, newline: the backslash-n stays two literal characters and the newline after the opener is trimmed'
    - kw: And
      text: 'no escapes are processed, matching the single-line literal rule but allowed to span lines'
code:
  lang: go
  source: |
    // a value opening with "'''" is a multiline literal string
    //   read everything up to the closing "'''"
    //   trim ONE newline right after the opening delimiter
    //   NO escape processing - backslashes and all are verbatim
checkpoint: 'Multiline literal strings span lines with no escaping. Commit and stop here.'
---

The fourth and final string form is the **multiline literal string**, delimited by
three single quotes `'''`. It is the union of two rules you already know: it may
span many lines like a multiline basic string, and it processes **no escapes** like
a single-line literal string. That makes it ideal for raw blocks of text - a code
snippet, a regular expression across lines - where you want exactly the characters
typed.

It borrows one trimming rule from the multiline basic string: **a newline right
after the opening `'''` is trimmed**, so the opener can sit on its own line. It does
**not** borrow the line-ending backslash trim, because backslashes are not special
here at all. So `'''` then a newline then `first\nsecond` then a newline then `'''`
yields `first\nsecond\n` where the `\n` in the middle is two literal characters,
backslash and `n`, and only the trailing real newline survives. With this, all four
of TOML's string flavors are done: basic, literal, and the multiline version of
each.
