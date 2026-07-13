---
project: build-a-programming-language
lesson: 44
title: Index expressions
overview: An array is only useful if you can read from it. Today you parse and evaluate the index operator arr[i], treating the opening bracket as an infix operator - and decide what an out-of-range index produces.
goal: Parse and evaluate array indexing, returning null for an out-of-range index.
spec:
  scenario: Indexing into an array
  status: failing
  lines:
    - kw: Given
      text: 'array index expressions'
    - kw: When
      text: 'the evaluator evaluates [1, 2, 3][0], then [1, 2, 3][2], then [1, 2, 3][5]'
    - kw: Then
      text: 'the results are 1, 3, and null'
    - kw: And
      text: 'a negative index like [1, 2, 3][-1] also yields null'
code:
  lang: go
  source: |
    type IndexExpression struct { Left Expression; Index Expression }
    const ( /* ...levels... */ INDEX ) // even tighter than CALL
    precedences["["] = INDEX
    // register '[' as an INFIX parse fn too; eval:
    //   evaluate Left (array) and Index (integer); bounds-check before reading
checkpoint: Indexing reads array elements, with out-of-range indices returning null. Commit.
---

Reading an element uses the **index operator** `arr[i]`, which - like a call - is
really an **infix** use of a bracket: the expression on the left is the array, and
the expression inside the brackets is the position. Register `[` as an infix parse
function at `INDEX` precedence, the tightest of all so `arr[0]` binds before any
surrounding operator.

The design decision is out-of-bounds behavior: rather than crash or error, an
index past the end - or a negative one - evaluates to `null`. That keeps indexing
total (it always produces a value) and composes nicely with the truthiness rules,
so callers can test the result. Evaluate the array and the index, bounds-check,
and return the element or `null`.
