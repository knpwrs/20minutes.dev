---
project: build-an-expression-evaluator
lesson: 25
title: Too little and too much input
overview: A valid input is exactly one complete expression, so the parser must reject both input that ends too early and input with leftover tokens. Today you handle the end-of-input case and check for trailing tokens.
goal: Report an end-of-input error when an operand is missing, and a trailing-token error when tokens remain.
spec:
  scenario: Input must be exactly one complete expression
  status: failing
  lines:
    - kw: Given
      text: 'the input "1 2"'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'parsing fails with: unexpected token ''2'' at position 2'
    - kw: And
      text: 'parsing the empty string fails with: unexpected end of input at position 0, and parsing "1 +" fails with: unexpected end of input at position 3'
code:
  lang: go
  source: |
    func perr(t Token) error {
      if t.Kind == EOF { return fmt.Errorf("unexpected end of input at position %d", t.Pos) }
      return fmt.Errorf("unexpected token '%s' at position %d", t.Text, t.Pos)
    }
    // Parse: after parseExpr(0), require that nothing is left but EOF
    e, err := p.parseExpr(0)
    if err != nil { return nil, err }
    if p.peek().Kind != EOF { return nil, perr(p.peek()) }
    return e, nil
checkpoint: The parser rejects both a missing operand and leftover trailing tokens. Commit and stop here.
---

Two opposite failures both mean the same thing: the input is not exactly one
expression. If it ends **too early**, like `1 +`, then `nud` gets called and finds the
`EOF` token where an operand should be. Extend `perr` to recognize `EOF` and say
`unexpected end of input` rather than quoting an empty token; the empty string hits
this immediately, at position `0`.

If there is **too much**, like `1 2`, then `parseExpr` happily parses the `1` and
stops, but a `2` is left over. So after parsing, `Parse` checks that the only token
remaining is `EOF`; anything else is a trailing-token error at that token's position.
Together these two checks make `Parse` total in the good sense: it either returns one
well-formed tree or a precise reason why it could not, and never silently ignores part
of its input.
