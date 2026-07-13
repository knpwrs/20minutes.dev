---
project: build-a-type-checker
lesson: 22
title: let-generalization
overview: This is the payoff of the whole chapter - the rule that makes let id = \x.x genuinely polymorphic. Generalizing a let-bound type over its free variables lets one definition be used at many types, while a lambda parameter stays monomorphic.
goal: Generalize a let-bound type into a polymorphic scheme, and keep lambda parameters monomorphic.
spec:
  scenario: let is polymorphic, a lambda parameter is not
  status: failing
  lines:
    - kw: Given
      text: 'programs that use one function at two different types'
    - kw: When
      text: each is inferred in an empty environment
    - kw: Then
      text: 'the type of let id = \x. x in if id true then id 1 else id 2 is Int - id is used at Bool for the condition and at Int for the branches'
    - kw: And
      text: 'the lambda-bound version (\id. if id true then id 1 else id 2) (\x. x) fails with "argument type mismatch: expected Bool, got Int", because a lambda parameter is monomorphic'
code:
  lang: go
  source: |
    // generalize: quantify the variables free in t but NOT free in the environment.
    func generalize(env SchemeEnv, t Type) Scheme {
      qs := difference(freeVars(t), freeVarsEnv(env))
      return Scheme{qs, t}
    }
    //   case *Let:
    //     vt, s1, err := infer(env, l.Value)
    //     env1 := applyEnv(s1, env)
    //     sch := generalize(env1, apply(s1, vt))       // the magic step
    //     return infer(extend(env1, l.Name, sch), l.Body)
checkpoint: A let-bound definition is polymorphic; a lambda parameter is not. Commit and stop here.
---

Everything in this chapter was built for this one rule. When a `let` binds a
definition, you **generalize** its inferred type: any type variable that is free in
the type but not tied down by the surrounding environment becomes universally
quantified, turning the type into a real polymorphic scheme. So `let id = \x. x`
gives `id` the scheme `forall a. a -> a`, and every use of `id` in the body
instantiates a fresh copy. That is why `if id true then id 1 else id 2` type-checks
to `Int`: the condition instantiates `id` at `Bool`, each branch instantiates it
independently at `Int`, and nothing collides.

The contrast with a **lambda** parameter is the deep idea, and it is deliberate. A
parameter bound by `\id. ...` is **not** generalized - it stays a single monomorphic
variable shared across every use, because when you are still inside the function you
do not yet know what it will be called with. So `(\id. if id true then id 1 else id 2)`
forces its one `id` variable to become `Bool -> Bool` at the condition, and then
using it on `1` fails with `argument type mismatch: expected Bool, got Int`, even
though the identical body under a `let` succeeds. This let-versus-lambda distinction is exactly what
"let-polymorphism" names, and getting the free-variable bookkeeping right - quantify
what the environment does not already own - is what makes it sound.
