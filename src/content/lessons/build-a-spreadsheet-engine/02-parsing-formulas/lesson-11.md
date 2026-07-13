---
project: build-a-spreadsheet-engine
lesson: 11
title: Parentheses
overview: Precedence has a manual override - parentheses. Today you let the parser treat a parenthesized expression as a single primary value, so a user can force any grouping they want.
goal: Parse a parenthesized sub-expression as a primary, overriding the default precedence.
spec:
  scenario: Parentheses override precedence
  status: failing
  lines:
    - kw: Given
      text: 'a formula that uses parentheses to group a lower-precedence operation'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'parse(''=(1+2)*3'').String() is ''((1 + 2) * 3)'' and parse(''=2*(3+4)'').String() is ''(2 * (3 + 4))'', with each parenthesized sum forced ahead of the multiply'
    - kw: And
      text: 'redundant and nested parentheses add no nodes, so parse(''=((1+2))'').String() is ''(1 + 2)'' and parse(''=((1+2)*3)'').String() is ''((1 + 2) * 3)'''
code:
  lang: go
  source: |
    // in the primary parser: an open paren starts a fresh expr(0),
    // then the matching close paren is consumed.
    func (p *Parser) primary() Expr {
      t := p.next()
      if t.Kind == TLParen {
        e := p.expr(0)
        p.next() // consume ')'
        return e
      }
      // ... Number, and later Cell / Ident
    }
checkpoint: Parentheses now override operator precedence. Commit and stop here.
---

Precedence gives a sensible default, but a user needs to override it, and that is
what parentheses are for. The parser handles them in the **primary** position:
when the primary parser sees an open paren, it starts a fresh `expr(0)` - parsing a
full expression from the lowest binding power - and then consumes the matching
close paren. The parenthesized expression comes back as a single node, so the
surrounding operators treat it as one atomic value.

That is all it takes. Because the inner `expr(0)` runs with no precedence floor, the
grouping inside the parens is computed on its own terms, and the result plugs into
the outer expression as a unit. So `(1+2)*3` parses with the sum as a subtree of the
multiply, printing `((1 + 2) * 3)` - the reverse of what precedence alone would
give. The fully-parenthesized `String()` from last lesson makes the effect easy to
see.
