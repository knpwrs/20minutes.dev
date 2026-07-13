---
project: build-a-programming-language
lesson: 17
title: Return statements
overview: Functions need a way to hand back a value, and that is the return statement. Today you parse it - the same dispatch-and-parse shape as let, with just an expression to carry.
goal: Parse a return statement into a node holding the returned expression.
spec:
  scenario: Parsing a return statement
  status: failing
  lines:
    - kw: Given
      text: 'the source return 10;'
    - kw: When
      text: 'the parser parses the program and prints it'
    - kw: Then
      text: 'the printed form is return 10;'
    - kw: And
      text: 'parsing return 2 * 5; prints return (2 * 5);'
code:
  lang: go
  source: |
    type ReturnStatement struct { ReturnValue Expression }
    func (rs *ReturnStatement) String() string {
      return "return " + rs.ReturnValue.String() + ";"
    }
    // add a RETURN case to parseStatement's dispatch
checkpoint: Return statements parse into a node holding the returned expression. Commit.
---

A **return statement** is the keyword `return` followed by an expression and a
semicolon. It fits the exact shape you built for `let`: add a `RETURN` case to
the statement dispatch, consume the keyword, and parse the value expression that
follows.

There is nothing to bind on the left this time - just the returned value - so the
node is even simpler than a let. The printed form `return (2 * 5);` confirms the
value expression is parsed with full precedence like everywhere else. You are not
running returns yet; you are building the tree the evaluator will later use to
jump out of a function.
