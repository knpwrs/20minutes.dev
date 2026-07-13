---
project: build-a-spreadsheet-engine
lesson: 16
title: Evaluating arithmetic
overview: A parsed formula is a tree; evaluating it means walking that tree to a value. Today you build the evaluator's core - a recursive walk that computes arithmetic nodes into a numeric result.
goal: Evaluate a number-and-operator AST into a numeric Value by walking the tree.
spec:
  scenario: An arithmetic tree evaluates to a number
  status: failing
  lines:
    - kw: Given
      text: 'a parsed arithmetic formula'
    - kw: When
      text: 'eval walks its tree'
    - kw: Then
      text: 'eval(parse(''=1+2*3'')) is the Number 7 and eval(parse(''=(1+2)*3'')) is the Number 9'
    - kw: And
      text: 'eval(parse(''=10-3-2'')) is the Number 5, confirming the tree already encodes precedence and associativity'
code:
  lang: go
  source: |
    func (s *Sheet) eval(e Expr) Value {
      switch n := e.(type) {
      case NumberNode:
        return Value{Kind: Number, Num: n.Val}
      case BinaryNode:
        l := s.eval(n.L); r := s.eval(n.R)
        return applyBin(n.Op, l, r) // + - * / on l.Num, r.Num
      }
      return Value{Kind: Empty}
    }
checkpoint: Arithmetic formulas evaluate to a numeric value. Commit and stop here.
---

Evaluation is a **post-order walk**: to evaluate a `BinaryNode`, first evaluate its
left and right children to values, then apply the operator to them. A `NumberNode`
is the base case - it just wraps its literal in a `Number` value. Because the parser
already built the tree with the right shape, the evaluator does no precedence work
at all: `1+2*3` is already `1 + (2*3)`, so walking it bottom-up naturally computes
the multiply before the add and returns `7`.

The operator application lives in a small helper, `applyBin`, that switches on the
operator string and does the arithmetic on the two numbers. Keep it to the four
arithmetic operators today; comparisons produce booleans and come later. Notice the
evaluator is a **method on the sheet** even though it does not touch any cells yet -
that is deliberate, because the very next lesson needs the sheet to resolve cell
references, and having eval already be a sheet method means no signature change.
