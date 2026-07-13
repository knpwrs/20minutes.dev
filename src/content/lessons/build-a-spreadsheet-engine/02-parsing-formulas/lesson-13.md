---
project: build-a-spreadsheet-engine
lesson: 13
title: Cell references as leaves
overview: A formula's whole point is referring to other cells. Today you make a cell reference a leaf of the AST, so "=A1+B1" parses into a tree with two cell nodes the evaluator can later resolve.
goal: Parse a Cell token into a CellNode leaf holding its coordinate.
spec:
  scenario: Cell references parse into leaf nodes
  status: failing
  lines:
    - kw: Given
      text: 'a formula that references cells'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'parse(''=A1+B1'').String() is ''(A1 + B1)'''
    - kw: And
      text: 'parse(''=A1+B1*2'').String() is ''(A1 + (B1 * 2))'', with the references sitting as leaves inside the precedence tree'
code:
  lang: go
  source: |
    type CellNode struct{ Ref Ref }
    func (n CellNode) String() string { return formatRef(n.Ref) }
    // in primary(): a Cell token becomes a CellNode
    case TCell:
      return CellNode{Ref: parseRef(t.Text)}
checkpoint: Cell references now parse as leaves of the formula tree. Commit and stop here.
---

Until now the only leaves in the tree were numbers. A **cell reference** is the
other kind of leaf, and it is what turns a calculator into a spreadsheet. When the
primary parser meets a `Cell` token, it parses the reference text into a coordinate
(reusing `parseRef` from Chapter 1) and wraps it in a `CellNode`. A `CellNode`
renders as its A1 address, so it reads naturally in the parenthesized output.

Because references are just another primary, they compose with all the precedence
you already built: `A1+B1*2` parses with `B1*2` as a subtree and prints
`(A1 + (B1 * 2))`, exactly as the numeric version did. The `CellNode` only records
*which* cell the formula points at - it does not know that cell's value yet. Turning
a `CellNode` into the value stored at that address is the evaluator's job in the
next chapter; for now the tree simply remembers the dependency.
