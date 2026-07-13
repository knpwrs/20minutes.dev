---
project: build-a-programming-language
lesson: 14
title: Grouped expressions
overview: Parentheses let the programmer override precedence, forcing (1 + 2) * 3 to add first. Today you parse grouping parentheses - and the trick is that they need no node of their own.
goal: Parse parentheses that override precedence, without introducing a new node type.
spec:
  scenario: Parentheses override precedence
  status: failing
  lines:
    - kw: Given
      text: 'the source (1 + 2) * 3'
    - kw: When
      text: 'the parser parses the program and prints it'
    - kw: Then
      text: 'the printed form is ((1 + 2) * 3)'
    - kw: And
      text: 'parsing 2 * (3 + 4) prints (2 * (3 + 4))'
code:
  lang: go
  source: |
    // register '(' as a prefix parse function:
    func (p *Parser) parseGrouped() Expression {
      p.nextToken()                        // consume '('
      exp := p.parseExpression(LOWEST)     // parse the inner expression
      // expect and consume the matching ')'
      return exp
    }
checkpoint: Parentheses regroup expressions, overriding operator precedence. Commit.
---

A grouping parenthesis is not an operator and does not survive in the tree - it
only tells the parser to start a *fresh* expression at the lowest precedence,
ignoring whatever was binding outside. When the lexer hands you a `(` where an
operand is expected, parse a whole expression inside it at `LOWEST`, then require
the matching `)`.

Because the inner parse resets precedence, `(1 + 2) * 3` forces the addition to
finish before the `*` can act, producing `((1 + 2) * 3)`. Notice there is no
`GroupExpression` node - the returned subtree already encodes the grouping
through its shape, so the parentheses have done their job and disappear.
