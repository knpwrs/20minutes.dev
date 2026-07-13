---
project: build-a-programming-language
lesson: 35
title: Parsing function literals
overview: Functions are values in this language, written with fn. Today you parse a function literal into a node holding its parameter names and body block - back to the parser for one lesson to give the evaluator something to run.
goal: Parse a function literal into a node with its parameter list and body block.
spec:
  scenario: Parsing a function literal
  status: failing
  lines:
    - kw: Given
      text: 'the source fn(x, y) { x + y }'
    - kw: When
      text: 'the parser parses the program and prints it'
    - kw: Then
      text: 'the printed form is fn(x, y) (x + y)'
    - kw: And
      text: 'parsing fn() { } prints fn() with an empty parameter list and empty body'
code:
  lang: go
  source: |
    type FunctionLiteral struct { Parameters []*Identifier; Body *BlockStatement }
    // register 'fn' as a prefix parse function:
    //   consume 'fn', parse a comma-separated parameter list in ( ),
    //   then parse the body with parseBlock
checkpoint: Function literals parse into a node with parameters and a body. Commit.
---

A **function literal** starts with `fn`, a parenthesized list of parameter names,
and a body block - and crucially it is an **expression**, a value you can bind to
a name or pass around, not a named declaration. Register `fn` as a prefix parse
function: parse the comma-separated identifiers between the parentheses, then
reuse `parseBlock` for the body.

Parsing the parameter list is the one new bit - handle zero parameters (`fn() {
}`), one, and several separated by commas. The body reuses machinery you already
have. This is a brief detour back into the parser; the next lesson adds call
syntax, and then the evaluator brings both to life.
