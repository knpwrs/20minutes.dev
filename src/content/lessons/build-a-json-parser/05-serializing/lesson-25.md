---
project: build-a-json-parser
lesson: 25
title: Serializing strings
overview: Writing a string is the mirror of scanning one - the special characters that were decoded on the way in must be escaped on the way out. Today you build that escaping so any string round-trips.
goal: Serialize a string value with the required escapes, leaving other characters literal.
spec:
  scenario: Escaping a string on output
  status: failing
  lines:
    - kw: Given
      text: 'a string Value'
    - kw: When
      text: 'Serialize is called'
    - kw: Then
      text: 'the string a-quote-b serializes to the five characters quote, a, backslash, quote, b, quote; and a tab between two words serializes with a backslash-t'
    - kw: And
      text: 'a byte 0x01 serializes as backslash-u-0-0-0-1, a forward slash is left literal (not escaped), and café serializes with é as its raw UTF-8 bytes'
code:
  lang: go
  source: |
    // wrap output in quotes; for each rune of the string:
    //   '"'  -> \"      '\\' -> \\
    //   0x08 -> \b  0x0C -> \f  '\n' -> \n  '\r' -> \r  '\t' -> \t
    //   other control (< 0x20) -> \u00XX  (lowercase hex, 4 digits)
    //   everything else (incl. '/' and non-ASCII) -> written as-is
checkpoint: Strings serialize with correct escaping. Commit and stop here.
---

Serializing a string reverses the scanner's decoding. The two characters that would
break the syntax - the double quote and the backslash - must be escaped as `\"` and
`\\`. Control characters below `0x20` are not allowed literally in a JSON string, so
they are escaped too: the five with short forms (`\b`, `\f`, `\n`, `\r`, `\t`) use
them, and any other control byte uses the `\u00XX` form with lowercase hex.

Everything else is written **literally**. The forward slash is legal unescaped, so
this library leaves it as `/` (escaping it is allowed but noisy). And characters
above ASCII - accented letters, symbols, anything the scanner may have decoded from a
`\u` escape or read as raw UTF-8 - are emitted directly as their UTF-8 bytes, not
turned back into escapes. That keeps output compact and human-readable while staying
valid. With strings done, the two containers are all that remain.
