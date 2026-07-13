---
project: build-a-sql-database
lesson: 31
title: COUNT(*)
overview: Aggregates collapse many rows into one summary value. Today you add the first and simplest, COUNT(*), which returns how many rows a query produced.
goal: Parse and execute COUNT(*) so a SELECT returns a single row holding the row count.
spec:
  scenario: Counting rows with COUNT(*)
  status: failing
  lines:
    - kw: Given
      text: 'a users table with three rows'
    - kw: When
      text: '"SELECT COUNT(*) FROM users" is executed'
    - kw: Then
      text: 'the result is a single row holding the integer 3'
    - kw: And
      text: '"SELECT COUNT(*) FROM users WHERE age = 30" returns 2'
code:
  lang: go
  source: |
    // represent a select item as an aggregate call, general enough to grow:
    type Agg struct { Func string; Column string } // e.g. {"COUNT","*"}
    // parse COUNT ( * ) into Agg{Func:"COUNT", Column:"*"}
    // execute: after filtering, if the select is an aggregate,
    //   return one row whose value is len(filtered rows)
checkpoint: A query can count its rows with COUNT(*). Commit and stop here.
---

An **aggregate** is a function that folds a whole set of rows into a single
value, and `COUNT(*)` is the gateway drug: it simply reports how many rows the
query produced. Represent an aggregate select item as a small **function + column
argument** pair (here the column is just `*`) rather than a one-off boolean flag -
that shape is exactly what `SUM(age)` and `MAX(age)` will reuse tomorrow, so
building it now keeps the next lesson to pure execution. Execution, after the filter
runs, returns a one-row result whose single value is the count of surviving rows.

The key shift is that an aggregate query returns **one row summarizing many**,
not one row per input row - a different shape of result than everything so far.
Notice it composes with `WHERE` for free: filter first, then count what is left,
so `COUNT(*) ... WHERE age = 30` counts only the matching rows. This one-row-out
pattern is the template for `SUM`, `MIN`, `MAX`, and `AVG` next.
