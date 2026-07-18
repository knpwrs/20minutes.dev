---
project: build-an-llm
lesson: 5
title: Backpropagation and the sum rule
overview: 'A gradient has to start somewhere and flow backward through every edge. Today Add gets a backward closure, and the graph gets its first real Backward pass.'
goal: 'Give Add a backward closure, then write Backward: seed the root''s gradient and walk lesson 4''s order in reverse, running each closure.'
spec:
  scenario: Backpropagating through a sum
  status: failing
  lines:
    - kw: Given
      text: 'a=2.0, b=-3.0, and e built by adding a and b'
    - kw: When
      text: 'Backward is called on e'
    - kw: Then
      text: 'e.Grad is 1.0 - Backward seeds the value it is called on before propagating anything'
    - kw: And
      text: 'a.Grad is 1.0'
    - kw: And
      text: 'b.Grad is 1.0'
code:
  lang: go
  source: |
    // seed the root's own Grad, then visit lesson 4's order in REVERSE -
    // every consumer of a node has already run by the time the node
    // itself comes up
    func (v *Value) Backward() {
      order := Topo(v)
      v.Grad = 1.0
      for i := len(order) - 1; i >= 0; i-- {
        if order[i].backward != nil { order[i].backward() }
      }
    }
checkpoint: Calling Backward on any value now sends a real gradient flowing through every addition in its graph. Commit and stop for today.
---

A gradient measures how much the final result would change if some earlier value nudged up slightly, and the only value for which that question has an obvious answer is the result itself - it would change by exactly as much as it nudges, so `Backward` starts by setting that value's own `Grad` to `1.0`. Everything upstream of it inherits a share of that `1.0` by walking backward through the graph, one edge at a time, using lesson 4's order in reverse so that a node's own gradient is complete before anything asks it to pass gradient further back.

Each edge needs to know its own **local rule** for how gradient passes through it, which is what the `backward` closure on each `Value` is for. For addition, ask yourself: if `e = a + b`, and `e` nudges up by some tiny amount, by how much does that tell you `a` nudged, and by how much does it tell you `b` nudged? Work that out for yourself rather than taking it on faith - it is the simplest of the rules you will derive in this chapter, and the same question, asked of multiplication and then of `tanh`, is what the next few lessons are about.
