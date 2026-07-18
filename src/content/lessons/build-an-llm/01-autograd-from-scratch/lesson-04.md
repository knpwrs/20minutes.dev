---
project: build-an-llm
lesson: 4
title: Ordering the graph
overview: 'A backward pass has to visit every node after its consumers and before its children. Today you compute an order that guarantees exactly that.'
goal: Build a public Topo function that returns every node reachable from a given Value in an order where each node comes after all of its children.
spec:
  scenario: Topologically ordering a small graph
  status: failing
  lines:
    - kw: Given
      text: 'a=2.0, b=-3.0, c=10.0, e built by multiplying a and b, and d built by adding e and c'
    - kw: When
      text: 'the graph rooted at d is ordered'
    - kw: Then
      text: 'the order contains a, b, c, d and e, each exactly once'
    - kw: And
      text: 'a appears before e, and b appears before e - both of e''s children come before it'
    - kw: And
      text: 'e appears before d, and c appears before d - both of d''s children come before it'
code:
  lang: go
  source: |
    // depth-first: visit a node's children before appending the node
    // itself, so every child is guaranteed to land earlier in the slice
    func topoSort(v *Value, seen map[*Value]bool, order *[]*Value) {
      if seen[v] {
        return
      }
      seen[v] = true
      for _, c := range v.children {
        topoSort(c, seen, order)
      }
      *order = append(*order, v)
    }

    // the public entry point: allocate the seen-set and output slice,
    // run the recursion, and hand back the finished order
    func Topo(v *Value) []*Value {
      seen := map[*Value]bool{}
      order := []*Value{}
      topoSort(v, seen, &order)
      return order
    }
checkpoint: You can produce a valid visiting order for any graph you can build so far - the one piece backward passes still need. Commit and stop for today.
---

A backward pass needs to visit every node exactly once, and it needs every node's consumers to have already routed a gradient into it before it runs its own backward step. That is a **topological order**: an arrangement of the graph where every node comes after all of its children. Depth-first search gives you one for free - recurse into a node's children first, then append the node itself, and the append can only ever happen after every child has already been appended. The recursion itself is a small private helper; wrap it in a public `Topo(v)` that allocates the bookkeeping and returns the finished slice, because that is the entry point the next lesson's backward pass calls.

The important thing to notice is that this order is not unique. Visit a node's children left to right and you get one valid order; visit them right to left and you get a different one - both are correct, because both satisfy the one rule that matters: no node appears before something it depends on. Do not be tempted to pin down one exact sequence; pin down the rule instead; several different orderings will satisfy today's spec, and a backward pass run in lesson 5 will produce identical gradients under any of them.
