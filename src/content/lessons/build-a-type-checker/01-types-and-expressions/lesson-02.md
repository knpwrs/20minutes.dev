---
project: build-a-type-checker
lesson: 2
title: Typing the literals
overview: Types describe expressions, so now you need expressions - and the simplest ones are literals whose type is obvious. Today you build a tiny expression AST and the Infer function that reads a literal's type straight off it.
goal: Build an expression AST for the three literal kinds and infer each literal's type.
spec:
  scenario: Inferring the type of a literal
  status: failing
  lines:
    - kw: Given
      text: 'the literal expressions 5, true, and "hi"'
    - kw: When
      text: Infer is called on each
    - kw: Then
      text: 'Infer(IntLit 5) is Int, Infer(BoolLit true) is Bool, and Infer(StrLit "hi") is String'
code:
  lang: go
  source: |
    // expressions are the things we type; start with the three literals.
    type Expr interface{ exprNode() }
    type IntLit struct{ Value int }
    type BoolLit struct{ Value bool }
    type StrLit struct{ Value string }
    // Infer reads a type off an expression. Literals are the easy base case.
    func Infer(e Expr) (Type, error) {
      switch e.(type) {
      // case *IntLit: return TInt{}, nil  ... and the other two
      }
    }
checkpoint: Infer reports the type of any of the three literals. Commit and stop here.
---

Types describe **expressions**, so you need some expressions to describe. The
smallest possible ones are **literals** - a number, a boolean, a string - whose
type you can read off without any context at all: a `5` is an `Int`, full stop.
This is the base case of `Infer`, the function that will eventually work out the
type of any expression in the language.

`Infer` takes an expression and returns its `Type` (or, later, an error when the
expression is ill-typed). Today every input is well-typed and the answer is
immediate, but the shape you set up now - a switch over the kinds of expression,
one arm per kind, each returning a `Type` - is the skeleton that every following
lesson hangs a new arm on. Return an `error` alongside the type even though it is
always `nil` today; the moment variables and conditionals arrive, that error slot
is where "this program does not type-check" will live.
