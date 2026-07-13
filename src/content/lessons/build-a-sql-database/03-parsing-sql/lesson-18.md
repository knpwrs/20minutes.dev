---
project: build-a-sql-database
lesson: 18
title: AND, OR, and precedence
overview: Real filters combine conditions, and AND binds tighter than OR. Today you parse boolean expressions so that the tree reflects the correct precedence without any parentheses.
goal: Parse AND and OR combinations of comparisons into a tree where AND binds tighter than OR.
spec:
  scenario: Parsing boolean operators with precedence
  status: failing
  lines:
    - kw: Given
      text: 'the expression "a = 1 AND b = 2 OR c = 3"'
    - kw: When
      text: it is parsed
    - kw: Then
      text: 'the top node is an OR whose left is (a = 1 AND b = 2) and right is (c = 3)'
    - kw: And
      text: '"a = 1 OR b = 2 AND c = 3" parses with the AND grouped on the right of the OR'
code:
  lang: go
  source: |
    // layered rules encode precedence:
    //   parseOr  -> parseAnd ( OR parseAnd )*
    //   parseAnd -> parseCompare ( AND parseCompare )*
    // the lowest-precedence operator sits at the top of the tree
checkpoint: The parser respects AND-before-OR precedence when building boolean expressions. Commit and stop here.
---

`WHERE a = 1 AND b = 2 OR c = 3` has to mean `(a = 1 AND b = 2) OR c = 3` - `AND`
binds more tightly than `OR`, just like `*` binds tighter than `+` in
arithmetic. The classic recursive-descent way to encode this is **one function
per precedence level**: an `OR` parser that calls an `AND` parser for each of its
operands, and an `AND` parser that calls the comparison parser for each of its.

Because the outer level is the *lowest*-precedence operator, `OR` ends up at the
top of the tree and the tighter `AND` groups sit beneath it - exactly the
structure you want when the executor walks it. This layering is the core trick of
recursive-descent parsing; the same shape scales to as many precedence levels as
a language needs.
