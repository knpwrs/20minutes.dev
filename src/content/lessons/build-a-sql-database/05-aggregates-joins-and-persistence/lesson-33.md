---
project: build-a-sql-database
lesson: 33
title: GROUP BY
overview: Aggregates get their real power when applied per group. Today you add GROUP BY, partitioning rows by a column and emitting one aggregated row per distinct value.
goal: Execute a SELECT with GROUP BY so each distinct value of the grouping column yields one aggregated row.
spec:
  scenario: Aggregating within groups
  status: failing
  lines:
    - kw: Given
      text: 'users with cities NYC, LA, NYC (alice, bob, carol)'
    - kw: When
      text: '"SELECT city, COUNT(*) FROM users GROUP BY city" is executed'
    - kw: Then
      text: 'there is one row per city: ["NYC", 2] and ["LA", 1]'
    - kw: And
      text: 'the groups appear in first-seen order of the city value'
code:
  lang: go
  source: |
    // parse: optional GROUP BY <column> after WHERE
    // execute: partition filtered rows by the group column's value
    //   (preserve first-seen order); for each group, emit the group key
    //   column plus each aggregate computed over that group's rows
checkpoint: Queries can group rows and aggregate within each group. Commit and stop here.
---

**GROUP BY** turns one whole-table aggregate into one aggregate *per group*.
Execution partitions the filtered rows by the grouping column's value - all the
`NYC` rows together, all the `LA` rows together - then, for each group, emits a
row containing the group key and every aggregate computed over just that group's
rows. `SELECT city, COUNT(*) ... GROUP BY city` becomes one row per city with its
count.

Preserve **first-seen order** of the group keys so results are deterministic
(`NYC` before `LA` because alice came first). The select list in a grouped query
is now a mix of the grouping column and aggregate calls, which is exactly what
your parser already produces. This is the most powerful query shape in the engine;
next you let a query filter on the aggregated result itself.
