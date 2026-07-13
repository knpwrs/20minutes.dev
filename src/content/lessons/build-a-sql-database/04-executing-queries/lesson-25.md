---
project: build-a-sql-database
lesson: 25
title: Evaluating predicates
overview: A WHERE clause is a predicate - an expression that must come out true or false. Today you extend the evaluator to comparisons and boolean operators so it can judge a row.
goal: Evaluate comparison and AND/OR expressions against a row to a boolean result.
spec:
  scenario: Evaluating a predicate against a row
  status: failing
  lines:
    - kw: Given
      text: 'the schema (age INTEGER) and the row [30]'
    - kw: When
      text: 'the predicate "age > 18" is evaluated'
    - kw: Then
      text: the result is true
    - kw: And
      text: '"age > 18 AND age < 25" evaluates to false for this row'
    - kw: And
      text: '"age = 30 OR age = 40" evaluates to true'
code:
  lang: go
  source: |
    // extend Eval:
    // case Compare: eval Left and Right, compare by Op (=,<>,<,<=,>,>=)
    // case And/Or: eval both sides as booleans, combine
    // integers compare numerically; texts compare lexically
checkpoint: The evaluator judges comparisons and boolean combinations - the engine can now filter. Commit and stop here.
---

A **predicate** is an expression whose job is to yield a truth value for a row.
Today's work extends the evaluator with the interior nodes: a `Compare`
evaluates its two sides and applies the operator - `=`, `<>`, `<`, `<=`, `>`,
`>=` - and an `AND`/`OR` evaluates both sides as booleans and combines them.
Integers compare by magnitude, text compares lexicographically, and comparing two
different types is simply false.

Represent the boolean however fits your engine - reusing the integer value (0 or
1) or adding a boolean kind both work; just be consistent so `AND` and `OR` can
read their operands back. This completes the evaluator: given any parsed
condition and a row, it returns true or false. That is precisely the test a
`WHERE` filter applies to every row, which you wire up in two lessons.
