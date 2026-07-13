---
project: build-a-type-checker
lesson: 14
title: Composing substitutions
overview: Inference discovers facts one unification at a time, and you need to combine them into a single substitution that applies them all at once, in the right order. Today you build composition, and pin down why the order matters.
goal: Compose two substitutions so applying the result equals applying the first, then the second.
spec:
  scenario: Combining two substitutions in order
  status: failing
  lines:
    - kw: Given
      text: 'the substitutions s1 = { a -> (b -> b) } and s2 = { b -> Int }'
    - kw: When
      text: each composition is applied to the variable a
    - kw: Then
      text: 'compose(s2, s1) applied to a gives Int -> Int (apply s1, then s2)'
    - kw: And
      text: 'compose(s1, s2) applied to a gives b -> b, so the two orderings differ and composition is not symmetric'
code:
  lang: go
  source: |
    // compose(s2, s1): apply s2 THROUGH s1's answers, then keep s2's own entries.
    func compose(s2, s1 Subst) Subst {
      out := Subst{}
      for k, v := range s1 { out[k] = apply(s2, v) } // s1's targets, refined by s2
      for k, v := range s2 { if _, ok := s1[k]; !ok { out[k] = v } }
      return out
    }
    // invariant: apply(compose(s2,s1), t) == apply(s2, apply(s1, t))
checkpoint: compose combines two substitutions so the result applies both, in order. Commit and stop here.
---

Unification hands back one small substitution at a time, but the engine has to carry
a single running answer. **Composition** merges two substitutions into one with a
precise meaning: `compose(s2, s1)` is the substitution that does what applying `s1`
and then `s2` would do. You build it by pushing `s1`'s targets through `s2` - so a
variable `s1` sends to `b`, and `s2` sends `b` to `Int`, ends up going all the way to
`Int` - and then adding any of `s2`'s own bindings that `s1` did not already cover.

The order is not a detail, it is the meaning. With `s1 = { a -> (b -> b) }` and
`s2 = { b -> Int }`, composing `s2` after `s1` sends `a` to `Int -> Int`: `s1` turns
`a` into `b -> b`, then `s2` fills the `b`s. Compose them the other way and `a` stays
`b -> b`, because applying `s2` first does nothing to `a` and `s1` finishes the job
without ever seeing `s2`. The engine always composes the **newest** discovery onto
the accumulated one, `compose(new, old)`, so later facts refine earlier guesses and
never the reverse.
