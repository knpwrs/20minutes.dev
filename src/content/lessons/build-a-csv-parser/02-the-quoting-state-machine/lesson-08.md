---
project: build-a-csv-parser
lesson: 8
title: An unterminated quote is an error
overview: A field that opens a quote and never closes it is the first genuinely malformed input your parser can meet. Today you add a positioned error type and report an unterminated quoted field at the exact place it began.
goal: Report an unterminated quoted field as an error naming the line and column where the quote opened.
spec:
  scenario: A quoted field with no closing quote
  status: failing
  lines:
    - kw: Given
      text: 'the input "abc with an opening quote and no closing quote, that is the raw characters quote a b c'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'parsing fails with an error whose line is 1 and column is 1, the position of the opening quote, and a message that says the quoted field is unterminated'
    - kw: And
      text: 'valid input still parses with no error, so parsing "a,b" (a quoted field a comma b) returns the table [["a,b"]] and a nil error'
code:
  lang: go
  source: |
    // Parse now returns (records, error). A positioned error carries where it happened:
    type ParseError struct { Line, Column int; Msg string }
    func (e *ParseError) Error() string { /* "line L, column C: M" */ }
    // track Line/Column as you read runes; remember where the current quote OPENED
    // if input ends while still in QUOTED mode -> return that opening position
checkpoint: Parse reports an unterminated quoted field with its exact line and column. Commit and stop here.
---

Every input so far has been valid, so `Parse` could return just the table. A quoted
field changes that: the moment a field opens with a quote, it has promised a closing
quote, and if the input ends first the file is malformed. This is the first error
your parser must report, and reporting it well means saying **where**. So `Parse`
grows a second return value, an error, and you introduce a small **positioned error
type** that carries a line, a column, and a message. Every earlier call site now
also gets back a nil error for valid input, which is the one change this lesson makes
to code you already wrote.

To report a position you have to track one, so keep a running **line** and **column**
as you consume runes: start both at 1, advance the column on each rune, and reset the
column to 1 and bump the line each time an unquoted newline ends a record. When you
enter a quoted field, remember the line and column of that opening quote. If the
input runs out while you are still inside the quote, that remembered position is
exactly what the error should name, because that opening quote is the thing the user
needs to find and fix. Pinning the error to the opening quote, not to the end of the
file, is what makes the message actionable.
