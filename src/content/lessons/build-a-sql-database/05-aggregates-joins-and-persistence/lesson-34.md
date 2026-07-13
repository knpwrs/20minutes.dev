---
project: build-a-sql-database
lesson: 34
title: HAVING
overview: WHERE filters rows before grouping; HAVING filters the groups after. Today you add HAVING so a query can keep only groups whose aggregate meets a condition.
goal: Execute a GROUP BY with a HAVING clause that keeps only groups satisfying an aggregate predicate.
spec:
  scenario: Filtering groups with HAVING
  status: failing
  lines:
    - kw: Given
      text: 'users with cities NYC, LA, NYC'
    - kw: When
      text: '"SELECT city, COUNT(*) FROM users GROUP BY city HAVING COUNT(*) > 1" is executed'
    - kw: Then
      text: 'the only result row is ["NYC", 2]'
    - kw: And
      text: 'HAVING COUNT(*) > 5 returns no rows'
code:
  lang: go
  source: |
    // parse: optional HAVING <predicate> after GROUP BY
    // execute: after computing each group's aggregated row,
    //   evaluate the HAVING predicate against that group and drop failures
    //   (the predicate may reference COUNT(*) and other aggregates)
checkpoint: Grouped queries can filter their groups with HAVING. Commit and stop here.
---

`HAVING` is to groups what `WHERE` is to rows - but it runs *after* aggregation,
so it can test the aggregated values a `WHERE` cannot see. `WHERE age > 27`
filters input rows; `HAVING COUNT(*) > 1` filters *groups* by their computed
count. Parsing adds one more optional clause after `GROUP BY`; execution
evaluates that predicate against each group's aggregated result and keeps only the
groups that pass.

The subtlety is that the `HAVING` predicate can reference aggregates like
`COUNT(*)`, so evaluate it against the group's computed values, not its raw rows.
With `WHERE`, `GROUP BY`, and `HAVING` in place, the engine now expresses the full
"filter, group, aggregate, filter again" shape that real analytical SQL is built
on. Next you connect two tables with a join.
