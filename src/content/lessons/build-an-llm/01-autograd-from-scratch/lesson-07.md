---
project: build-an-llm
lesson: 7
title: Gradients accumulate
overview: 'A value used twice in the same graph gets gradient routed to it twice. Today you find out what happens if the second arrival overwrites the first.'
goal: Make sure a value that feeds into more than one place in a graph ends up with the correct total gradient, not just its most recent contribution.
spec:
  scenario: A value used twice in its own graph
  status: failing
  lines:
    - kw: Given
      text: 'a=3.0, and b built by adding a to itself'
    - kw: When
      text: 'Backward is called on b'
    - kw: Then
      text: 'b.Grad is 1.0'
    - kw: And
      text: 'a.Grad is 2.0 - the combined result of both of a''s uses in b, not the result of just one'
code:
  lang: go
  source: |
    func demoAccumulation() {
      a := NewValue(3.0)
      b := Add(a, a)
      b.Backward()
      // a feeds into this Add on BOTH sides - when Backward reaches a
      // via each side, does the second arrival ADD TO a.Grad, or REPLACE
      // whatever the first arrival already wrote there?
    }
checkpoint: 'A value used more than once now collects the correct total gradient from every place it is used. Commit and stop for today.'
---

Every backward rule you have written so far has assumed each input to an operation is a distinct value, visited once. Nothing in this project actually guarantees that - the exact same `Value` can be handed to an operation twice, or used in two different operations that both feed the same graph, and `Backward` will reach it once for each place it was used.

That is exactly what `b := Add(a, a)` does: `a` is one of `b`'s two children, twice over. Both of `Add`'s backward calls write into `a.Grad`, and how your code combines those two writes is the entire lesson. Go back to every backward closure you have written and check what each one actually does the second time it runs against the same `Grad` field - whether it treats the field as a running total or as a single answer that can be replaced. Get this wrong and a value shared between two branches of a graph silently ends up with only a fraction of the gradient it should have, which is the kind of bug that trains a network to the wrong answer without ever crashing.
