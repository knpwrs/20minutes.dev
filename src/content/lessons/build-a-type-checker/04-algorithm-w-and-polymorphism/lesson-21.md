---
project: build-a-type-checker
lesson: 21
title: Type schemes and instantiation
overview: Polymorphism means one definition usable at many types, and the way you record "usable at many types" is a type scheme with quantified variables. Today you build schemes and the instantiation that hands out a fresh copy on each use.
goal: Represent a polymorphic type scheme and instantiate it with fresh variables per use.
spec:
  scenario: Instantiating a quantified scheme
  status: failing
  lines:
    - kw: Given
      text: 'the type scheme forall a. a -> a, quantifying the variable a over the type a -> a'
    - kw: When
      text: it is instantiated twice
    - kw: Then
      text: 'each instantiation is an arrow whose argument and result are the same single variable (a fresh copy of a -> a)'
    - kw: And
      text: 'the two instantiations use different fresh variables, so the two resulting types are not equal to each other'
code:
  lang: go
  source: |
    // a scheme is a type with some variables universally quantified.
    type Scheme struct{ Vars []int; Type Type }
    func instantiate(sch Scheme) Type {
      s := Subst{}
      for _, v := range sch.Vars { s[v] = fresh() } // a new variable per quantified one
      return apply(s, sch.Type)
    }
    // the environment now maps names to Schemes; an ordinary binding is a
    // MONOMORPHIC scheme Scheme{nil, t}, and Var instantiates whatever it finds.
checkpoint: A scheme can be instantiated to a fresh copy each time it is used. Commit and stop here.
---

A polymorphic value like the identity function is usable at `Int`, at `Bool`, at any
type at all, and inference records that with a **type scheme**: a type together with
the list of variables that are **universally quantified** over it, written
`forall a. a -> a`. The scheme says "for any `a`, this is an `a -> a`". The operation
that consumes a scheme is **instantiation**: each time the value is used, replace
every quantified variable with a brand-new fresh one, producing an independent copy.
That freshness is the whole point - it is why one use at `Int` and another at `Bool`
do not collide, because each got its own variable to solve.

This lesson also moves the environment from mapping names to *types* to mapping them
to *schemes*. Nothing you have written breaks: an ordinary binding, like a lambda
parameter or a `let` for now, is just a **monomorphic** scheme with no quantified
variables, and instantiating it hands back the type unchanged. The variable rule
becomes "look the name up and instantiate its scheme". What is still missing is
anything that actually *creates* a quantified scheme - so far every scheme is
monomorphic and instantiation is a no-op. The next lesson supplies the missing half:
generalizing a `let`-bound definition so its scheme really is polymorphic.
