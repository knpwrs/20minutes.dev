---
project: build-a-programming-language
lesson: 43
title: Arrays
overview: The first compound data structure is the array - an ordered list of values. Today you parse array literals and evaluate them, evaluating each element expression in order.
goal: Parse and evaluate an array literal into an array object holding its evaluated elements.
spec:
  scenario: Evaluating an array literal
  status: failing
  lines:
    - kw: Given
      text: 'the source [1, 2 * 2, 3 + 3]'
    - kw: When
      text: 'the evaluator evaluates the program'
    - kw: Then
      text: 'the result is an array object whose elements are 1, 4, 6'
    - kw: And
      text: 'len([1, 2, 3]) yields 3'
code:
  lang: go
  source: |
    type ArrayLiteral struct { Elements []Expression }   // AST node
    type Array struct { Elements []Object }               // runtime object
    // parse '[' as a prefix parse fn: a comma-separated list until ']'
    // eval: evaluate each element expression in order into the Array
    // extend len to return the element count for an Array
checkpoint: Array literals parse and evaluate, and len reports an array's length. Commit.
---

An **array** is an ordered list of values, written `[a, b, c]`. Parsing reuses the
comma-separated-list logic from call arguments: register `[` as a prefix parse
function that reads element expressions until the closing `]`. Evaluating the
literal evaluates each element expression in order and collects the results into a
runtime `Array` object.

Elements are arbitrary expressions, so `[1, 2 * 2, 3 + 3]` evaluates to `[1, 4,
6]`. Extend `len` to report an array's element count - `len([1,2,3])` is `3` -
which shows why a shared builtin registry was worth building: one function now
works across strings and arrays. Reading elements *out* by position comes in the
next lesson.
