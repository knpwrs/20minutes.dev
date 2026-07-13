---
project: build-a-sql-database
lesson: 37
title: DELETE
overview: A database has to forget as well as remember. Today you add DELETE, removing every row of a table that matches a WHERE condition.
goal: Execute a DELETE that removes the rows matching its WHERE predicate and reports how many were removed.
spec:
  scenario: Deleting rows by a predicate
  status: failing
  lines:
    - kw: Given
      text: 'a users table with rows for alice (id 1), bob (id 2), carol (id 3)'
    - kw: When
      text: '"DELETE FROM users WHERE id = 2" is executed'
    - kw: Then
      text: 'the table has two rows left (alice and carol) and the count deleted is 1'
    - kw: And
      text: 'a DELETE with no WHERE removes every row'
code:
  lang: go
  source: |
    type DeleteStmt struct { Table string; Where Expr }
    // execute: keep only rows where the predicate is FALSE (or all if no Where)
    // replace the table's rows with the survivors; return the removed count
checkpoint: The engine can delete rows matching a condition. Commit and stop here.
---

`DELETE` is the first statement that *removes* data. Parsing mirrors a `SELECT`'s
front: `DELETE FROM table` with an optional `WHERE`. Execution walks the rows and
keeps the ones the predicate rejects - the survivors become the table's new row
list - and reports how many were removed. With no `WHERE`, every row matches, so
the table is emptied.

The implementation is the filter operator from lesson 27 read inverted: instead of
returning the matching rows, you retain the *non*-matching ones. Reusing the same
predicate evaluator keeps `DELETE`'s condition exactly as expressive as a query's.
This is your first taste of mutation; `UPDATE` next changes rows in place rather
than removing them.
