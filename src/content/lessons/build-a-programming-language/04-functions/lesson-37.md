---
project: build-a-programming-language
lesson: 37
title: Functions as values
overview: A function literal should evaluate to a value you can store and pass around. Today you evaluate it into a function object that captures its parameters, body, and - importantly - the environment it was defined in.
goal: Evaluate a function literal into a function object that captures its defining environment.
spec:
  scenario: Evaluating a function literal
  status: failing
  lines:
    - kw: Given
      text: 'the source let double = fn(x) { x * 2 }; double'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is a function object with one parameter x'
    - kw: And
      text: 'the function object holds a reference to the environment in which it was defined'
code:
  lang: go
  source: |
    type Function struct {
      Parameters []*Identifier
      Body *BlockStatement
      Env *Environment          // the environment where the fn was defined
    }
    func (f *Function) Type() string { return "FUNCTION" }
    // eval of a FunctionLiteral: build a Function, capturing the current env
checkpoint: Function literals evaluate to function objects that remember their environment. Commit.
---

Evaluating a function literal produces a **function object** - a first-class value
holding the parameter names, the body, and a reference to the **environment it was
defined in**. That captured environment is the single most important field: it is
what will let a function see the variables that were in scope where it was
written, even when it is called somewhere else entirely.

Nothing runs yet - you are only turning the literal into a value that can be bound
with `let` and passed as an argument. Storing the defining environment now, before
you can call anything, is what makes **closures** possible two lessons from here.
Get the capture right and the rest of the chapter falls into place.
