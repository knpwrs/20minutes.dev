---
project: build-a-pathfinder
lesson: 13
title: The min-heap, popping
overview: A priority queue that only fills up is useless. Today you complete the heap with pop, removing the minimum and sifting down to restore order, so draining the heap yields items in ascending priority.
goal: Add pop that removes the minimum item and restores the heap, in ascending priority order.
spec:
  scenario: Popping drains the heap smallest-first
  status: failing
  lines:
    - kw: Given
      text: 'a min-heap into which items with priorities 5, 3, 8, 1, 4 have been pushed'
    - kw: When
      text: 'the heap is popped repeatedly until empty'
    - kw: Then
      text: 'the priorities come out in the order 1, 3, 4, 5, 8'
    - kw: And
      text: 'Len reports 0 after the fifth pop'
code:
  lang: go
  source: |
    func (h *Heap) Len() int { return len(h.items) }
    func (h *Heap) Pop() Item {
      top := h.items[0]
      last := len(h.items) - 1
      h.items[0] = h.items[last]        // move last to root
      h.items = h.items[:last]
      i, n := 0, len(h.items)
      for {                             // sift down toward the smaller child
        l, r, small := 2*i+1, 2*i+2, i
        if l < n && h.items[l].Priority < h.items[small].Priority { small = l }
        if r < n && h.items[r].Priority < h.items[small].Priority { small = r }
        if small == i { break }
        h.items[i], h.items[small] = h.items[small], h.items[i]
        i = small
      }
      return top
    }
checkpoint: The heap pops items smallest-first and stays valid. Commit and stop here.
---

Popping the minimum is the mirror of pushing. The smallest item is at the root, so we
take it, then plug the **last** item into the root to keep the tree complete, and
**sift down**: repeatedly swap it with its smaller child until neither child is
smaller. Comparing against the smaller of the two children is what preserves the heap
property; swapping with the larger would immediately violate it.

With push and pop both in hand, the heap is a working priority queue: pushing five
scrambled priorities and popping them all yields them in sorted order. That is the
engine Dijkstra's search rides on, always pulling the cheapest frontier cell next.
One gap remains before it is safe for pathfinding: when two cells have the **same**
priority, the order they pop in is currently accidental, and the next lesson makes it
deterministic.
