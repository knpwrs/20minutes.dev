---
project: build-a-csv-parser
lesson: 17
title: Validating a dialect
overview: Some dialects are nonsense, like a delimiter that is also the quote character, and a good library rejects them up front instead of parsing gibberish. Today you validate a dialect and prove a real combined dialect on a whole block of messy input.
goal: Reject an invalid dialect with a clear error, and parse a semicolon-delimited, trimmed, commented block correctly.
spec:
  scenario: Dialect validation and a combined dialect
  status: failing
  lines:
    - kw: Given
      text: 'a dialect whose delimiter is the double-quote character'
    - kw: When
      text: 'it is used to parse any input'
    - kw: Then
      text: 'parsing fails with an error saying the delimiter is invalid, and the same holds when the delimiter is a carriage return, a newline, or equal to the comment character'
    - kw: And
      text: 'a valid dialect with delimiter semicolon, trimming on, and comment hash parses the input "# generated" newline " a ; b " newline "c;d" into [["a", "b"], ["c", "d"]]'
code:
  lang: go
  source: |
    // validate before running the machine; return an error if any hold:
    //   Delimiter == '"'                       (clashes with the quote)
    //   Delimiter == '\r' || Delimiter == '\n' (clashes with line endings)
    //   Comment != 0 && Comment == Delimiter    (ambiguous)
    // otherwise run as normal; a valid dialect combines delimiter + trim + comment
checkpoint: An invalid dialect is rejected with a clear error, and a full combined dialect parses a messy block. Commit and stop here.
---

A dialect is a small configuration, and like any configuration it can be
self-contradictory. If the delimiter is the double quote, the parser cannot tell a
field separator from a quoted-field marker. If the delimiter is a carriage return or
a newline, it collides with the record terminators. If the comment character equals
the delimiter, a line's first field could never be empty. Rather than produce
baffling output, a careful library **validates** the dialect first and returns a
clear error naming the problem, so the mistake is caught at the call that configured
it, not three files later.

With validation in place, this lesson doubles as the chapter's proof that all three
dialect options cooperate. Point a single dialect, semicolon delimiter, trimming on,
and a hash comment character, at a block that exercises each one: a comment line to
skip, a data line padded with spaces to trim, and a plain data line. If it comes back
as the two clean records you expect, your dialect layer is done. The state machine at
the center has not changed since the quoting chapter; everything here is
configuration around it, which is exactly how a real CSV library keeps one engine
serving many file formats.
