---
project: build-a-type-checker
lesson: 4
title: let-bindings and scope
overview: Names have to come from somewhere, and in a functional language they come from let. Today you add let-bindings so a name is bound to the type of its value and is visible only inside the body.
goal: Type a let-binding by extending the environment for the body, respecting lexical scope.
spec:
  scenario: Binding a name with let and using it in the body
  status: failing
  lines:
    - kw: Given
      text: 'the expression let x = 5 in x'
    - kw: When
      text: it is inferred in an empty environment
    - kw: Then
      text: 'its type is Int'
    - kw: And
      text: 'in let x = 5 in (let x = true in x), the inner x is Bool, and after that inner let the name x is not in scope'
code:
  lang: go
  source: |
    // let Name = Value in Body
    type Let struct{ Name string; Value, Body Expr }
    //   case *Let:
    //     vt, err := Infer(env, l.Value)   // type of the bound value
    //     ...
    //     inner := extend(env, l.Name, vt) // a NEW env, don't mutate the old
    //     return Infer(inner, l.Body)
checkpoint: let binds a name to its value's type for the body only. Commit and stop here.
---

A variable rule is only useful once something can put names in the environment. In
this language that something is **let**: `let x = 5 in x` binds `x` to the type of
`5` and then types the body with `x` in scope. The rule is two steps - infer the
type of the bound value, then infer the body in an environment **extended** with
that binding.

The word that matters is **lexical scope**. The binding is visible in the body and
nowhere else, and an inner `let` that reuses a name **shadows** the outer one only
for the duration of its own body. The safe way to get this right is to build a
*new* extended environment for the body rather than mutating the one you were
handed, so the binding disappears automatically when you return. Get shadowing and
"not visible afterwards" right now and nested scopes will keep working for free all
the way to the capstone.
