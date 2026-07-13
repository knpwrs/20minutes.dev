---
project: build-a-programming-language
lesson: 21
title: The object system and evaluating integers
overview: The evaluator walks the syntax tree and produces values. Today you define what a runtime value is - the object system - and evaluate the simplest node, an integer literal, then wire eval into the REPL so it finally computes.
goal: Evaluate an integer literal node into an integer object and print its value at the REPL.
spec:
  scenario: Evaluating an integer literal
  status: failing
  lines:
    - kw: Given
      text: 'the source 5'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is an integer object whose value is 5'
    - kw: And
      text: 'the REPL prints 5 when that line is entered'
code:
  lang: go
  source: |
    type Object interface { Type() string; Inspect() string }
    type Integer struct { Value int64 }
    func (i *Integer) Type() string    { return "INTEGER" }
    func (i *Integer) Inspect() string { return fmt.Sprint(i.Value) }
    func Eval(node Node) Object { /* switch on node type; IntegerLiteral -> &Integer{...} */ }
checkpoint: The REPL evaluates integer literals into objects and prints their value. Commit.
---

Parsing gave you a tree; **evaluation** turns that tree into values. First you
need to say what a runtime value *is*: an `Object` interface with a `Type` (for
error messages and comparisons) and an `Inspect` (how it prints). Define the
`Integer` object now - it is the first of several object kinds, all sharing this
interface.

`Eval` is a function that takes a node and returns an object, switching on the
node's kind. Today it handles exactly one case - an integer literal becomes an
integer object - but that switch is the spine of the whole evaluator, growing one
case per node type. Wire `Eval` into the REPL after the parser, print the
result's `Inspect`, and your loop finally *computes* instead of just echoing.
