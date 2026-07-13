---
project: build-a-csv-parser
lesson: 10
title: Carriage-return line endings
overview: CSV files written on Windows and by the RFC end their records with a carriage return plus a newline, not a bare newline. Today you accept CRLF as a record terminator and strip the carriage return so it never leaks into a field.
goal: Treat a carriage return followed by a newline as a single record terminator, dropping the carriage return.
spec:
  scenario: CRLF between records
  status: failing
  lines:
    - kw: Given
      text: 'the input a,b then a carriage return and newline then c,d, that is the raw characters a comma b \r \n c comma d'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the result is two records, [["a", "b"], ["c", "d"]], and the field b is exactly "b" with no trailing carriage return'
    - kw: And
      text: 'a trailing \r\n adds no empty record, so a,b\r\n parses to [["a", "b"]], and a quoted final field is also terminated by CRLF, so "a","b"\r\n parses to [["a", "b"]]'
code:
  lang: go
  source: |
    // when you see '\r' OUTSIDE quotes, peek at the next rune:
    //   if it is '\n' -> this is CRLF: terminate the record, consume BOTH, drop the '\r'
    //   (a lone '\r' with no '\n' after it is the next lesson; leave it for now)
    // treat this CRLF terminator exactly like the '\n' terminator from lesson 3
checkpoint: CRLF line endings terminate records and the carriage return is stripped. Commit and stop here.
---

RFC 4180 says a CSV record ends with a **carriage return followed by a line feed**,
the two-character sequence written `\r\n` and known as CRLF. It is what most
spreadsheet tools emit and what you will meet constantly in real files, so a parser
that only understands a bare newline will leave a stray carriage return dangling on
the end of every field before a line break. That is the classic bug where a value
reads as `b` in your code but mysteriously fails to compare equal to `"b"`, because
it is really `b\r`.

The fix lives in your state machine next to the newline rule. Outside quotes, when
you see a carriage return, look at what follows. If it is a newline, the two together
are one record terminator: flush the record just as a bare newline would, and consume
both characters so neither reaches a field. Because it terminates a record exactly
like `\n`, the same end-of-input rule applies, a trailing `\r\n` does not create a
phantom empty record. A carriage return that is *not* followed by a newline is a
different, rarer case that the next lesson handles, so leave it alone for today.
