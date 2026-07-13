---
project: build-a-toml-parser
lesson: 1
title: A document is a table
overview: 'Every TOML file is, at the top, a table: a set of key/value pairs. Today you build the smallest possible parser, one that reads an input with no pairs in it and returns an empty table, so the library has a public surface from day one that every later lesson thickens.'
goal: 'Parse an empty or blank-only input into an empty table.'
spec:
  scenario: Parsing an empty document
  status: failing
  lines:
    - kw: Given
      text: 'the empty input string, and separately an input of only blank lines and spaces'
    - kw: When
      text: 'Parse is called on each'
    - kw: Then
      text: 'each returns a table with zero entries and a nil error'
    - kw: And
      text: 'the table has an ordered list of entries and a Get(key) that reports the value is absent'
code:
  lang: go
  source: |
    // the value kinds this library will ever hold - name them all now
    type Kind int
    const ( KindString Kind = iota; KindInteger; KindFloat; KindBool
            KindOffsetDateTime; KindLocalDateTime; KindLocalDate
            KindLocalTime; KindArray; KindTable )
    type Value struct {
      Kind Kind
      Str  string; Int int64; Float float64; Bool bool
      Arr  []Value; Tbl *Table   // datetime fields arrive later
    }
    type Entry struct { Key string; Val Value }
    type Table struct { Entries []Entry }
    func (t *Table) Get(k string) (Value, bool) { /* linear scan */ }
    func Parse(input string) (*Table, error) { /* split lines, skip blanks */ }
checkpoint: 'You have an importable parser whose empty document is an empty table. Commit and stop here.'
---

Every TOML document describes one **table** - an ordered collection of key/value
pairs - and the whole file is the contents of that top-level table. So the natural
public shape of the library is `Parse(input) -> (*Table, error)`: hand it text, get
back the root table. The `Table` keeps its entries in a slice so insertion order is
preserved, which matters later when a document defines keys and subtables in a
particular sequence.

Start at the degenerate case. An empty file has no pairs, and a file of only blank
lines and spaces carries no meaning either, so both parse to an **empty table**.
Define the `Value` union now with every `Kind` it will ever hold - strings,
numbers, dates, arrays, and nested tables - even though today only the empty table
exists; naming the whole family up front means later lessons add a case, never
reshape the type. Splitting the input into lines and skipping the blank ones is the
entire parser today; every value form grows on top of this loop.
