---
project: build-a-toml-parser
lesson: 30
title: Positioned syntax errors
overview: 'Malformed input should get a precise complaint, not a crash. Today you report the common syntax mistakes, an unterminated string, a bad escape, a missing value or equals, and trailing junk, each with a line and column.'
goal: 'Report positioned errors for the common malformed lines.'
spec:
  scenario: Reporting syntax errors
  status: failing
  lines:
    - kw: Given
      text: 'malformed inputs'
    - kw: When
      text: 'Parse is called and the error is formatted'
    - kw: Then
      text: 'x = "abc with no closing quote reports an unterminated string with its position, and x = 1 2 reports unexpected text after the value at the column of the 2'
    - kw: And
      text: 'a line with no equals such as just the word key reports an expected equals error, and an empty value x = reports an expected value error, each naming its line and column'
code:
  lang: go
  source: |
    // in the readers, raise a positioned ParseError on:
    //   end of input before a closing quote  -> "unterminated string"
    //   a value that does not start any form  -> "expected a value"
    //   a key line with no '='                -> "expected '='"
    //   non-comment text left after a value   -> "unexpected text after value"
    // fill Line/Col from where the reader stopped
checkpoint: 'Common syntax mistakes report a clear position. Commit and stop here.'
---

The duplicate-key lessons gave errors a position; now you spread that same care over
the everyday **syntax mistakes** a person makes while editing a config. Four are
common enough to name precisely: an **unterminated string** (`x = "abc` with no
closing quote), a **value that starts nothing** (`x = ` with an empty right side),
a **key line with no equals** (a stray word on a line), and **trailing junk** after
an otherwise-complete value (`x = 1 2`, where the `2` has no business being there).

Each of these already has a place in the code where the reader gives up; the work is
to raise a `ParseError` there instead of returning something wrong or panicking, and
to fill in the line and column of the spot where parsing stopped. Trailing junk is
worth calling out: after a value is read, the only thing allowed on the rest of the
line is whitespace and an optional `#` comment, so anything else is an error at the
column where it starts. Good positions turn a rejected file from a mystery into a
one-line fix, which is much of what makes a parser pleasant to use.
