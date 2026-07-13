---
project: build-an-expression-evaluator
lesson: 9
title: Precedence with higher binding power
overview: A naive left-to-right parse reads 2 + 3 * 4 as (2 + 3) * 4, which is wrong. Today you fix it the Pratt way, by giving multiplication a higher binding power than addition, so it binds its operands more tightly.
goal: Give * / and % higher binding power so they bind tighter than + and -.
spec:
  scenario: Higher-precedence operators bind tighter
  status: failing
  lines:
    - kw: Given
      text: 'the input "2 + 3 * 4"'
    - kw: When
      text: 'it is parsed and rendered with String'
    - kw: Then
      text: 'the rendering is "(2 + (3 * 4))", not "((2 + 3) * 4)"'
    - kw: And
      text: 'parsing "8 / 4 / 2" renders as "((8 / 4) / 2)", still grouping left to right within the tier'
code:
  lang: go
  source: |
    func infixBP(op string) (int, int, bool) {
      switch op {
      case "+", "-": return 10, 11, true
      case "*", "/", "%": return 20, 21, true   // tighter than + and -
      }
      return 0, 0, false
    }
checkpoint: Multiplication, division, and modulo bind tighter than addition. Commit and stop here.
---

This is the precedence problem, and the Pratt loop already contains its solution.
Read `2 + 3 * 4` strictly left to right and you get `(2 + 3) * 4`, which is `20`
instead of the correct `14`. The fix is not a new algorithm, just **bigger numbers**:
give `*`, `/`, and `%` a left binding power of `20`, above the `10` you gave `+` and
`-`. Now when the loop is parsing the right operand of `+` with floor `11`, it meets
`*` with left power `20`, which **is** above `11`, so `*` gets absorbed into that
right operand as `(3 * 4)`, exactly the tighter grouping precedence demands.

Notice you did not touch `parseExpr` at all; one table entry expresses the whole idea
of precedence. Within a tier the left-associativity from the previous lesson still
holds, because each tier keeps right power one above left power: `8 / 4 / 2` groups as
`((8 / 4) / 2)`. This is the payoff of binding powers over hand-written grammar rules:
precedence and associativity are both just two integers per operator.
