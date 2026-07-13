---
project: build-a-type-checker
lesson: 13
title: Applying a substitution
overview: Once you learn what an unknown type really is, you have to plug that answer in everywhere it appears. A substitution is that mapping from variables to types, and today you build the function that applies one to a type.
goal: Apply a substitution to a type, replacing its variables and recursing through structure.
spec:
  scenario: Substituting variables inside a type
  status: failing
  lines:
    - kw: Given
      text: 'the substitution mapping a to Int and b to Bool'
    - kw: When
      text: it is applied to various types
    - kw: Then
      text: 'applying it to a gives Int, to the function type a -> b gives Int -> Bool, and to String gives String unchanged'
    - kw: And
      text: 'a variable the substitution does not mention is left alone: applying it to c gives c'
code:
  lang: go
  source: |
    // a substitution maps variable ids to the types they stand for.
    type Subst map[int]Type
    func apply(s Subst, t Type) Type {
      switch t := t.(type) {
      case TVar:   if u, ok := s[t.Id]; ok { return u }; return t
      case TArrow: return TArrow{apply(s, t.From), apply(s, t.To)}
      // base types: return t unchanged
      }
    }
checkpoint: apply replaces a type's variables everywhere they appear. Commit and stop here.
---

When unification discovers that some variable `a` is really `Int`, that fact has to
propagate to **every** place `a` shows up - the parameter type, the result type, a
type nested three arrows deep. A **substitution** records those discoveries as a map
from variable ids to types, and `apply` is the function that carries them out: walk
the type, replace any variable the substitution mentions, and rebuild the structure
around it.

The recursion is the whole point. A base type has no variables, so it comes back
untouched. A variable is replaced if the substitution names it and left alone if it
does not - leaving unknowns you have not solved yet exactly as they were. A function
type applies the substitution to both sides and reassembles the arrow. This is the
one operation the inference engine leans on constantly: every time unification learns
something, it applies the result to the types still in play so the new knowledge is
visible everywhere at once.
