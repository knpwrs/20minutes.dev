---
project: build-a-programming-language
lesson: 36
title: Parsing call expressions
overview: Calling a function is written name(args). Today you parse call expressions by treating the opening parenthesis as an infix operator with the tightest precedence of all.
goal: Parse a call expression into a node holding the callee and its argument expressions.
spec:
  scenario: Parsing a function call
  status: failing
  lines:
    - kw: Given
      text: 'the source add(1, 2 * 3)'
    - kw: When
      text: 'the parser parses the program and prints it'
    - kw: Then
      text: 'the printed form is add(1, (2 * 3))'
    - kw: And
      text: 'parsing a + b(c) prints (a + b(c)), because the call binds tighter than +'
code:
  lang: go
  source: |
    type CallExpression struct { Function Expression; Arguments []Expression }
    const ( /* ...existing levels... */ CALL ) // highest precedence
    // register '(' as an INFIX parse function at CALL precedence:
    //   the left expression is the callee; parse the comma-separated args
    precedences["("] = CALL
checkpoint: Call expressions parse with arguments, binding tighter than any operator. Commit.
---

A call like `add(1, 2)` is really an **infix** use of `(`: the thing on its left
is the function being called, and inside the parentheses is a comma-separated list
of argument expressions. Registering `(` as an infix parse function at the
**highest** precedence, `CALL`, is what makes this work inside the Pratt loop you
already have.

That top precedence is why `a + b(c)` parses as `(a + b(c))` - the call to `b`
binds tighter than the `+`, so `b(c)` forms first and only then is added to `a`.
The callee is any expression, not just a name, which will matter once functions
return other functions. Arguments are parsed with full precedence, so
`add(1, 2 * 3)` correctly groups its second argument as `(2 * 3)`.
