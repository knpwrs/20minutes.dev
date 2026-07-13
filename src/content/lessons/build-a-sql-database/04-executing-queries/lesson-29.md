---
project: build-a-sql-database
lesson: 29
title: ORDER BY
overview: Results have come back in insertion order; now the query controls the order. Today you parse and execute ORDER BY to sort the result set by a column, ascending or descending.
goal: Execute a SELECT with ORDER BY to return rows sorted by the given column and direction.
spec:
  scenario: Ordering results by a column
  status: failing
  lines:
    - kw: Given
      text: 'a users table with rows [1, "alice", 30], [2, "bob", 25], [3, "carol", 30]'
    - kw: When
      text: '"SELECT name FROM users ORDER BY age DESC" is executed'
    - kw: Then
      text: 'the rows are ["alice"], ["carol"], ["bob"] (age 30, 30, 25)'
    - kw: And
      text: '"ORDER BY age ASC" returns ["bob"], ["alice"], ["carol"]'
code:
  lang: go
  source: |
    // parse: after WHERE, optional ORDER BY <col> [ASC|DESC] (default ASC)
    // execute: after filtering, stable-sort rows by the column's value
    //   using the same value comparison as < / > ; reverse for DESC
checkpoint: Queries can sort their results by a column in either direction. Commit and stop here.
---

Until now rows came back in insertion order; **ORDER BY** puts the query in
control. Parsing adds one more optional trailing clause after `WHERE` - a column
name and an optional `ASC`/`DESC` direction, defaulting to ascending - stored on
the select node. Execution sorts the rows by that column's value using the same
comparison your predicate evaluator uses, reversing the order for `DESC`.

Sort *after* filtering and *before* projecting is the natural placement, and use
a **stable** sort so rows with equal keys keep their relative order - here
`alice` stays ahead of `carol` because both are age 30 and `alice` was inserted
first. Sorting is another operator in the same pipeline: rows in, rows out, just
reordered. Pair it with a limit tomorrow and you have "top N" queries.
