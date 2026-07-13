---
project: build-a-programming-language
lesson: 45
title: Array built-ins
overview: Arrays need operations to be worth having. Today you add a family of built-ins - first, last, rest, and push - all following the same pattern and all producing new arrays rather than mutating.
goal: Add the first, last, rest, and push built-ins, each returning a new value without mutating its input.
spec:
  scenario: Array built-in functions
  status: failing
  lines:
    - kw: Given
      text: 'array built-in calls'
    - kw: When
      text: 'the evaluator evaluates first([1, 2, 3]), last([1, 2, 3]), rest([1, 2, 3]), and push([1, 2], 3)'
    - kw: Then
      text: 'the results are 1, 3, [2, 3], and [1, 2, 3]'
    - kw: And
      text: 'push returns a new array, leaving its argument [1, 2] unchanged; first([]) yields null'
code:
  lang: go
  source: |
    // add to the builtins registry, each validating it got an *Array:
    //   first -> element 0 (or NULL if empty)
    //   last  -> last element (or NULL if empty)
    //   rest  -> a NEW array of all but the first element
    //   push  -> a NEW array with one element appended (copy, don't mutate)
checkpoint: The array built-ins first, last, rest, and push all work immutably. Commit.
---

With indexing in place, a handful of **built-ins** make arrays genuinely useful,
and they all follow the builtin pattern you set up for `len`: validate the
argument is an array, then compute. `first` and `last` return the end elements (or
`null` when empty), `rest` returns everything after the first, and `push` returns
the array with one element added.

The important design rule is **immutability**: `rest` and `push` build and return
*new* arrays rather than changing their input, so `push([1,2], 3)` gives
`[1,2,3]` while the original `[1,2]` is untouched. That keeps values predictable
and is exactly what lets you write recursive list algorithms - like the `map` you
will build in the final lesson - without one call clobbering another's data.
