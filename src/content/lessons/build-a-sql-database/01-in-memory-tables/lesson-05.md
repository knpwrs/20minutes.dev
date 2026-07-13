---
project: build-a-sql-database
lesson: 5
title: Typed insert validation
overview: A table should reject a row that does not fit its schema. Today you make insertion check the number of values and their types before accepting a row.
goal: Reject a row whose length or column types do not match the table's schema, and accept one that does.
spec:
  scenario: Validating a row against the schema on insert
  status: failing
  lines:
    - kw: Given
      text: 'a table with schema (id INTEGER), (name TEXT)'
    - kw: When
      text: 'the row [1, "alice"] is inserted'
    - kw: Then
      text: it is accepted
    - kw: And
      text: 'inserting [1] is rejected (wrong number of values)'
    - kw: And
      text: 'inserting ["x", "alice"] is rejected (id is not an integer)'
    - kw: And
      text: a null value is accepted in any column
code:
  lang: go
  source: |
    func (t *Table) Insert(r Row) error {
      // 1. len(r.Values) must equal len(schema.Columns)
      // 2. each value's Kind must match the column Type, unless it is null
      // return an error describing the first mismatch, else Append
    }
checkpoint: The table now guards its own integrity, refusing rows that break the schema. Commit and stop here.
---

A schema is a promise about the shape of every row, and the moment to enforce
that promise is on the way in. **Insert validation** checks two things: that the
row has exactly one value per column, and that each value's type matches its
column - an `INTEGER` column will not accept a text value.

The one exception is `NULL`, which is allowed to stand in for a value of *any*
type; that is what makes it the universal "no data here" marker. Reject the two
bad rows with a clear error and the good one silently, and every table in the
database is now self-defending - no query downstream has to wonder whether a row
is well-formed.
