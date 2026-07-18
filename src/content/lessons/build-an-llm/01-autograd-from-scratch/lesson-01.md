---
project: build-an-llm
lesson: 1
title: A value that carries a gradient
overview: 'Every number in this project will need to remember how it was computed and hold a slot for its own derivative. Today you define that type.'
goal: Define a Value type holding a number and its gradient, with room for the graph structure later lessons will need, and construct one from a literal.
spec:
  scenario: Constructing a leaf value
  status: failing
  lines:
    - kw: Given
      text: 'the number 2.0'
    - kw: When
      text: a new Value is constructed from it
    - kw: Then
      text: 'its data is 2.0 and its gradient is 0.0'
    - kw: And
      text: 'it has no children and no recorded operation - it was not produced by combining other values'
code:
  lang: go
  source: |
    // front-load the whole shape now - children, op and backward stay
    // unused (nil / empty) until later lessons wire them up, but a Value
    // that only ever gets built directly still needs room for them
    type Value struct {
      Data     float64
      Grad     float64
      children []*Value
      op       string
      backward func()
    }
checkpoint: You have the type every later lesson builds on - a number, its gradient, and room for the graph structure backward passes will need. Commit and stop for today.
---

Every number that takes part in a calculation you want to differentiate needs two things sitting next to it: the value itself, and a place to accumulate its **gradient** - how much a final result would change if this number nudged up a little. That pairing is the whole idea behind automatic differentiation, and it earns its own type rather than a bare float, because the fields a working engine needs are more than the two you will read today.

So build the full shape now rather than growing it piecemeal. `Data` and `Grad` are what today's spec touches, but a `Value` that only ever gets built by hand (`NewValue`) will soon need to remember how it was made once you start combining values - which other `Value`s fed into it (`children`), what operation combined them (`op`), and a closure that knows how to route a gradient backward once one exists. None of those three do anything yet; a freshly constructed `Value` has no children and no operation. Lesson 2 starts filling them in the moment two values are added together, and this same type, unchanged in shape, is what trains the transformer at the end of this project.
