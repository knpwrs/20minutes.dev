---
project: build-a-programming-language
lesson: 10
title: Prefix expressions
overview: Some operators sit in front of their operand - the negation in -5 and the logical not in !x. Today you parse these prefix expressions, your first node with a child, and print them with explicit parentheses.
goal: Parse a prefix operator and its operand into a node that prints as (operator operand).
spec:
  scenario: Parsing prefix operators
  status: failing
  lines:
    - kw: Given
      text: 'the source -5'
    - kw: When
      text: 'the parser parses the program and prints it'
    - kw: Then
      text: 'the printed form is (-5)'
    - kw: And
      text: 'parsing !x prints (!x)'
code:
  lang: go
  source: |
    type PrefixExpression struct { Operator string; Right Expression }
    func (pe *PrefixExpression) String() string {
      return "(" + pe.Operator + pe.Right.String() + ")"
    }
    // register a parse function for '-' and '!':
    // consume the operator, then parse the operand that follows
    func (p *Parser) parsePrefix() Expression { ... }
checkpoint: Prefix operators parse into a node that prints with explicit parentheses. Commit.
---

A **prefix expression** is an operator applied to the expression on its right:
`-5` negates, `!x` logically inverts. This is your first node with a *child* - it
holds the operator string and a `Right` expression, which itself came from
parsing. The parser reads the operator, then recursively parses whatever operand
follows.

Printing it wrapped in parentheses - `(-5)`, `(!x)` - is deliberate. Explicit
parentheses in the printed form make the tree's shape unambiguous, so when you
add operators with precedence next, you can *see* how tightly each one bound just
by reading the output. That printed form is your window into the parser for the
rest of the chapter.
