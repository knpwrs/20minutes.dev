---
project: build-a-sql-database
lesson: 38
title: UPDATE
overview: Data changes without being deleted. Today you add UPDATE, setting a column to a new value on every row that matches a WHERE condition.
goal: Execute an UPDATE that assigns a new value to a column on the rows matching its WHERE predicate.
spec:
  scenario: Updating rows in place
  status: failing
  lines:
    - kw: Given
      text: 'a users table with rows for alice (id 1, age 30) and bob (id 2, age 25)'
    - kw: When
      text: '"UPDATE users SET age = 31 WHERE id = 1" is executed'
    - kw: Then
      text: "alice's age is 31 and bob's age is unchanged, and the count updated is 1"
    - kw: And
      text: 'an UPDATE with no WHERE changes the column on every row'
code:
  lang: go
  source: |
    type UpdateStmt struct { Table string; Col string; Value Expr; Where Expr }
    // execute: for each matching row, evaluate Value and write it into
    // the column's index; validate the new value's type; return the count
checkpoint: The engine can update a column on the rows matching a condition. Commit and stop here.
---

`UPDATE` modifies rows without removing them. The statement names a table, a
`SET column = value` assignment, and an optional `WHERE`. Execution finds the
matching rows (same predicate evaluator), evaluates the new value expression, and
writes it into that column's position in each matched row, reporting the count
changed. A missing `WHERE` updates every row.

Keep the type check honest: the new value must match the column's declared type,
the same rule `INSERT` enforces, so an `UPDATE` cannot smuggle text into an
integer column. Supporting a single-column `SET` is plenty for one lesson; extending
to several assignments at once is a natural exercise. With `INSERT`, `UPDATE`, and
`DELETE`, the engine is a complete read-write store - all that is missing is
making it survive a restart.
