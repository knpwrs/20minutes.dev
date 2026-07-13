---
project: build-a-sql-database
lesson: 27
title: Filtering with WHERE
overview: A query that returns every row is rarely what you want. Today you add the filter operator, keeping only the rows whose WHERE predicate evaluates to true.
goal: Execute a SELECT with a WHERE clause so only rows satisfying the predicate are returned.
spec:
  scenario: Filtering rows by a WHERE predicate
  status: failing
  lines:
    - kw: Given
      text: 'a users table with rows [1, "alice", 30], [2, "bob", 25], [3, "carol", 30]'
    - kw: When
      text: '"SELECT name FROM users WHERE age > 27" is executed'
    - kw: Then
      text: 'the result rows are ["alice"] and ["carol"] in that order'
    - kw: And
      text: '"... WHERE age = 25" returns only ["bob"]'
code:
  lang: go
  source: |
    // between Scan and projection:
    //   if s.Where != nil, keep only rows where Eval(s.Where, row, schema)
    //   is true; evaluate against the table's schema, before projecting
checkpoint: SELECT ... WHERE returns just the matching rows. Commit and stop here.
---

The **filter** is the operator that makes queries selective. It sits between the
scan and the projection: for each scanned row, evaluate the `WHERE` predicate
(lesson 25) against the *table's* schema - the full set of columns, since the
predicate may test a column the projection drops - and keep the row only if the
result is true. Rows that fail the test are discarded; the survivors flow on to
projection.

Order matters here: filter before you project, because `SELECT name ... WHERE age
> 27` filters on `age` even though the result never shows it. This is the classic
scan-filter-project pipeline, and it is why every operator speaks the same result
set - each is just a function from rows to rows. With filtering in place, the
engine runs genuinely useful queries; tomorrow it reads them from a live prompt.
