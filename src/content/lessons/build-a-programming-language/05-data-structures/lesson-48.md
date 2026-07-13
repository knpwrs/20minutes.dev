---
project: build-a-programming-language
lesson: 48
title: Writing map in the language
overview: Everything comes together today. You write a higher-order map function - in your own language - using closures, recursion, and the array built-ins, proving the interpreter is powerful enough to build its own tools.
goal: Run a map function, written in the language itself, that applies a function to every element of an array.
spec:
  scenario: A map function written in the language
  status: failing
  lines:
    - kw: Given
      text: 'a map defined as let map = fn(arr, f) { let iter = fn(arr, acc) { if (len(arr) == 0) { acc } else { iter(rest(arr), push(acc, f(first(arr)))) } }; iter(arr, []) };'
    - kw: When
      text: 'the evaluator evaluates map([1, 2, 3], fn(x) { x * 2 })'
    - kw: Then
      text: 'the result is the array [2, 4, 6], in the original order'
    - kw: And
      text: 'map([], fn(x) { x }) yields the empty array []'
code:
  lang: go
  source: |
    // no interpreter changes - this program is written in YOUR language.
    // an inner iter walks the array front-to-back, pushing each mapped
    // element onto an accumulator that starts empty, so order is preserved:
    //   let map = fn(arr, f) {
    //     let iter = fn(arr, acc) {
    //       if (len(arr) == 0) { acc }
    //       else { iter(rest(arr), push(acc, f(first(arr)))) }
    //     };
    //     iter(arr, [])
    //   };
    //   map([1, 2, 3], fn(x) { x * 2 })
checkpoint: A higher-order map runs entirely in your language - the interpreter is complete. Commit and stop for today.
---

This final lesson writes no interpreter code at all - instead you write a program
*in your language* and watch it run. `map` takes an array and a function and
builds a new array by applying the function to each element. It is defined with an
inner **iter** helper that walks the array front to back: an empty array returns
the **accumulator** built so far, otherwise `iter` recurses on the `rest` with
`push(acc, f(first(arr)))`. Because you push each element as you move forward, the
result keeps the original order - `[2, 4, 6]`, not reversed.

That one definition leans on nearly everything you built - `fn` values passed as
arguments (`f`), the closure `iter` capturing `f`, recursion, `if` for the base
case, the immutable `first`/`rest`/`push` built-ins, and an empty array literal as
the starting accumulator. `map([1,2,3], fn(x){x*2})` producing `[2,4,6]` is the
proof: your interpreter is expressive enough that its users can extend it from
inside. That is the whole point of building a language - and a fitting place to
stop.
