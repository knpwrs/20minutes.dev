---
project: build-a-csv-parser
lesson: 9
title: Stray text after a closing quote
overview: Once a quoted field closes, the only things allowed next are a delimiter, a newline, or the end of input. Anything else is malformed, and today you report it at the position of the offending character, completing the quoting state machine.
goal: Report an error when characters other than a delimiter or newline follow a closing quote.
spec:
  scenario: Extra characters after a closing quote
  status: failing
  lines:
    - kw: Given
      text: 'the input "a"b (the raw characters quote a quote b), where a character follows the closing quote'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'parsing fails with an error at line 1, column 4, the position of the stray b, with a message about unexpected text after a closing quote'
    - kw: And
      text: 'a space also counts, so "a" b (quote a quote space b) fails at column 4 as well, while "a","b" (two quoted fields) parses cleanly to [["a", "b"]]'
code:
  lang: go
  source: |
    // after the CLOSING quote you are in an "after-quote" state; the next rune must be
    //   a delimiter -> start the next field
    //   a newline / carriage return / end of input -> end the record
    //   anything else (including a space) -> ParseError at the current column
checkpoint: The quoting state machine is complete, accepting well-formed quoted fields and rejecting malformed ones with positions. Commit and stop here.
---

A quoted field makes a tidy promise: after its closing quote, the field is over, so
the very next thing must be a separator. Concretely, once you read the closing quote
you enter a brief **after-quote** state where only three things are legal, a
delimiter to start the next field, a record terminator to end the row, or the end of
the input. A `"` followed by `a"` followed by `b` violates this, because `b` is
neither, and the honest response is to reject it at the position of that `b` rather
than silently gluing it onto the field.

This includes whitespace: a space after a closing quote, as in `"a" b`, is stray
text too, because leading and trailing spaces are significant in this parser and a
quoted field's boundary is exact. Reporting these at the offending column, using the
positioned error from the previous lesson, closes out the quoting state machine.
With it, your parser now has a complete model of quotes: it opens them only at a
field's start, reads any content including delimiters, newlines, and escaped quotes,
requires a matching close, and forbids anything unexpected around the boundary. Every
later chapter builds on this core without changing it.
