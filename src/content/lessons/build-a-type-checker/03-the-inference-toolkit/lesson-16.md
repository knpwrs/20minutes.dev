---
project: build-a-type-checker
lesson: 16
title: The occurs check
overview: A variable cannot equal a type that contains it - that would be an infinite type. Today you add the occurs check, the guard that rejects it, and it is exactly what catches the self-application hidden in \x. x x.
goal: Reject binding a variable to a type it occurs inside, while still allowing it to unify with itself.
spec:
  scenario: Guarding against infinite types
  status: failing
  lines:
    - kw: Given
      text: 'a variable a and the function type a -> b that contains it'
    - kw: When
      text: unify is called
    - kw: Then
      text: 'unify(a, a -> b) fails with the error "occurs check failed: a occurs in a -> b"'
    - kw: And
      text: 'unify(a, a) succeeds with the empty substitution - a variable unifies with itself and binds nothing'
code:
  lang: go
  source: |
    // occurs: does variable id appear anywhere inside t?
    func occurs(id int, t Type) bool {
      switch t := t.(type) {
      case TVar:   return t.Id == id
      case TArrow: return occurs(id, t.From) || occurs(id, t.To)
      }
      return false
    }
    // in the variable case of unify, BEFORE binding a to b:
    //   if u, ok := b.(TVar); ok && u.Id == id { return Subst{}, nil } // same var
    //   if occurs(id, b) { return nil, fmt.Errorf("occurs check failed: %s occurs in %s", a, b) }
checkpoint: unify rejects infinite types and treats a variable unified with itself as a no-op. Commit and stop here.
---

Binding a variable looks harmless until the type on the other side **contains that
same variable**. Try to unify `a` with `a -> b` and you are claiming `a` equals a
function that takes an `a` - which takes an `a`, forever. There is no finite type
that satisfies it, so unification must refuse. The **occurs check** is the guard:
before binding `a`, scan the target type, and if `a` appears anywhere inside it,
fail with an infinite-type error instead of building a cyclic substitution that would
send `apply` into an endless loop.

There is one case that looks like it should trip the check but must not: unifying `a`
with `a` itself. Here the two sides are already equal, so unification succeeds and
binds nothing - you skip the occurs check for the trivial same-variable case and
return the empty substitution. This small guard is what will reject the classic
`\x. x x` a few lessons from now: inferring the self-application asks to unify `x`'s
type with a function **from** that very type, the occurs check fires, and the checker
correctly reports that no type can be given to a term that applies itself to itself.
