---
project: build-a-sql-database
lesson: 19
title: The WHERE clause
overview: Now you attach an expression to a query. Today you extend the SELECT parser to read an optional WHERE clause and hang its condition on the statement node.
goal: Parse an optional WHERE clause on a SELECT, storing its condition expression, or leaving it empty when absent.
spec:
  scenario: Parsing a SELECT with a WHERE clause
  status: failing
  lines:
    - kw: Given
      text: 'the statement "SELECT * FROM users WHERE age > 18"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the Select has a Where expression Compare(ColRef(age), ">", IntLit(18))'
    - kw: And
      text: '"SELECT * FROM users" parses with no Where (empty)'
code:
  lang: go
  source: |
    // after parsing FROM <table>:
    //   if peek is Keyword(WHERE): consume it, parse a full expression
    //   store it on SelectStmt.Where (nil when the clause is absent)
checkpoint: A SELECT can now carry a WHERE condition parsed as a full expression. Commit and stop here.
---

The `SELECT` node from lesson 15 knows its columns and table; now it gains a
**condition**. After the `FROM` table, the parser peeks for the `WHERE` keyword -
if present, it consumes it and parses a full boolean expression using the
precedence-aware rules you just built, storing the resulting tree on the
statement. If `WHERE` is absent, the condition is simply empty and the query
matches every row.

This is the moment the parser's two halves meet: statement parsing (lesson 15) and
expression parsing (lessons 16-18) compose into one tree. An optional clause like
this is just a `peek` and a conditional parse - the same pattern you will reuse
for `ORDER BY`, `LIMIT`, and every other trailing clause the query language
grows.
