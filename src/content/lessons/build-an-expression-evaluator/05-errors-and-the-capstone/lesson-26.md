---
project: build-an-expression-evaluator
lesson: 26
title: Mismatched parentheses
overview: Grouping and calls both consumed a closing parenthesis on faith, which crashes on unbalanced input. Today you check for the closing parenthesis and report a clear error when it is missing.
goal: Report an error when a grouped subexpression or call is not closed by a matching parenthesis.
spec:
  scenario: An unclosed parenthesis is reported
  status: failing
  lines:
    - kw: Given
      text: 'the input "(1 + 2"'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'parsing fails with: expected '')'' at position 6'
    - kw: And
      text: 'parsing "1 + 2)" fails with a trailing-token error: unexpected token '')'' at position 5'
code:
  lang: go
  source: |
    // in the grouping nud, replace the blind p.next() that consumed ")":
    inner, err := p.parseExpr(0)
    if err != nil { return nil, err }
    if p.peek().Kind != RParen {
      return nil, fmt.Errorf("expected ')' at position %d", p.peek().Pos)
    }
    p.next()
    // apply the same guard before consuming ")" in the call argument list
checkpoint: Unbalanced parentheses report a clear, positioned error. Commit and stop here.
---

Back when you wrote grouping and calls, both simply called `next` to consume the
closing `)`, trusting it was there. On input like `(1 + 2`, that trust is misplaced:
after parsing the inner `1 + 2`, the next token is `EOF`, not `)`. So before consuming
the `)`, **check** for it, and if it is missing, report `expected ')'` at the position
where the parser is now looking, which for `(1 + 2` is the end of input at position
`6`. Apply the identical guard in the call's argument list, so `sqrt(16` fails the
same clear way.

The opposite case, an **extra** closing parenthesis like `1 + 2)`, needs no new code:
the parser finishes the `1 + 2`, and the leftover `)` is caught by the trailing-token
check from the previous lesson. Between the unexpected-token, end-of-input,
trailing-token, and unclosed-parenthesis checks, the parser now rejects every
malformed shape with a message that names what went wrong and where.
