---
project: build-a-type-checker
lesson: 27
title: Typing recursion
overview: A recursive function refers to itself before its type is known, which is the one place inference needs a trick. Today you add let rec by binding the name to a fresh variable while typing its own body.
goal: Type a recursive definition by binding its name to a fresh variable inside its own value.
spec:
  scenario: Inferring a recursive function
  status: failing
  lines:
    - kw: Given
      text: 'the recursive definition let rec f = \n. if n < 1 then 1 else n * (f (n - 1)) in f'
    - kw: When
      text: it is inferred in an empty environment
    - kw: Then
      text: 'Show of its type is "Int -> Int"'
    - kw: And
      text: 'Show of the type of let rec loop = \n. loop n in loop is "a -> b" - an endlessly-recursive function places no constraint on its result'
code:
  lang: go
  source: |
    //   case *LetRec:
    //     tv := fresh()                                  // f's type, unknown for now
    //     env1 := extend(env, r.Name, Scheme{nil, tv})   // f is in scope in its OWN value
    //     vt, s1, err := infer(env1, r.Value)
    //     s2, err := unify(apply(s1, tv), vt)            // tie the guess to the real type
    //     s := compose(s2, s1)
    //     sch := generalize(applyEnv(s, env), apply(s, tv))
    //     return infer(extend(applyEnv(s, env), r.Name, sch), r.Body)
checkpoint: A recursive function is typed by binding its name to a fresh variable in its own body. Commit and stop here.
---

Recursion breaks the usual order of inference: to type `f`'s body you need `f`'s
type, but `f`'s type is what you are trying to compute. The standard resolution is to
**guess** - bind `f` to a fresh type variable, put that in scope, and infer the body
under it. Every recursive call to `f` then instantiates the guess, and when the body
finishes you **unify** the guess with the type the body actually produced, forcing
them to agree. For the factorial-shaped `\n. if n < 1 then 1 else n * (f (n - 1))`,
the recursive call and the arithmetic pin `n` and the result to `Int`, so `f` comes
out `Int -> Int`.

Two details make it sound. First, the recursive name is bound **monomorphically**
while typing its own value - it is a single fresh variable there, not yet
generalized, because you cannot generalize a type you are still discovering. Only
after unifying do you generalize it for the **body** of the `let rec`. Second, notice
what happens to a function that never returns a base value: `let rec loop = \n. loop n`
constrains its argument but nothing ever constrains its result, so it generalizes to
`a -> b` - honestly reflecting that a non-terminating function can be claimed to
produce any type. With recursion, arithmetic, and comparison in hand, the language
can now express real computation.
