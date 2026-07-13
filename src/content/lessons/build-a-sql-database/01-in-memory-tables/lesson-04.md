---
project: build-a-sql-database
lesson: 4
title: A table
overview: A table pairs a schema with the rows that follow it. Today you build the table that holds your data and hand back every row you put in.
goal: Build a table from a schema, append rows to it, and iterate the rows back in insertion order.
spec:
  scenario: Appending and iterating table rows
  status: failing
  lines:
    - kw: Given
      text: 'an empty table with schema (id INTEGER), (name TEXT)'
    - kw: When
      text: 'the rows [1, "alice"] and [2, "bob"] are appended'
    - kw: Then
      text: iterating the table yields exactly those two rows in that order
    - kw: And
      text: the table row count is 2
code:
  lang: go
  source: |
    type Table struct { Schema Schema; Rows []Row }
    func (t *Table) Append(r Row) { t.Rows = append(t.Rows, r) }
    // iteration is just ranging over t.Rows
checkpoint: A table stores a schema and its rows and gives them back in order. Commit and stop here.
---

A **table** is the whole picture: a schema describing the columns, and the rows
that conform to it, kept in the order they were inserted. That order matters -
without an `ORDER BY`, a query returns rows in insertion order, and everything
you build on top will rely on scanning them predictably.

Right now `Append` takes any row without checking it. That is deliberate:
storing rows and *validating* them are two ideas, and today is only the first.
Tomorrow you make the table refuse a row that does not match its schema.
