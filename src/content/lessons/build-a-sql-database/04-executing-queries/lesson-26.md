---
project: build-a-sql-database
lesson: 26
title: Executing SELECT with projection
overview: Now the executor runs a query. Today you execute a SELECT by scanning the table and projecting - keeping only the columns the query asked for, in the order it asked.
goal: Execute a SELECT to a result set containing only the requested columns, and support SELECT *.
spec:
  scenario: Projecting selected columns
  status: failing
  lines:
    - kw: Given
      text: 'a users table (id, name, age) with the row [1, "alice", 30]'
    - kw: When
      text: '"SELECT name, id FROM users" is executed'
    - kw: Then
      text: 'the result columns are ["name", "id"] and the row is ["alice", 1]'
    - kw: And
      text: '"SELECT * FROM users" returns all columns in schema order'
code:
  lang: go
  source: |
    case SelectStmt:
      rs := Scan(t)                 // start from all rows
      if s.Star { return rs }       // * keeps every column
      // else build a new ResultSet keeping only s.Columns, in that order,
      // by resolving each name to its index in the scan's schema
checkpoint: SELECT runs end to end - scan the table and project the chosen columns. Commit and stop here.
---

**Projection** is the "select the columns" half of `SELECT` - reshaping each row
to just the requested columns, in the requested order. The executor starts from a
`Scan` of the table (lesson 6), then, unless the query is `SELECT *`, builds a new
result set whose columns are exactly those named, pulling each row's matching
fields by index. Note the order follows the *query*, not the schema:
`SELECT name, id` puts `name` first even though `id` is column 0.

This is the first query that returns data through the whole stack - tokenize,
parse, scan, project. `SELECT *` short-circuits to the scan's own columns, which
is why keeping the star as a flag (lesson 15) rather than a fake column pays off.
Next you insert a filter between the scan and the projection so queries can ask
for *some* rows.
