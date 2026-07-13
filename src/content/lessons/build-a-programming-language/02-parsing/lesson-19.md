---
project: build-a-programming-language
lesson: 19
title: While statements
overview: Loops are how a program repeats. Today you parse a while statement - a condition and a body block - reusing the block parser you just built for if.
goal: Parse a while loop into a statement holding a condition and a body block.
spec:
  scenario: Parsing a while loop
  status: failing
  lines:
    - kw: Given
      text: 'the source while (x < 10) { x }'
    - kw: When
      text: 'the parser parses the program and prints it'
    - kw: Then
      text: 'the printed form is while (x < 10) x'
    - kw: And
      text: 'the statement records a condition that prints as (x < 10) and a body block'
code:
  lang: go
  source: |
    type WhileStatement struct { Condition Expression; Body *BlockStatement }
    func (ws *WhileStatement) String() string {
      // the condition already prints its own parens when it is an infix
      // expression, so don't add another pair here (matches how if prints)
      return "while " + ws.Condition.String() + " " + ws.Body.String()
    }
    // add a WHILE case to parseStatement, mirroring if's condition+block
checkpoint: While loops parse into a statement with a condition and a body block. Commit.
---

A **while statement** is structurally an if without the else: the keyword, a
parenthesized condition, and a body block. Add a `WHILE` case to the statement
dispatch, parse the condition inside its parentheses, and reuse `parseBlock` for
the body - no new container needed.

Unlike `if`, a loop is a **statement**, not an expression: it exists to repeat
work, not to produce a value. That is a design choice you are baking into the
tree now and will honor in the evaluator, where the loop's job is to run its body
over and over while the condition holds.
