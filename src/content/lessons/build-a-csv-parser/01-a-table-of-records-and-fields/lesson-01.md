---
project: build-a-csv-parser
lesson: 1
title: One field, one record
overview: A CSV file is a table of records, and each record is a list of fields. Today you build the smallest possible parser, one that reads a single unpunctuated chunk of text as a table with one record holding one field, so the public surface exists from day one and every later lesson thickens it.
goal: Parse a chunk of text with no commas or newlines into a table of one record holding one field.
spec:
  scenario: Parsing the simplest possible input
  status: failing
  lines:
    - kw: Given
      text: 'the input "abc"'
    - kw: When
      text: it is parsed into records
    - kw: Then
      text: 'the result is one record holding one field, so the whole table is [["abc"]]'
    - kw: And
      text: 'parsing the empty input "" yields zero records, the empty table []'
code:
  lang: go
  source: |
    // records are a slice of records; each record is a slice of string fields
    func Parse(input string) [][]string {
      if input == "" {
        return [][]string{}
      }
      return [][]string{{input}}
    }
checkpoint: You have an importable parser that turns a chunk of text into a one-record, one-field table, and treats empty input as zero records. Commit and stop here.
---

Every CSV document is a **table**: an ordered list of **records** (the rows), and
every record is an ordered list of **fields** (the cells). That two-level shape,
records made of fields, is the whole data model, so the type your parser returns
is a list of lists of strings. Start with the smallest input that has any content
at all, a single run of characters with no commas and no line breaks. It is one
record, and that record has exactly one field.

The one decision worth making now is what **empty input** means. A file with no
bytes has no rows in it, so parsing `""` returns zero records, an empty table,
not a table containing one empty row. Keep that distinction in mind: absence of
any record is different from a record that happens to hold an empty field, which
is a case you will meet very soon. Return a plain list of records for now; the
commas, the newlines, and the quoting all arrive one lesson at a time on top of
this shape.
