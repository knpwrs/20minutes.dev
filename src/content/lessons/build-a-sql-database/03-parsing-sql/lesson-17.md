---
project: build-a-sql-database
lesson: 17
title: Comparison expressions
overview: With atoms in hand, you can parse the comparisons at the heart of every WHERE clause. Today you combine two atoms and an operator into a comparison node.
goal: Parse a comparison of two atoms into a binary comparison node carrying its operator.
spec:
  scenario: Parsing a comparison expression
  status: failing
  lines:
    - kw: Given
      text: 'the expression "age > 18"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the result is a Compare node with left ColRef(age), operator ">", right IntLit(18)'
    - kw: And
      text: "\"name = 'bob'\" parses to Compare(ColRef(name), =, StrLit(bob))"
code:
  lang: go
  source: |
    type Compare struct { Left Expr; Op string; Right Expr }
    // parse an atom, then if the next token is a comparison operator,
    // consume it and parse the right-hand atom into a Compare node
checkpoint: The parser builds comparison expressions from atoms and an operator. Commit and stop here.
---

A **comparison** joins two atoms with a relational operator - `=`, `<>`, `<`,
`<=`, `>`, `>=` - and evaluates to true or false for a given row. Parsing one is
a tidy three-step move: parse the left atom, check whether the next token is a
comparison operator, and if so consume it and parse the right atom, wrapping all
three in a `Compare` node.

Storing the operator as a small value on the node (a string or an enum) keeps the
executor's job to a single lookup later. If there is no operator after the first
atom, the expression is just that atom - so this rule gracefully handles both
`age > 18` and a bare `age`. Comparisons are the predicates a `WHERE` filters on;
next you combine several of them with `AND` and `OR`.
