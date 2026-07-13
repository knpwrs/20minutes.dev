---
project: build-a-sql-database
lesson: 30
title: 'Demo: LIMIT and a query file'
overview: The last operator of the chapter caps how many rows come back. Today you add LIMIT and run a whole .sql file through the engine to see the pipeline in action.
goal: Execute a SELECT with LIMIT to return at most N rows, and run a multi-statement script through the engine.
spec:
  scenario: Limiting the number of rows
  status: failing
  lines:
    - kw: Given
      text: 'a users table with rows for alice (30), bob (25), carol (30)'
    - kw: When
      text: '"SELECT name FROM users ORDER BY age DESC LIMIT 2" is executed'
    - kw: Then
      text: 'the result has exactly the two rows ["alice"] and ["carol"]'
    - kw: And
      text: 'a LIMIT larger than the row count returns all rows'
code:
  lang: go
  source: |
    // parse: optional LIMIT <number> after ORDER BY
    // execute: after sorting, keep at most the first N rows
    // (min of N and len(rows)); run ParseScript then Exec each statement
checkpoint: The full query pipeline runs - filter, sort, limit - and a whole script executes at once. Commit and stop here.
---

**LIMIT** caps the result at the first N rows, which only means something once
ordering is defined - which is why it comes last and applies *after* the sort.
Parsing is one more trailing clause (`LIMIT` and a number); execution truncates
the row list to at most N, guarding against a limit larger than the number of
rows.

That completes the read pipeline: **scan → filter → sort → limit → project**,
each a small operator over result sets. To close the chapter, drive a whole `.sql`
script through the engine - several `CREATE`/`INSERT` statements to set up data,
then a `SELECT ... WHERE ... ORDER BY ... LIMIT` that exercises the entire chain.
The next chapter turns from "which rows" to "summarize the rows": aggregates,
grouping, and joins.
