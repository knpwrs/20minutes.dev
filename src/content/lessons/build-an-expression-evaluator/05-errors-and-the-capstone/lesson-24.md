---
project: build-an-expression-evaluator
lesson: 24
title: Unexpected token errors
overview: A parser must reject nonsense clearly, not crash or guess. Today you make the prefix handler report a precise error when it meets a token that cannot begin an expression, and thread that error out through the parse loop.
goal: Report an unexpected-token error, with position, when a token cannot start an expression.
spec:
  scenario: A token that cannot start an expression is reported
  status: failing
  lines:
    - kw: Given
      text: 'the input "1 + * 2"'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'parsing fails with the error message: unexpected token ''*'' at position 4'
    - kw: And
      text: 'parsing "* 3" fails with: unexpected token ''*'' at position 0'
code:
  lang: go
  source: |
    func perr(t Token) error {
      return fmt.Errorf("unexpected token '%s' at position %d", t.Text, t.Pos)
    }
    // nud: after the Number, "-", "(", and Ident cases, the fall-through is an error
    // default: return nil, perr(t)
    // and parseExpr must now propagate the right-operand error instead of ignoring it:
    rhs, err := p.parseExpr(rbp)
    if err != nil { return nil, err }
checkpoint: The parser reports a positioned error for a token that cannot start an expression. Commit and stop here.
---

An expression has to **start** with something: a number, a name, a `(`, or a unary
minus. When `nud` is handed anything else, like the `*` in `1 + * 2`, there is no
valid parse, and the right response is a clear error rather than a panic or a wrong
tree. The `perr` helper formats the message from the offending token, and because the
token has carried its **position** since the tokenizer, the message can point at the
exact column: `at position 4`.

This is where the error return that `Parse` and `parseExpr` have carried since the
start finally does work. Until now the loop discarded the right-operand result with a
blank identifier; now it checks that error and passes it up, so a failure deep in a
subexpression surfaces all the way out. Wiring the propagation once means every parse
rule you already wrote gains real error handling for free.
