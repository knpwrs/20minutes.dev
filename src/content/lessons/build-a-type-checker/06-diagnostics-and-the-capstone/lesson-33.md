---
project: build-a-type-checker
lesson: 33
title: Source positions
overview: A type error that says what is wrong is only half a diagnostic - a good one says where. Today you attach source positions to expressions so every type error can report the line and column it came from.
goal: Carry a source position on expressions so a type error reports its line and column.
spec:
  scenario: A type error that reports its location
  status: failing
  lines:
    - kw: Given
      text: 'expressions carrying a source position, and a type error inside one'
    - kw: When
      text: each is inferred
    - kw: Then
      text: 'inferring 1 + true carried at line 1, column 5 fails with the message "cannot unify Bool with Int at line 1, col 5"'
    - kw: And
      text: 'a well-typed 2 + 3 carried at line 1, column 1 infers to Int, its position unused'
code:
  lang: go
  source: |
    // a positioned wrapper around any expression - the AST is built by hand, so
    // positions are attached as the tree is constructed.
    type At struct{ Line, Col int; Expr Expr }
    type TypeError struct{ Msg string; Line, Col int }
    func (e *TypeError) Error() string {
      if e.Line > 0 { return fmt.Sprintf("%s at line %d, col %d", e.Msg, e.Line, e.Col) }
      return e.Msg
    }
    //   case *At: infer the inner expr; if it errored and is not already located,
    //     wrap the message as &TypeError{msg, a.Line, a.Col}. Otherwise return as is.
checkpoint: A type error inside a positioned expression reports its line and column. Commit and stop here.
---

Every error the checker raises so far - `unbound variable`, `cannot unify`, the
occurs check - names the problem but not the place, and a programmer staring at a
hundred lines needs the place. Because this checker works on a **pre-built AST** rather
than parsing text, positions are attached as the tree is constructed: an `At` wrapper
carries a line and column around any subexpression. When inference fails inside an
`At`, the wrapper stamps its position onto the error, so `1 + true` wrapped at line 1,
column 5 reports `cannot unify Bool with Int at line 1, col 5`.

The mechanism is a single, additive rule and one small error type. A `TypeError`
carries the message plus an optional position, and prints the position only when it
has one - so every error you already built keeps its exact wording when no location
is attached, and gains an `at line ..., col ...` suffix when it is. The `At` case
wraps the **innermost** location: if an error is already positioned, an outer `At`
leaves it alone, so the reported spot is the smallest expression that actually went
wrong rather than the whole program. This is the groundwork; the next lessons turn
these positioned errors into a clean report.
