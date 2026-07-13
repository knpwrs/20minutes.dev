---
project: build-a-programming-language
lesson: 11
title: Infix expressions
overview: Binary operators like + sit between two operands. Today you parse them using the core Pratt-parsing loop - parse a left side, then while an operator follows, fold it and the next operand into an infix node.
goal: Parse chained additions and subtractions into left-associative infix nodes.
spec:
  scenario: Parsing a chain of same-level operators
  status: failing
  lines:
    - kw: Given
      text: 'the source 1 - 2 + 3'
    - kw: When
      text: 'the parser parses the program and prints it'
    - kw: Then
      text: 'the printed form is ((1 - 2) + 3)'
    - kw: And
      text: 'parsing 1 + 2 prints (1 + 2)'
code:
  lang: go
  source: |
    type InfixExpression struct { Left Expression; Operator string; Right Expression }
    func (ie *InfixExpression) String() string {
      return "(" + ie.Left.String() + " " + ie.Operator + " " + ie.Right.String() + ")"
    }
    // parseExpression: parse a left operand, then loop while the
    // next token is an infix operator, folding left = Infix{left, op, right}
checkpoint: Chains of same-precedence operators parse left-associatively. Commit.
---

An **infix expression** has an operator between two operands: `1 + 2`. The engine
that parses these is the heart of a **Pratt parser**: parse one operand for the
left side, then look at the next token - if it is an infix operator, consume it,
parse the operand on its right, and combine the two into an infix node. Then
loop, treating that whole node as the new left side.

That loop is what makes `1 - 2 + 3` group as `((1 - 2) + 3)` rather than
`(1 - (2 + 3))`: each operator grabs only the operand immediately to its right
before the loop moves on, so operators of equal binding strength associate to the
**left**. Right now every operator binds equally; the next lesson introduces
precedence so `*` can bind tighter than `+`.
