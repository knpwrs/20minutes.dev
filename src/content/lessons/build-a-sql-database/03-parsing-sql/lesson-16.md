---
project: build-a-sql-database
lesson: 16
title: Expression atoms
overview: A WHERE clause is built from expressions, and every expression bottoms out in an atom - a literal or a column reference. Today you parse those two leaves of the expression tree.
goal: Parse a single literal or a column name into an expression node.
spec:
  scenario: Parsing literal and column-reference atoms
  status: failing
  lines:
    - kw: Given
      text: 'the expression text "42"'
    - kw: When
      text: an expression is parsed
    - kw: Then
      text: the result is an integer-literal node holding 42
    - kw: And
      text: "'alice' parses to a text-literal node holding alice"
    - kw: And
      text: '"age" parses to a column-reference node naming age'
code:
  lang: go
  source: |
    type Expr interface{}
    type IntLit struct { Value int64 }
    type StrLit struct { Value string }
    type ColRef struct { Name string }
    // dispatch on the current token's kind to build the right leaf
checkpoint: The parser reads the leaves of an expression - literals and column references. Commit and stop here.
---

`WHERE age > 18` is an **expression**, and expressions form a tree. Before you
can parse the whole tree you need its **leaves** - the atoms that need no further
breaking down. There are three: an integer literal, a text literal, and a
**column reference** (a bare name that will be looked up in a row at execution
time).

Each atom is a distinct node type so later stages can tell them apart without
re-inspecting text: an `IntLit` carries a number, a `StrLit` carries a string, a
`ColRef` carries a name to resolve. The parser picks which to build by looking at
the current token's kind - number, string, or identifier. These three leaves are
what the comparison and boolean operators you add next will hang off of.
