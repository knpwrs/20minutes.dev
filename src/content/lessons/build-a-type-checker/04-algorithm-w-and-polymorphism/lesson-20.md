---
project: build-a-type-checker
lesson: 20
title: Conditionals refine their parts
overview: The if-rule you wrote with equality becomes an inference rule today. Unifying the condition against Bool and the two branches against each other lets an if pin down an otherwise-unknown parameter.
goal: Infer an if-expression by unification, so the condition and branches refine unknown types.
spec:
  scenario: Inferring an if that constrains a variable
  status: failing
  lines:
    - kw: Given
      text: 'lambdas whose parameters are used inside an if'
    - kw: When
      text: each is inferred in an empty environment
    - kw: Then
      text: 'Show of the type of \x. if x then 1 else 2 is "Bool -> Int"'
    - kw: And
      text: 'Show of the type of \x. \y. if x then y else 0 is "Bool -> Int -> Int" - the condition forces x to Bool and the else-branch forces y to Int'
code:
  lang: go
  source: |
    //   case *If:
    //     ct, s1, err := infer(env, i.Cond)
    //     s2, err := unify(ct, TBool{})                  // condition must be Bool
    //     env2 := applyEnv(compose(s2, s1), env)
    //     tt, s3, err := infer(env2, i.Then)
    //     et, s4, err := infer(applyEnv(s3, env2), i.Else)
    //     s5, err := unify(apply(s4, tt), et)            // branches must agree
    //     return apply(s5, et), composeAll(s5, s4, s3, s2, s1), nil
checkpoint: An if is inferred by unification and can pin down a variable used in it. Commit and stop here.
---

Chapter one's `if` rule used `Equal` to demand a `Bool` condition and matching
branches. That was fine when every type was already known, but inference needs the
`if` to **push information back**: if a parameter of unknown type `a` is used as a
condition, then `a` must be `Bool`, and that fact should be visible everywhere else
`a` appears. Replace the two equality checks with **unifications** - the condition
against `Bool`, then the two branches against each other - and thread the resulting
substitutions through, and the rule does exactly that. Now `\x. if x then 1 else 2`
infers to `Bool -> Int`: unifying the condition `x : a` with `Bool` solves `a`, and
the branches fix the result to `Int`.

Watch the substitution flow, because it is what makes multi-variable programs come
out right. Each sub-inference runs under the discoveries of the ones before it -
the branches are typed in an environment already updated by the condition's
unification - and the branch agreement is checked after applying the latest
substitution. In `\x. \y. if x then y else 0`, the condition forces `x` to `Bool`
and unifying the `y` branch against the `0` branch forces `y` to `Int`, so the whole
function is `Bool -> Int -> Int`. The equality-based failures from chapter one still
fail, now as unification errors, so a non-`Bool` condition or disagreeing branches
are rejected exactly as before.
