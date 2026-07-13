---
project: build-a-programming-language
lesson: 32
title: Runtime errors
overview: Programs go wrong - a type mismatch, an unknown name. Today you make errors first-class objects that carry a message and bubble up like a return, so a bad expression reports instead of crashing.
goal: Produce error objects for type mismatches and unknown identifiers, and stop evaluation when one appears.
spec:
  scenario: Reporting runtime errors
  status: failing
  lines:
    - kw: Given
      text: 'programs that misuse types or names'
    - kw: When
      text: 'the evaluator evaluates 5 + true, then foobar, then -true'
    - kw: Then
      text: 'each yields an error whose message is type mismatch: INTEGER + BOOLEAN, then identifier not found: foobar, then unknown operator: -BOOLEAN'
    - kw: And
      text: 'in 5 + true; 5; the error stops evaluation so the trailing 5 is never returned'
code:
  lang: go
  source: |
    type Error struct { Message string }
    func (e *Error) Type() string { return "ERROR" }
    // build errors like: &Error{fmt.Sprintf("type mismatch: %s %s %s", l.Type(), op, r.Type())}
    // in evalStatements, stop early on an *Error just like a *ReturnValue
checkpoint: Type mismatches and unknown names produce errors that stop evaluation. Commit.
---

Real evaluation meets bad input: `5 + true` mixes types, `foobar` was never
bound, `-true` negates a non-number. Rather than crash, make an **Error** a
regular object carrying a message. The evaluator returns one wherever an operation
does not make sense, with a message precise enough to debug from -
`type mismatch: INTEGER + BOOLEAN`, `identifier not found: foobar`,
`unknown operator: -BOOLEAN`.

Errors must **propagate** like `return` values do: when the statement loop sees an
error, it stops and passes it up, so `5 + true; 5;` reports the mismatch and never
reaches the trailing `5`. Get the message format exactly right - later error
messages reuse the same `Type()` names - and remember to check for errors after
evaluating sub-expressions so a deep error still surfaces at the top.
