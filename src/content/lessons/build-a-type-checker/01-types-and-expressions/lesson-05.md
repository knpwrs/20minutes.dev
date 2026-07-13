---
project: build-a-type-checker
lesson: 5
title: Conditionals
overview: An if is the first expression whose type depends on two subexpressions agreeing. Today you add if/then/else with the two rules that make it sound - the condition must be a Bool, and the branches must have the same type.
goal: Type an if-expression, requiring a Bool condition and matching branch types.
spec:
  scenario: Typing an if-expression and its two error cases
  status: failing
  lines:
    - kw: Given
      text: 'if-expressions over the base types'
    - kw: When
      text: each is inferred
    - kw: Then
      text: 'if true then 1 else 2 is Int, and if true then "a" else "b" is String'
    - kw: And
      text: 'if 1 then 2 else 3 fails (condition is Int, not Bool), and if true then 1 else false fails (branch types Int and Bool disagree)'
code:
  lang: go
  source: |
    // if Cond then Then else Else
    type If struct{ Cond, Then, Else Expr }
    //   case *If:
    //     ct := Infer(env, i.Cond); if !Equal(ct, TBool{}) { error }
    //     tt := Infer(env, i.Then); et := Infer(env, i.Else)
    //     if !Equal(tt, et) { error "branches ... disagree" }
    //     return tt
checkpoint: if type-checks its condition and branches, and rejects the two bad cases. Commit and stop here.
---

An `if` is the first expression whose type is not read straight off itself - it
depends on its parts **fitting together**. Two rules make it sound. First, the
condition has to be a `Bool`: branching on an `Int` is meaningless, so it is a type
error. Second, the two branches have to produce the **same** type, because the
whole `if` has one type and you cannot know at check time which branch will run -
`if c then 1 else "x"` could be an `Int` or a `String`, and a type checker refuses
that ambiguity.

This is where `Equal` from lesson one earns its place: you call it twice, once to
check the condition is `Bool` and once to check the branches agree, and the result
type of the whole expression is the branches' shared type. Pin both failure cases
now - a non-`Bool` condition and mismatched branches - because these are the exact
disagreements that unification will later generalize when the types involved are
still unknown.
