---
project: build-a-sql-database
lesson: 2
title: A row
overview: A row is an ordered list of the values you built yesterday - one per column. Today you make the row type that every table stores and every query returns.
goal: Build a row from an ordered list of values, read a field by position, and report its length.
spec:
  scenario: Reading fields from a row
  status: failing
  lines:
    - kw: Given
      text: 'a row built from the values [1, "alice", null]'
    - kw: When
      text: field at index 1 is read
    - kw: Then
      text: 'it is the text value "alice"'
    - kw: And
      text: the row length is 3
    - kw: And
      text: field at index 0 is the integer value 1
code:
  lang: go
  source: |
    // a row is just an ordered slice of Value
    type Row struct { Values []Value }
    func (r Row) Field(i int) Value { return r.Values[i] }
    func (r Row) Len() int { return len(r.Values) }
checkpoint: You can build a row and read any field by position. Commit and stop here.
---

A **row** is the horizontal unit of a table: an ordered list of values, one per
column, addressed by **position**. Column 0 is the first value, column 1 the
second, and so on. Names come later - at this layer a row does not know that
position 1 is called `name`; it only knows it holds three values and the second
one is `"alice"`.

Keeping rows positional is what lets a query pipeline stay simple: an operator
can pull field 1 out of every row without carrying a schema around. The mapping
from a column *name* to its *index* is a separate concern you will build next.
