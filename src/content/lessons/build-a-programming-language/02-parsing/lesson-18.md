---
project: build-a-programming-language
lesson: 18
title: If expressions
overview: Conditionals are how a program chooses. Today you parse if/else - which needs a block statement to hold each branch's body, so you build that too and use if as its first home.
goal: Parse an if/else into an expression holding a condition and consequence and alternative blocks.
spec:
  scenario: Parsing an if/else expression
  status: failing
  lines:
    - kw: Given
      text: 'the source if (x < y) { x } else { y }'
    - kw: When
      text: 'the parser parses the program and prints it'
    - kw: Then
      text: 'the printed form is if (x < y) x else y'
    - kw: And
      text: 'parsing if (x < y) { x } (no else) prints if (x < y) x'
code:
  lang: go
  source: |
    type BlockStatement struct { Statements []Statement }
    type IfExpression struct {
      Condition Expression
      Consequence *BlockStatement
      Alternative *BlockStatement   // nil when there is no else
    }
    // parseBlock: consume '{', parse statements until '}'
checkpoint: If/else parses into an expression with a condition and one or two blocks. Commit.
---

An `if` needs somewhere to put the statements in each branch, so first build a
**block statement**: a `{ ... }` holding a list of statements, parsed with the
same loop as the whole program but stopping at the closing brace. This is the
container you will reuse for function bodies and loop bodies too.

With blocks in hand, an **if expression** is a condition (in parentheses), a
consequence block, and an optional `else` alternative block - store `nil` for the
alternative when there is no `else`. It is an *expression*, not a statement,
because in this language `if` produces a value; that will matter when you
evaluate it. The printed form drops the braces for readability, so
`if (x < y) x else y` still shows the structure clearly.
