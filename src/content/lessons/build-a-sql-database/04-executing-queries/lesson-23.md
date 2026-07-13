---
project: build-a-sql-database
lesson: 23
title: Executing INSERT
overview: With tables you can create, the next step is putting data in them. Today you execute an INSERT node, turning its value expressions into a row and appending it.
goal: Execute a parsed INSERT so its literal values become a validated row in the target table.
spec:
  scenario: Executing an INSERT statement
  status: failing
  lines:
    - kw: Given
      text: "a database with table users(id INTEGER, name TEXT) and a parsed Insert of (1, 'alice')"
    - kw: When
      text: the statement is executed
    - kw: Then
      text: 'the users table has one row [1, "alice"]'
    - kw: And
      text: 'inserting into a missing table "ghosts" reports a table-not-found error'
code:
  lang: go
  source: |
    case InsertStmt:
      t, ok := db.Table(s.Table)          // not found -> error
      // convert each literal expr to a Value, build a Row
      // t.Insert(row) reuses lesson-5 validation
checkpoint: The executor runs INSERT, adding validated rows through the parser. Commit and stop here.
---

`INSERT` is the executor's first data-writing case. The `Insert` node carries a
list of literal expressions; convert each to a `Value` - an `IntLit` becomes an
integer value, a `StrLit` a text value - collect them into a `Row`, and hand it
to the table's `Insert`, which reuses the schema validation from lesson 5. A row of
the wrong shape is rejected here without any new code.

Two failures are worth handling explicitly: inserting into a table that does not
exist (the `Table` lookup fails) and inserting a row that violates the schema
(validation fails). Both return a clear error rather than corrupting the
database. With `CREATE` and `INSERT` running, you can build up state; next you
teach the executor to *read* it back with expressions.
