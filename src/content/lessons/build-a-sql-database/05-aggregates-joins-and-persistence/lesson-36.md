---
project: build-a-sql-database
lesson: 36
title: 'Demo: INNER JOIN'
overview: Joins are what make a database relational. Today you add INNER JOIN, pairing rows from two tables that satisfy an ON condition, then demo a real cross-table query.
goal: Execute a SELECT that INNER JOINs two tables on a condition, returning the matched combined rows.
spec:
  scenario: Joining two tables on a condition
  status: failing
  lines:
    - kw: Given
      text: 'users [1,"alice"],[2,"bob"] and orders [1,1,100],[2,1,50],[3,2,75] (order.user_id links to user.id)'
    - kw: When
      text: '"SELECT users.name, orders.total FROM users JOIN orders ON users.id = orders.user_id" is executed'
    - kw: Then
      text: 'the rows are ["alice",100], ["alice",50], ["bob",75]'
    - kw: And
      text: 'a user with no matching order contributes no rows'
code:
  lang: go
  source: |
    // parse: FROM t1 JOIN t2 ON <predicate>
    // execute: for each row of t1, for each row of t2, build a combined row
    //   over the merged (qualified) schema; keep it when ON evaluates true
    //   then filter/project as usual
checkpoint: The engine joins two tables on a condition - it is genuinely relational now. Commit and stop here.
---

An **INNER JOIN** combines rows from two tables wherever a condition holds - the
operation that makes a database *relational* rather than a pile of independent
tables. The simplest algorithm is the **nested-loop join**: for every row of the
left table, walk every row of the right table, build a combined row over the
merged schema (whose columns are qualified, thanks to lesson 35), and keep the pair
only when the `ON` predicate evaluates true.

The merged rows then flow through the same filter and projection you already have,
which is why qualified names had to come first - `SELECT users.name,
orders.total` resolves against the combined schema. Rows with no match on the
other side simply produce no output (that is what makes it *inner*). Nested-loop
is quadratic and a real database would use an index or hash join, but it is
correct and clear - the honest core those optimizations accelerate.
