---
project: build-a-type-checker
lesson: 15
title: Unifying base types and variables
overview: Unification is the heart of inference - the operation that makes two types equal by solving for their unknowns. Today you build its first two cases - two ground types, and a variable meeting a type it must become.
goal: Unify two base types, and bind a variable to whatever type it is unified against.
spec:
  scenario: The base cases of unification
  status: failing
  lines:
    - kw: Given
      text: 'pairs of types to unify'
    - kw: When
      text: unify is called on each pair
    - kw: Then
      text: 'unify(Int, Int) succeeds with the empty substitution, and unify(Int, Bool) fails with "cannot unify Int with Bool"'
    - kw: And
      text: 'unify(a, Int) gives { a -> Int }, and unify(Int, a) also gives { a -> Int } - a variable binds to the type on the other side'
code:
  lang: go
  source: |
    // unify makes two types equal, returning the substitution that does it.
    func unify(a, b Type) (Subst, error) {
      switch {
      case bothBaseAndEqual(a, b): return Subst{}, nil
      case isVar(a): return Subst{a.(TVar).Id: b}, nil   // bind a to b
      case isVar(b): return Subst{b.(TVar).Id: a}, nil   // bind b to a
      }
      return nil, fmt.Errorf("cannot unify %s with %s", a, b)
    }
checkpoint: unify handles equal base types, mismatched base types, and binding a variable. Commit and stop here.
---

**Unification** answers a sharper question than `Equal` did. `Equal` asks "are these
two types the same?"; unification asks "what would make them the same?" and returns
the substitution that does it, or fails if nothing can. It is the engine that lets a
lambda parameter start as an unknown `a` and become `Int` the moment it is used where
an `Int` is required.

Today covers the two base cases. When both sides are the same ground type, they are
already equal, so unification succeeds having learned nothing - the **empty**
substitution. When they are different ground types, `Int` and `Bool`, nothing can
reconcile them and unification fails; that failure is the argument-mismatch error
from chapter two, now expressed as unification. The interesting case is a **variable**
meeting a type: since `a` stands for an unknown, you make the two equal simply by
deciding `a` **is** that type, and record `{ a -> Int }`. It works from either side,
because unification is symmetric. One case is still missing, and it is the one that
keeps unification from looping forever - that is next.
