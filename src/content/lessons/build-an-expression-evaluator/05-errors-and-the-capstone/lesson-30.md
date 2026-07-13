---
project: build-an-expression-evaluator
lesson: 30
title: 'Capstone: a batch of expressions'
overview: The finale runs a batch of real expressions through the finished library, asserting the exact result of each well-formed one and the exact error of each malformed one. Every layer you built proves itself at once.
goal: Evaluate a batch of expressions to their exact results, and confirm malformed ones report the right errors.
spec:
  scenario: The finished evaluator handles a batch of real and malformed input
  status: failing
  lines:
    - kw: Given
      text: 'the well-formed batch: "2 + 3 * 4", "(2 + 3) * 4", "2 ^ 3 ^ 2", "-2 ^ 2", "sqrt(16) + abs(-5)", and "x * 2 + max(a, b)" with x=3, a=1, b=7'
    - kw: When
      text: 'each is evaluated with EvalString'
    - kw: Then
      text: 'the results are exactly 14, 20, 512, -4, 9, and 13'
    - kw: And
      text: 'the malformed batch reports: "1 + * 2" gives unexpected token ''*'' at position 4, "(1 + 2" gives expected '')'' at position 6, "10 / 0" gives division by zero at position 3, and "y + 1" gives undefined variable: y at position 0'
code:
  lang: go
  source: |
    good := []struct{ in string; env Env; want float64 }{
      {"2 + 3 * 4", nil, 14}, {"(2 + 3) * 4", nil, 20},
      {"2 ^ 3 ^ 2", nil, 512}, {"-2 ^ 2", nil, -4},
      {"sqrt(16) + abs(-5)", nil, 9},
      {"x * 2 + max(a, b)", Env{"x": 3, "a": 1, "b": 7}, 13},
    }
    for _, c := range good {
      got, err := EvalString(c.in, c.env)  // err nil, got == c.want
    }
checkpoint: The finished evaluator computes a batch of real expressions exactly and reports every malformed one clearly. The project is complete; commit and stop here.
---

This is the promise the whole project was built to keep: a real **expression
evaluator**. The well-formed batch exercises every layer at once. `2 + 3 * 4` proves
precedence, `(2 + 3) * 4` proves grouping overrides it, `2 ^ 3 ^ 2` proves right
associativity, `-2 ^ 2` proves the unary-minus convention, `sqrt(16) + abs(-5)` proves
functions, and `x * 2 + max(a, b)` proves variables and precedence together. Each
reduces to one exact number because the tokenizer, the Pratt parser, and the tree
walk all agree.

The malformed batch closes the loop on robustness: a stray operator, an unclosed
parenthesis, a division by zero, and an unknown variable each come back as a clear
message naming what went wrong and the position where. From a tokenizer that could
only recognize a single number, you have built the honest core of a calculator: a
Pratt parser whose binding powers capture all of precedence and associativity, an
evaluator over float64 with variables and built-in functions, and errors that point
exactly at the problem. The same technique scales straight up to real language
parsers, and now it is yours.
