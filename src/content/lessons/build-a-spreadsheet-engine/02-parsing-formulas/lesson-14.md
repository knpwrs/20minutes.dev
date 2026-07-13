---
project: build-a-spreadsheet-engine
lesson: 14
title: Function calls
overview: Formulas call functions like SUM and IF with comma-separated arguments. Today you parse a function call - a name, then a parenthesized list of argument expressions - into a call node.
goal: Parse an identifier followed by a parenthesized, comma-separated argument list into a CallNode.
spec:
  scenario: Function calls parse into a name and argument list
  status: failing
  lines:
    - kw: Given
      text: 'a formula that calls a function with arguments'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'parse(''=SUM(1, 2)'').String() is ''SUM(1, 2)'''
    - kw: And
      text: 'parse(''=IF(A1>0, 1, 0)'').String() is ''IF((A1 > 0), 1, 0)'', each argument parsed as its own expression'
code:
  lang: go
  source: |
    type CallNode struct{ Name string; Args []Expr }
    // in primary(): an Ident is a call. Consume '(', then parse
    // comma-separated expr(0) arguments until ')'.
    case TIdent:
      name := t.Text
      p.next() // '('
      var args []Expr
      if p.cur().Kind != TRParen {
        args = append(args, p.expr(0))
        for p.cur().Kind == TComma { p.next(); args = append(args, p.expr(0)) }
      }
      p.next() // ')'
      return CallNode{Name: name, Args: args}
checkpoint: Function calls parse into a name plus a list of argument expressions. Commit and stop here.
---

A function call is another kind of primary: an **identifier** immediately followed
by a parenthesized argument list. When the primary parser sees an `Ident` token, it
consumes the open paren, then parses each argument as a **full expression**
(`expr(0)`), separated by commas, until it reaches the close paren. Each argument is
its own subtree, so `IF(A1>0, 1, 0)` parses the condition `A1>0` into a comparison
node while the other two arguments stay simple numbers.

Parsing arguments as complete expressions is what makes calls composable - an
argument can itself be arithmetic, a comparison, or even another call. The parser
does not care whether `SUM` or `IF` is a real function or how many arguments it
should take; it just builds a `CallNode` with the name and the argument list, which
prints as `NAME(arg, arg)`. Checking that names and arities are valid, and actually
running the function, is the evaluator's job later. One argument shape is still
missing - a **range** like `A1:B3` - and that is the next lesson.
