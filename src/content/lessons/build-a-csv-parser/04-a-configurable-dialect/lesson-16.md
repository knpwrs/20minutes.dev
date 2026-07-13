---
project: build-a-csv-parser
lesson: 16
title: Comment lines
overview: Some CSV dialects let a line be a comment, skipped entirely, which is handy for metadata or notes at the top of a file. Today you add an optional comment character that drops a whole line when it is the first character of a record.
goal: Add a dialect comment character that skips any line beginning with it.
spec:
  scenario: A comment line is skipped
  status: failing
  lines:
    - kw: Given
      text: 'a dialect whose comment character is the hash, and the input #c then a newline then a,b'
    - kw: When
      text: 'it is parsed with that dialect'
    - kw: Then
      text: 'the comment line is skipped entirely and the result is [["a", "b"]]'
    - kw: And
      text: 'the comment character is only special at the start of a record, so a,#b parses to ["a", "#b"] with the hash kept literally'
code:
  lang: go
  source: |
    // add to the dialect: Comment rune (zero means "no comment character")
    // at the START of a record, if Comment != 0 and the first rune == Comment:
    //   consume every rune up to (and including) the next line terminator, emit NO record
    // anywhere else the comment rune is ordinary content
checkpoint: A line that starts with the dialect's comment character is skipped. Commit and stop here.
---

Real CSV files sometimes carry human notes: a copyright line, a generated-on
timestamp, a column legend. Many tools support this with a **comment character**, and
when a line begins with it the whole line is ignored. You add it as an optional field
on the dialect, using a sentinel of zero to mean no comment character at all, which
keeps the default dialect exactly as strict as before.

The rule is positional, just like the byte-order mark and the opening quote. A
comment is recognized only when the comment character is the **first** character of a
record, so once any field content has begun the character is ordinary data. That is
why `a,#b` keeps its hash: the record already started with `a`, so the `#` is just
part of the second field. When a comment is recognized, skip forward through the rest
of the line, consuming its terminator, and emit no record for it at all, so a comment
does not even count as a blank line. Detecting it at the record-start state, before
you begin a field, is what makes this both simple and unambiguous.
