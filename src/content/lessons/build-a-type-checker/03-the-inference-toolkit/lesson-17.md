---
project: build-a-type-checker
lesson: 17
title: Unifying function types
overview: The last unification case is the recursive one - two arrows are equal when their parts are. Today you unify function types by unifying argument against argument and result against result, threading the substitution as you go.
goal: Unify two function types recursively, carrying each side's discoveries into the next.
spec:
  scenario: Recursively unifying arrows
  status: failing
  lines:
    - kw: Given
      text: 'pairs of function types to unify'
    - kw: When
      text: unify is called on each pair
    - kw: Then
      text: 'unify(a -> Bool, Int -> b) gives { a -> Int, b -> Bool }, and unify(Int -> Bool, Bool -> Bool) fails because Int and Bool cannot unify'
    - kw: And
      text: 'unify(a -> a, Int -> b) gives { a -> Int, b -> Int } - solving the argument side to Int forces the result side to Int too'
code:
  lang: go
  source: |
    //   case both are TArrow:
    //     s1, err := unify(a.From, b.From)          // solve the argument sides
    //     if err != nil { return nil, err }
    //     s2, err := unify(apply(s1, a.To), apply(s1, b.To)) // carry s1 into the results
    //     if err != nil { return nil, err }
    //     return compose(s2, s1), nil
checkpoint: unify handles function types recursively, and unification is now complete. Commit and stop here.
---

Two function types are equal exactly when their argument types are equal **and**
their result types are equal, so unifying arrows is a recursion: unify the two
`From` sides, then unify the two `To` sides. The subtlety is that the first
unification may have **learned** something that the second one needs. Solving the
argument sides of `a -> a` against `Int -> b` discovers `a` is `Int`; before
unifying the result sides you must `apply` that to both, so the left result `a`
becomes `Int` and you correctly force `b` to `Int` as well. Composing the two
substitutions, newest onto oldest, gives the full answer `{ a -> Int, b -> Int }`.

Skip the `apply` step and a variable appearing on both sides of an arrow could be
solved two inconsistent ways; threading the substitution is what keeps the whole
type coherent. With this case, `unify` is **complete** for the types you have: base
types, variables with the occurs check, and functions. You now hold the finished
inference toolkit - fresh variables, substitutions you can apply and compose, and a
unifier that finds the one most general way to make two types agree. The next chapter
wires it into `Infer` and the annotations start disappearing.
