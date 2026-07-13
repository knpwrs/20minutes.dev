---
project: build-a-toml-parser
lesson: 25
title: Inline arrays
overview: 'Values can be lists. Today you parse an inline array, a comma-separated sequence in square brackets, by reusing the value parser recursively for each element.'
goal: 'Parse a bracketed, comma-separated array of values.'
spec:
  scenario: A one-line array
  status: failing
  lines:
    - kw: Given
      text: 'the value written as open-bracket 1, 2, 3 close-bracket'
    - kw: When
      text: 'it is parsed'
    - kw: Then
      text: 'the value is an array of three integers 1, 2, 3'
    - kw: And
      text: 'an empty array open-bracket close-bracket has zero elements, and an array of strings holds string values'
code:
  lang: go
  source: |
    // parseValue: a leading '[' starts an array
    //   loop: skip whitespace; if ']' then stop
    //         parse one value (recurse into parseValue)
    //         append it; expect ',' or ']'
    // build a KindArray value holding the element Values
checkpoint: 'A bracketed comma-separated array parses its elements. Commit and stop here.'
---

An **array** is an ordered list of values written in square brackets, comma
separated: `[1, 2, 3]`. This is the first **compound** value, and it is where the
recursive nature of the parser shows: each element is itself a value, so parsing an
array means calling the same `parseValue` you already have, once per element, and
collecting the results into a `KindArray`.

The loop is straightforward: after the `[`, read a value, then expect either a comma
(more elements follow) or the closing `]` (the array ends). An **empty array** `[]`
is valid and has no elements, so check for the closing bracket before trying to read
a value. The elements can be any value type - `["a", "b"]` is an array of strings -
because `parseValue` handles all of them. Today keep the array on one line; the next
lesson relaxes that and pins the finer rules.
