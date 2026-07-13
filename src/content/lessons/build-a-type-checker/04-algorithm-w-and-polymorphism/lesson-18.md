---
project: build-a-type-checker
lesson: 18
title: Lambdas without annotations
overview: Here the annotations start coming off. An unannotated lambda gives its parameter a fresh type variable and infers the body under it - the first rule that discovers a type instead of being told it.
goal: Infer an unannotated lambda by assigning its parameter a fresh type variable.
spec:
  scenario: Inferring a lambda with no parameter annotation
  status: failing
  lines:
    - kw: Given
      text: 'lambdas written without a parameter type, such as \x. x and \x. \y. x'
    - kw: When
      text: each is inferred in an empty environment
    - kw: Then
      text: 'Show of the type of \x. x is "a -> a"'
    - kw: And
      text: 'Show of the type of \x. \y. x is "a -> b -> a"'
code:
  lang: go
  source: |
    // internally, inference now also returns the substitution it discovered:
    //   infer(env, e) (Type, Subst, error)   // the real worker
    //   func Infer(env Env, e Expr) (Type, error) {   // public wrapper, unchanged shape
    //     counter = 0                                  // reset fresh supply per top-level call
    //     t, s, err := infer(env, e); return apply(s, t), err
    //   }
    // unannotated lambda (ParamType left nil): pt := fresh()
    //   bt, s, err := infer(extend(env, l.Param, pt), l.Body)
    //   return TArrow{apply(s, pt), bt}, s, nil
    // Show(t): rename the variables to a, b, c... in order of first appearance,
    //   so printed principal types are stable no matter which fresh ids were used.
checkpoint: An unannotated lambda infers to an arrow from a fresh variable to its body's type. Commit and stop here.
---

Until now every lambda spelled out its parameter type, so there was nothing to
discover. Take the annotation away and the checker has to **invent a placeholder** -
a fresh type variable - stand it in for the parameter, and infer the body with that
placeholder in scope. For the identity `\x. x`, the body is just `x`, whose type is
the placeholder `a`, so the whole thing is `a -> a`: a function from some type to the
same type, exactly the polymorphic identity you would hope for. `\x. \y. x` nests the
trick twice and comes out `a -> b -> a`.

This lesson also quietly upgrades the engine's plumbing. Inference now threads a
**substitution** alongside the type it returns, because the body may refine the
parameter's placeholder as it goes, and that discovery has to flow back out to the
arrow. The public `Infer` stays the same shape - give it an environment and an
expression, get a type - and it applies the final substitution before handing the
type back. Two small conveniences keep the output stable. `Infer` resets the
fresh-variable supply at the start of each top-level call, so the ids a program uses
do not depend on what ran before it (which matters the moment an error message names
a variable). And because substitution can leave gaps in those ids, a small `Show`
renames the variables in a finished type to `a`, `b`, `c` in the order they first
appear, so `\x. x` reads back as `a -> a` every time. The parameter of `\x. x` never
gets refined, so it stays fully general; the next two lessons are where using the
parameter starts pinning it down.
