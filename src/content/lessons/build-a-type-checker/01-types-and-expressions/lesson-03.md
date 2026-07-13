---
project: build-a-type-checker
lesson: 3
title: Variables and the environment
overview: Real programs name things, so the checker needs to remember what type each name has. Today you add a typing environment and the variable rule - look the name up, or fail if it was never bound.
goal: Infer a variable's type from an environment, and report an unbound variable as an error.
spec:
  scenario: Looking a variable up in the typing environment
  status: failing
  lines:
    - kw: Given
      text: 'an environment binding x to Int'
    - kw: When
      text: 'a variable expression is inferred in that environment'
    - kw: Then
      text: 'Infer(Var "x") is Int'
    - kw: And
      text: 'Infer(Var "y") fails with the error "unbound variable: y"'
code:
  lang: go
  source: |
    // the environment maps names in scope to their types.
    type Env map[string]Type
    type Var struct{ Name string }
    // Infer now takes the environment it is typing under.
    // func Infer(env Env, e Expr) (Type, error)
    //   case *Var:
    //     if t, ok := env[v.Name]; ok { return t, nil }
    //     return nil, fmt.Errorf("unbound variable: %s", v.Name)
checkpoint: Infer resolves a variable against the environment and rejects unbound names. Commit and stop here.
---

Every expression past a literal is typed **relative to a context**: the type of
`x` depends on what `x` was bound to. That context is the **typing environment** -
a mapping from the names currently in scope to their types. The variable rule is
the first place the environment is read: to type `Var "x"`, look `x` up and return
whatever type it holds.

This lesson also gives `Infer` the parameter it will carry for the rest of the
project: the environment it is typing under. That is the one change today ripples
into the earlier literal lessons - their tests now pass an empty environment, since
a literal ignores it. The other half of the rule is the failure case: a name that
is not in scope is not a runtime problem to discover later, it is a **type error**
right now. Reporting `unbound variable: y` is the first real "this does not
type-check", and it is exactly the kind of clear, early rejection a type checker
exists to give.
