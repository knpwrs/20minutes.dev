---
project: build-an-llm
lesson: 2
title: Adding two values
overview: 'Combining two values should produce a third that remembers where it came from. Today you build addition, and a Value first gets children.'
goal: Build an Add function that returns a new Value holding the sum, recording the two inputs as its children.
spec:
  scenario: Adding two leaf values
  status: failing
  lines:
    - kw: Given
      text: 'a=2.0 and b=-3.0'
    - kw: When
      text: 'c is built by adding a and b'
    - kw: Then
      text: 'c.Data is -1.0'
    - kw: And
      text: 'c records a and b as its children, in that order'
    - kw: And
      text: 'c is marked as the result of an addition, distinguishing it from a value built by hand'
code:
  lang: go
  source: |
    // forward only today - c remembers its parents, but has no backward
    // closure yet, so calling one later on a and b still does nothing
    func Add(a, b *Value) *Value {
      return &Value{
        Data:     a.Data + b.Data,
        children: []*Value{a, b},
        op:       "+",
      }
    }
checkpoint: You can combine two values into a third that remembers where it came from - the first real edge in a computation graph. Commit and stop for today.
---

Lesson 1 gave `Value` room for `children` and an `op` label, but a value built with `NewValue` never fills them in - it has nothing to remember. That changes the moment you combine two values. `Add` computes the sum as before, but the result also has to record which two values produced it and how, because a later pass will need to walk backward through exactly this structure.

Think of it as building one edge of a graph rather than just computing a number. `c := Add(a, b)` is a new `Value` whose `Data` is the familiar sum, but whose `children` slice points at `a` and `b` - the graph now has three nodes and two edges, and a name for what produced the newest one. Nothing routes a gradient anywhere yet; that is deliberately still missing. Today is only about forward computation and bookkeeping, which is exactly what makes lesson 5's backward pass simple to add later without reshaping anything.
