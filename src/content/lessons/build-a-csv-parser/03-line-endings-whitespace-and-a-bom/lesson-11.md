---
project: build-a-csv-parser
lesson: 11
title: A lone carriage return
overview: Older Mac files and some exports end records with a bare carriage return and no newline at all. Today you accept that as a record terminator too, while making sure a carriage return inside a quoted field is still preserved untouched.
goal: Treat a carriage return not followed by a newline as a record terminator, but keep one inside quotes literal.
spec:
  scenario: A bare carriage return as a terminator
  status: failing
  lines:
    - kw: Given
      text: 'the input a then a lone carriage return then b, that is the raw characters a \r b with no newline'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the result is two records, [["a"], ["b"]]'
    - kw: And
      text: 'a carriage return inside a quoted field is preserved, so the quoted input a \r b (raw characters quote a \r b quote) parses to one field "a\rb"'
code:
  lang: go
  source: |
    // extend the '\r' handling from lesson 10, OUTSIDE quotes:
    //   next rune is '\n' -> CRLF terminator (consume both)
    //   otherwise         -> lone-'\r' terminator (consume just the '\r')
    // INSIDE quotes a '\r' is an ordinary character: append it, terminate nothing
checkpoint: A lone carriage return terminates a record outside quotes but stays literal inside them. Commit and stop here.
---

Before newlines settled down, classic Mac OS ended lines with a single carriage
return and no line feed, and you still find that convention in legacy exports. A
robust parser treats all three line endings, `\n`, `\r\n`, and a lone `\r`, as record
terminators, so a file written any of those ways reads the same. You already handle
the first two; the lone carriage return is the last one. Outside quotes, a `\r` that
is not part of a CRLF pair ends the record on its own.

The crucial pairing is that this only applies **outside** quotes. Inside a quoted
field, a carriage return is ordinary content that must survive intact, just like an
embedded newline, because the whole promise of quoting is that the field is taken
literally. So the same `\r` rune means two opposite things depending on your one bit
of state: a terminator in the open, a preserved character inside quotes. Test both
sides in the same lesson so the distinction is nailed down, since a parser that
strips carriage returns everywhere will quietly corrupt binary-ish or Windows-authored
values that were legitimately quoted.
