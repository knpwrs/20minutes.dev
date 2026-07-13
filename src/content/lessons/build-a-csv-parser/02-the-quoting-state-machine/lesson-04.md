---
project: build-a-csv-parser
lesson: 4
title: A quoted field holds the delimiter
overview: A comma inside a value is exactly why naive CSV parsing fails, and why a real parser is a state machine. Today you let a field be wrapped in double quotes so it can contain the delimiter, turning your loop into a small finite-state machine with a quoted mode.
goal: Parse a double-quoted field so a delimiter inside the quotes is part of the field, not a separator.
spec:
  scenario: A delimiter inside a quoted field
  status: failing
  lines:
    - kw: Given
      text: 'the input "a,b" including the surrounding double quotes, so the raw characters are quote a comma b quote'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the result is one record with one field whose value is a,b (the comma is part of the field, and the surrounding quotes are removed)'
    - kw: And
      text: 'a quoted field sits among plain ones, so parsing the three characters quote a quote then a comma then b gives two fields, ["a", "b"]'
code:
  lang: go
  source: |
    // grow the field loop into a small state machine
    //   at the START of a field: if the first rune is '"', enter QUOTED mode
    //   in QUOTED mode: a comma is an ordinary character; keep appending
    //   the next '"' ends the quoted field; then expect a delimiter, newline, or end
    //   otherwise the field is UNQUOTED and behaves exactly as before
    // strip the surrounding quotes; keep only what is between them
checkpoint: A field wrapped in double quotes can contain the delimiter. The parser is now a state machine. Commit and stop here.
---

Here is the case that breaks every parser built on splitting text on commas: a value
that legitimately contains a comma, like an address or a name written last, first.
CSV solves it by letting a field be **quoted**, wrapped in double quotes, and
declaring that inside those quotes the delimiter is just an ordinary character. To
honor that, your field loop has to know whether it is currently inside a quoted
field or not, and that is precisely what makes a CSV parser a **finite-state
machine**: it moves between a small set of states as it reads each rune, and the
same rune, a comma, means different things in different states.

The rule is that quoting is decided at the **start** of a field. If the very first
rune of a field is a double quote, the field is quoted: you drop that opening quote,
then keep appending every following rune, commas included, until you reach the
closing quote, which you also drop. After the closing quote you are back to normal
and the next character should be a delimiter, a newline, or the end of input. A
field that does not start with a quote stays unquoted and behaves exactly as it did
before. Keep the state small and explicit now; the escape rule and the error cases
build directly on this quoted mode.
