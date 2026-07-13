---
project: build-a-type-checker
lesson: 31
title: List operations
overview: With lists built, you need to look inside them. Today you add head, tail, and null - the three accessors that read a list's element, its rest, and whether it is empty - each polymorphic over the element type.
goal: Infer head, tail, and null by unifying the operand against a list type.
spec:
  scenario: Inferring the list accessors
  status: failing
  lines:
    - kw: Given
      text: 'head, tail, and null applied to lists'
    - kw: When
      text: each is inferred
    - kw: Then
      text: 'the type of head [1, 2, 3] is Int, the type of tail [1, 2, 3] is [Int], and the type of null [] is Bool'
    - kw: And
      text: 'Show of the type of \xs. head xs is "[a] -> a" - head returns the element type of any list'
code:
  lang: go
  source: |
    type Head struct{ Arg Expr }   // and Tail, Null
    //   case *Head:
    //     et, s1, err := infer(env, h.Arg)
    //     a := fresh()
    //     s2, err := unify(apply(s1, et), TList{a})  // the arg must be a list
    //     return apply(s2, a), compose(s2, s1), nil  // tail returns TList{a}; null returns Bool
checkpoint: head, tail, and null read a list and infer polymorphic types. Commit and stop here.
---

The accessors mirror the projections you wrote for tuples, using the same "unify
against a shape with holes" trick. Each one invents a fresh element variable `a`,
**unifies** the operand's type with `[a]` to insist it really is a list, and then
returns the piece it is after: `head` returns the element type `a`, `tail` returns
the list type `[a]` unchanged, and `null` ignores the element type entirely and
returns a `Bool`. Applied to `[1, 2, 3]`, unification solves `a` to `Int`, so `head`
gives `Int`, `tail` gives `[Int]`, and `null` gives `Bool`.

Because the element type is a fresh variable each time, all three are **polymorphic**
over what the list contains: `\xs. head xs` infers to `[a] -> a`, working on a list
of anything. Notice `null` typing to `[a] -> Bool` even though it never touches an
element - it still forces its argument to be a list, so `null 5` is correctly
rejected. You now have both halves of lists, construction and access, and together
with tuples the language can build and take apart structured data. One more shape
remains before the diagnostics chapter: records, which name their fields instead of
numbering them.
