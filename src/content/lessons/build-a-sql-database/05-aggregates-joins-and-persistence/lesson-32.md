---
project: build-a-sql-database
lesson: 32
title: SUM, MIN, MAX, and AVG
overview: Beyond counting, aggregates summarize a column's values. Today you add the numeric aggregates that fold a column down to its sum, extremes, and average.
goal: Execute SUM, MIN, MAX, and AVG over a numeric column, returning a single summary row.
spec:
  scenario: Aggregating a numeric column
  status: failing
  lines:
    - kw: Given
      text: 'a users table whose age column holds 30, 25, 30'
    - kw: When
      text: '"SELECT SUM(age), MAX(age), MIN(age) FROM users" is executed'
    - kw: Then
      text: 'the single result row is [85, 30, 25]'
    - kw: And
      text: '"SELECT AVG(age) FROM users" returns 28 (integer division of 85 by 3)'
code:
  lang: go
  source: |
    // reuse yesterday's Agg{Func, Column}; a select list is now a list of them.
    // SUM(age) parses just like COUNT(*) but with a column name for the arg.
    // execute: for each Agg, fold its column over the filtered rows -
    //   SUM/AVG accumulate; MIN/MAX track the extreme; AVG = SUM / count
checkpoint: Queries can sum, average, and find the extremes of a column. Commit and stop here.
---

The **numeric aggregates** take a column argument and fold its values across the
rows: `SUM` accumulates a running total, `MIN` and `MAX` track the smallest and
largest seen, and `AVG` is the sum divided by the count. The parser needs almost
nothing new - yesterday's `Agg{Func, Column}` already holds a function and a
column, so `SUM(age)` parses exactly like `COUNT(*)` with a real column name in
the argument; today is really about the **execution fold**, looping the filtered
rows and updating one accumulator per function.

They share `COUNT`'s one-row-out shape, so they slot into the same aggregate path
- several in one `SELECT` (a list of `Agg` items) just means several accumulators
over the same pass. Keep
`AVG` as integer division for now to stay within the integer value type (85 / 3 =
28), and note the empty-input edges (`SUM` of no rows is 0; `MIN`/`MAX`/`AVG` of
no rows are undefined) so the demo does not surprise you. Next you compute these
*per group* rather than over the whole table.
