---
project: build-a-programming-language
lesson: 28
title: Evaluating a sequence of statements
overview: A program is many statements, but evaluating one produces one value. Today you define what a whole program evaluates to - the value of its last statement - and the same rule for the statements inside a block.
goal: Evaluate a program and a block to the value of their final statement.
spec:
  scenario: A program evaluates to its last statement
  status: failing
  lines:
    - kw: Given
      text: 'the source 1; 2; 3'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is 3, the value of the last statement'
    - kw: And
      text: 'evaluating 5 alone yields 5, and an empty program yields null'
code:
  lang: go
  source: |
    func evalStatements(stmts []Statement) Object {
      var result Object = NULL
      for _, s := range stmts {
        result = Eval(s)
      }
      return result
    }
checkpoint: A program and a block evaluate to the value of their final statement. Commit.
---

So far you have evaluated single expressions. A real program is a **list of
statements**, so you must decide what the whole thing produces. The rule here is
simple and useful in a REPL: evaluate the statements in order and the program's
value is the value of the **last** one. An empty program is `null`.

Blocks - the `{ ... }` bodies inside `if` and `while` - follow the same rule, so
write one helper that folds a statement list down to its final value and reuse it
for both the top-level program and blocks. This is what lets `if (true) { 10 }`
produce `10` in the very next lessons: the consequence block evaluates to its last
statement. There is one subtlety with `return` that jumps out early - you will
handle that in two lessons.
