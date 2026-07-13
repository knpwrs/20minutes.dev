---
project: build-a-pathfinder
lesson: 14
title: Deterministic tie-breaking
overview: When two frontier cells share a priority, which comes out first decides which of several equal paths you get. Today you make that choice deterministic by breaking ties on insertion order, so equal-cost searches always return the same path.
goal: Break equal-priority ties by insertion order so the heap is fully deterministic.
spec:
  scenario: Equal priorities pop in the order they were pushed
  status: failing
  lines:
    - kw: Given
      text: 'each pushed item now also carries a sequence number, assigned 0, 1, 2, ... in push order'
    - kw: When
      text: 'items are pushed as (priority 5, seq 0), (priority 5, seq 1), (priority 3, seq 2), then popped until empty'
    - kw: Then
      text: 'the first pop is priority 3 (seq 2)'
    - kw: And
      text: 'the next two pops are the priority-5 items in seq order, seq 0 then seq 1'
code:
  lang: go
  source: |
    type Item struct { Priority, Seq int; Cell Coord }
    // compare by priority, then by seq to break ties
    func less(a, b Item) bool {
      if a.Priority != b.Priority { return a.Priority < b.Priority }
      return a.Seq < b.Seq
    }
    // use less(...) everywhere Push and Pop compared .Priority directly.
    // assign Seq from a counter that increments on every Push.
checkpoint: Equal priorities now pop in a fixed insertion order. Commit and stop here.
---

A min-heap ordered by priority alone leaves one thing to chance: when two items share
a priority, which surfaces first is an artifact of swap order. In a search that is
fatal to reproducibility, because two cells often reach the frontier with the same
cost, and whichever pops first steers the path. To pin down a single answer we need a
**tie-breaker**.

The simplest deterministic one is **insertion order**. Give every pushed item a
**sequence number** from a counter that ticks up on each push, and when priorities
are equal, prefer the smaller sequence, the one pushed earlier. Route every
comparison in push and pop through one `less` function so the rule applies
everywhere at once. Now the heap is a **total order** with no ties left to chance,
and combined with the fixed neighbor order from chapter one, every search built on it
returns exactly one path. This is the second half of the determinism promise the
whole project rests on.
