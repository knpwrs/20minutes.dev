---
project: build-a-spreadsheet-engine
lesson: 10
title: Parsing arithmetic with precedence
overview: The heart of the parser is turning a token stream into a tree that respects operator precedence. Today you build a precedence-driven parser for the four arithmetic operators and check it with a fully-parenthesized printout of the tree.
goal: Parse the four arithmetic operators into an AST that respects precedence and left-associativity, and print it fully parenthesized.
spec:
  scenario: Arithmetic parses into a precedence-correct tree
  status: failing
  lines:
    - kw: Given
      text: 'an arithmetic formula and a parser that renders its tree with String(), fully parenthesized'
    - kw: When
      text: 'the formula is parsed'
    - kw: Then
      text: 'parse(''=1+2*3'').String() is ''(1 + (2 * 3))'' and parse(''=2*3+4'').String() is ''((2 * 3) + 4)'''
    - kw: And
      text: 'parse(''=10-3-2'').String() is ''((10 - 3) - 2)'', showing left-associative subtraction'
code:
  lang: go
  source: |
    // the whole node set (leaves filled in over later lessons)
    type Expr interface{ String() string }
    type NumberNode struct{ Val float64 }
    type BinaryNode struct{ Op string; L, R Expr }
    // CellNode, RangeNode, CallNode come in later lessons
    func bp(k TokKind) int { // binding power: * / bind tighter than + -
      switch k { case TStar, TSlash: return 30; case TPlus, TMinus: return 20 }
      return 0
    }
    // expr(minbp): parse a primary, then fold operators while bp(op) > minbp,
    // recursing with expr(bp(op)) for the right side.
checkpoint: Arithmetic formulas parse into a precedence-correct tree. Commit and stop here.
---

This is the core of the parser. We use **precedence climbing** (a Pratt parser):
each binary operator has a **binding power**, and `*` and `/` bind more tightly
than `+` and `-`. The routine `expr(minbp)` parses one primary value, then keeps
folding an operator and its right-hand side into a `BinaryNode` as long as that
operator's binding power exceeds `minbp` - recursing with the operator's own power
for the right side. Higher-power operators get pulled into the subtree first, which
is exactly what precedence means: `1+2*3` groups as `1 + (2*3)`.

To check the tree without exposing its internal shape, give every node a `String()`
that prints itself **fully parenthesized** - a `BinaryNode` prints
`(left op right)`. Then a whole parse is one readable string you can assert on:
`(1 + (2 * 3))`. Left-associativity falls out of the binding rule: recursing with
the operator's power (not one less) means `10-3-2` folds the left pair first and
prints `((10 - 3) - 2)`, not `(10 - (3 - 2))`. Define the other node types
(`CellNode`, `RangeNode`, `CallNode`) as empty stubs now so later lessons only add
a parse rule, never reshape the tree.
