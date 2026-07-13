---
project: build-a-programming-language
lesson: 29
title: Evaluating if/else
overview: Now conditionals actually choose. Today you evaluate an if expression - test the condition's truthiness, run the matching block, and decide what an if with no matching branch produces.
goal: Evaluate an if expression by running the branch its condition selects.
spec:
  scenario: Evaluating if/else
  status: failing
  lines:
    - kw: Given
      text: 'if expressions with integer results'
    - kw: When
      text: 'the evaluator evaluates if (true) { 10 }, then if (1 > 2) { 10 } else { 20 }, then if (false) { 10 }'
    - kw: Then
      text: 'the results are 10, 20, and null'
    - kw: And
      text: 'an if whose condition is falsy with no else branch evaluates to null'
code:
  lang: go
  source: |
    func evalIf(ie *IfExpression) Object {
      cond := Eval(ie.Condition)
      if isTruthy(cond) {
        return Eval(ie.Consequence)
      } else if ie.Alternative != nil {
        return Eval(ie.Alternative)
      }
      return NULL
    }
checkpoint: If expressions run and return the selected branch, or null when nothing matches. Commit.
---

Evaluating an `if` ties together two things you already built: **truthiness**
(from the bang lesson) decides which way to go, and **block evaluation** (from the
last lesson) produces the chosen branch's value. Evaluate the condition, and if
it is truthy run the consequence; otherwise run the alternative if there is one.

The boundary case is an `if` whose condition is falsy and that has **no else**:
there is nothing to run, so it evaluates to `null`. That is why `if` is an
expression in this language - it always produces a value, even if that value is
`null`. This same truthiness test will drive `while` at the end of the chapter.
